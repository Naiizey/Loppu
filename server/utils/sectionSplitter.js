let fs = require('fs');

fs.readFile('backend/db/RAMPAGE.txt', 'utf8', (_, data) => {
    let results = {};
    let regex = /\s*RAMPAGE! by Andrew Wright\s*2009 Windhammer Prize for Short Gamebook Fiction/g;
    console.log(data);
    let toSplit = data.replace(regex, '');

    for (let i = 1; i <= 50 + 1; i++) {
        let replace = `[ \u0002]{10,}${i}(?!\\d)`;
        let regex = new RegExp(replace, "g");
        let parts = toSplit.split(regex);
        if (i != 1) {
            results[i - 1] = parts[0].trim();
        }
        toSplit = parts[1];
    }

    fs.writeFile('backend/db//RAMPAGE.json', JSON.stringify(results), () => {});
});
