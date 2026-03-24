import pg from 'pg';
const { Pool } = pg;
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '../.env') });

const pool = new Pool({
  host: process.env.DB_HOST_SB?.trim(),
  port: process.env.DB_PORT_SB,
  user: process.env.DB_USER_SB,
  password: process.env.DB_PASSWORD_SB,
  database: process.env.DB_NAME_SB,
  ssl: { rejectUnauthorized: false }
});

async function migrate() {
  try {
    console.log('🚀 Starting Multi-Source Telemetry Migration...');

    // 1. API Tables
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

    // 2. Load Test Tables
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

    console.log('✅ Multi-Source Tables created successfully.');
  } catch (err) {
    console.error('❌ Migration failed:', err.message);
  } finally {
    process.exit();
  }
}

migrate();
