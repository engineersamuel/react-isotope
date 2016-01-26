module.exports = require("./make-webpack-config")({
    env: "production",
    isExtension: false,
    browserPath: '/',
    // For this particular app there are not multiple entry points so commons chunk isn't helpful
    //commonsChunk: true,
    longTermCaching: true,
    separateStylesheet: true,
    minimize: true
});
