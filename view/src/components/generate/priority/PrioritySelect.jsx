import React from "react";
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';
import {options} from './priorityfunc'


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

export default PrioritySelect