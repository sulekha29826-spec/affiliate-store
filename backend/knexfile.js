require('dotenv').config();

const connectionConfig = () => {
  const url = process.env.DATABASE_URL || '';
  if (!url.includes('.render.com') && !url.includes('sslmode=require')) {
    return url;
  }
  return {
    connectionString: url,
    ssl: { rejectUnauthorized: false },
  };
};

module.exports = {
  development: {
    client: 'pg',
    connection: process.env.DATABASE_URL,
    migrations: { directory: './migrations' },
    seeds: { directory: './seeds' },
  },
  production: {
    client: 'pg',
    connection: connectionConfig(),
    migrations: { directory: './migrations' },
    seeds: { directory: './seeds' },
  },
};
