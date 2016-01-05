var path = require("path");
var _ = require("lodash");
var webpack = require("webpack");
var ExtractTextPlugin = require("extract-text-webpack-plugin");
var StatsPlugin = require("stats-webpack-plugin");
var loadersByExtension = require("./config/loadersByExtension");

module.exports = function(options) {
    var entry = {
        main: "./app/index"
        // second: "./app/someOtherPage
    };
    var loaders = {
        "jsx": options.hotComponents ? ["react-hot-loader", "babel-loader?stage=0"] : "babel-loader?stage=0",
        "js": {
            loader: "babel-loader?stage=0",
            include: path.join(__dirname, "app")
        },
        "adoc": "raw-loader",
        "json": "json-loader",
        "coffee": "coffee-redux-loader",
        "json5": "json5-loader",
        "txt": "raw-loader",
        "png|jpg|jpeg|gif|svg": "url-loader?limit=10000",
        "woff|woff2": "url-loader?limit=100000",
        "ttf|eot": "file-loader",
        "wav|mp3": "file-loader",
        "html": "html-loader",
        "md|markdown": ["html-loader", "markdown-loader"]
    };
    // This modular css is bizarre, it may make sense for hot reloading but it creates mangled names and you have
    // to import from the css file and reference the imported name.style.  Futhermore styles don't just
    // apply given they are localized which makes editing the css in the browser a PITA.
    //var cssLoader = options.minimize ? "css-loader?module" : "css-loader?module&localIdentName=[path][name]---[local]---[hash:base64:5]";
    var cssLoader = options.minimize ? "css-loader" : "css-loader?localIdentName=[path][name]---[local]---[hash:base64:5]";
    //var cssLoader = "css-loader";
    var stylesheetLoaders = {
        "css": cssLoader,
        "less": [cssLoader, "less-loader"],

        "scss|sass": [cssLoader, "sass-loader"]
    };
    var additionalLoaders = [
        // { test: /some-reg-exp$/, loader: "any-loader" }
    ];
    var alias = {
        //alt: 'alt/lib/index'
    };
    var aliasLoader = {

    };
    //var externals = [
    //
    //];
    var externals = {
        // require("jquery") is external and available
        //  on the global var jQuery
        "jquery": "jQuery"
    };
    var modulesDirectories = ["web_modules", "node_modules"];
    var extensions = ["", ".web.js", ".js", ".jsx"];
    var root = path.join(__dirname, "app");
    var publicPath = options.devServer ?
        "http://localhost:2992/_assets/" :
        "/_assets/";
    var output = {
        path: options.outputPath || path.join(__dirname, "build", "public"),
        publicPath: publicPath,
        filename: "[name].js" + (options.longTermCaching ? "?[chunkhash]" : ""),
        chunkFilename: (options.devServer ? "[id].js" : "[name].js") + (options.longTermCaching ? "?[chunkhash]" : ""),
        sourceMapFilename: "debugging/[file].map",
        libraryTarget: undefined,
        pathinfo: options.debug
    };
    // Excluding all node_module ouput will prevent a lot of spam in the webpack output
    var excludeFromStats = [
        /webpack/,
        /node_modules/
    ];
    // http://stackoverflow.com/questions/23305599/webpack-provideplugin-vs-externals
    var plugins = [
        new StatsPlugin("stats.json", {
            chunkModules: true,
            exclude: excludeFromStats
        }),
        new webpack.PrefetchPlugin("react"),
        new webpack.PrefetchPlugin("react/lib/ReactComponentBrowserEnvironment"),
        new webpack.ProvidePlugin({
            $: 'jquery',
            _: 'lodash'
        })

    ];
    //plugins.push(new StatsPlugin(path.join(__dirname, "build", "stats.json"), {
    // https://github.com/webpack/docs/wiki/node.js-api
    //plugins.push(new StatsPlugin("stats.json", {
    //    chunkModules: true,
    //    exclude: excludeFromStats
    //}));
    if(options.commonsChunk) {
        plugins.push(new webpack.optimize.CommonsChunkPlugin("commons", "commons.js" + (options.longTermCaching ? "?[chunkhash]" : "")));
    }

    Object.keys(stylesheetLoaders).forEach(function(ext) {
        var stylesheetLoader = stylesheetLoaders[ext];
        if(Array.isArray(stylesheetLoader)) stylesheetLoader = stylesheetLoader.join("!");
        if(options.separateStylesheet) {
            stylesheetLoaders[ext] = ExtractTextPlugin.extract("style-loader", stylesheetLoader);
        } else {
            stylesheetLoaders[ext] = "style-loader!" + stylesheetLoader;
        }
    });
    if(options.separateStylesheet) {
        plugins.push(new ExtractTextPlugin("[name].css" + (options.longTermCaching ? "?[contenthash]" : "")));
    }
    if(options.minimize) {
        plugins.push(
            new webpack.optimize.UglifyJsPlugin({
                compressor: {
                    warnings: false
                }
            }),
            new webpack.optimize.DedupePlugin()
        );
    }

    var defineOptions = {
        "ENV": JSON.stringify(options.env)
    };

    if(options.minimize) {
        plugins.push(
            new webpack.DefinePlugin(_.defaults(defineOptions, {
                "process.env": {
                    NODE_ENV: JSON.stringify("production")
                }
            })),
            new webpack.NoErrorsPlugin()
        );
    } else {
        plugins.push(
            new webpack.DefinePlugin(defineOptions)
        );
    }

    return {
        entry: entry,
        output: output,
        target: "web",
        module: {
            loaders: [].concat(loadersByExtension(loaders)).concat(loadersByExtension(stylesheetLoaders)).concat(additionalLoaders)
        },
        devtool: options.devtool,
        debug: options.debug,
        resolveLoader: {
            root: path.join(__dirname, "node_modules"),
            alias: aliasLoader
        },
        externals: externals,
        resolve: {
            root: root,
            modulesDirectories: modulesDirectories,
            extensions: extensions,
            alias: alias
        },
        plugins: plugins,
        devServer: {
            stats: {
                cached: false,
                exclude: excludeFromStats
            }
        }
    };
};
