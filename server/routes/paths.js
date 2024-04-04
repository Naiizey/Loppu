const express = require("express");
const db = require("../db/connect");
const pool = db.getPool();
const router = express.Router();

/*

  Paths
    id_character INT REFERENCES characters(id),
    id_sections INT REFERENCES sections(id),

*/
// GET all paths
router.get("/paths", (req, res) => {
    pool.query("SELECT * FROM paths").then((results) => {
        res.json(results.rows);
    });
});

// Get paths by single idCharacter
router.get("/paths/:idCharacter", (req, res) => {
    const idCharacter = req.params.idCharacter;
    pool.query("SELECT * FROM paths WHERE id_character = $1", [
        idCharacter,
    ]).then((results) => {
        res.json(results.rows);
    });
});

// GET a path by id
router.get("/paths/:idCharacter/:idSection", (req, res) => {
    const idCharacter = req.params.idCharacter;
    const idSection = req.params.idSection;
    pool.query(
        "SELECT * FROM paths WHERE id_character = $1 AND id_sections = $2",
        [idCharacter, idSection]
    ).then((results) => {
        res.json(results.rows);
    });
});

// POST a path
router.post("/paths", (req, res) => {
    const path = req.body;

    pool.query(
        "SELECT * FROM paths WHERE id_character = $1 ORDER BY id DESC LIMIT 1",
        [path.id_character]
    ).then((results) => {
        if (results.rows.length > 0) {
            const lastPath = results.rows[0];

            if (lastPath.id_sections !== path.id_sections) {
                pool.query(
                    "INSERT INTO paths (id_character, id_sections) VALUES ($1, $2)",
                    [path.id_character, path.id_sections]
                );
            }
        } else {
            pool.query(
                "INSERT INTO paths (id_character, id_sections) VALUES ($1, $2)",
                [path.id_character, path.id_sections]
            );
        }
    });
});

// PUT a path
router.put("/paths/:idCharacter/:idSection", (req, res) => {
    const idCharacter = req.params.idCharacter;
    const idSection = req.params.idSection;
    const path = req.body;
    pool.query(
        "UPDATE paths SET id_character = $1, id_sections = $2 WHERE id_character = $3 AND id_sections = $4",
        [path.id_character, path.id_sections, idCharacter, idSection]
    ).then(() => {
        res.json(path);
    });
});

// DELETE a path
router.delete("/paths/:idCharacter/:idSection", (req, res) => {
    const idCharacter = req.params.idCharacter;
    const idSection = req.params.idSection;
    pool.query(
        "DELETE FROM paths WHERE id_character = $1 AND id_section = $2",
        [idCharacter, idSection]
    ).then(() => {
        res.json(`Path deleted with ID: ${idCharacter} and ${idSection}`);
    });
});

module.exports = router;
