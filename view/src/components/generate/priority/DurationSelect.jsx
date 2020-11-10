import React from 'react'
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';
import Box from '@material-ui/core/Box';
import { durationOp } from './priorityfunc'
import { defaultFields } from './priorityfunc'

const DurationSelect = ({ handleFieldsChange, fields }) => {
    function handleChange(val) {
        let updatedFields = defaultFields
        updatedFields.hours = val;
        handleFieldsChange(updatedFields);
    }

    return (
        <Box m={1}>
            <TextField
                select label="Select"
                onChange={(e) => handleChange(e.target.value)}
                helperText="Please select duration (in hours)"
                variant="outlined"
                value={fields.hours}
            >
                {durationOp.map((d) => <MenuItem key={d} value={d}> {d} </MenuItem>)}
            </TextField>
        </Box>
    )
}

export default DurationSelect