const express = require("express");

const router = express.Router();

// We import all the files from the api folder
const characters = require("./characters");
const users = require("./users");
const stories = require("./stories");

// GET
router.get("/", (req, res) => {
  res.json({
    message: "Welcome to Loppu API! 🦄🌈✨👋🌎",
  });
});

router.use(characters);
router.use(users);
router.use(stories);

module.exports = router;
