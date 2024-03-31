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
  const { name } = req.body;
  pool.query("INSERT INTO users (name) VALUES ($1)", [name]).then(() => {
    res.json({
      message: "user added successfully!",
    });
  });
});

// PUT updated user
router.put("/users/:id", (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  pool
    .query("UPDATE users SET name = $1 WHERE id = $2", [name, id])
    .then(() => {
      res.json({
        message: "user updated successfully!",
      });
    });
});

// DELETE user
router.delete("/users/:id", (req, res) => {
  const { id } = req.params;
  pool.query("DELETE FROM users WHERE id = $1", [id]).then(() => {
    res.json({
      message: "user deleted successfully!",
    });
  });
});

module.exports = router;
