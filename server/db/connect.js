const pg = require("pg");
require('dotenv').config();

// Connect to the postgres db
var pool = new pg.Pool({
  user: process.env.DATABASE_USER,
  host: process.env.DATABASE_HOST,
  database: process.env.DATABASE_NAME,
  password: process.env.DATABASE_PASSWORD,
  port : process.env.DATABASE_PORT,
});

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
