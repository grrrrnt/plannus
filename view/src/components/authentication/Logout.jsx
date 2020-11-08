import React from 'react';
import { Button, Dialog, DialogTitle, DialogContent, DialogActions } from '@material-ui/core';

import { withFirebase } from '../firebase';

const LogoutButton = ({ firebase, ...others }) => {
    const [dialogOpen, setDialogOpen] = React.useState(false)

    const handleDialogClose = () => setDialogOpen(false)

    return (<React.Fragment>
        <Button variant="outlined" color="secondary" onClick={() => setDialogOpen(true)} {...others}>
            Logout
        </Button>
        <Dialog
            open={dialogOpen}
            onClose={handleDialogClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <DialogTitle id="alert-dialog-title" style={{textAlign: "center", fontWeight: "bolder"}}>Confirm logout?</DialogTitle>

            <DialogContent style={{margin: "0 1em 1em 1em", borderTop: "0.1em solid #E33371"}}>
                <DialogActions>
                    <Button onClick={handleDialogClose} color="secondary">
                        No
                    </Button>
                    <Button onClick={firebase.doLogout} color="secondary">
                        Yes
                    </Button>
                </DialogActions>
            </DialogContent>
        </Dialog>
    </React.Fragment>
    )
};

export default withFirebase(LogoutButton);