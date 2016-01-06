import alt                  from "../../alt";
import { decorate, bind }   from 'alt/utils/decorators'
import QueryActions         from "../actions/ElementActions";

@decorate(alt)
class ElementStore {
    constructor() {
        this.state = {
            type: '',
            elements: [],
            loading: false,
            err: null
        }
    }
    @bind(QueryActions.loading)
    onLoading(loading) {
        this.setState({ loading: loading })
    }

    @bind(QueryActions.elementResults)
    onElementResults(data) {
        this.setState({
            type: data.type,
            elements: data.elements,
            loading: data.loading,
            err: data.err
        })
    }

}

export default alt.createStore(ElementStore, 'ElementStore');
