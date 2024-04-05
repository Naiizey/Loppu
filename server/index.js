const app = require("./app");

const port = process.env.API_PORT || 5000;
app.listen(port, () => {
  console.log(`Listening: http://localhost:${port}`);
});
