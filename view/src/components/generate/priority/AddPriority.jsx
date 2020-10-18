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
            value: "Avoid lessons between (time1) and (time2) every day."
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
        this.handleTime1Change = this.handleTime1Change.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleTime2Change = this.handleTime2Change.bind(this);
    }

    handleChange(e) {
        const val = e.target.value;
        console.log(val);
        this.setState({
            priority: val,
            time1: new Date('2014-08-18T21:11:54'),
            time2: new Date('2014-08-18T21:11:54'),
            duration: "02",
        });
    }

    handleTime1Change(time) {
        this.setState({
            time1: time,
        });

    }

    handleTime2Change(time) {
        this.setState({
            time2: time,
        });

    }

    handleSubmit() {
        const { priority } = this.state;
        if (priority === "Select a Priority") {
            alert("Please select a valid priority!");
            return;
        }

        if (!priority.includes("(")) {
            this.props.addPriority(priority);
            this.setState({
                priority: 'Select a Priority',
                time1: new Date('2014-08-18T21:11:54'),
                time2: new Date('2014-08-18T21:11:54'),
                duration: "02",
            }); 
        }
        if (priority.includes("(time)")) {
            const time = this.state.time1.getHours() + ":" + this.state.time1.getMinutes();
            const updatedPriority = priority.replace("(time)", time);
            console.log(updatedPriority);
            this.props.addPriority(updatedPriority);
            this.setState({
                priority: 'Select a Priority',
                time1: new Date('2014-08-18T21:11:54'),
                time2: new Date('2014-08-18T21:11:54'),
                duration: "02",
            }); 
        }

        if (priority.includes("(time1)")) {
            const time1 = this.state.time1.getHours() + ":" + this.state.time1.getMinutes();
            const time2 = this.state.time2.getHours() + ":" + this.state.time2.getMinutes();
            const updatedTime1 = priority.replace("(time1)", time1);
            const updatedTime2 = updatedTime1.replace("(time2)", time2);
            console.log(updatedTime2);
            this.props.addPriority(updatedTime2);
            
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
        return (
            <div>
                <select value = {this.state.priority} onChange = {this.handleChange}>
                    {options.map((option) => (
                        <option key = {option.value} value={option.value}>{option.value}</option>
                    ))}
                    
                </select>
                
                {
                    priority.includes("(time)") ?
                        <div>
                           <MuiPickersUtilsProvider utils={DateFnsUtils}>
                           <KeyboardTimePicker label="(time)" value = {this.state.time1}onChange={this.handleTime1Change}/>
                           </MuiPickersUtilsProvider>
                            <button onClick = {this.handleSubmit}> Add Priority </button>
                        </div>
                        : priority.includes("(time1)") ?
                        <div>
                           <MuiPickersUtilsProvider utils={DateFnsUtils}>
                           <KeyboardTimePicker label="(time1)" value = {this.state.time1} onChange={this.handleTime1Change}/>
                           <KeyboardTimePicker label="(time2)" value = {this.state.time2} onChange={this.handleTime2Change}/>
                           </MuiPickersUtilsProvider>
                            <button onClick = {this.handleSubmit}> Add Priority </button>
                        </div>
                        :
                        <button onClick = {this.handleSubmit}> Add Priority </button>
                }
            </div>
        );
    }
}

export default AddPriority