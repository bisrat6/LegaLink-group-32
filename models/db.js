const pg = require('pg');

const db = new pg.Client({
  user: process.env.USER,
  database: process.env.DATABASE,
  host: process.env.HOST,
  password: process.env.PASSWORD,
  port: process.env.DATABASE_PORT,
});

db.connect()
  .then(() => console.log('✅ Successfully connected to PostgreSQL!'))
  .catch((err) => console.error('❌ Connection error:', err.stack));
module.exports = db;
