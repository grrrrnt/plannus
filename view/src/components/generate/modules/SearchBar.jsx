import React, { Component } from "react";
import TextField from '@material-ui/core/TextField';
import _ from 'lodash';

class SearchBar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            input:"",
        };

        this.updateFilter = this.updateFilter.bind(this);
        this.delayedUpdateFilter = _.debounce(q => this.props.onChange(q), 500);
    }

    componentWillUnmount() {
        this.delayedUpdateFilter.cancel();
    }


    updateFilter(e) {
        const val = e.target.value
        this.setState({
            input: val
        });

        this.delayedUpdateFilter(val);
    }

    render() {
        return (
            <TextField style={{width : "100%"}} id="outlined-search" label="Enter Module Code" type="search" variant="outlined" value={this.state.input} 
            onChange = {this.updateFilter} autoComplete="off" />
        );
    }
}

export default SearchBar
