import React, { Component } from "react";
import { withFirebase } from '../../../context';
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import { LinearProgress } from "@material-ui/core"
import { semOptions } from "./SemOptions.js"
import ErrorMsg from "../ErrorMsg"
import Box from '@material-ui/core/Box';



class SelectSemester extends Component {
    constructor(props) {
        super(props);
        this.state = {
            semester: this.props.init,
            error: "",
            loaded: true,
        }
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(val) {
        this.setState({ semester: val, error: "" })
    }

    handleSubmit() {
        const { semester } = this.state;
        if (this.state.semester === '') {
            this.setState({ error: "Please Select a Valid Semester" });
            return;
        }
        this.props.setSem(semester); //save semester state in stepper
        this.props.firebase.setSemester(parseInt(semester.split(" ")[0]), parseInt(semester.split(" ")[1])); //save semester into db
        this.props.nextStep(); 
    }

    render() {
        return (
            <div>
                {
                    this.state.loaded ?
                        <Grid
                            container
                            direction="column"
                            justify="center"
                            alignItems="center"
                        >
                            <h2> Which Semester are you planning for?</h2>
                            <SemSelector current={this.state.semester} handleChange={this.handleChange} />
                            {
                                this.state.error !== "" ?
                                    <Box m={1} >
                                        <ErrorMsg msg={this.state.error} />
                                    </Box>
                                    : <div></div>
                            }
                            <Button variant="outlined" color="primary" onClick={this.handleSubmit}>
                                Next
                                </Button>
                        </Grid>
                        :
                        <LinearProgress />
                }
            </div>
        )
    }
}

const SemSelector = ({ handleChange, current }) => {
    return (
        <TextField style={{ width: "50%" }}
            select label="Select"
            onChange={(e) => handleChange(e.target.value)}
            helperText="Please select your Semester"
            variant="outlined"
            value={current}
        >
            {semOptions.map(s => (
                <MenuItem key={s.val} value={s.val}> {s.name} </MenuItem>
            ))}

        </TextField>
    )
}


export default withFirebase(SelectSemester);