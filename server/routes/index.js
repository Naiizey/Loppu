const express = require("express");

const router = express.Router();

// We import all the files from the api folder
const characters_models = require("./characters_models");
const characters = require("./characters");
const choices = require("./choices");
const paths = require("./paths");
const sections = require("./sections");
const stories_tags = require("./stories_tags");
const stories = require("./stories");
const tags = require("./tags");
const type = require("./type");
const users = require("./users");

// GET
router.get("/", (req, res) => {
  res.json({
    message: "Welcome to Loppu API! 🦄🌈✨👋🌎",
  });
});

router.use(characters_models);
router.use(characters);
router.use(choices);
router.use(paths);
router.use(sections);
router.use(stories_tags);
router.use(stories);
router.use(tags);
router.use(type);
router.use(users);

module.exports = router;
