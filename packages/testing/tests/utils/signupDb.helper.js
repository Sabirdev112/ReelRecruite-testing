import { runQuery } from "./db/dbClient.js";

export async function verifyUserCreated(email) {
  const rows = await runQuery(
    `SELECT id, email, full_name FROM users WHERE email = $1`,
    [email]
  );
  if (rows.length === 0) {
    throw new Error(`User with email ${email} not found in DB`);
  }
  return rows[0];
}
