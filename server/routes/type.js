const express = require("express");
const db = require("../db/connect");
const pool = db.getPool();
const router = express.Router();

// GET all type
router.get("/type", (req, res) => {
  pool.query("SELECT * FROM type").then((results) => {
    res.json(results.rows);
  });
});

// GET type by id
router.get("/type/:id", (req, res) => {
  const { id } = req.params;
  pool.query("SELECT * FROM type WHERE id = $1", [id]).then((results) => {
    res.json(results.rows);
  });
});

// POST a new type
router.post("/type", (req, res) => {
  const { name } = req.body;
  pool.query("INSERT INTO type (name) VALUES ($1)", [name]).then(() => {
    res.json({
      message: "type added successfully!",
    });
  });
});

// PUT updated type
router.put("/type/:id", (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  pool.query("UPDATE type SET name = $1 WHERE id = $2", [name, id]).then(() => {
    res.json({
      message: "type updated successfully!",
    });
  });
});

// DELETE type
router.delete("/type/:id", (req, res) => {
  const { id } = req.params;
  pool.query("DELETE FROM type WHERE id = $1", [id]).then(() => {
    res.json({
      message: "type deleted successfully!",
    });
  });
});

module.exports = router;
