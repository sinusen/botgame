// db-clientpool.js - Global pool of clients for all DB connections

const { Pool } = require("pg");

config = {
  connectionString: process.env.DB_CONNECTION_STRING,
  max: 20,
  connectionTimeoutMillis: 5000,
  idleTimeoutMillis: 30000,
};

module.exports = new Pool(config);
