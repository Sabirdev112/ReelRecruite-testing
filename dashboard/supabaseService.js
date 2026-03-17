import pg from 'pg';
const { Pool } = pg;
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

/**
 * Supabase Connection Module
 * 
 * Uses 'pg' to connect to Supabase via the connection string.
 * Enforces a 200-row rolling limit on the 'test_cases' table.
 */

// Initialize connection pool
console.log(`📡 Connecting to Supabase at: ${process.env.DB_HOST_SB || 'DATABASE_URL_SB'}`);

// Note: It's recommended to use DATABASE_URL, but we support individual components as well.
const pool = new Pool({
  // connectionString: process.env.DATABASE_URL_SB, // Prioritize individual fields to avoid password parsing issues
  host: process.env.DB_HOST_SB ? process.env.DB_HOST_SB.trim() : undefined,
  port: process.env.DB_PORT_SB,
  user: process.env.DB_USER_SB,
  password: process.env.DB_PASSWORD_SB,
  database: process.env.DB_NAME_SB,
  ssl: {
    rejectUnauthorized: false
  }
});

/**
 * Inserts a new test run summary.
 */
export async function insertTestRun(runData) {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const query = `
      INSERT INTO test_runs (id, started_at, ended_at, duration, summary)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *;
    `;
    const res = await client.query(query, [
      runData.id,
      runData.startedAt,
      runData.endedAt,
      runData.duration,
      runData.summary
    ]);

    // Enforce 200-run limit
    await client.query(`
      DELETE FROM test_runs
      WHERE id NOT IN (
        SELECT id FROM test_runs
        ORDER BY created_at DESC
        LIMIT 200
      );
    `);

    await client.query('COMMIT');
    return res.rows[0];
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Error inserting test run:', err.message);
    throw err;
  } finally {
    client.release();
  }
}

/**
 * Inserts a new test case result and maintains the rolling limit.
 */
export async function insertTestCase(testName, status, result, runId) {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const insertQuery = `
      INSERT INTO test_cases (test_name, status, result, run_id)
      VALUES ($1, $2, $3, $4)
      RETURNING *;
    `;
    const res = await client.query(insertQuery, [testName, status, result, runId]);
    const insertedRow = res.rows[0];

    // Enforce limit
    await client.query(`
      DELETE FROM test_cases
      WHERE id NOT IN (
        SELECT id FROM test_cases
        ORDER BY created_at DESC
        LIMIT 2000
      );
    `);

    await client.query('COMMIT');
    return insertedRow;
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Error inserting test case:', err.message);
    throw err;
  } finally {
    client.release();
  }
}

/**
 * Retrieves latest test runs.
 */
export async function getTestRuns() {
  try {
    const res = await pool.query('SELECT * FROM test_runs ORDER BY created_at DESC LIMIT 200');
    // Note: pg returns BIGINT columns as strings — parse them explicitly
    return res.rows.map(row => ({
      id: Number(row.id),
      startedAt: row.started_at,
      endedAt: row.ended_at,
      duration: parseInt(row.duration, 10) || 0,
      summary: row.summary
    }));
  } catch (err) {
    console.error('Error fetching runs:', err.message);
    return [];
  }
}

/**
 * Retrieves details for a specific run.
 */
export async function getRunDetails(runId) {
  try {
    const runRes = await pool.query('SELECT * FROM test_runs WHERE id = $1', [runId]);
    if (runRes.rows.length === 0) return null;

    const run = runRes.rows[0];
    const testsRes = await pool.query('SELECT * FROM test_cases WHERE run_id = $1', [runId]);

    return {
      id: Number(run.id),
      startedAt: run.started_at,
      endedAt: run.ended_at,
      duration: parseInt(run.duration, 10) || 0,
      summary: run.summary,
      tests: testsRes.rows.map(t => ({
        title: t.test_name,
        status: t.status,
        ...t.result
      }))
    };
  } catch (err) {
    console.error('Error fetching run details:', err.message);
    return null;
  }
}

/**
 * Retrieves the latest 200 individual test cases.
 */
export async function getLatestTests() {
  try {
    const res = await pool.query('SELECT * FROM test_cases ORDER BY created_at DESC LIMIT 200');
    return res.rows;
  } catch (err) {
    console.error('Error fetching latest tests:', err.message);
    return [];
  }
}

/**
 * Example Usage Helper
 * You can call this to verify the connection or as a template for your server logic.
 */
export async function testConnection() {
  try {
    const res = await pool.query('SELECT NOW()');
    console.log('Connected to Supabase successfully at:', res.rows[0].now);
    return true;
  } catch (err) {
    console.error('Connection failed:', err.message);
    return false;
  }
}
