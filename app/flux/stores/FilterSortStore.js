var alt = require('../../alt');
import { decorate, bind } from 'alt/utils/decorators'
var FilterSortActions = require('../actions/FilterSortActions');

@decorate(alt)
class FilterSortStore {
    constructor() {
        this.object = null;
        this.state = {
            filter: '*',
            sort: ''
        }
    }

    @bind(FilterSortActions.filter)
    onFilter(filter) {
        this.setState({
            filter: filter
        })
    }

    @bind(FilterSortActions.sort)
    onSort(sort) {
        this.setState({
            sort: sort
        })
    }
}

export default alt.createStore(FilterSortStore, 'FilterSortStore');
