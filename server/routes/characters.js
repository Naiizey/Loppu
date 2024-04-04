const express = require("express");
const db = require("../db/connect");
const pool = db.getPool();
const router = express.Router();

// GET all characters
router.get("/characters", (req, res) => {
  pool.query("SELECT * FROM characters").then((results) => {
    res.json(results.rows);
  });
});

// GET character by id
router.get("/characters/:id", (req, res) => {
  const { id } = req.params;
  pool.query("SELECT * FROM characters WHERE id = $1", [id]).then((results) => {
    res.json(results.rows);
  });
});

// POST a new character
router.post("/characters", (req, res) => {
  const { name } = req.body;
  pool.query("INSERT INTO characters (name) VALUES ($1)", [name]).then(() => {
    res.json({
      message: "Character added successfully!",
    });
  });
});

// PUT updated character
router.put("/characters/:id/stats", (req, res) => {
  const { id } = req.params;
  const stats = req.body;
  pool
    .query("UPDATE characters SET stats = $1 WHERE id = $2", [stats, id])
    .then(() => {
      res.json({
        message: "Character updated successfully!",
      });
    });
});

// DELETE character
router.delete("/characters/:id", (req, res) => {
  const { id } = req.params;
  pool.query("DELETE FROM characters WHERE id = $1", [id]).then(() => {
    res.json({
      message: "Character deleted successfully!",
    });
  });
});

module.exports = router;
