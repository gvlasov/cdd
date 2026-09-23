// Where the editor keeps files uploaded to an ontology (images, for now). The
// host passes an implementation to <OntologyEditor :file-store>; without one,
// the editor offers no uploads.
export interface StoredFile {
  /** Content-addressed name, unique within the ontology. */
  name: string
  /** Where the file is served from — what an Image instance's `url` holds. */
  url: string
  size: number
  contentType: string
  originalName: string
  uploadedAt: string
}

export interface FileStore {
  /** Every file uploaded to the ontology, newest first. */
  list(): Promise<StoredFile[]>
  upload(file: File): Promise<StoredFile>
  remove(name: string): Promise<void>
}
