import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const NEW_USERS_FILE = path.join(process.cwd(), 'tests/test-data/users/NewUsers.json');
const USERS_JSON_PATH = path.join(__dirname, '../fixtures/users.json');
const PASSWORD = 'Test@12345';

/**
 * Generate a single unique user for signup
 */
export function getRandomUser() {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 1000);

  const uniqueId = `${timestamp}${random}`;

  return {
    fullName: `User ${uniqueId.slice(-4)}`,
    email: `user${uniqueId}@gmail.com`,
    phone: `92${uniqueId.slice(-10)}`,
    password: PASSWORD
  };
}

/**
 * Format a getRandomUser().phone value for POST /v1/auth/signup (e.g. 923098765453).
 */
export function toSignupApiPhone(phone) {
  const digits = String(phone).replace(/\D/g, '');
  const withoutCountry = digits.startsWith('92') ? digits.slice(2) : digits;
  const local = withoutCountry.replace(/^0+/, '').slice(-10).padStart(10, '0');
  return `92${local}`;
}

/**
 * Persist successfully signed-up user
 */
export function storeNewUser(user) {
  if (!user?.email || !user?.phone) {
    throw new Error('email and phone did not generated. Cannot store user.');
  }

  const users = fs.existsSync(NEW_USERS_FILE)
    ? JSON.parse(fs.readFileSync(NEW_USERS_FILE, 'utf-8'))
    : [];

  users.push(user);

  fs.writeFileSync(
    NEW_USERS_FILE,
    JSON.stringify(users, null, 2),
    'utf-8'
  );
}

export function writeUsersJson(updates) {
  const existing = fs.existsSync(USERS_JSON_PATH)
    ? JSON.parse(fs.readFileSync(USERS_JSON_PATH, 'utf-8'))
    : {};

  const next = { ...existing };
  if (updates.candidate) next.candidate = updates.candidate;
  if (updates.recruiter) next.recruiter = updates.recruiter;

  fs.writeFileSync(USERS_JSON_PATH, JSON.stringify(next, null, 2), 'utf-8');
  console.log('[signupCredentials] users.json updated:', {
    candidate: next.candidate?.email,
    recruiter: next.recruiter?.email,
  });
}


