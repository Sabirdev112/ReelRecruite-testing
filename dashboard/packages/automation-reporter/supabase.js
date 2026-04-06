import pg from 'pg';
const { Pool } = pg;
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { createClient } from '@supabase/supabase-js';

// The reporter always looks in process.cwd() for .env
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
    await client.query(query, [
      runData.id, runData.startedAt, runData.endedAt,
      runData.duration, runData.summary, runData.name || null
    ]);
    
    // Prune entries beyond the 200 limit
    await client.query(`
      DELETE FROM ${table} 
      WHERE id NOT IN (SELECT id FROM ${table} ORDER BY created_at DESC LIMIT 200)
    `);
    
    await client.query('COMMIT');
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
