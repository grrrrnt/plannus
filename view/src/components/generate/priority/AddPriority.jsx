import React, {Component} from "react";
import {KeyboardTimePicker, MuiPickersUtilsProvider} from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import 'date-fns';

const options = [
        {
            value: "Select a Priority"
        },
        {
            value: "Avoid lessons before (time) every day."
        },
        {
            value: "Avoid lessons after (time) every day."
        },
        {
            value: "Avoid lessons between (time 1) and (time 2) every day."
        },    
        {
            value: "Have a maximum number of free days."
        },    
        {
            value: "Minimise travelling across campus."
        },    
        {
            value: "Minimise breaks between classes."
        },    
        {
            value: "Include a lunch break for (duration) every day."
        }
    ]

class AddPriority extends Component {
    constructor(props) {
        super(props);
        this.state = {
            priority: 'Select a Priority',
            time1: new Date('2014-08-18T21:11:54'),
            time2: new Date('2014-08-18T21:11:54'),
            duration: "02",
        }
        this.handleChange = this.handleChange.bind(this);
        this.handleTimeChange = this.handleTimeChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(e) {
        const val = e.target.value;
        console.log(val);
        this.setState({
            priority: val,
        });
    }

    handleTimeChange(time) {
        this.setState({
            time1: time,
        });
    }

    handleSubmit() {
        const { priority } = this.state;
        if (priority === "Select a Priority") {
            alert("Please select a valid priority!");
            return;
        }

        if (!priority.includes("(")) {
            this.props.addPriority(this.state.priority);
            this.setState({
                priority: 'Select a Priority',
                time1: new Date('2014-08-18T21:11:54'),
                time2: new Date('2014-08-18T21:11:54'),
                duration: "02",
            }); 
        }
              
    }

    render() {
        const { priority } = this.state;
        console.log(this.state.time1);
        return (
            <div>
                <select value = {this.state.priority} onChange = {this.handleChange}>
                    {options.map((option) => (
                        <option key = {option.value} value={option.value}>{option.value}</option>
                    ))}
                    
                </select>
                
                {
                    priority === "Avoid lessons before (time) every day." ?
                        <div>
                           <MuiPickersUtilsProvider utils={DateFnsUtils}>
                           <KeyboardTimePicker label="(time)" value = {this.state.time1}onChange={this.handleTimeChange}/>
                           </MuiPickersUtilsProvider>
                            <button onClick = {this.handleSubmit}> Add Priority </button>
                        </div>
                        : <button onClick = {this.handleSubmit}> Add Priority </button>
                }
            </div>
        );
    }
}

export default AddPriority