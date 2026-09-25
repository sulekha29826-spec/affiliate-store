const knex = require('knex');
const knexfile = require('../../knexfile');

const env = process.env.NODE_ENV || 'development';
const db = knex(knexfile[env]);

db.raw('SELECT 1')
  .then(() => console.log('✅ PostgreSQL connected'))
  .catch((err) => console.error('❌ DB connection failed:', err.message));

module.exports = db;
