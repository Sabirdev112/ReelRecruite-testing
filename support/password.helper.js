import { runQuery } from '../utils/db/dbClient.js';
import bcrypt from 'bcrypt';
import { loadCredentials, saveCredentials } from './recruiterCredentials.js';

export async function changeRecruiterPassword(email, newPassword) {
  const users = loadCredentials();
  const updatedUsers = users.map(u =>
    u.email === email ? { ...u, password: newPassword } : u
  );
  saveCredentials(updatedUsers);
}

export async function verifyPasswordUpdatedInDb(email, oldPassword, newPassword) {
  const usersInDb = await runQuery(
    `SELECT password FROM users WHERE email = $1`,
    [email]
  );

  if (usersInDb.length !== 1) throw new Error('User not found in DB');

  const hashedPassword = usersInDb[0].password;

  // Old password should NOT match the new hash
  const isOldPasswordSame = await bcrypt.compare(oldPassword, hashedPassword);
  if (isOldPasswordSame) throw new Error('Old password still matches DB');

  // New password should match the hash
  const isNewPasswordCorrect = await bcrypt.compare(newPassword, hashedPassword);
  if (!isOldPasswordCorrect) throw new Error('New password does not match DB');

  console.log(`DB verification passed: Password updated successfully for ${email}`);
}
