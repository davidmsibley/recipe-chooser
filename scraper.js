let jsdom = require("jsdom");
let Promise = require("bluebird");
let dom = Promise.promisify(jsdom.env);
let fs = require("fs");
let IngredientBuilder = require('./ingredientBuilder');
let clean = IngredientBuilder.clean;
let parseIngredient = IngredientBuilder.parseIngredient;


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
                result.title = clean($(this).attr("content"));
            });

            $("meta[property='og:description']").each(function() {
                result.description = clean($(this).attr("content"));
            });

            $("span[itemprop='calories']").each(function() {
                result.calories = clean($(this).text());
            });

            $("img.rec-splash-img").each(function() {
                result.splash = clean($(this).attr("src"));
            });

            $("meta[itemprop='image thumbnailUrl']").each(function() {
                result.thumb = clean($(this).attr("content"));
            });

            result.ingredients = [];
            $("li[itemprop='ingredients']").each(function() {
                result.ingredients.push(parseIngredient(clean($(this).text())));
            });

            result.storyPics = [];
            $("a.js-SubStory").each(function() {
                let pic = clean($(this).find("img.img-flex").attr("src"));
                let name = clean($(this).find("span.story-title").text());
                result.storyPics.push ({
                    pic,
                    name
                });
                let ing = result.ingredients.find(function(el) {
                    return el.name === name;
                });
                if (ing) {
                    ing.pic = pic;
                }
            });

            result.steps = [];
            $("#instructions .instr-step").each(function() {
                let $this = $(this);
                let step = clean($this.find(".instr-num").text());
                let title = clean($this.find(".instr-title").text());
                let img = clean($this.find(".img-max").attr("src"));
                let text = clean($this.find(".instr-txt").text());

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

            fs.writeFileSync(__dirname + "/scraped/unit/" + i + ".json", JSON.stringify(result, null, "\t"));

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
