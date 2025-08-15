const { Pool } = require('pg');

const db = new Pool({
  user: process.env.USER,
  database: process.env.DATABASE,
  host: process.env.HOST,
  password: process.env.PASSWORD,
  port: process.env.DATABASE_PORT,
});

db.on('connect', () => {
  console.log('✅ PostgreSQL pool is ready.');
});

db.on('error', (err) => {
  console.error('❌ PostgreSQL pool error:', err.stack);
});

module.exports = db;
