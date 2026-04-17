import pg from 'pg';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { createClient } from '@supabase/supabase-js';

      const { Pool } = pg;

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
       const supabaseUrl = process.env.SUPABASE_URL;
       const supabaseKey = process.env.SUPABASE_PUBLISHABLE_KEY
export const supabase = createClient(supabaseUrl, supabaseKey);

/**
 * Saves a local file to the dashboard's public folder for local serving
 */
export async function uploadScreenshot(localPath, fileName) {
        try {
        const dashboardRoot = process.env.DASHBOARD_PATH || process.cwd();
        const publicDir = path.join(dashboardRoot, 'public', 'screenshots');
    
        if (!fs.existsSync(publicDir)) {
        fs.mkdirSync(publicDir, { recursive: true });
        }

        const targetPath = path.join(publicDir, fileName);
        fs.copyFileSync(localPath, targetPath);
    
// Return relative URL for Next.js image serving
        return `/screenshots/${fileName}`;
        } catch (err)
        {
        console.error('[LOCAL STORAGE] Save failed:', err.message);
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
        VALUES ($1, $2, $3, $4, $5, $6) RETURNING *;`;
        await client.query(query, [
            runData.id, runData.startedAt, runData.endedAt,
            runData.duration, runData.summary, runData.name || null
        ]);
    
// Prune entries beyond the 100 limit
        await client.query(`
        DELETE FROM ${table} 
        WHERE id NOT IN (SELECT id FROM ${table} ORDER BY created_at DESC LIMIT 100)`);
    
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
      VALUES ($1, $2, $3, $4) RETURNING *;`;
      const res = await client.query(query, [testName, status, result, runId]);
    
    // Prune tests beyond limit (100)
      await client.query(`
      DELETE FROM ${table} 
      WHERE id NOT IN (SELECT id FROM ${table} ORDER BY id DESC LIMIT 100)`);
    
      await client.query('COMMIT');
      return res.rows[0];
      } catch (err)
      {
      await client.query('ROLLBACK');
      throw err;
      } finally {
      client.release();
      }
}

export const insertTestCase = (n, s, r, rid) => insertCase('test_cases', n, s, r, rid);
export const insertApiTestCase = (n, s, r, rid) => insertCase('api_test_cases', n, s, r, rid);
export const insertLoadTestCase = (n, s, r, rid) => insertCase('load_test_cases', n, s, r, rid);
