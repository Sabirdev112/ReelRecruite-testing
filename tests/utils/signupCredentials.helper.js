import fs from 'fs';
import path from 'path';

const NEW_USERS_FILE = path.join(process.cwd(), 'tests/test-data/users/NewUsers.json');
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
 * Format a getRandomUser().phone value for POST /v1/auth/signup (expects e.g. (+92)0123456789).
 */
export function toSignupApiPhone(phone) {
  const digits = String(phone).replace(/\D/g, '');
  const local = (digits.startsWith('92') ? digits.slice(2) : digits).slice(-10).padStart(10, '0');
  return `(+92)${local}`;
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


