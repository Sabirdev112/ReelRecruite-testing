import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export function loadCredentials() {
  const data = JSON.parse(
    fs.readFileSync(
      path.join(__dirname, '../fixtures/users.json'),
      'utf-8'
    )
  );
  return data.recruiter;
}
export function saveCredentials(updatedUsers) {
  const credentialsPath = path.join(
    __dirname,
    '../fixtures/users.json'
  );
  const data = JSON.parse(fs.readFileSync(credentialsPath, 'utf-8'));
  data.recruiter = updatedUsers;
  fs.writeFileSync(credentialsPath, JSON.stringify(data, null, 2), 'utf-8');
}
