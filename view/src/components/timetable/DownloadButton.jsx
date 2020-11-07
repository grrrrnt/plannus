import React from 'react';
import { Button, Dialog, DialogContent, DialogContentText, DialogTitle, TextField, IconButton, Snackbar } from '@material-ui/core';
import { GetApp } from '@material-ui/icons';

export default function DownloadButton(props) {
    return (
        <div className={props.className}>
            <Button
                variant="outlined"
                color="primary"
                endIcon={<GetApp/>}
                {...props}
            >
                Download
            </Button>
        </div>
    )
}