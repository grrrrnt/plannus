import React, { Component } from "react";
import { KeyboardTimePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import 'date-fns';
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import { options, durationOp, reformatForAdd } from './priorityfunc'
import './priorities.css'
import ErrorMsg from '../ErrorMsg'

class PriorityAdder extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: "",
            type: "",
            fields: {
                time: defaultDate,
                fromTime: defaultDate,
                toTime: defaultDate,
                hours: "1",
            },
            error: "",
        }
        this.handleOptionChange = this.handleOptionChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleTimeChange = this.handleTimeChange.bind(this);
        this.handleDurationChange = this.handleDurationChange.bind(this);
    }

    handleOptionChange(selected) {
        var selectedType;
        for (var op of options) { //loop to get type of priority
            if (op.value === selected) {
                selectedType = op.type;
            }
        }
        this.setState({ name: selected, type: selectedType, error: "" });
    }

    handleTimeChange = id => (changedTime) => {
        if (id === 1) {
            this.setState({
                fields: { ...this.state.fields, time: changedTime },
                error: "",
            });
        }
        if (id === 2) {
            this.setState({
                fields: { ...this.state.fields, fromTime: changedTime },
                error: "",
            });
        }
        if (id === 3) {
            this.setState({
                fields: { ...this.state.fields, toTime: changedTime, },
                error: "",
            });
        }
    };

    handleDurationChange(d) {
        this.setState({
            fields: { ...this.state.fields, hours: d },
            error: "",
        });
    }

    handleSubmit() {
        const { type, fields, name } = this.state;
        let priority = { name: name, type: type, fields: {} };
        if (name === "") {
            this.setState({ error: "Please select a valid priority" })
            return;
        }
        if (type === 'FreePeriodPriority' && fields.fromTime >= fields.toTime) {
            this.setState({ error: "Time 2 should be after Time 1. Please select your desired time(s) again." })
            return;
        }
        reformatForAdd(priority, fields);
        const res = this.props.addPriority(priority);
        res !== "success" ? this.setState({ error: res }) : this.setState(initialState);
    }

    render() {
        const { name, type, fields, error } = this.state;
        return (
                <Grid
                    container
                    direction="column"
                    justify="center"
                    alignItems="center"
                >
                    <h2> What priorities are important to you?</h2>
                    <PrioritySelect name={name} handleOptionChange={this.handleOptionChange} />
                    {
                        (type === 'AvoidBeforePriority' || type === 'AvoidAfterPriority') ?
                            <TimeSelect t={fields.time} handleTimeChange={this.handleTimeChange(1)} label={"Time"} />
                            : (type === 'FreePeriodPriority') ?
                                <FreePeriodSelect toTime={fields.toTime} fromTime={fields.fromTime} handleTimeChange={this.handleTimeChange} />
                                : (type === 'LunchBreakPriority') ?
                                    <DurationSelect handleDurationChange={this.handleDurationChange} val={fields.hours} />
                                    :
                                    <div></div>
                    }
                    {
                        error !== "" ?
                            <Box m={1}>
                                <ErrorMsg msg={error} />
                            </Box>
                            : <div></div>
                    }
                    <Box m={1}>
                        <Button variant="outlined" color="primary" onClick={this.handleSubmit}>
                            Add Priority
                        </Button>
                    </Box>
                </Grid>
        )
    }
}

const defaultDate = new Date('2014-08-18T21:11:54');

const initialState = {
    name: "",
    type: "",
    fields: {
        time: defaultDate,
        fromTime: defaultDate,
        toTime: defaultDate,
        hours: "1",
    },
    error: ""
}

const DurationSelect = ({ handleDurationChange, val }) => {
    return (
        <Box m={1}>
            <TextField
                select label="Select"
                onChange={(e) => handleDurationChange(e.target.value)}
                helperText="Please select duration (in hours)"
                variant="outlined"
                value={val}
            >
                {durationOp.map((d) => <MenuItem key={d} value={d}> {d} </MenuItem>)}
            </TextField>
        </Box>
    )
}

const FreePeriodSelect = ({ handleTimeChange, fromTime, toTime }) => {
    return (
        <div>
            <TimeSelect handleTimeChange={handleTimeChange(2)} t={fromTime} label={"Time 1"} />
            <TimeSelect handleTimeChange={handleTimeChange(3)} t={toTime} label={"Time 2"} />
        </div>
    );
}

const TimeSelect = ({ handleTimeChange, t, label }) => {
    return (
        <Box m={1}>
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
                <KeyboardTimePicker label={label} value={t} onChange={(time) => handleTimeChange(time)} />
            </MuiPickersUtilsProvider>
        </Box>
    )
}

const PrioritySelect = ({ handleOptionChange, name }) => {
    return (
        <TextField style={{ width: "50%" }}
            select label="Select"
            onChange={(e) => handleOptionChange(e.target.value)}
            helperText="Please select your priority"
            variant="outlined"
            value={name}
        >
            {options.map((op) => <MenuItem key={op.value} value={op.value}> {op.value} </MenuItem>)}

        </TextField>
    )
}


export default PriorityAdder

