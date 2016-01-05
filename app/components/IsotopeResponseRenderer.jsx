import React                from "react";
import shallowEqual         from "react-pure-render/shallowEqual"

// Flux
import connectToStores      from 'alt/utils/connectToStores';
import FilterSortActions    from '../flux/actions/FilterSortActions';
import FilterSortStore      from '../flux/stores/FilterSortStore';

@connectToStores
export default class IsotopeResponseRenderer extends React.Component {
    // This class takes no arguments, pass in children of type Element
    static propTypes = {};
    static getStores() {
        return [FilterSortStore];
    }
    static getPropsFromStores() {
        return FilterSortStore.getState();
    }
    constructor(props, context) {
        super(props, context);

        // Copied from http://codepen.io/desandro/pen/nFrte
        this.filterFns = {
            // show if number is greater than 50
            numberGreaterThan50: function () {
                var number = $(this).find('.number').text();
                return parseInt( number, 10 ) > 50;
            },
            // show if name ends with -ium
            ium: function () {
                var name = $(this).find('.name').text();
                return name.match( /ium$/ );
            }
        };

        this.isoOptions = {
            itemSelector: '.element-item',
            layoutMode: 'masonry',
            masonry: {
                // Using a sizer element is necessary to prevent a vertical collapse between data loads
                // Ex. load all, then load metal, the metal will collapse into a vertical layout if this masonry: {}
                // section is commented out.
                columnWidth: '.element-item-sizer'
            },
            //sortBy: 'name', // If you want to set the default sort, do that here.
            getSortData: {
                name: '.name',
                symbol: '.symbol',
                number: '.number parseInt',
                category: '[data-category]',
                weight: function( itemElem ) {
                    var weight = $( itemElem ).find('.weight').text();
                    return parseFloat( weight.replace( /[\(\)]/g, '') );
                }
            }
        };
    }
    shouldComponentUpdate(nextProps, nextState) {
        return !shallowEqual(this.props, nextProps) || !shallowEqual(this.state, nextState);
    }
    // Filter and sort are coming from the Parent.
    componentWillReceiveProps(nextProps) {
        if (nextProps.filter && !_.isEqual(nextProps.filter, this.props.filter)) {
            this.iso.arrange({ filter: this.filterFns[nextProps.filter] || nextProps.filter });
        }
        if (nextProps.sort != null) {
            this.iso.arrange({sortBy: nextProps.sort});
        }
    }
    componentWillUnmount() {
        if (this.iso != null) {
            this.iso.destroy();
        }
    }
    componentDidMount() {
        this.createIsotopeContainer();

        // Only arrange if there are elements to arrange
        if (_.get(this, 'props.children.length', 0) > 0) {
            this.iso.arrange();
        }
    }
    componentDidUpdate(prevProps) {
        let currentKeys = _.map(prevProps.children, (n) => n.key);
        let newKeys = _.map(this.props.children, (n) => n.key);
        let addKeys = [];
        let removeKeys = [];

        // Find which keys are new between the current set of keys and any new children passed to this component
        newKeys.forEach((newKey) => {
            if (!_.includes(currentKeys, newKey)) {
                addKeys.push(newKey);
            }
        });

        // Find which keys have been removed between the current set of keys and any new children passed to this component
        currentKeys.forEach((currentKey) => {
            if (!_.includes(newKeys, currentKey)) {
                removeKeys.push(currentKey);
            }
        });

        if (removeKeys.length > 0) {
            //console.log(`Removing ${removeKeys.length} elements`);
            _.each(removeKeys, removeKey => this.iso.remove(document.getElementById(removeKey)));
            this.iso.arrange();
        }
        if (addKeys.length > 0) {
            //console.log(`Adding ${addKeys.length} elems`);
            this.iso.addItems(_.map(addKeys, (addKey) => document.getElementById(addKey)));
            this.iso.arrange();
        }
    }
    createIsotopeContainer() {
        if (this.iso == null) {
            this.iso = new Isotope(React.findDOMNode(this.refs.isotopeContainer), this.isoOptions);
        }
    }
    render() {
        return <div className="isotope" ref="isotopeContainer">
            <div className="element-item-sizer"></div>
            {this.props.children}
        </div>
    }
}
