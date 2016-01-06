import React                                from "react";
import shallowEqual                         from "react-pure-render/shallowEqual"
import { Grid, Button, ButtonGroup, Alert } from "react-bootstrap";

import IsotopeResponseRenderer  from "./IsotopeResponseRenderer.jsx";
import Element                  from "./Element.jsx";
import Spacer                   from "./Spacer";

// Flux
import ElementActions       from "../flux/actions/ElementActions";
import ElementStore         from "../flux/stores/ElementStore";
import FilterSortActions    from "../flux/actions/FilterSortActions";
import FilterSortStore      from "../flux/stores/FilterSortStore";
import connectToStores      from 'alt/utils/connectToStores';

// The Home.less contains the CSS as copied from the Isotope example @ http://codepen.io/desandro/pen/nFrte
require("./Home.less");

// Define data to drive the UI and Isotope.  This could/should be placed in a separate module.
const loadData = [
    {name: 'all', value: 'all'},
    {name: 'metal', value: 'metal'},
    {name: '-iums', value: 'iums'}
];
const sortData = [
    {name: 'original order', value: ''},
    {name: 'name', value: 'name'},
    {name: 'symbol', value: 'symbol'},
    {name: 'number', value: 'number'},
    {name: 'weight', value: 'weight'},
    {name: 'category', value: 'category'}
];
const filterData = [
    {name: 'show all', value: '*'},
    {name: 'metal', value: '.metal'},
    {name: 'transition', value: '.transition'},
    {name: 'alkali and alkaline-earth', value: '.alkali, .alkaline-earth'},
    {name: 'not transition', value: ':not(.transition)'},
    {name: 'metal but not transition', value: '.metal:not(.transition)'},
    {name: 'number > 50', value: 'numberGreaterThan50'},
    {name: 'name ends with -ium', value: 'ium'}
];

@connectToStores
export default class Home extends React.Component {
    constructor(props, context) {
        super(props, context);
    }
    static getStores() {
        return [ElementStore, FilterSortStore];
    }
    static getPropsFromStores() {
        return _.assign(ElementStore.getState(), FilterSortStore.getState());
    }
    shouldComponentUpdate(nextProps, nextState) {
        return !shallowEqual(this.props, nextProps) || !shallowEqual(this.state, nextState);
    }
    renderElements(elements) {
        return _.map(elements, e => <Element key={e.name} element={e}></Element>);
    }
    filterElements(filter, e) {
        FilterSortActions.filter(filter);
    }
    sortElements(sort, e) {
        FilterSortActions.sort(sort);
    }
    renderLoadButtons() {
        return _.map(loadData, d => <Button key={d.name} active={this.props.type == d.value} onClick={ElementActions.loadElements.bind(this, d.value)}>{d.name}</Button>, this)
    }
    renderFilterButtons() {
        return _.map(filterData, d => <Button key={d.name} active={this.props.filter == d.value} onClick={this.filterElements.bind(this, d.value)}>{d.name}</Button>, this)
    }
    renderSortButtons() {
        return _.map(sortData, d => <Button key={d.name} active={this.props.sort == d.value} onClick={this.sortElements.bind(this, d.value)}>{d.name}</Button>, this)
    }
    renderNoData() {
        if (_.get(this, 'props.elements.length', 0) > 0) return null;
        return <Alert bsStyle="info">Please load data by clicking on one of the buttons in the 'Ajax Load Elements' section.</Alert>
    }
    render() {
        return (
            <Grid fluid={true}>
                <h2>Isotope - filtering & sorting</h2>
                <p>First load elements, then filter and sort.  Try loading different elements at any point.</p>

                <Spacer />

                <h3>Ajax Load Elements</h3>
                <ButtonGroup>
                    {this.renderLoadButtons()}
                </ButtonGroup>

                <Spacer />

                <h3>Filter</h3>
                <ButtonGroup>
                    {this.renderFilterButtons()}
                </ButtonGroup>

                <h3>Sort</h3>
                <ButtonGroup>
                    {this.renderSortButtons()}
                </ButtonGroup>

                <Spacer />

                {this.renderNoData()}
                <IsotopeResponseRenderer>
                    {this.renderElements(this.props.elements)}
                </IsotopeResponseRenderer>
            </Grid>
        );
    }
}
