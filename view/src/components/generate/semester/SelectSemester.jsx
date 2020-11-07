import React, { Component } from "react";
import { withFirebase } from '../../firebase';
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
            loaded: false
        }
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(val) {
        this.setState({ semester: val, error: "" })
    }


    componentDidMount() { //only fetch from db if Generate don't have data.
        if (this.state.semester === "") {
            this.props.firebase.getSemester().then((res) => {
                if (res.year !== null) { //if user did not have any saved data
                    this.setState({ semester: res.year + " " + res.semester, loaded: true })
                } else {
                    this.setState({ loaded: true })
                }
            });
        } else {
            this.setState({ loaded: true })
        }
    }


    handleSubmit() {
        const { semester } = this.state;
        if (this.state.semester === '') {
            this.setState({ error: "Please Select a Valid Semester" });
            return;
        }
        this.props.setSem(semester);
        this.props.firebase.setSemester(parseInt(semester.split(" ")[0]), parseInt(semester.split(" ")[1]));
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