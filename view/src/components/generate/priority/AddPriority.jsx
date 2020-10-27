import React, {Component} from "react";
import {KeyboardTimePicker, MuiPickersUtilsProvider} from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import 'date-fns';
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import options from './options'


const defaultDate = new Date('2014-08-18T21:11:54');

const initialState = {
    name: "",
    type: "",
    fields: {
        time: defaultDate,
        fromTime: defaultDate,
        toTime: defaultDate,
        hours: 0,
    }            
}

class AddPriority extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: "",
            type: "",
            fields: {
                time: defaultDate,
                fromTime: defaultDate,
                toTime: defaultDate,
                hours: 0,
            },            
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
            fields: {
                time: defaultDate,
                fromTime: defaultDate,
                toTime: defaultDate,
                hours: 0,
            },
        });
    }

    handleTimeChange = id => (changedTime) => {
        if (id === 1) {
            this.setState({
                fields: {
                    ...this.state.fields,
                    time: changedTime,
                }
            });
        }

        if (id === 2) {
            this.setState({
                fields: {
                    ...this.state.fields,
                    fromTime: changedTime,
                }
            });
        }

        if (id === 3) {
            this.setState({
                fields: {
                    ...this.state.fields,
                    toTime: changedTime,
                }
            });
        }

    };

    handleDurationChange(e) {
        const duration = e.target.value;
        this.setState({
            fields: {
                ...this.state.fields,
                hours: parseInt(duration),
            }
        });
    }


    handleSubmit() {
        const { type, fields, name } = this.state;
        const toAdd = this.state;
        
        if (name === "") {
            alert("Please select a valid priority");
            return;
        }
        
        if (type === 'FreePeriodPriority') {
            if (fields.fromTime >= fields.toTime) {
                alert("For priority 'Avoid lessons between (Time 1) and (Time 2) every day.' Time 2 should be after Time 1. Please select your desired time(s) again.");
                return;
            } 
            
            toAdd.fields = {
                toTime: parseInt(fields.toTime.getHours() + "" + fields.toTime.getMinutes()),
                fromTime: parseInt(fields.fromTime.getHours() + "" + fields.fromTime.getMinutes())
            }

            toAdd.name = name.replace('(Time 1)', toAdd.fields.fromTime);
            toAdd.name = toAdd.name.replace('(Time 2)', toAdd.fields.toTime);
                    
            
        } else if (type === 'AvoidBeforePriority' || type === 'AvoidAfterPriority' ) {
            toAdd.fields = {
                time: parseInt(fields.time.getHours() + "" + fields.time.getMinutes())
            }

            toAdd.name = name.replace('(Time)', toAdd.fields.time);

        } else if (type === 'LunchBreakPriority') {
            toAdd.fields = {
                hours: fields.hours,
            }

            toAdd.name = name.replace('(duration)', fields.hours + " hours");

        } else {
            toAdd.fields = {};
        }

        this.props.addPriority(toAdd);
        this.setState(initialState);
    }
    


    render() {
        const { name, type, fields } = this.state;
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
                            <MuiPickersUtilsProvider utils={DateFnsUtils}>
                            <KeyboardTimePicker label="(Time)" value = {fields.time} onChange={this.handleTimeChange(1)}/>
                            </MuiPickersUtilsProvider>
                        </Grid>

                    : (type === 'FreePeriodPriority') ?
                            <Grid container justify = "center">
                                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                <KeyboardTimePicker label="(Time1)" value = {fields.fromTime} onChange={this.handleTimeChange(2)}/>
                                <KeyboardTimePicker label="(Time2)" value = {fields.toTime} onChange={this.handleTimeChange(3)}/>
                                </MuiPickersUtilsProvider>
                            </Grid>
                    
                    : (type === 'LunchBreakPriority') ?
                            <Grid container justify = "center">
                                <TextField
                                    id="outlined-number"
                                    label="(duration)"
                                    type="number"
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                    variant="outlined"
                                    onChange = {this.handleDurationChange}
                                /> 
                            </Grid> 
                    :
                    <div></div>
                }
                 <Grid container justify = "center">
                            <Button variant="outlined" color="primary" onClick = {this.handleSubmit}>
                                Add Priority
                            </Button>
                </Grid>
            </div>
        )
    }
}

export default AddPriority