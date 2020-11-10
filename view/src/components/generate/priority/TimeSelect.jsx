import React from 'react'
import { KeyboardTimePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import 'date-fns';
import Box from '@material-ui/core/Box';
import {defaultFields} from './priorityfunc'


const TimeSelect = ({ handleFieldsChange, fields }) => {
    function handleChange(time) {
        let updatedFields = defaultFields
        updatedFields.time = time;
        handleFieldsChange(updatedFields);
    }

    return (
        <Box m={1}>
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
                <KeyboardTimePicker label={"Time"} value={fields.time} onChange={handleChange} />
            </MuiPickersUtilsProvider>
        </Box>
    )
}

export default TimeSelect