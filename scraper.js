var jsdom = require("jsdom");

var clean = function clean ($this) {
    return $this.text().replace(/\n/g, '');
};

var i = 430;

jsdom.env({
    file: __dirname + "/downloaded/" + i + ".html",
    scripts: ["http://code.jquery.com/jquery.js"],
    done: function (err, window) {
        var result = {};
        var $ = window.$;

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
            result.ingredients.push(clean($(this)));
        });

        result.steps = [];
        $("#instructions .instr-step").each(function() {
            var $this = $(this);
            var step = clean($this.find(".instr-num"));
            var title = clean($this.find(".instr-title"));
            var img = $this.find(".img-max").attr("src");
            var text = clean($this.find(".instr-txt"));

            result.steps.push({
                step,
                title,
                img,
                text
            });
        });

        console.log(result);
    }
});
