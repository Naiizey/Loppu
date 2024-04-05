const express = require("express");
const db = require("../db/connect");
const pool = db.getPool();
const router = express.Router();

// GET all stuff
router.get("/stuff", (req, res) => {
    pool.query("SELECT * FROM stuff").then((results) => {
        res.json(results.rows);
    });
});

// GET stuff by id
router.get("/stuff/:idStory/:idItem", (req, res) => {
    const { idStory, idItem } = req.params;
    pool.query("SELECT * FROM stuff WHERE id_story = $1 AND id_item = $2", [
        idStory,
        idItem,
    ]).then((results) => {
        res.json(results.rows);
    });
});

module.exports = router;
