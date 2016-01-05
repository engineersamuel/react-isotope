var React = require('react');
var router = require('./router');

router.run(function (Handler, state) {
    React.render((
        <Handler />
    ), document.getElementById('content'));
});
