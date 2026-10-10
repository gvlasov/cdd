import sqlite3InitModule from '@sqlite.org/sqlite-wasm'
import type { Sqlite3Static } from '@sqlite.org/sqlite-wasm'

let loading: Promise<Sqlite3Static> | undefined

/** The SQLite WebAssembly module, initialised once on first use. */
export function sqliteModule(): Promise<Sqlite3Static> {
  loading ??= sqlite3InitModule()
  return loading
}
