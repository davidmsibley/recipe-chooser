let jsdom = require("jsdom");
let Promise = require("bluebird");
let dom = Promise.promisify(jsdom.env);
let fs = require("fs");
let IngredientBuilder = require('./ingredientBuilder');
let clean = IngredientBuilder.clean;
let parseIngredient = IngredientBuilder.parseIngredient;

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
        fs.writeFileSync(__dirname + "/scraped/ingredientRefs.json", JSON.stringify(ref, null, "\t"));
        let ordered = (([...lookup]).sort(function(a, b) { return b[1].length - a[1].length})).map(function (entry) { return {name : entry[0], refs : entry[1]}});
        fs.writeFileSync(__dirname + "/scraped/ingredientOrder.json", JSON.stringify(ordered, null, "\t"));
    }
};
doit();
