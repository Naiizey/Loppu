const fs = require("fs");

const filePath = "RAMPAGE.json";

fs.readFile(filePath, "utf8", (err, data) => {
  if (err) {
    console.error(`Error reading file: ${err}`);
    return;
  }
  console.log(data);
});
