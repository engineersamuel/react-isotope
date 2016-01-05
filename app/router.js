let Router = require('react-router');

function location() {
    if (typeof window !== 'undefined') {
        return Router.HistoryLocation;
    }
}

module.exports = Router.create({
    routes: require('./routes'),
    location: location()
});