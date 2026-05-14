import { getPool, runQuery } from './db/dbClient.js';

export async function deleteUserByEmail(email) {
  if (!email) throw new Error('[cleanup] deleteUserByEmail called with empty email');

  const found = await runQuery('SELECT id FROM users WHERE email = $1', [email]);
  if (found.length === 0) {
    console.log(`[cleanup] User not found, nothing to delete: ${email}`);
    return { deleted: false, reason: 'not_found', email };
  }
  const userId = found[0].id;

  const steps = [
    {
      label: 'application_answers (as candidate)',
      sql: `DELETE FROM application_answers
            WHERE application_id IN (SELECT id FROM applications WHERE candidate_id = $1)`,
    },
    {
      label: 'application_answers (via recruiter jobs)',
      sql: `DELETE FROM application_answers
            WHERE application_id IN (
              SELECT id FROM applications WHERE job_id IN (
                SELECT id FROM jobs WHERE recruiter_id = $1
              )
            )`,
    },

    // applications
    {
      label: 'applications (as candidate)',
      sql: `DELETE FROM applications WHERE candidate_id = $1`,
    },
    {
      label: 'applications (on recruiter jobs)',
      sql: `DELETE FROM applications
            WHERE job_id IN (SELECT id FROM jobs WHERE recruiter_id = $1)`,
    },

    // jobs (recruiter side)
    { label: 'jobs', sql: `DELETE FROM jobs WHERE recruiter_id = $1` },

    // videos uploaded by this user (cover videos, application recordings, etc.).
    // Without this, FK videos.uploaded_by → users.id blocks the user delete.
    { label: 'videos', sql: `DELETE FROM videos WHERE uploaded_by = $1` },

    // profile rows
    { label: 'candidate_profiles', sql: `DELETE FROM candidate_profiles WHERE user_id = $1` },
    { label: 'company_profiles',  sql: `DELETE FROM company_profiles  WHERE user_id = $1` },

    // the user itself
    { label: 'users', sql: `DELETE FROM users WHERE id = $1` },
  ];

  const client = await getPool().connect();
  try {
    await client.query('BEGIN');

    for (const step of steps) {
      try {
        const res = await client.query(step.sql, [userId]);
        if (res.rowCount > 0) {
          console.log(`[cleanup] ${step.label}: deleted ${res.rowCount}`);
        }
      } catch (err) {
        // 42P01 = undefined_table, 42703 = undefined_column. Tolerate both so
        // a schema drift on one step doesn't tear down the whole transaction
        // before the user-blocking step (videos/applications) has a chance.
        if (err.code === '42P01' || err.code === '42703') {
          console.log(`[cleanup] ${step.label}: ${err.code === '42P01' ? 'table' : 'column'} missing, skipped`);
          continue;
        }
        throw err;
      }
    }

    await client.query('COMMIT');
    console.log(`[cleanup] Deleted user ${email} (${userId})`);
    return { deleted: true, userId, email };
  } catch (err) {
    await client.query('ROLLBACK');
    console.error(`[cleanup] Rolled back delete for ${email}:`, err.message);
    throw err;
  } finally {
    client.release();
  }
}
