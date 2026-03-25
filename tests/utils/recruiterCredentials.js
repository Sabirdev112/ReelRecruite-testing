import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export function loadCredentials() {
  const raw = fs.readFileSync(
    path.join(__dirname, '../fixtures/users.json'),
    'utf-8'
  );
  const data = JSON.parse(raw.trim()); // trim() handles leading/trailing whitespace
  if (!data.recruiter) throw new Error('[loadCredentials] users.json is missing "recruiter" key');
  // Wrap in array so callers can use [0] indexing
  return Array.isArray(data.recruiter) ? data.recruiter : [data.recruiter];
}
export function saveCredentials(updatedUsers) {
  const credentialsPath = path.join(
    __dirname,
    '../fixtures/users.json'
  );
  const data = JSON.parse(fs.readFileSync(credentialsPath, 'utf-8'));
  // Unwrap array back to single object to match the JSON structure
  data.recruiter = Array.isArray(updatedUsers) ? updatedUsers[0] : updatedUsers;
  fs.writeFileSync(credentialsPath, JSON.stringify(data, null, 2), 'utf-8');
}
