let jsdom = require("jsdom");
let Promise = require("bluebird");
let dom = Promise.promisify(jsdom.env);
let fs = require("fs");
let IngredientBuilder = require('./ingredientBuilder');
let clean = IngredientBuilder.clean;
let parseIngredient = IngredientBuilder.parseIngredient;

let big = fs.readFileSync(__dirname + "/scraped/big.json");
let data = JSON.parse(big);

let ref = {};
let lookup = new Map();

for (key in data) {
    if (data.hasOwnProperty(key)) {
        populateRef(data[key]);
    }
}

function populateRef (recipe) {
    for (ingredient of recipe.ingredients) {
        if (!lookup.get(ingredient.name)) {
            lookup.set(ingredient.name,
                {
                    img : ingredient.pic,
                    refs : []
                });
            ref[ingredient.name] = lookup.get(ingredient.name).refs;
        }
        lookup.get(ingredient.name).refs.push(recipe.id);
        lookup.get(ingredient.name).refs.sort();
    }
}

fs.writeFileSync(__dirname + "/scraped/ingredientRefs.json", JSON.stringify(ref, null, "\t"));
let ordered = (([...lookup]).sort(function(a, b) { return b[1].refs.length - a[1].refs.length})).map(function (entry) { return {name : entry[0], img : entry[1].img, refs : entry[1].refs}});
fs.writeFileSync(__dirname + "/scraped/ingredientOrder.json", JSON.stringify(ordered, null, "\t"));
