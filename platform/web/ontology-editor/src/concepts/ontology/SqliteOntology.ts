import type { Database, Sqlite3Static } from '@sqlite.org/sqlite-wasm'
import type { Identity } from '@/concepts/identity/Identity'
import type { Instance } from '@/concepts/instances/Instance'
import type { Property, PropertyKindName } from '@/concepts/properties/Property'
import type { Ontology } from './Ontology'
import { sqliteModule } from './sqliteModule'

/** Bumped when the table layout changes in a way older readers cannot handle. */
export const SQLITE_ONTOLOGY_VERSION = 1

/** An error whose message is safe to show to a person opening a `.sqlite` ontology. */
export class SqliteOntologyError extends Error {
  constructor(message: string) {
    super(`Invalid ontology database: ${message}`)
    this.name = 'SqliteOntologyError'
  }
}

// A property holds either one string (`value`, `is_list = 0`) or a list
// (`is_list = 1`, items in `property_value`), so an empty string is never
// confused with an empty list. `position` keeps the order of an instance's
// properties; `item_position` the order of a list.
const SCHEMA = `
CREATE TABLE meta (
  key   TEXT PRIMARY KEY,
  value TEXT NOT NULL
) WITHOUT ROWID;

CREATE TABLE instance (
  identity TEXT PRIMARY KEY
) WITHOUT ROWID;

CREATE TABLE property (
  owner    TEXT    NOT NULL REFERENCES instance(identity) ON DELETE CASCADE,
  position INTEGER NOT NULL,
  kind     TEXT    NOT NULL,
  is_list  INTEGER NOT NULL CHECK (is_list IN (0, 1)),
  value    TEXT,
  PRIMARY KEY (owner, position),
  CHECK ((is_list = 1 AND value IS NULL) OR (is_list = 0 AND value IS NOT NULL))
) WITHOUT ROWID;

CREATE TABLE property_value (
  owner         TEXT    NOT NULL,
  position      INTEGER NOT NULL,
  item_position INTEGER NOT NULL,
  value         TEXT    NOT NULL,
  PRIMARY KEY (owner, position, item_position),
  FOREIGN KEY (owner, position) REFERENCES property(owner, position) ON DELETE CASCADE
) WITHOUT ROWID;

CREATE INDEX property_kind_idx ON property (kind, owner);
CREATE INDEX property_value_idx ON property (value) WHERE is_list = 0;
CREATE INDEX property_item_value_idx ON property_value (value);
`

function sameProperties(a: Instance, b: Instance): boolean {
  if (a === b) return true
  if (a.length !== b.length) return false
  return a.every((property, index) => {
    const other = b[index]
    if (property.kind !== other.kind) return false
    if (Array.isArray(property.value) || Array.isArray(other.value)) {
      return (
        Array.isArray(property.value) &&
        Array.isArray(other.value) &&
        property.value.length === other.value.length &&
        property.value.every((item, i) => item === (other.value as string[])[i])
      )
    }
    return property.value === other.value
  })
}

/**
 * An ontology kept in an in-memory SQLite database. The database is the
 * storage: `update()` writes a new ontology into it as row changes, and
 * `export()` yields a standard `.sqlite` file any SQLite client can open.
 */
export class SqliteOntology {
  private constructor(
    private readonly sqlite: Sqlite3Static,
    private readonly db: Database,
    private stored: Ontology,
  ) {}

  /** The ontology as last stored. */
  get ontology(): Ontology {
    return this.stored
  }

  /** A new database holding `ontology`. */
  static async create(ontology: Ontology): Promise<SqliteOntology> {
    const sqlite = await sqliteModule()
    const db = new sqlite.oo1.DB()
    try {
      db.exec('PRAGMA foreign_keys = ON')
      db.exec(`PRAGMA user_version = ${SQLITE_ONTOLOGY_VERSION}`)
      db.exec(SCHEMA)
      const store = new SqliteOntology(sqlite, db, { root: ontology.root, instances: {} })
      db.exec({ sql: 'INSERT INTO meta (key, value) VALUES (?, ?)', bind: ['format', 'cdd-ontology'] })
      db.exec({ sql: 'INSERT INTO meta (key, value) VALUES (?, ?)', bind: ['root', ontology.root] })
      store.update(ontology)
      return store
    } catch (error) {
      db.close()
      throw error
    }
  }

  /** Opens the bytes of a `.sqlite` file written by `export()`. */
  static async open(bytes: Uint8Array): Promise<SqliteOntology> {
    const sqlite = await sqliteModule()
    const db = new sqlite.oo1.DB()
    try {
      const pointer = sqlite.wasm.allocFromTypedArray(bytes)
      const flags = sqlite.capi.SQLITE_DESERIALIZE_FREEONCLOSE | sqlite.capi.SQLITE_DESERIALIZE_RESIZEABLE
      db.checkRc(sqlite.capi.sqlite3_deserialize(db, 'main', pointer, bytes.length, bytes.length, flags))
      db.exec('PRAGMA foreign_keys = ON')
      return new SqliteOntology(sqlite, db, SqliteOntology.read(db))
    } catch (error) {
      db.close()
      if (error instanceof SqliteOntologyError) throw error
      throw new SqliteOntologyError('not a SQLite database written by CDD')
    }
  }

  private static read(db: Database): Ontology {
    const version = db.selectValue('PRAGMA user_version')
    if (version !== SQLITE_ONTOLOGY_VERSION) throw new SqliteOntologyError(`unsupported version ${String(version)}`)
    if (db.selectValue("SELECT value FROM meta WHERE key = 'format'") !== 'cdd-ontology') {
      throw new SqliteOntologyError('it is not a CDD ontology')
    }
    const root = db.selectValue("SELECT value FROM meta WHERE key = 'root'")
    if (typeof root !== 'string' || root === '') throw new SqliteOntologyError('root is not recorded')

    const instances: Record<Identity, Instance> = {}
    for (const [identity] of db.selectArrays('SELECT identity FROM instance ORDER BY identity')) {
      instances[identity as string] = []
    }
    const lists = new Map<string, string[]>()
    for (const [owner, position, value] of db.selectArrays(
      'SELECT owner, position, value FROM property_value ORDER BY owner, position, item_position',
    )) {
      const key = `${owner as string}\u0000${position as number}`
      const items = lists.get(key) ?? []
      items.push(value as string)
      lists.set(key, items)
    }
    for (const [owner, position, kind, isList, value] of db.selectArrays(
      'SELECT owner, position, kind, is_list, value FROM property ORDER BY owner, position',
    )) {
      const property: Property = {
        kind: kind as PropertyKindName,
        value: isList ? (lists.get(`${owner as string}\u0000${position as number}`) ?? []) : (value as string),
      }
      instances[owner as string].push(property)
    }
    if (!instances[root]) throw new SqliteOntologyError(`root instance ${root} is absent`)
    return { root, instances }
  }

  /**
   * Stores `next`. Only instances that differ from the stored ontology are
   * rewritten, all in one transaction, so a failed write leaves the database
   * as it was.
   */
  update(next: Ontology): void {
    const previous = this.stored
    this.db.transaction(() => {
      if (next.root !== previous.root) {
        this.db.exec({ sql: "UPDATE meta SET value = ? WHERE key = 'root'", bind: [next.root] })
      }
      for (const identity of Object.keys(previous.instances)) {
        if (!next.instances[identity]) {
          this.db.exec({ sql: 'DELETE FROM instance WHERE identity = ?', bind: [identity] })
        }
      }
      for (const [identity, instance] of Object.entries(next.instances)) {
        const before = previous.instances[identity]
        if (before && sameProperties(before, instance)) continue
        this.writeInstance(identity, instance, !before)
      }
    })
    this.stored = {
      root: next.root,
      instances: Object.fromEntries(Object.entries(next.instances).map(([id, instance]) => [id, instance])),
    }
  }

  private writeInstance(identity: Identity, instance: Instance, isNew: boolean): void {
    if (isNew) this.db.exec({ sql: 'INSERT INTO instance (identity) VALUES (?)', bind: [identity] })
    else this.db.exec({ sql: 'DELETE FROM property WHERE owner = ?', bind: [identity] })
    instance.forEach((property, position) => {
      const isList = Array.isArray(property.value)
      this.db.exec({
        sql: 'INSERT INTO property (owner, position, kind, is_list, value) VALUES (?, ?, ?, ?, ?)',
        bind: [identity, position, property.kind, isList ? 1 : 0, isList ? null : (property.value as string)],
      })
      if (Array.isArray(property.value)) {
        property.value.forEach((item, itemPosition) => {
          this.db.exec({
            sql: 'INSERT INTO property_value (owner, position, item_position, value) VALUES (?, ?, ?, ?)',
            bind: [identity, position, itemPosition, item],
          })
        })
      }
    })
  }

  /** The database as a standalone `.sqlite` file. */
  export(): Uint8Array<ArrayBuffer> {
    return this.sqlite.capi.sqlite3_js_db_export(this.db)
  }

  close(): void {
    this.db.close()
  }
}
