module.exports = require("./make-webpack-config")({
    env: "development",
    isExtension: false,
    browserPath: '/quest',
    devServer: true,
    separateStylesheet: true,
    //devtool: "eval",
    devtool: "source-map",
    debug: true
});