const express = require("express");
const cors = require("cors");

// my dot env is in the root folder
require("dotenv").config({
  path: "../.env",
});

const middlewares = require("./middlewares");
const api = require("./routes");

const app = express();

app.use(cors());

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
