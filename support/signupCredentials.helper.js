import fs from 'fs';
import path from 'path';

const RANDOM_USERS_FILE = path.join(process.cwd(), 'fixtures/users/RandomUsers.json');
const NEW_USERS_FILE = path.join(process.cwd(), 'fixtures/users/NewUsers.json');

export function getRandomUser() {
  const users = JSON.parse(fs.readFileSync(RANDOM_USERS_FILE, 'utf-8'));

  if (!users.length) {
    return null;
  }

  // Always return first user (predictable & safe)
  return users[0];
}

export function moveUserAfterSuccess(user) {
  const randomUsers = JSON.parse(fs.readFileSync(RANDOM_USERS_FILE, 'utf-8'));
  const newUsers = fs.existsSync(NEW_USERS_FILE)
    ? JSON.parse(fs.readFileSync(NEW_USERS_FILE, 'utf-8'))
    : [];

  // Remove user from random list
  const remainingUsers = randomUsers.filter(u => u.email !== user.email);

  // Add to new users
  newUsers.push(user);

  fs.writeFileSync(
    RANDOM_USERS_FILE,
    JSON.stringify(remainingUsers, null, 2),
    'utf-8'
  );

  fs.writeFileSync(
    NEW_USERS_FILE,
    JSON.stringify(newUsers, null, 2),
    'utf-8'
  );
}
