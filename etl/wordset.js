let jsdom = require("jsdom");
let Promise = require("bluebird");
let dom = Promise.promisify(jsdom.env);
let fs = require("fs");

function clean ($this) {
    return $this.text().replace(/\n/g, '');
};

function isUnit(str) {
    return false;
}

function parseIngredient (fullStr) {
    let split = fullStr.split(" ");
    let amount = "";
    let unit = "";
    let name = fullStr;

    let nameIndex = 0;
    if (split.length > 1) {
        amount = split[0];
        nameIndex++;
    }

    for (let i = 1; split.length > i+1 && isUnit(split[i]); i++) {
        if (i > 1) {
            unit += " ";
        }
        unit += split[i];
        nameIndex++;
    }

    name = split.slice(nameIndex).join(" ");

    return {
        amount,
        unit,
        name
    };
};


let resultSet = new Set();
let windowWidth = 20;
let start = 430;
let doing = 0;
let done = 0;
let stop = 950;
function doit() {
    if (start + doing < stop && doing - done < windowWidth) {
        let i = start + doing;
        doing++;
        dom(__dirname + "/downloaded/" + i + ".html",["http://code.jquery.com/jquery.js"])
        .then(function (window) {
            let result = {};
            let $ = window.$;
            result.ingredients = [];
            $("li[itemprop='ingredients']").each(function() {
                result.ingredients.push(parseIngredient(clean($(this))));
            });

            for (ingredient of result.ingredients) {
                let split = ingredient.name.split(" ");
                for (word of split) {
                    resultSet.add(word);
                }
            }
            done++;
            doit();
        });
        doit();
    }
    if (start + done >= stop) {
        // console.log(JSON.stringify([...resultSet]));
        fs.writeFileSync(__dirname + "/scraped/ingredientWords.json", JSON.stringify([...resultSet], null, "\t"));
    }
};
doit();
