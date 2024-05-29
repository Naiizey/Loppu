let fs = require("fs");

fs.readFile("../misc/RAMPAGE.txt", "utf8", (_, data) => {
  let results = {};
  let regex =
    /\s*RAMPAGE! by Andrew Wright\s*2009 Windhammer Prize for Short Gamebook Fiction/g;
  let toSplit = data.replace(regex, "");

  for (let i = 1; i <= 50 + 1; i++) {
    let replace = `[ \u0002]{10,}${i}(?!\\d)`;
    let regex = new RegExp(replace, "g");
    let parts = toSplit.split(regex);
    if (i != 1) {
      results[i - 1] = replaceUnicode(parts[0].trim().replace(/\s+/g, " "));
    }
    toSplit = parts[1];
  }

  fs.writeFile("../misc/RAMPAGE.json", JSON.stringify(results), () => {});
});

function replaceUnicode(input) {
  return input
    .replace(/[\u2018\u2019]/g, "'") // replace left and right single quotes
    .replace(/[\u201C\u201D]/g, '"'); // replace left and right double quotes
}
