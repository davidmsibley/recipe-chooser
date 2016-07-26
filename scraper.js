let jsdom = require("jsdom");
let promisify = require('bluebird').promisify;
let dom = promisify(jsdom.env);

function clean ($this) {
    return $this.text().replace(/\n/g, '');
};

function isUnit(str) {
    return false; //TODO
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

    if (split.length > 2 && isUnit(split[1])) {
        unit = split[1];
        nameIndex++;
    }

    name = split.slice(nameIndex).join(" ");

    return {
        amount,
        unit,
        name
    };
};

let i = 430;

dom(__dirname + "/downloaded/" + i + ".html", ["http://code.jquery.com/jquery.js"])
    .then(function (window) {
        let result = {};
        let $ = window.$;

        result.id = i;

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

        console.log(result);
    });
