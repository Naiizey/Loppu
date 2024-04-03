const pg = require("pg");
require("dotenv").config({
  path: "../.env",
});

// Connect to the postgres db using the connection string in the .env file
const pool = new pg.Pool(
  process.env.DATABASE_URL
    ? {
        connectionString: process.env.DATABASE_URL,
      }
    : {
        user: process.env.DATABASE_USER,
        host: process.env.DATABASE_HOST,
        database: process.env.DATABASE_NAME,
        password: process.env.DATABASE_PASSWORD,
        port: process.env.DATABASE_PORT,
      }
);

pool.connect().then(() => {
  console.log("connected to the database");
});

module.exports = {
  getPool: function () {
    if (pool) return pool; // if it is already there, grab it here
    pool = new pg.Pool(config);
    return pool;
  },
};
