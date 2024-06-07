const express = require("express");
const db = require("../db/connect");
const pool = db.getPool();
const router = express.Router();

// GET all characters_models
router.get("/characters_models", (req, res) => {
  pool.query("SELECT * FROM characters_models").then((results) => {
    res.json(results.rows);
  });
});

// GET character model by id
router.get("/characters_models/:id", (req, res) => {
  const { id } = req.params;
  pool.query("SELECT * FROM characters_models WHERE id = $1", [id]).then((results) => {
      res.json(results.rows);
    });
});

// POST a new character_model
router.post("/characters_models", (req, res) => {
  const { name } = req.body;
  pool
    .query("INSERT INTO characters_models (name) VALUES ($1)", [name])
    .then(() => {
      res.json({
        message: "character model added successfully!",
      });
    });
});

// PUT updated characters model
router.put("/characters_models/:id", (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  pool
    .query("UPDATE characters_models SET name = $1 WHERE id = $2", [name, id])
    .then(() => {
      res.json({
        message: "character model updated successfully!",
      });
    });
});

// DELETE character model
router.delete("/characters_models/:id", (req, res) => {
  const { id } = req.params;
  pool.query("DELETE FROM characters_models WHERE id = $1", [id]).then(() => {
    res.json({
      message: "character model deleted successfully!",
    });
  });
});

// GET character model by story id
router.get("/characters_models/story/:id", (req, res) => {
  const { id } = req.params;
  pool.query("SELECT * FROM characters_models WHERE story_id = $1", [id]).then((results) => {
      res.json(results.rows)
  })
})

module.exports = router;
