let _               = require("lodash");
let logger          = require("../utils/logger");

let makeElement = (classes, category, name, symbol, number, weight) => {
    return {
        classes: classes,
        category: category,
        name: name,
        symbol: symbol,
        number: number,
        weight: weight
    };
};

let elements = [
    makeElement(['transition', 'metal'], 'transition', 'Mercury', 'Hg', 80, 200.59),
    makeElement(['metalloid'], 'metalloid', 'Tellurium', 'Te', 52, 127.6),
    makeElement(['post-transition', 'metal'], 'post-transition', 'Bismuth', 'Bi', 83, 208.980),
    makeElement(['post-transition', 'metal'], 'post-transition', 'Lead', 'Pb', 82, 207.2),
    makeElement(['transition', 'metal'], 'transition', 'Gold', 'Au', 79, 196.967),
    makeElement(['alkali', 'metal'], 'alkali', 'Potassium', 'K', 19, 39.0983),
    makeElement(['alkali', 'metal'], 'alkali', 'Sodium', 'Na', 11, 22.99),
    makeElement(['transition', 'metal'], 'transition', 'Cadmium', 'Cd', 48, 112.411),
    makeElement(['alkaline-earth', 'metal'], 'alkaline-earth', 'Calcium', 'Ca', 20, 40.078),
    makeElement(['transition', 'metal'], 'transition', 'Rhenium', 'Re', 75, 186.207),
    makeElement(['post-transition', 'metal'], 'post-transition', 'Thallium', 'Tl', 81, 204.383),
    makeElement(['metalloid'], 'metalloid', 'Antimony', 'Sb', 51, 121.76),
    makeElement(['transition', 'metal'], 'transition', 'Cobalt', 'Co', 27, 58.933),
    makeElement(['lanthanoid', 'metal', 'inner-transition'], 'lanthanoid', 'Ytterbium', 'Yb', 70, 173.054),
    makeElement(['noble-gas', 'nonmetal'], 'noble-gas', 'Argon', 'Ar', 18, 39.948),
    makeElement(['diatomic', 'nonmetal'], 'diatomic', 'Nitrogen', 'N', 7, 14.007),
    makeElement(['actinoid', 'metal', 'inner-transition'], 'actinoid', 'Uranium', 'U', 92, 238.029),
    makeElement(['actinoid', 'metal', 'inner-transition'], 'actinoid', 'Plutonium', 'Pu', 94, 244)
];

module.exports = function(app) {
    app.get("/api/elements", function(req, res) {
        var type = req.query.type;
        switch(type) {
            case "all":
                res.send(elements);
                break;
            case "metal":
                res.send(_.filter(elements, e => _.includes(e.classes, 'metal')));
                break;
            case "iums":
                res.send(_.filter(elements, e => _.includes(e.name, "ium")));
                break;
            default:
                res.send(elements);
        }
    });
};