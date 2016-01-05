import React        from "react";
import shallowEqual from "react-pure-render/shallowEqual"

export default class Element extends React.Component {
    static propTypes = {
        element: React.PropTypes.shape({
            classes: React.PropTypes.array,
            category: React.PropTypes.string,
            name: React.PropTypes.string,
            symbol: React.PropTypes.string,
            number: React.PropTypes.number,
            weight: React.PropTypes.number
        })
    };
    shouldComponentUpdate(nextProps, nextState) {
        return !shallowEqual(this.props, nextProps);
    }
    render() {
        // Setting the id is so we can quickly lookup an element to tell Isotope to add/remove it
        return (
            <div id={this.props.element.name}
                 className={`element-item ${this.props.element.classes.join(' ')}`}
                 data-category={this.props.element.category}>
                <h3 className="name">{this.props.element.name}</h3>
                <p className="symbol">{this.props.element.symbol}</p>
                <p className="number">{this.props.element.number}</p>
                <p className="weight">{this.props.element.weight}</p>
            </div>
        );
    }
}
