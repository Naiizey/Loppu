const express = require("express");

// my dot env is in the root folder
require("dotenv").config({
  path: "../.env",
});

const middlewares = require("./middlewares");
const api = require("./routes");

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message: "🦄🌈✨👋🌎🌍🌏✨🌈🦄",
  });
});

app.use("/api", api);

app.use(middlewares.notFound);
app.use(middlewares.errorHandler);

module.exports = app;
