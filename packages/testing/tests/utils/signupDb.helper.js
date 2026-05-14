import { runQuery } from "./db/dbClient.js";
import {deleteUserByEmail} from './cleanup.helper.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { expect } from '@playwright/test';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const USERS_JSON_PATH = path.join(__dirname, '../fixtures/users.json');




export async function verifyUserCreated(email) {
  const rows = await runQuery(
    `SELECT id, email, full_name, phone FROM users WHERE email = $1`,
    [email]
  );
  if (rows.length === 0) {
    throw new Error(`User with email ${email} not found in DB`);
  }
  return rows[0];
}

export async function approveRecruiter(email) {
  const rows = await runQuery(
    `UPDATE users
     SET is_approved = true
     WHERE email = $1 AND user_type = 'recruiter'
     RETURNING id, email, is_approved, user_type`,
    [email]
  );
  if (rows.length === 0) {
    throw new Error(`[signupDb] approveRecruiter: no recruiter found for email ${email}`);
  }
  console.log('[signupDb] approveRecruiter:', rows[0]);
  return rows[0];
}

function readUsersJson() {
  if (!fs.existsSync(USERS_JSON_PATH)) {
    throw new Error(`users.json not found at ${USERS_JSON_PATH}`);
  }
  return JSON.parse(fs.readFileSync(USERS_JSON_PATH, 'utf-8'));
}

// Idempotent: passes whether the row was actually deleted this run or was
// already absent (e.g. a previous cleanup run already removed it). The final
// SELECT enforces the real post-condition: the user is gone from the DB.
function assertGoneOrJustDeleted(role, email, result) {
  const ok = result.deleted === true || result.reason === 'not_found';
  expect(
    ok,
    `${role} ${email} was not deleted (deleted=${result.deleted}, reason=${result.reason})`
  ).toBe(true);
}

export async function deleteCandidate(){
  const { candidate } = readUsersJson();
  expect(candidate?.email, 'users.json is missing candidate.email').toBeTruthy();

  const result = await deleteUserByEmail(candidate.email);
  assertGoneOrJustDeleted('candidate', candidate.email, result);

  const remaining = await runQuery('SELECT id FROM users WHERE email = $1', [candidate.email]);
  expect(remaining.length).toBe(0);
}

export async function deleteRecruiter(){
  const { recruiter } = readUsersJson();
  expect(recruiter?.email, 'users.json is missing recruiter.email').toBeTruthy();

  const result = await deleteUserByEmail(recruiter.email);
  assertGoneOrJustDeleted('recruiter', recruiter.email, result);

  const remaining = await runQuery('SELECT id FROM users WHERE email = $1', [recruiter.email]);
  expect(remaining.length).toBe(0);
}
