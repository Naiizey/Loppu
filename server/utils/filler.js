const db = require("../db/connect");
const pool = db.getPool();
const fs = require('fs');
const readline = require('readline');

var calling_file_path = require('path').dirname(require.main.filename) + "/";

var characters = ["../db/brindlebeard.json", "../db/hilgaHagsnot.json", "../db/torTheTerrible.json"];
var story_path = "../db/RAMPAGE.json";

// transform the relative paths to absolute paths
characters = characters.map((character) => calling_file_path + character);
story = calling_file_path + story_path;

characters.forEach((character) => {
    if (!fs.existsSync(character)) {
        throw new Error("character file not found: " + character);
    }
});

var regex_turn = /turn\s*to\s*(\d+)/ig;


var story = JSON.parse(fs.readFileSync(story));
var characters = characters.map((character) => JSON.parse(fs.readFileSync
(character)));

var max_section = Object.keys(story).length;

var dico = {};

//get the turns for each section
for (var i = 1; i <= max_section; i++) {
    var section = story[i];

    var matches = [...section.matchAll(regex_turn)];
    var turnToNumbers = matches.map(match => match[1]);
    dico[i] = {section, turnToNumbers};
}

pool.connect().then(async () => {

    // insert a new story 
    var story_name = story_path.split("/").pop().split(".")[0];
    var author_name = "unknown";
    var description = "unknown";
    var image = "unknown.png";
    var storyInsertResult = await pool.query("INSERT INTO stories (title, author, description, image) VALUES ($1, $2, $3, $4) RETURNING id", [story_name, author_name, description, image]);

    // insert the type
    var type_name = "unknown";
    var type_icon = "unknown";
    var typeInsertResult = await pool.query("INSERT INTO type (name, icon) VALUES ($1, $2) RETURNING id", [type_name, type_icon]);

    // insert the user
    var username = "unknown";
    var password = "unknown";
    var email = "unknown";
    var userInsertResult = await pool.query("INSERT INTO users (username, password, email) VALUES ($1, $2, $3) RETURNING id", [username, password, email]);

    // insert the sections
    var user_id = userInsertResult.rows[0].id;
    var story_id = storyInsertResult.rows[0].id;
    var type_id = typeInsertResult.rows[0].id;
    var title = "unknown";
    var image = "unknown.png";

    for (var i = 1; i <= max_section; i++) {
        var section = dico[i].section;
        var turnToNumbers = dico[i].turnToNumbers;

        var content = {
            text: section,
            turnToNumbers: turnToNumbers
        };

        var sectionInsertResult = await pool.query("INSERT INTO sections (title, content, image, user_id, type_id, story_id) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id", [title, content, image, user_id, type_id, story_id]);
    }

    console.log("done, database filled with the story: " + story_name);
});