const express = require("express");
const db = require("../db/connect");
const pool = db.getPool();
const router = express.Router();

// GET all tags
router.get("/tags", (req, res) => {
  pool.query("SELECT * FROM tags").then((results) => {
    res.json(results.rows);
  });
});

// GET tags by id
router.get("/tags/:id", (req, res) => {
  const { id } = req.params;
  pool.query("SELECT * FROM tags WHERE id = $1", [id]).then((results) => {
    res.json(results.rows);
  });
});

// POST a new tags
router.post("/tags", (req, res) => {
  const { name } = req.body;
  pool.query("INSERT INTO tags (name) VALUES ($1)", [name]).then(() => {
    res.json({
      message: "tags added successfully!",
    });
  });
});

// PUT updated tags
router.put("/tags/:id", (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  pool.query("UPDATE tags SET name = $1 WHERE id = $2", [name, id]).then(() => {
    res.json({
      message: "tags updated successfully!",
    });
  });
});

// DELETE tags
router.delete("/tags/:id", (req, res) => {
  const { id } = req.params;
  pool.query("DELETE FROM tags WHERE id = $1", [id]).then(() => {
    res.json({
      message: "tags deleted successfully!",
    });
  });
});

module.exports = router;
