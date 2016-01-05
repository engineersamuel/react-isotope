import alt from '../../alt';
import Uri from 'jsuri';
import Promise from "bluebird";
Promise.longStackTraces();

class QueryActions {
    constructor() {
        this.generateActions('elementResults');
        this.generateActions('loading');
    }
    loadElements(type) {
        let uri = new Uri();
        uri.setPath('/api/elements');
        uri.addQueryParam('type', type);
        this.actions.loading(true);
        Promise.resolve($.ajax({
            url: uri.toString()
        })).then((response) => {
            this.actions.elementResults({
                type: type,
                elements: response,
                loading: false,
                err: null
            });
        }).catch( err => {
            console.error(err.stack || err.message || err);
            this.actions.elementResults({
                type: type,
                elements: null,
                loading: false,
                err: err
            });
        });
    }
}

export default alt.createActions(QueryActions);