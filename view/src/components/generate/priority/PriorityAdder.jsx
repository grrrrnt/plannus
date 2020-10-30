import React, {Component} from "react";
import {KeyboardTimePicker, MuiPickersUtilsProvider} from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import 'date-fns';
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Alert from '@material-ui/lab/Alert';
import {options, durationOp, reformatForAdd} from './priorityfunc'
import './priorities.css'


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

    handleOptionChange(e) {
        const selectedOp = e.target.value;    
        var selectedType;    
        for (var op of options) { //loop to get type of priority
            if (op.value === selectedOp) {
                selectedType = op.type;
            }
        }

        this.setState({
            name: selectedOp,
            type: selectedType,
            error: "",
        });
    }

    handleTimeChange = id => (changedTime) => {
        if (id === 1) {
            this.setState({
                fields: {
                    ...this.state.fields,
                    time: changedTime,
                },
                error: "",
            });
        }

        if (id === 2) {
            this.setState({
                fields: {
                    ...this.state.fields,
                    fromTime: changedTime,
                },
                error: "",
            });
        }

        if (id === 3) {
            this.setState({
                fields: {
                    ...this.state.fields,
                    toTime: changedTime,
                },
                error: "",
            });
        }

    };

    handleDurationChange(e) {
        const duration = e.target.value;
        this.setState({
            fields: {
                ...this.state.fields,
                hours: duration,
                
            },
            error: "",
        });
    }


    handleSubmit() {
        const { type, fields, name } = this.state;
        let priority = {
            name: name,
            type: type,
            fields: {},        
        };

        if (name === "") {
            this.setState({
                error: "Please select a valid priority"
            })
            return;
        }

        if (type === 'FreePeriodPriority' && fields.fromTime >= fields.toTime) {
                this.setState({
                    error: "Time 2 should be after Time 1. Please select your desired time(s) again."
                })
                return;
        }

        reformatForAdd(priority, fields);
        const res = this.props.addPriority(priority);  
        res !==  "success" ? this.setState({error: res}) : this.setState(initialState);
    
    }
    
    render() {
        const { name, type, fields, error } = this.state;
        
        return (
            <div>
                <Grid container justify = "center">
                <TextField style={{width: "50%"}}
                    select label="Select"
                    onChange={this.handleOptionChange}
                    helperText="Please select your priority"
                    variant="outlined"
                    value={name}
                >
                    {options.map((op) => (
                        <MenuItem key = {op.value} value={op.value}> {op.value} </MenuItem>
                    ))}
                
                </TextField>
                </Grid>

                {
                    (type === 'AvoidBeforePriority' || type === 'AvoidAfterPriority') ?
                        
                        <Grid container justify = "center">
                            <Box m={1}>
                                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                    <KeyboardTimePicker label="(Time)" value = {fields.time} onChange={this.handleTimeChange(1)}/>
                                </MuiPickersUtilsProvider>
                            </Box>
                        </Grid>

                    : (type === 'FreePeriodPriority') ?
                            <Grid container justify = "center">
                                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                    <Box m={1} >
                                        <KeyboardTimePicker label="(Time1)" value = {fields.fromTime} onChange={this.handleTimeChange(2)}/>
                                    </Box>
                                    <Box m={1} >
                                        <KeyboardTimePicker label="(Time2)" value = {fields.toTime} onChange={this.handleTimeChange(3)}/>
                                    </Box>
                                </MuiPickersUtilsProvider>
                            </Grid>
                    
                    : (type === 'LunchBreakPriority') ?
                            <Grid container justify = "center">
                                <Box m={1}>
                                    <TextField
                                        select label="Select"
                                        onChange={this.handleDurationChange}
                                        helperText="Please select duration (in hours)"
                                        variant="outlined"
                                        value={fields.hours}
                                    >
                                        {durationOp.map((d) => (
                                            <MenuItem key = {d} value={d}> {d} </MenuItem>
                                        ))}
                                    
                                    </TextField> 
                                </Box> 
                            </Grid> 
                    :
                    <div></div>
                }
                {
                    error !== "" ? 
                        <Grid container justify = "center">
                            <Box m={1}>
                                <Alert severity="error">
                                    {error}
                                </Alert>
                            </Box>
                            
                        </Grid>
                    : <div></div>
                }
                 <Grid container justify = "center">
                    <Box m={1}>
                            <Button variant="outlined" color="primary" onClick = {this.handleSubmit}>
                                Add Priority
                            </Button>
                    </Box>
                </Grid>
            </div>
        )
    }
}

export default PriorityAdder