import Database from 'better-sqlite3';

let db;

export function getDb() {
  if (!db) {
    db = new Database('bad-ux.sqlite');
    // Schema placeholder:
    // CREATE TABLE users (
    //   id INTEGER PRIMARY KEY,
    //   credential TEXT NOT NULL
    // );
  }
  return db;
}
