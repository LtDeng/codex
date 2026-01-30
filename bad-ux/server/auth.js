import { getDb } from './db.js';

export async function createAccount({ credential }) {
  // Skeleton for exact string match storage.
  // No normalization. Case-sensitive. Whitespace-sensitive.
  const db = getDb();
  db.prepare('INSERT INTO users (credential) VALUES (?)').run(credential);
}

export async function authenticate({ credential }) {
  // Skeleton for exact string match authentication.
  // No normalization. Case-sensitive. Whitespace-sensitive.
  const db = getDb();
  const row = db.prepare('SELECT id FROM users WHERE credential = ?').get(credential);
  return Boolean(row);
}
