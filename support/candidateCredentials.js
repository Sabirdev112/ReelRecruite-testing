import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export function loadCredentials() {
  return JSON.parse(
    fs.readFileSync(
      path.join(__dirname, '../fixtures/Candidate/Credentials.json'),
      'utf-8'
    )
  );
}

export function updatePassword(email, newPassword) {
  const users = loadCandidateCredentials();

  const updatedUsers = users.map(user =>
    user.email === email
      ? { ...user, password: newPassword }
      : user
  );

  fs.writeFileSync(
    CANDIDATE_CREDENTIALS_PATH,
    JSON.stringify(updatedUsers, null, 2),
    'utf-8'
  );
}
