import alt from '../../alt';

class FilterSortActions {
    constructor() {
        this.generateActions('filter');
        this.generateActions('sort');
    }
}

export default alt.createActions(FilterSortActions);