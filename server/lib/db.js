import pg from 'pg';
const { Pool } = pg;
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { createClient } from '@supabase/supabase-js';

const envPath = path.resolve(process.cwd(), '.env');
if (fs.existsSync(envPath)) {
  dotenv.config({ path: envPath });
}

// SQL Connection
const pool = new Pool({
  host: process.env.DB_HOST_SB?.trim(),
  port: parseInt(process.env.DB_PORT_SB, 10) || 5432,
  user: process.env.DB_USER_SB,
  password: process.env.DB_PASSWORD_SB,
  database: process.env.DB_NAME_SB,
  ssl: { rejectUnauthorized: false }
});

// Supabase Client for Storage
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY;
export const supabase = createClient(supabaseUrl, supabaseKey);

/**
 * Uploads a local file to Supabase Storage and returns the public URL
 * @param {string} localPath - Path to local file
 * @param {string} fileName - Target name in bucket
 * @returns {Promise<string|null>} - Public URL or null if failed
 */
export async function uploadScreenshot(localPath, fileName) {
  try {
    const fileData = fs.readFileSync(localPath);
    const { data, error } = await supabase.storage
      .from('screenshots')
      .upload(fileName, fileData, {
        contentType: 'image/png',
        upsert: true
      });

    if (error) throw error;
    
    const { data: { publicUrl } } = supabase.storage
      .from('screenshots')
      .getPublicUrl(fileName);
      
    return publicUrl;
  } catch (err) {
    console.error('[STORAGE] Upload failed:', err.message);
    return null;
  }
}

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
      tests: testsRes.rows.map(t => {
        const parsedResult = typeof t.result === 'string' ? JSON.parse(t.result) : t.result;
        return {
          title: t.test_name,
          status: t.status,
          browser: parsedResult?.browser || 'unknown',
          ...parsedResult
        };
      })
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
    
    // Fetch screenshots for records about to be deleted to prune storage
    const pruneRes = await client.query(`
      SELECT result->>'screenshot' as path FROM ${table} 
      WHERE id NOT IN (SELECT id FROM ${table} ORDER BY id DESC LIMIT 200)
      AND result->>'screenshot' IS NOT NULL;
    `);
    
    // Attempt to delete from the cloud bucket
    const filesToDelete = pruneRes.rows
      .map(r => r.path ? r.path.split('/').pop() : null)
      .filter(Boolean);

    if (filesToDelete.length > 0) {
      await supabase.storage.from('screenshots').remove(filesToDelete);
    }

    // Prune tests beyond limit (200)
    await client.query(`
      DELETE FROM ${table} 
      WHERE id NOT IN (SELECT id FROM ${table} ORDER BY id DESC LIMIT 200)
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
    return res.rows.map(row => ({
      id: row.id,
      test_name: row.test_name,
      status: row.status,
      run_id: row.run_id,
      created_at: row.created_at,
      result: typeof row.result === 'string' ? JSON.parse(row.result) : row.result,
      // Flatten browser for easier access
      browser: typeof row.result === 'string' ? JSON.parse(row.result)?.browser : row.result?.browser
    }));
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


