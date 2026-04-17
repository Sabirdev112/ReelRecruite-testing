import pg from 'pg';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const { Pool } = pg;

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const pool = new Pool({
  host: process.env.DB_HOST_SB?.trim(),
  port: parseInt(process.env.DB_PORT_SB, 10) || 5432,
  user: process.env.DB_USER_SB,
  password: process.env.DB_PASSWORD_SB,
  database: process.env.DB_NAME_SB,
  ssl: { rejectUnauthorized: false }
});


// Creates all telemetry tables used by lib/db/index.js:
 
async function migrate() {
  try {
    console.log('Starting schema migration (UI + API + load)...');

    await pool.query(`
      CREATE TABLE IF NOT EXISTS test_runs (
        id BIGINT PRIMARY KEY,
        run_name TEXT,
        started_at TIMESTAMPTZ,
        ended_at TIMESTAMPTZ,
        duration BIGINT,
        summary JSONB,
        created_at TIMESTAMPTZ DEFAULT NOW()
      );
    `);
    await pool.query(`
      CREATE TABLE IF NOT EXISTS test_cases (
        id SERIAL PRIMARY KEY,
        test_name TEXT,
        status TEXT,
        result JSONB,
        run_id BIGINT REFERENCES test_runs(id) ON DELETE CASCADE,
        created_at TIMESTAMPTZ DEFAULT NOW()
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS api_runs (
        id BIGINT PRIMARY KEY,
        run_name TEXT,
        started_at TIMESTAMPTZ,
        ended_at TIMESTAMPTZ,
        duration BIGINT,
        summary JSONB,
        created_at TIMESTAMPTZ DEFAULT NOW()
      );
    `);
    await pool.query(`
      CREATE TABLE IF NOT EXISTS api_test_cases (
        id SERIAL PRIMARY KEY,
        test_name TEXT,
        status TEXT,
        result JSONB,
        run_id BIGINT REFERENCES api_runs(id) ON DELETE CASCADE,
        created_at TIMESTAMPTZ DEFAULT NOW()
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS load_runs (
        id BIGINT PRIMARY KEY,
        run_name TEXT,
        started_at TIMESTAMPTZ,
        ended_at TIMESTAMPTZ,
        duration BIGINT,
        summary JSONB,
        created_at TIMESTAMPTZ DEFAULT NOW()
      );
    `);
    await pool.query(`
      CREATE TABLE IF NOT EXISTS load_test_cases (
        id SERIAL PRIMARY KEY,
        test_name TEXT,
        status TEXT,
        result JSONB,
        run_id BIGINT REFERENCES load_runs(id) ON DELETE CASCADE,
        created_at TIMESTAMPTZ DEFAULT NOW()
      );
    `);

    console.log('Migration finished: test_runs, test_cases, api_*, load_* tables ready.');
  } catch (err) {
    console.error('Migration failed:', err);
    process.exitCode = 1;
  } finally {
    await pool.end();
    process.exit();
  }
}

console.log('Initiating migration sequence...');
migrate();

export { migrate };
