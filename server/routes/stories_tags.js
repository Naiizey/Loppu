const express = require("express");
const db = require("../db/connect");
const pool = db.getPool();
const router = express.Router();

// GET all stories_tags
router.get("/stories_tags", (req, res) => {
  pool.query("SELECT * FROM stories_tags").then((results) => {
    res.json(results.rows);
  });
});

// GET stories_tags by id
router.get("/stories_tags/:id", (req, res) => {
  const { id } = req.params;
  pool
    .query("SELECT * FROM stories_tags WHERE id = $1", [id])
    .then((results) => {
      res.json(results.rows);
    });
});

// POST a new stories_tags
router.post("/stories_tags", (req, res) => {
  const { name } = req.body;
  pool.query("INSERT INTO stories_tags (name) VALUES ($1)", [name]).then(() => {
    res.json({
      message: "stories_tags added successfully!",
    });
  });
});

// PUT updated stories_tags
router.put("/stories_tags/:id", (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  pool
    .query("UPDATE stories_tags SET name = $1 WHERE id = $2", [name, id])
    .then(() => {
      res.json({
        message: "stories_tags updated successfully!",
      });
    });
});

// DELETE stories_tags
router.delete("/stories_tags/:id", (req, res) => {
  const { id } = req.params;
  pool.query("DELETE FROM stories_tags WHERE id = $1", [id]).then(() => {
    res.json({
      message: "stories_tags deleted successfully!",
    });
  });
});

module.exports = router;
