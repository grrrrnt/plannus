import React, { Component } from "react";
import './generate.css'
import { withRouter } from 'react-router-dom'
import * as ROUTES from '../../util/Routes';
import { withFirebase } from '../firebase';
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';


class SelectSemester extends Component {
    constructor(props) {
        super(props);
        this.state = {
            semester: '',
        }   
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(event) {
        this.setState({
            semester : event.target.value
        })
    }
    
    handleSubmit(event) {
        event.preventDefault();
        
        if (this.state.semester === '') {
            alert("Please Select a Valid Semester");
            return;
        }
    
        const year = this.state.semester.split(" ")[0];
        const sem = this.state.semester.split(" ")[1];
        alert(year + ' ' + sem);
        //this.props.history.push(ROUTES.SELECTMODULES);
         //save year and sem into firebase sanq
    }

    render() {
        return (
            <div>
                <Grid container justify = "center">
                <h1 className = {"title"}> Generate Timetables</h1>
                </Grid>
                <Grid container justify = "center">
                    <h2 className = {"title"}> Which Semester are you planning for?</h2>
                </Grid>
                    <Grid container justify = "center">
                            <TextField style={{width: "50%"}}
                                select label="Select"
                                onChange={this.handleChange}
                                helperText="Please select your Semester"
                                variant="outlined"
                                value={this.state.semester}
                            >
                                <MenuItem value="2020/2021 1">AY 20/21 Sem 1</MenuItem>
                                <MenuItem value="2020/2021 2">AY 20/21 Sem 2</MenuItem>
                                <MenuItem value="2020/2021 3">AY 20/21 Special Term 1</MenuItem>
                                <MenuItem value="2020/2021 4">AY 20/21 Special Term 2</MenuItem>
                            </TextField>
                    </Grid>
                <Grid container justify = "center">
                    <Button variant="outlined" color="primary" onClick = {this.handleSubmit}>
                        Submit
                    </Button>
                </Grid>
                    
            </div>
        )
    }
}

export default withRouter(withFirebase(SelectSemester));