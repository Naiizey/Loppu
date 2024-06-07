const express = require("express");
const db = require("../db/connect");
const pool = db.getPool();
const router = express.Router();

// GET all sections
router.get("/sections/:idStory", (req, res) => {
  const { idStory } = req.params;
  pool.query("SELECT * FROM sections WHERE story_id= $1", [idStory]).then((results) => {
    res.json(results.rows);
  });
});

// GET section by id
router.get("/sections/:idStory/:id", (req, res) => {
  const { id, idStory } = req.params;
  pool.query("SELECT * FROM sections WHERE id_book_section = $1 and story_id = $2", [id, idStory]).then((results) => {
    res.json(results.rows);
  });
});

// GET section by story id
router.get("/sections/story/:idStory", (req, res) => {
  const { idStory } = req.params;
  pool
    .query("SELECT * FROM sections WHERE story_id = $1", [idStory])
    .then((results) => {
      res.json(results.rows);
    });
});

// POST a new section
router.post("/sections", (req, res) => {
  const { name } = req.body;
  pool.query("INSERT INTO sections (name) VALUES ($1)", [name]).then(() => {
    res.json({
      message: "section added successfully!",
    });
  });
});

// PUT updated section
router.put("/sections/:id", (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  pool
    .query("UPDATE sections SET name = $1 WHERE id_book_section = $2", [name, id])
    .then(() => {
      res.json({
        message: "section updated successfully!",
      });
    });
});

// DELETE section
router.delete("/sections/:id", (req, res) => {
  const { id } = req.params;
  pool.query("DELETE FROM sections WHERE id_book_section = $1", [id]).then(() => {
    res.json({
      message: "section deleted successfully!",
    });
  });
});

module.exports = router;
