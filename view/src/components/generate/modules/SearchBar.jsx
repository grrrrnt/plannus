import React, { Component } from "react";
import TextField from '@material-ui/core/TextField';



class SearchBar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            input:""
        };
    }

    render() {
        return (
            <TextField style={{width : "50%"}} id="outlined-search" label="Enter Module Code" type="search" variant="outlined" />
        );
    }
}

export default SearchBar
