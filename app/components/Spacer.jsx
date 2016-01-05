import React from "react";

export default class TodoItem extends React.Component {
    shouldComponentUpdate(nextProps, nextState) {
        return false;
    }
    render() {
        return <div style={{marginBottom: "10"}}></div>
    }
}