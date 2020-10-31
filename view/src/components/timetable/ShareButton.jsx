import React from 'react';
import { Button, Dialog, DialogContent, DialogContentText, DialogTitle, TextField, IconButton } from '@material-ui/core';
import { FileCopy, Share } from '@material-ui/icons';
import { CopyToClipboard } from 'react-copy-to-clipboard';

import "./ShareButton.scss"


export default function ShareButton(props) {
    const [open, setOpen] = React.useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const link = window.location.origin + "/timetable/" + props.timetableId

    return (
        <div className="share-button-container">
            <Button
                variant="outlined"
                color="primary"
                endIcon={<Share></Share>}
                onClick={handleClickOpen}
            >
                Share
            </Button>
            <Dialog
                open={open}
                onClose={handleClose}
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
                    <CopyToClipboard text={link}>
                        <IconButton color="primary" aria-label="copy">
                            <FileCopy></FileCopy>
                        </IconButton>
                    </CopyToClipboard>
                </DialogContent>
            </Dialog>
        </div>
    );
}