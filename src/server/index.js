module.exports = function(options) {
    require('babel/register')({
        stage: 0,
        experimental: true
    });

    var _               = require('lodash');
    var settings        = require('./settings');
    var path            = require('path');
    var morgan          = require('morgan');
    var express         = require('express');
    var bodyParser      = require('body-parser');
    var cookieParser    = require('cookie-parser');
    var compression     = require('compression');
    var ejs             = require("ejs");
    var logger          = require("../utils/logger");
    if (options.env == "development") {
        logger.info("Setting the console transports level to debug");
        logger.transports.console.level = 'debug';
    } else {
        logger.info("Setting the console transports level to info");
        logger.transports.console.level = 'info';
    }

    var app         = express();
    var server      = require('http').Server(app);

    // load bundle information from stats
    var stats       = options.stats || require("../../build/public/stats.json");
    var packageJson = require("../../package.json");
    var publicPath  = stats.publicPath;

    // This is how it looks in the stats.json
    //assetsByChunkName": {
    //"main": [
    //  "main.js?21059f1cb71ba8fbd914",
    //  "main.css?bc8f4539d07f0f272436380df3391431"
    //]}
    var styleUrl    = options.separateStylesheet && (publicPath + "main.css?" + stats.hash);
    //var styleUrl   = publicPath + [].concat(stats.assetsByChunkName.main)[1]; // + "?" + stats.hash;
    var scriptUrl   = publicPath + [].concat(stats.assetsByChunkName.main)[0]; // + "?" + stats.hash;
    var commonsUrl  = stats.assetsByChunkName.commons && publicPath + [].concat(stats.assetsByChunkName.commons)[0];
    logger.debug("main.js" + stats.assetsByChunkName.main);
    var mainJsHash = stats.hash;
    try {
        mainJsHash = /main.js\?(.*)$/.exec(stats.assetsByChunkName.main)[1];
    } catch(e){}

    // Set this in the settings to that it can be sent with each request.  Then it can be compared to the
    // window.app.mainJsHash, if there is a difference, then the user should refresh the browser.
    settings.mainJsHash = mainJsHash;

    // Set this so extensions can read it
    settings.version = packageJson.version;

    var ipAddress           = options.ipAddress || '127.0.0.1';
    var port                = options.port || 8080;
    var env                 = options.env || 'development';
    settings.env            = env;
    settings.environment    = env;

    logger.info("main.js hash: " + mainJsHash);
    logger.info("version: " + packageJson.version);
    logger.info("styleUrl: " + styleUrl);
    logger.info("scriptUrl: " + scriptUrl);
    logger.info("commonsUrl: " + commonsUrl);

    var renderOptions = {
        STYLE_URL: styleUrl,
        SCRIPT_URL: scriptUrl,
        COMMONS_URL: commonsUrl,
        ENV: env,
        body: '',
        state: '',
        mainJsHash: mainJsHash,
        version: packageJson.version
    };

    // Always https in production
    if (env == "production") {
        renderOptions['STYLE_URL'] = styleUrl.replace("http", "https");
        renderOptions['SCRIPT_URL'] = scriptUrl.replace("http", "https");
    }

    logger.info("Env is " + env + ', running server http://' + ipAddress + ':' + port);
    server.listen(port, ipAddress);

    process.on('SIGTERM', function() {
        logger.info("SIGTERM, exiting.");
        server.close();
    });

    process.on('uncaughtException', function(err) {
        logger.error( " UNCAUGHT EXCEPTION " );
        logger.error( "[Inside 'uncaughtException' event] " + err.stack || err.message );
    });


    app.set('views', path.join(__dirname, 'views'));
    app.set('view engine', 'ejs');
    app.set('port', port);

    app.use(compression());
    app.use(morgan('dev'));
    // Set the limit otherwise larger payloads can cause 'Request Entity Too Large'
    app.use(bodyParser.json({limit: '50mb'}));
    app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
    app.use(cookieParser());

    app.use("/_assets", express.static(path.join(__dirname, "..", "..", "build", "public"), {
        //etag: false,
        //maxAge: "0"
        maxAge: "200d" // We can cache them as they include hashes
    }));
    app.use("/static", express.static("public", {
        //etag: false,
        //maxAge: "0"
        maxAge: "200d" // We can cache them as they include hashes
    }));

    logger.info("Using development error handler.");
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });

    // load REST API
    require("./api")(app);
    app.get("/*", function(req, res) {
        res.header("Cache-Control", "no-cache, no-store, must-revalidate");
        res.header("Pragma", "no-cache");
        res.header("Expires", 0);
        res.render('index', renderOptions);
    });
};