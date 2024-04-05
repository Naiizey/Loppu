const express = require("express");
const db = require("../db/connect");
const pool = db.getPool();

const router = express.Router();

// GET all users
router.get("/users", (req, res) => {
  pool.query("SELECT * FROM users").then((results) => {
    res.json(results.rows);
  });
});

// GET user by id
router.get("/users/:id", (req, res) => {
  const { id } = req.params;
  pool.query("SELECT * FROM users WHERE id = $1", [id]).then((results) => {
    res.json(results.rows);
  });
});

// POST a new user
router.post("/users", (req, res) => {
  console.log(req.body);
  const { username, password, email } = req.body;
  pool
    .query(
      "INSERT INTO users (username, password, email) VALUES ($1, $2, $3)",
      [username, password, email]
    )
    .then(() => {
      res.json({ message: "User created" });
    });
});

// PUT updated user info
router.put("/users/:id", (req, res) => {
  const { id } = req.params;
  const { username, password, email } = req.body;
  pool
    .query(
      "UPDATE users SET username = $1, password = $2, email = $3 WHERE id = $4",
      [username, password, email, id]
    )
    .then(() => {
      res.json({ message: "User updated" });
    });
});

// DELETE a user
router.delete("/users/:id", (req, res) => {
  const { id } = req.params;
  pool.query("DELETE FROM users WHERE id = $1", [id]).then(() => {
    res.json({ message: "User deleted" });
  });
});

module.exports = router;
