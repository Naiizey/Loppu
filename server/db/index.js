const pg = require("pg");

// Connect to the postgres db
const pool = new pg.Pool({
  user: process.env.DATABASE_USER,
  host: process.env.DATABASE_HOST,
  database: process.env.DATABASE_NAME,
  password: process.env.DATABASE_PASSWORD,
});

pool.connect().then(() => {
  console.log("connected to the database");
});
