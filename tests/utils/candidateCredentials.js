import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const FIXTURE_PATH = path.join(__dirname, '../fixtures/users.json');

export function loadCredentials() {
  const data = JSON.parse(fs.readFileSync(FIXTURE_PATH, 'utf-8'));
  return data.candidate;
}

export function updatePassword(email, newPassword) {
  const data = JSON.parse(fs.readFileSync(FIXTURE_PATH, 'utf-8'));
  
  data.candidate = data.candidate.map(user =>
    user.email === email
      ? { ...user, password: newPassword }
      : user
  );

  fs.writeFileSync(
    FIXTURE_PATH,
    JSON.stringify(data, null, 2),
    'utf-8'
  );
}
