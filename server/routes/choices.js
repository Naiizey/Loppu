const express = require("express");
const db = require("../db/connect");
const pool = db.getPool();
const router = express.Router();

// GET all choices
router.get("/choices/:storyId", (req, res) => {
  const { storyId } = req.params;
  pool.query("SELECT * FROM choices WHERE id_story = $1", [storyId]).then((results) => {
    res.json(results.rows);
  });
});

// GET choice by id
router.get("/choices/:storyId/:idFrom", (req, res) => {
  const { idFrom, storyId } = req.params;
  pool.query("SELECT * FROM choices WHERE id_section_from = $1 and id_story = $2", [idFrom, storyId]).then((results) => {
    res.json(results.rows);
  });
});

// POST a new choice
router.post("/choices/:storyId", (req, res) => {
  const { storyId } = req.params;
  const { name } = req.body;
  pool.query("INSERT INTO choices (name) VALUES ($1) WHERE id_story = $2", [name, storyId]).then(() => {
    res.json({
      message: "choice added successfully!",
    });
  });
});

// PUT updated choice
router.put("/choices/:storyId/:id", (req, res) => {
  const { id, storyId } = req.params;
  const { name } = req.body;
  pool
    .query("UPDATE choices SET name = $1 WHERE id = $2 WHERE id_story = $3", [name, id, storyId])
    .then(() => {
      res.json({
        message: "choice updated successfully!",
      });
    });
});

// DELETE choice
router.delete("/choices/:storyId/:id", (req, res) => {
  const { id, storyId } = req.params;
  pool.query("DELETE FROM choices WHERE id = $1 and id_story = $2", [id, storyId]).then(() => {
    res.json({
      message: "choice deleted successfully!",
    });
  });
});

module.exports = router;
