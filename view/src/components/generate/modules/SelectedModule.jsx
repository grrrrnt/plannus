import React from 'react'
import Button from '@material-ui/core/Button';


const SelectedModule = ({ ind, module, delMod }) => {
    return (
        <div>
            {module.moduleCode} {module.title}
            <Button variant="outlined" color="primary" onClick = {() => delMod(ind)}>
                        X
            </Button>
        </div>
    )
}

export default SelectedModule
