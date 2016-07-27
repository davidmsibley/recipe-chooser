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


let big = {};
let titles = {};

let windowWidth = 20;
let start = 430;
let doing = 0;
let done = 0;
let stop = 950;
function doit() {
    if (start + doing < stop && doing - done < windowWidth) {
        let i = start + doing;
        doing++;

        /**
        * https://theinfosphere.org/Hedonismbot
        */
        let djambi = dom(__dirname + "/downloaded/" + i + ".html", ["http://code.jquery.com/jquery.js"]);
        djambi.then(function scrapeAndButterTheOrgyPit (window) {
            let result = {};
            let $ = window.$;

            result.id = window.location.href.split("/").slice(-1)[0].split(".")[0];

            $("meta[property='og:title']").each(function() {
                result.title = $(this).attr("content");
            });

            $("meta[property='og:description']").each(function() {
                result.description = $(this).attr("content");
            });

            $("span[itemprop='calories']").each(function() {
                result.calories = clean($(this));
            });

            $("img.rec-splash-img").each(function() {
                result.splash = $(this).attr("src");
            });

            $("meta[itemprop='image thumbnailUrl']").each(function() {
                result.thumb = $(this).attr("content");
            });

            result.ingredients = [];
            $("li[itemprop='ingredients']").each(function() {
                result.ingredients.push(parseIngredient(clean($(this))));
            });

            result.steps = [];
            $("#instructions .instr-step").each(function() {
                let $this = $(this);
                let step = clean($this.find(".instr-num"));
                let title = clean($this.find(".instr-title"));
                let img = $this.find(".img-max").attr("src");
                let text = clean($this.find(".instr-txt"));

                result.steps.push({
                    step,
                    title,
                    img,
                    text
                });
            });

            big[i] = result;

            let titled = {};
            titled.id = result.id;
            titled.title = result.title;
            titled.thumb = result.thumb;
            titles[i] = titled;

            fs.writeFileSync(__dirname + "/scraped/" + i + ".json", JSON.stringify(result, null, "\t"));

            done++;
            doit();
        });
        doit();
    }
    if (start + done >= stop) {
        fs.writeFileSync(__dirname + "/scraped/big.json", JSON.stringify(big, null, "\t"));
        fs.writeFileSync(__dirname + "/scraped/titles.json", JSON.stringify(titles, null, "\t"));
    }
};
doit();
