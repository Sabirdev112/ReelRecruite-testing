import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Save application ID to tests/test-data/Candidate/applicationId.json
 */
export function storeApplicationId(applicationId) {
  const filePath = path.join(__dirname, '../test-data/Candidate/applicationId.json');
  const data = { applicationId };

  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
}

// gets id from tests/test-data/Candidate/applicationId.json
export function getApplicationId() {
  const filePath = path.join(__dirname, '../test-data/Candidate/applicationId.json');

  if (!fs.existsSync(filePath)) {
    throw new Error('Application ID file not found. Make sure candidate applied first!');
  }

  const { applicationId } = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  return applicationId;
}

export function buildApplicationUrl(applicationId) {
  return `https://recruitai-web-production.up.railway.app/applications/${applicationId}`;
}



