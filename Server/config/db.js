const { Client } = require('pg');
require('dotenv').config();

// Construct the connection string based on the environment
const connectionString =
  process.env.NODE_ENV === 'production'
    ? `postgres://satvik0125:pVoFMOxX94Na@ep-flat-moon-36733642.us-east-2.aws.neon.tech/Test2`
    : `postgres://satvik0125:pVoFMOxX94Na@ep-flat-moon-36733642.us-east-2.aws.neon.tech/Test2`;

// Create a new PostgreSQL client
const pool = new Client({
  connectionString: connectionString,
  ssl: {
    rejectUnauthorized: true, // Set to false if your server uses a self-signed certificate
  },
});

// Connect to the PostgreSQL database
pool.connect();

module.exports = { pool };
