const express = require("express");
const db = require("../db/connect");
const pool = db.getPool();
const router = express.Router();

// GET all sections
router.get("/sections", (req, res) => {
  pool.query("SELECT * FROM sections").then((results) => {
    res.json(results.rows);
  });
});

// GET section by id
router.get("/sections/:id", (req, res) => {
  const { id } = req.params;
  pool.query("SELECT * FROM sections WHERE id = $1", [id]).then((results) => {
    res.json(results.rows);
  });
});

// GET section stored by the column and sorting
router.get("/sections/sort/:sortingColumn/:sorting", (req, res) => {
  const { sortingColumn } = req.params;
  const { sorting } = req.params;
  if (sorting !== "asc" && sorting !== "desc") {
    res.json({
      message: "sorting must be either asc or desc",
    });
    return;
  }
  else 
  {
    pool.query(`SELECT * FROM sections ORDER BY ${sortingColumn} ${sorting}`).then((results) => {
      res.json(results.rows);
    });
  }
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
    .query("UPDATE sections SET name = $1 WHERE id = $2", [name, id])
    .then(() => {
      res.json({
        message: "section updated successfully!",
      });
    });
});

// DELETE section
router.delete("/sections/:id", (req, res) => {
  const { id } = req.params;
  pool.query("DELETE FROM sections WHERE id = $1", [id]).then(() => {
    res.json({
      message: "section deleted successfully!",
    });
  });
});

module.exports = router;
