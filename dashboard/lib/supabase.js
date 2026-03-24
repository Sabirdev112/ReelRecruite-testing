import pg from 'pg';
const { Pool } = pg;
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';

const envPaths = [
  path.resolve(process.cwd(), '.env'),
  path.resolve(process.cwd(), '../.env'),
];

const envPath = envPaths.find(p => fs.existsSync(p));
if (envPath) dotenv.config({ path: envPath });

const pool = new Pool({
  host: process.env.DB_HOST_SB?.trim(),
  port: parseInt(process.env.DB_PORT_SB, 10) || 5432,
  user: process.env.DB_USER_SB,
  password: process.env.DB_PASSWORD_SB,
  database: process.env.DB_NAME_SB,
  ssl: { rejectUnauthorized: false }
});

// Generic run insertion
async function insertRun(table, runData) {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const query = `
      INSERT INTO ${table} (id, started_at, ended_at, duration, summary, run_name)
      VALUES ($1, $2, $3, $4, $5, $6) RETURNING *;
    `;
    const res = await client.query(query, [
      runData.id, runData.startedAt, runData.endedAt,
      runData.duration, runData.summary, runData.name || null
    ]);
    
    // Prune entries beyond the 200 limit
    await client.query(`
      DELETE FROM ${table} 
      WHERE id NOT IN (SELECT id FROM ${table} ORDER BY created_at DESC LIMIT 200)
    `);
    
    await client.query('COMMIT');
    return res.rows[0];
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}

export const insertTestRun = (runData) => insertRun('test_runs', runData);
export const insertApiRun = (runData) => insertRun('api_runs', runData);
export const insertLoadRun = (runData) => insertRun('load_runs', runData);

export async function getRuns(table) {
  try {
    const res = await pool.query(`SELECT * FROM ${table} ORDER BY id DESC LIMIT 200`);
    return res.rows.map(row => ({
      id: row.id,
      startedAt: row.started_at,
      endedAt: row.ended_at,
      duration: parseInt(row.duration, 10) || 0,
      summary: row.summary,
      name: row.run_name
    }));
  } catch (err) {
    console.error(`[DB] Error fetching ${table}:`, err.message);
    return [];
  }
}

export async function getDetailedReport(runTable, testTable, runId) {
  try {
    const runRes = await pool.query(`SELECT * FROM ${runTable} WHERE id = $1::BIGINT`, [runId]);
    if (runRes.rows.length === 0) return null;
    const run = runRes.rows[0];
    const testsRes = await pool.query(`SELECT * FROM ${testTable} WHERE run_id = $1::BIGINT ORDER BY id ASC`, [runId]);
    
    return {
      id: run.id,
      startedAt: run.started_at,
      endedAt: run.ended_at,
      duration: parseInt(run.duration, 10) || 0,
      summary: run.summary,
      name: run.run_name,
      tests: testsRes.rows.map(t => ({
        title: t.test_name,
        status: t.status,
        ...t.result
      }))
    };
  } catch (err) {
    console.error(`[DB] Trace Failure for ${runId}:`, err.message);
    return null;
  }
}

export const getRunDetails = (id) => getDetailedReport('test_runs', 'test_cases', id);
export const getApiRunDetails = (id) => getDetailedReport('api_runs', 'api_test_cases', id);
export const getLoadRunDetails = (id) => getDetailedReport('load_runs', 'load_test_cases', id);

// Test Case Insertion
async function insertCase(table, testName, status, result, runId) {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const query = `
      INSERT INTO ${table} (test_name, status, result, run_id)
      VALUES ($1, $2, $3, $4) RETURNING *;
    `;
    const res = await client.query(query, [testName, status, result, runId]);
    
    // Prune tests beyond limit (2000 per requested 200 per category run session)
    await client.query(`
      DELETE FROM ${table} 
      WHERE id NOT IN (SELECT id FROM ${table} ORDER BY id DESC LIMIT 2000)
    `);
    
    await client.query('COMMIT');
    return res.rows[0];
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}

export const insertTestCase = (n, s, r, rid) => insertCase('test_cases', n, s, r, rid);
export const insertApiTestCase = (n, s, r, rid) => insertCase('api_test_cases', n, s, r, rid);
export const insertLoadTestCase = (n, s, r, rid) => insertCase('load_test_cases', n, s, r, rid);

export async function getLatestSpecimens(table) {
  try {
    // We order by id DESC to get most recent at the top
    const res = await pool.query(`SELECT * FROM ${table} ORDER BY id DESC LIMIT 200`);
    return res.rows;
  } catch (err) {
    console.error(`[DB] Error fetching ${table}:`, err.message);
    return [];
  }
}

export const getLatestTests = () => getLatestSpecimens('test_cases');
export const getLatestApiTests = () => getLatestSpecimens('api_test_cases');
export const getLatestLoadTests = () => getLatestSpecimens('load_test_cases');
export const getTestRuns = () => getRuns('test_runs');
export const getApiRuns = () => getRuns('api_runs');
export const getLoadRuns = () => getRuns('load_runs');
