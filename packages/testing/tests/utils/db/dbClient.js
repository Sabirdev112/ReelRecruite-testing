import pg from 'pg';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load env from testing package root
dotenv.config({ path: path.resolve(__dirname, '../../../.env') });

const { Pool } = pg;

const pool = new Pool({
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT, 10) || 5432,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false
});

/**
 * Executes a PostgreSQL query (Legacy verification logic)
 */
export async function runQuery(query, params = []) {
  try {
    const res = await pool.query(query, params);
    return res.rows;
  } catch (err) {
    console.error('[DB-VERIFICATION] PG Error:', err.message);
    throw err;
  }
}

// Keep a placeholder for mongo if needed, but the main E2E uses PostgreSQL for app data
export const getPool = () => pool;
