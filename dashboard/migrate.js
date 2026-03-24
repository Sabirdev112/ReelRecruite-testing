import pg from 'pg';
const { Pool } = pg;
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '../.env') });

const pool = new Pool({
  host: process.env.DB_HOST_SB ? process.env.DB_HOST_SB.trim() : undefined,
  port: process.env.DB_PORT_SB,
  user: process.env.DB_USER_SB,
  password: process.env.DB_PASSWORD_SB,
  database: process.env.DB_NAME_SB,
  ssl: {
    rejectUnauthorized: false
  }
});

async function migrate() {
  try {
    await pool.query('ALTER TABLE test_runs ADD COLUMN IF NOT EXISTS run_name TEXT');
    console.log('Migration completed: Added run_name to test_runs');
  } catch (err) {
    console.error('Migration failed:', err.message);
  } finally {
    process.exit();
  }
}

migrate();
