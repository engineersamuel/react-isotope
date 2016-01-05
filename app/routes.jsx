import React                                from "react";
import { Route,  NotFoundRoute, Redirect }  from 'react-router';

import App          from './components/App';
import Home         from './components/Home';
import NotFoundPage from './components/NotFoundPage';

let browserPath = require("./utils.js").browserPath;

module.exports = (
    <Route handler={App}>
        <Route name="home" path={browserPath} handler={Home} />
        <Redirect from="/?" to="home" />
        <Route path="*" component={NotFoundPage} />
    </Route>
);
