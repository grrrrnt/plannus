import React, { Component } from "react";
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import { options, reformatForAdd } from './priorityfunc'
import './priorities.css'
import ErrorMsg from '../ErrorMsg'
import TimeSelect from './TimeSelect';
import FreePeriodSelect from './FreePeriodSelect';
import DurationSelect from './DurationSelect';
import PrioritySelect from './PrioritySelect';
import { defaultFields } from './priorityfunc'


class PriorityAdder extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: "",
            type: "",
            fields: defaultFields,
            error: "",
        }

        this.handleOptionChange = this.handleOptionChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleFieldsChange = this.handleFieldsChange.bind(this);
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

    handleFieldsChange(fields) {
        this.setState({
            fields: fields,
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
                        <TimeSelect fields={fields} handleFieldsChange={this.handleFieldsChange} />
                        : (type === 'FreePeriodPriority') ?
                            <FreePeriodSelect fields={fields} handleFieldsChange={this.handleFieldsChange} />
                            : (type === 'LunchBreakPriority') ?
                                <DurationSelect fields={fields} handleFieldsChange={this.handleFieldsChange} />
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

const initialState = {
    name: "",
    type: "",
    fields: defaultFields,
    error: ""
}



export default PriorityAdder

