const express = require("express");
const db = require("../db/connect");
const pool = db.getPool();

const router = express.Router();

// GET all stories
router.get("/stories", (req, res) => {
  pool.query("SELECT * FROM stories").then((results) => {
    res.json(results.rows);
  });
});

// GET story by id
router.get("/stories/:id", (req, res) => {
  const { id } = req.params;
  pool.query("SELECT * FROM stories WHERE id = $1", [id]).then((results) => {
    res.json(results.rows);
  });
});

// POST a new story
router.post("/stories", (req, res) => {
  const { title, content } = req.body;
  pool
    .query("INSERT INTO stories (title, content) VALUES ($1, $2)", [
      title,
      content,
    ])
    .then(() => {
      res.json({
        message: "Story added successfully!",
      });
    });
});

// PUT updated story
router.put("/stories/:id", (req, res) => {
  const { id } = req.params;
  const { title, content } = req.body;
  pool
    .query("UPDATE stories SET title = $1, content = $2 WHERE id = $3", [
      title,
      content,
      id,
    ])
    .then(() => {
      res.json({
        message: "Story updated successfully!",
      });
    });
});

// DELETE story
router.delete("/stories/:id", (req, res) => {
  const { id } = req.params;
  pool.query("DELETE FROM stories WHERE id = $1", [id]).then(() => {
    res.json({
      message: "Story deleted successfully!",
    });
  });
});

module.exports = router;
