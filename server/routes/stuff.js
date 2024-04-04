const express = require("express");
const db = require("../db/connect");
const pool = db.getPool();
const router = express.Router();

// GET all stuff
router.get("/stuff", (req, res) => {
    pool.query("SELECT * FROM sections").then((results) => {
        res.json(results.rows);
    });
});

// GET stuff by id
router.get("/stuff/:id", (req, res) => {
    const { id } = req.params;
    pool.query("SELECT * FROM sections WHERE id = $1", [id]).then((results) => {
        res.json(results.rows);
    });
});

module.exports = router;
