import fs from 'fs';
import path from 'path';

const RANDOM_USERS_FILE = path.join(process.cwd(), 'fixtures/users/RandomUsers.json');
const NEW_USERS_FILE = path.join(process.cwd(), 'fixtures/users/NewUsers.json');


export function getRandomUser() {
  const users = JSON.parse(fs.readFileSync(RANDOM_USERS_FILE, 'utf-8'));

  if (!users.length) {
    throw new Error('No users left in RandomUsers.json');
  }

  // Remove user immediately
  const user = users.shift();

  // Defensive: ensure phone exists and is unique per user
  if (!user.phone) {
    throw new Error(`User ${user.email} has no phone number`);
  }

  fs.writeFileSync(
    RANDOM_USERS_FILE,
    JSON.stringify(users, null, 2),
    'utf-8'
  );

  // Return a fresh copy (prevents mutation reuse)
  return JSON.parse(JSON.stringify(user));
}

export function moveUserAfterSuccess(user) {
  const newUsers = fs.existsSync(NEW_USERS_FILE)
    ? JSON.parse(fs.readFileSync(NEW_USERS_FILE, 'utf-8'))
    : [];

  newUsers.push(user);

  fs.writeFileSync(
    NEW_USERS_FILE,
    JSON.stringify(newUsers, null, 2),
    'utf-8'
  );
}
