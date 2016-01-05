var winston         = require('winston');
winston.emitErrs    = true;

var logger = new winston.Logger({
    transports: [
        new winston.transports.Console({
            timestamp: function() {
                return new Date();
            },
            formatter: function(options) {
                // Return string will be passed to logger.
                return options.timestamp().toISOString() +' '+ options.level.toUpperCase() +' '+ (undefined !== options.message ? options.message : '') +
                    (options.meta && Object.keys(options.meta).length ? '\n\t'+ JSON.stringify(options.meta) : '' );
            },
            level: 'debug',
            handleExceptions: true,
            json: false,
            colorize: true
        })
    ],
    exitOnError: false
});
logger.exitOnError = false;

module.exports = logger;
module.exports.stream = {
    write: function(message, encoding){
        logger.info(message);
    }
};
