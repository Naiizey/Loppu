const db = require("../db/connect");
const pool = db.getPool();
const fs = require('fs');

var calling_file_path = require('path').dirname(require.main.filename) + "/";

var characters = ["../../misc/brindlebeard.json", "../../misc/hilgaHagsnot.json", "../../misc/torTheTerrible.json"];
var story_path = "../../misc/RAMPAGE.json";

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

    // Convert turnToNumbers to a Set to remove duplicates, then convert it back to an array
    turnToNumbers = [...new Set(turnToNumbers)];

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
    var story_id = storyInsertResult.rows[0].id;
    var type_id = typeInsertResult.rows[0].id;
    var title = "unknown";
    var image = "unknown.png";

    for (var i = 1; i <= max_section; i++) {
        var section = dico[i].section;
        var id_book_section = i;
        var content = {
            text: section
        };

        var sectionInsertResult = await pool.query("INSERT INTO sections (id_book_section,title, content, image, type_id, story_id) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id", [id_book_section,title, content, image, type_id, story_id]);
    }

    console.log("story created: " + story_name);

    // insert the characters
    for (var i = 0; i < characters.length; i++) {
        var character = characters[i];
        var name = character.name;
        var description = character.description.text;
        var image = "unknown.png";
        var story_id = story_id;
        var base_stats = JSON.stringify({"strength":character.strength, "intelligence": character.intelligence, "resistance":character.resistance});
        var base_stuff = JSON.stringify({"stuff":character.stuff, "inventory": character.inventory});

        var characterInsertResult = await pool.query("INSERT INTO characters_models (name, description, image, story_id, base_stats, base_stuff) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id", [name, description, image, story_id, base_stats, base_stuff]);
    }

    console.log("database filled with the characters: " + characters.map(character => character.name).join(", "));
    
    // fill the choice with the turns
    for (var i = 1; i <= max_section; i++) {
        var section = dico[i].section;
        var turnToNumbers = dico[i].turnToNumbers;

        for (var j = 0; j < turnToNumbers.length; j++) {
            var id_story = story_id;
            var id_section_from = i;
            var id_section_to = turnToNumbers[j];
            var content = "unknown";
            var impact = JSON.stringify({});

            var choiceInsertResult = await pool.query("INSERT INTO choices (id_story, id_section_from, id_section_to, content, impact) VALUES ($1, $2, $3, $4, $5)", [id_story ,id_section_from, id_section_to, content, impact]);
        }
    }
    console.log("database filled with the choices");

    pool.end();
    console.log("database filled with the story: " + story_name);
    process.exit();
});

