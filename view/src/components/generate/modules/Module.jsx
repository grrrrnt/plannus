import React, { Component } from "react";

class Module extends Component {
    constructor(props) {
        super(props);
        this.state = {
            moduleCode: this.props.moduleCode,
            title: this.props.title,
        };
    }
}