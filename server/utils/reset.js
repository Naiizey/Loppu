const pg = require("pg");
const fs = require("fs").promises; // Use the promise version of fs
require("dotenv").config({
  path: "../.env",
});

// Define the pool
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

async function resetDatabase() {
  try {
    const client = await pool.connect(); // Get a client and connect
    const sql = await fs.readFile('../containers/db/0-init.sql', 'utf-8'); // Read the SQL file
    await client.query("DROP SCHEMA public CASCADE"); // Drop the schema
    await client.query("CREATE SCHEMA public;"); // Create the schema
    await client.query("SET search_path TO public;"); // Set the default search path
    await client.query(sql); // Execute the SQL file
    console.log("Database reset successfully.");
  } catch (err) {
    console.error("Error executing database reset:", err);
  } finally {
    pool.end(); // Close the pool
    process.exit()
  }
}

resetDatabase();

