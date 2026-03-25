import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const FIXTURE_PATH = path.join(__dirname, '../fixtures/users.json');

export function loadCredentials() {
  const data = JSON.parse(fs.readFileSync(FIXTURE_PATH, 'utf-8'));
  // Wrap in array so callers can use [0] indexing
  return Array.isArray(data.candidate) ? data.candidate : [data.candidate];
}

export function updatePassword(email, newPassword) {
  const data = JSON.parse(fs.readFileSync(FIXTURE_PATH, 'utf-8'));

  if (data.candidate.email === email) {
    data.candidate = { ...data.candidate, password: newPassword };
  }

  fs.writeFileSync(
    FIXTURE_PATH,
    JSON.stringify(data, null, 2),
    'utf-8'
  );
}
