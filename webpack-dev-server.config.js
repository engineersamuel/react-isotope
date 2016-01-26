module.exports = require("./make-webpack-config")({
    env: "development",
    browserPath: '/',
    devServer: true,
    separateStylesheet: true,
    //devtool: "eval",
    devtool: "source-map",
    debug: true
});
