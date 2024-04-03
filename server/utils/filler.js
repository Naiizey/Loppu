const db = require("../db/connect");
const pool = db.getPool();
const fs = require('fs');

var calling_file_path = require('path').dirname(require.main.filename) + "/";

var characters = ["../../misc/brindlebeard.json", "../../misc/hilgaHagsnot.json", "../../misc/torTheTerrible.json"];
var story_path = "../../misc/test.json";
var items_path = "../../misc/items.json";

// transform the relative paths to absolute paths
characters = characters.map((character) => calling_file_path + character);
story = calling_file_path + story_path;
items = calling_file_path + items_path;

characters.forEach((character) => {
    if (!fs.existsSync(character)) {
        throw new Error("character file not found: " + character);
    }
});


var story = JSON.parse(fs.readFileSync(story));
var characters = characters.map((character) => JSON.parse(fs.readFileSync
(character)));
var items = JSON.parse(fs.readFileSync(items));

var sections = Object.keys(story);

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

    for (var i = 1; i <= sections.length; i++) {
        var sectionid = sections[i-1];
        var content = story[sectionid];
        var id_book_section = sectionid;

        var sectionInsertResult = await pool.query("INSERT INTO sections (id_book_section,title, content, image, type_id, story_id) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id", [id_book_section,title, content, image, type_id, story_id]);
    }
    console.log("story created: " + story_name);

    // insert the items
    for (var i = 1; i <= Object.keys(items).length; i++) {
        var item = items[i];
        var name = item.name;
        var type = item.type;
        var stats = JSON.stringify(item.stats);
        var loot_points = item.loot_points;
        var food_points = item.food_points;
        var heal_points = item.heal_points;
        var itemInsertResult = await pool.query("INSERT INTO stuff (id_story, item_name, item_type, stats, loot_points, food_points, heal_points) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id", [story_id, name, type, stats, loot_points, food_points, heal_points]);
    }

    console.log("database filled with the items: " + Object.keys(items).map(key => items[key].name).join(", "));

    // insert the characters
    for (var i = 0; i < characters.length; i++) {
        var character = characters[i];
        var name = character.name;
        var description = character.description.text;
        var image = "unknown.png";
        var base_stats = JSON.stringify({"strength":character.strength, "intelligence": character.intelligence, "resistance":character.resistance});
        var base_stuff = JSON.stringify({"stuff":character.stuff, "inventory": character.inventory});

        var characterInsertResult = await pool.query("INSERT INTO characters_models (name, description, image, story_id, base_stats, base_stuff) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id", [name, description, image, story_id, base_stats, base_stuff]);
    }

    console.log("database filled with the characters: " + characters.map(character => character.name).join(", "));
    
    // fill the choice with the turns
    for (var i = 1; i <= sections.length; i++) {
        var sectionid = sections[i-1];
        var section = story[sectionid].action;
        //look recursively for the choices aka "goto" key
        var choices = findGotoKeys(section);
        for (var j = 0; j < choices.length; j++) {
            var choice = choices[j][0];
            var parentKey = choices[j][1];
            var superParentKey = choices[j][2];
            var impact = choices[j][3];
            var text = choices[j][4];
            // console.log("choice: " + JSON.stringify(choice));
            // console.log("parentKey: " + parentKey);
            // console.log("superParentKey: " + superParentKey);
            // console.log("impact: " + JSON.stringify(impact));
            var id_section_from = sectionid;
            var id_section_to = choice;
            var content ;
            if (choice.text != null)
            {
                content = choice.text
            }
            else 
            {
                content = "";
            }
            
            var victory = false;
            if (parentKey == "win")
            {
                victory = true;
            }
            var lose = false;
            if (parentKey == "lose")
            {
                lose = true;
            }
            var parent_key = parentKey;
            if (superParentKey == "choices")
            {
                parent_key = superParentKey + "-" +  parentKey;
            }
            if (impact != null)
            {
                impact = JSON.stringify(impact);
            }
            else
            {
                impact = JSON.stringify({});
            }
            content = text
            var choiceInsertResult = await pool.query("INSERT INTO choices (id_story, id_section_from, id_section_to, content, impact, victory, lose, parent_key) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)", [story_id ,id_section_from, id_section_to, content, impact, victory, lose, parent_key]);
        }        
    }
    console.log("database filled with the choices");

    pool.end();
    console.log("database filled with the story: " + story_name);
    process.exit();
});

function findGotoKeys(obj, result = [], parentKey = null, superParentKey = null) {
    for (let key in obj) {
        if (typeof obj[key] === 'object' && obj[key] !== null) {
            if (!isNaN(key)) {
                findGotoKeys(obj[key], result, key, parentKey);
            }
            else 
            {
                findGotoKeys(obj[key], result, key);
            }
        } else if (key === 'goto') {
            if (parentKey == null)
            {
                parentKey = "choices";
            }
            var impact;
            // return the impact of the choice (next to the goto key)
            if (parentKey != null && obj.impact != null)
            {
                impact = obj.impact;
            }
            else
            {
                impact = {};
            }
            var text;
            // return the text of the choice (next to the goto key)
            if (parentKey != null)
            {
                if (obj.text != null)
                {
                    text = obj.text;
                }
                else if (obj.successText != null)
                {
                    text = obj.successText;
                }
                else if (obj.failureText != null)
                {
                    text = obj.failureText;
                }
                else
                {
                    text = "";
                }
                
            }
            else
            {
                text = "";
            }
            result.push([obj[key], parentKey ,superParentKey, impact, text]);
        }
    }
    return result;
}