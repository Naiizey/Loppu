const express = require("express");
const db = require("../db/connect");
const pool = db.getPool();
const router = express.Router();

// GET all characters
router.get("/characters", (req, res) => {
  pool.query("SELECT * FROM characters").then((results) => {
    res.json(results.rows);
  });
});

// GET character by id
router.get("/characters/:id", (req, res) => {
  const { id } = req.params;
  pool.query("SELECT * FROM characters WHERE id = $1", [id]).then((results) => {
    res.json(results.rows);
  });
});

// GET character stuff by id
router.get("/characters/:id/stuff", (req, res) => {
  const { id } = req.params;
  pool.query("SELECT stuff FROM characters WHERE id = $1", [id]).then((results) => {
    res.json(results.rows);
  });
});

// POST a new character
router.post("/characters", (req, res) => {
  const { name } = req.body;
  pool.query("INSERT INTO characters (name) VALUES ($1)", [name]).then(() => {
    res.json({
      message: "Character added successfully!",
    });
  });
});

// PUT updated character
router.put("/characters/:id/stats", (req, res) => {
  const { id } = req.params;
  const stats = req.body;
  pool
    .query("UPDATE characters SET stats = $1 WHERE id = $2", [stats, id])
    .then(() => {
      res.json({
        message: "Character updated successfully!",
      });
    });
});

// DELETE character
router.delete("/characters/:id", (req, res) => {
  const { id } = req.params;
  pool.query("DELETE FROM characters WHERE id = $1", [id]).then(() => {
    res.json({
      message: "Character deleted successfully!",
    });
  });
});

// DELETE whole inventory
router.delete("/characters/:id/inventory", (req, res) => {
  const { id } = req.params;
  //get the stuff object from the character wich is a jsonb object
  pool.query("SELECT stuff FROM characters WHERE id = $1", [id]).then((results) => {
    let stuff = results.rows[0].stuff;
    //iterate over the stuff object and delete each item
    for (let key in stuff) {
      if (key === "inventory") {
        stuff[key] = [];
      }
    }
    //update the stuff object in the database
    pool
      .query("UPDATE characters SET stuff = $1 WHERE id = $2", [stuff, id])
      .then(() => {
        res.json({
          message: "Inventory deleted successfully!",
        });
      });
  });
});

// PUT an item to inventory
router.put("/characters/:id/inventory/:itemId", (req, res) => {
  const { id, itemId } = req.params;
  let resItem;
  pool.query("SELECT stuff FROM characters WHERE id = $1", [id]).then((results) => {

    let stuff = results.rows[0].stuff; // Get the stuff object directly
    pool.query("SELECT item_type FROM stuff WHERE id = $1", [itemId]).then((results) => {

      let type = results.rows[0];
      let item = {};
      item[itemId] = type.item_type; // Create the item object
      resItem = item;
      if (!stuff.inventory) {
        stuff.inventory = []; // Initialize inventory if it doesn't exist
      }

      stuff.inventory.push(item); // Add the item to the inventory
      stuff = JSON.stringify(stuff)
      pool
        .query("UPDATE characters SET stuff = $1 WHERE id = $2", [stuff, id])
        .then(() => {
          res.json({
            message: "Item added to inventory successfully!",
          });
        });
    });
  });
});

// DELETE an item from inventory
router.delete("/characters/:id/inventory/:itemId", (req, res) => {
  const { id, itemId } = req.params;
  //get the stuff object from the character wich is a jsonb object
  pool.query("SELECT stuff FROM characters WHERE id = $1", [id]).then((results) => {
    let stuff = results.rows[0];
    //iterate over the stuff object and delete the item from the inventory
    for (let key in stuff) {
      if (key === "inventory") {
        stuff[key].forEach((item, index) => {
          if (item.itemID === itemId) {
            stuff[key].splice(index, 1);
          }
        });
      }
    }
    //update the stuff object in the database
    pool
      .query("UPDATE characters SET stuff = $1 WHERE id = $2", [stuff, id])
      .then(() => {
        res.json({
          message: "Item deleted from inventory successfully!",
        });
      });
  });
});

module.exports = router;
