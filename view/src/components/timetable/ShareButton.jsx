import React from 'react';
import { Button, Dialog, DialogContent, DialogContentText, DialogTitle, TextField, IconButton, Snackbar } from '@material-ui/core';
import { FileCopy, Share, Close } from '@material-ui/icons';
import { CopyToClipboard } from 'react-copy-to-clipboard';

import "./ShareButton.scss"


export default function ShareButton(props) {
    const [dialogOpen, setDialogOpen] = React.useState(false);
    const [snackbarOpen, setSnackbarOpen] = React.useState(false);

    const handleShareButtonClicked = () => {
        setDialogOpen(true);
    };

    const handleDialogClose = () => {
        setDialogOpen(false);
    };

    const handleCopyButtonClicked = () => {
        setSnackbarOpen(true);
    };

    const handleSnackbarClose = () => {
        setSnackbarOpen(false);
    };

    const link = window.location.origin + "/timetable/" + props.timetableId

    return (
        <div className={props.className}>
            <Button
                variant="outlined"
                color="primary"
                endIcon={<Share></Share>}
                onClick={handleShareButtonClicked}
            >
                Share
            </Button>
            <Dialog
                open={dialogOpen}
                onClose={handleDialogClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title" className="share-link-dialog-title">Share your timetable</DialogTitle>
                <DialogContent className="share-link-dialog-content">
                    <DialogContentText className="share-link-dialog-text">
                        Copy this link to share your timetable.
                    </DialogContentText>
                    <TextField
                        id="outlined-read-only-input"
                        label="Link"
                        defaultValue={link}
                        InputProps={{
                            readOnly: true,
                        }}
                        variant="outlined"
                    />
                    <CopyToClipboard text={link} onCopy={handleCopyButtonClicked}>
                        <IconButton color="primary" aria-label="copy">
                            <FileCopy></FileCopy>
                        </IconButton>
                    </CopyToClipboard>
                    <Snackbar
                        anchorOrigin={{
                            vertical: 'middle',
                            horizontal: 'center',
                        }}
                        open={snackbarOpen}
                        autoHideDuration={1500}
                        onClose={handleSnackbarClose}
                        message="Link Copied!"
                        action={
                            <React.Fragment>
                                <IconButton size="small" aria-label="close" color="inherit" onClick={handleSnackbarClose}>
                                    <Close fontSize="small" />
                                </IconButton>
                            </React.Fragment>
                        }
                    />

                </DialogContent>
            </Dialog>
        </div>
    );
}