/**
 * Unicode Escaping courtesy of
 * http://stackoverflow.com/questions/4901133/json-and-escaping-characters
 */
exports.clean = function (text) {
    return text.replace(/\n/g, '').replace(/[\u2028]/g, '');
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
    "Clove",
    "Large",
    "Small",
    "Mini",
    "Bottle"
]

let preparations = [
    "Grated",
    "Crushed",
    "Sliced",
    "Boneless",
    "Skinless",
    "Whole",
    "Grain",
    "Semi-Pearled",
    "Crumbled",
    "Part-Skim",
    "Plain",
    "Fresh",
    "Cracked",
    "Diced",
    "Long",
    "Multicolored",
    "Light",
    "Center-Cut",
    "Skin-On",
    "Farm",
    "Dried",
    "Bone-In",
    "Airline",
    "Baby",
    "Coursely",
    "Thinly",
    "Ground",
    "Granulated"
]

function isUnit(str, blackList) {
    let notResult = true;
    for (unit of blackList) {
        //TODO try to parseNumber
        //I thought I was so clever when I wrote this... ugh.
        //we're checking things that would invalidate the str from being a unit
        notResult = notResult && 0 > str.indexOf(unit);
    }
    return !notResult;
}

let details = [
    "Demi-Glace",
    "With",
    "Fronds"
];

function isDetail(str) {
    return false; //TODO
}

exports.parseIngredient = function (fullStr) {
    let split = fullStr.split(" ");
    let amount = "";
    let unit = "";
    let preparation = "";
    let name = fullStr;
    let detail = "";

    let nameIndex = 0;
    if (split.length > 1) {
        amount = split[0];
        nameIndex++;
    }

    for (let start = nameIndex; split.length > nameIndex+1 && isUnit(split[nameIndex], units); nameIndex++) {
        if (nameIndex > start) {
            unit += " ";
        }
        unit += split[nameIndex];
    }

    for (let start = nameIndex; split.length > nameIndex+1 && isUnit(split[nameIndex], preparations); nameIndex++) {
        if (nameIndex > start) {
            preparation += " ";
        }
        preparation += split[nameIndex];
    }

    name = split.slice(nameIndex).join(" ");

    return {
        amount,
        unit,
        preparation,
        name,
        detail
    };
}
