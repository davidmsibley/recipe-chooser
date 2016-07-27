let jsdom = require("jsdom");
let Promise = require("bluebird");
let dom = Promise.promisify(jsdom.env);
let fs = require("fs");

function clean ($this) {
    return $this.text().replace(/\n/g, '');
};

let units = [
    "Cup",
    "Pound",
    "Bunch",
    "Tablespoons",
    "Teaspoons",
    "Cloves",
    "Head",
    "Ounces",
    "Teaspoon",
    "Tablespoon",
    "Slices",
    "Ear",
    "Of",
    "Inch",
    "Piece",
    "Ounce",
    "Package",
    "Can",
]

function isUnit(str) {
    let notResult = true;
    for (unit of units) {
        notResult = notResult && 0 > str.indexOf(unit);
    }
    return !notResult;
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

let ref = {};
let lookup = new Map();
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
            result.id = window.location.href.split("/").slice(-1)[0].split(".")[0];
            result.ingredients = [];
            $("li[itemprop='ingredients']").each(function() {
                result.ingredients.push(parseIngredient(clean($(this))));
            });

            for (ingredient of result.ingredients) {
                if (!lookup.get(ingredient.name)) {
                    lookup.set(ingredient.name, []);
                    ref[ingredient.name] = lookup.get(ingredient.name);
                }
                lookup.get(ingredient.name).push(result.id);
                lookup.get(ingredient.name).sort();
            }
            done++;
            doit();
        });
        doit();
    }
    if (start + done >= stop) {
        fs.writeFileSync(__dirname + "/scraped/ingredientRefs.json", JSON.stringify(ref));
        let ordered = (([...lookup]).sort(function(a, b) { return b[1].length - a[1].length})).map(function (entry) { return {name : entry[0], refs : entry[1]}});
        fs.writeFileSync(__dirname + "/scraped/ingredientOrder.json", JSON.stringify(ordered));
    }
};
doit();
