import React from 'react'
import { KeyboardTimePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import 'date-fns';
import Box from '@material-ui/core/Box';
import {defaultFields} from './priorityfunc'


const FreePeriodSelect = ({ handleFieldsChange, fields }) => {
    function handleFromTimeChange(time) {
        let updatedFields = defaultFields
        updatedFields.fromTime = time;
        updatedFields.toTime = fields.toTime;
        handleFieldsChange(updatedFields);
    }

    function handleToTimeChange(time) {
        let updatedFields = defaultFields
        updatedFields.fromTime = fields.fromTime;
        updatedFields.toTime = time;
        handleFieldsChange(updatedFields);
    }

    return (
        <div>
            <Box m={1}>
                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                    <KeyboardTimePicker label={"Time 1"} value={fields.fromTime} onChange={handleFromTimeChange} />
                </MuiPickersUtilsProvider>
            </Box>
            <Box m={1}>
                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                    <KeyboardTimePicker label={"Time 2"} value={fields.toTime} onChange={handleToTimeChange} />
                </MuiPickersUtilsProvider>
            </Box>
        </div>
    );
}

export default FreePeriodSelect