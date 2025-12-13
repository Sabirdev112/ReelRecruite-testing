import dotenv from 'dotenv';
dotenv.config();

export const ENV = {
  // Backend
  API_BASE_URL: process.env.API_BASE_URL || 'https://recruitai-backend-production.up.railway.app',

  // Frontend
  WEB_BASE_URL: process.env.WEB_BASE_URL || 'https://recruitai-web-production.up.railway.app',

  // Database
  DB: {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 5432,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
  },

  // Playwright
  TIMEOUT: 30_000
};
