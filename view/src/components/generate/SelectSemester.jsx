import React, { Component } from "react";
import './generate.css'
import { withRouter } from 'react-router-dom'
import { withFirebase } from '../firebase';
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Box from '@material-ui/core/Box';
import Alert from '@material-ui/lab/Alert';


class SelectSemester extends Component {
    constructor(props) {
        super(props);
        this.state = {
            semester: this.props.sem,
            year: '',
            error: "",
        }   
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    
    handleChange(event) {
        this.setState({
            semester : event.target.value,
            error: "",
        })
    }
    
    handleSubmit(event) {
        event.preventDefault();
        
        if (this.state.semester === '') {
            this.setState({
                error: "Please Select a Valid Semester",
            });
            return;
        }
        
        this.props.setSem(this.state.semester);
        this.props.nextStep();
    }

    render() {
        return (
            <div>
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
                                <MenuItem value="2020 1">AY 20/21 Sem 1</MenuItem>
                                <MenuItem value="2020 2">AY 20/21 Sem 2</MenuItem>
                                <MenuItem value="2020 3">AY 20/21 Special Term 1</MenuItem>
                                <MenuItem value="2020 4">AY 20/21 Special Term 2</MenuItem>
                            </TextField>
                    </Grid>
                {
                    this.state.error !== "" ? 
                        <Grid container justify = "center">
                            <Box m={1}>
                                <Alert severity="error">
                                    {this.state.error}
                                </Alert>
                            </Box>
                        </Grid>
                    : <div></div>
                }
                
                <Grid container justify = "center">
                    <Button variant="outlined" color="primary" onClick = {this.handleSubmit}>
                        Next
                    </Button>
                </Grid>
                    
            </div>
        )
    }
}

export default withRouter(withFirebase(SelectSemester));