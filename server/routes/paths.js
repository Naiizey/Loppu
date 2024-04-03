const express = require("express");
const db = require("../db/connect");
const pool = db.getPool();
const router = express.Router();

// GET all paths
router.get("/paths", (req, res) => {
  pool.query("SELECT * FROM paths").then((results) => {
    res.json(results.rows);
  });
});

// GET path by id
router.get("/paths/:id", (req, res) => {
  const { id } = req.params;
  pool.query("SELECT * FROM paths WHERE id = $1", [id]).then((results) => {
    res.json(results.rows);
  });
});

// POST a new path
router.post("/paths", (req, res) => {
  const { name } = req.body;
  pool.query("INSERT INTO paths (name) VALUES ($1)", [name]).then(() => {
    res.json({
      message: "path added successfully!",
    });
  });
});

// PUT updated path
router.put("/paths/:id", (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  pool
    .query("UPDATE paths SET name = $1 WHERE id = $2", [name, id])
    .then(() => {
      res.json({
        message: "path updated successfully!",
      });
    });
});

// DELETE path
router.delete("/paths/:id", (req, res) => {
  const { id } = req.params;
  pool.query("DELETE FROM paths WHERE id = $1", [id]).then(() => {
    res.json({
      message: "path deleted successfully!",
    });
  });
});

module.exports = router;
