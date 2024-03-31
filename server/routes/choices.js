const express = require("express");
const db = require("../db/connect");
const pool = db.getPool();
const router = express.Router();

// GET all choices
router.get("/choices", (req, res) => {
  pool.query("SELECT * FROM choices").then((results) => {
    res.json(results.rows);
  });
});

// GET choice by id
router.get("/choices/:id", (req, res) => {
  const { id } = req.params;
  pool.query("SELECT * FROM choices WHERE id = $1", [id]).then((results) => {
    res.json(results.rows);
  });
});

// POST a new choice
router.post("/choices", (req, res) => {
  const { name } = req.body;
  pool.query("INSERT INTO choices (name) VALUES ($1)", [name]).then(() => {
    res.json({
      message: "choice added successfully!",
    });
  });
});

// PUT updated choice
router.put("/choices/:id", (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  pool
    .query("UPDATE choices SET name = $1 WHERE id = $2", [name, id])
    .then(() => {
      res.json({
        message: "choice updated successfully!",
      });
    });
});

// DELETE choice
router.delete("/choices/:id", (req, res) => {
  const { id } = req.params;
  pool.query("DELETE FROM choices WHERE id = $1", [id]).then(() => {
    res.json({
      message: "choice deleted successfully!",
    });
  });
});

module.exports = router;
