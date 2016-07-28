
exports.clean = function ($this) {
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
    "Clove",
    "Large",
    "Small",
    "Mini",
    "Bottle"
]

function isUnit(str) {
    let notResult = true;
    for (unit of units) {
        //TODO try to parseNumber
        notResult = notResult && 0 > str.indexOf(unit) && str.length < (unit.length + 3);
    }
    return !notResult;
}

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

function isPreparation(str) {
    let notResult = true;
    for (prep of preparations) {
        notResult = notResult && 0 > str.indexOf(prep) && str.length < (prep.length + 3);
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

    for (let start = nameIndex; split.length > nameIndex+1 && isUnit(split[nameIndex]); nameIndex++) {
        if (nameIndex > start) {
            unit += " ";
        }
        unit += split[nameIndex];
    }

    for (let start = nameIndex; split.length > nameIndex+1 && isPreparation(split[nameIndex]); nameIndex++) {
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
