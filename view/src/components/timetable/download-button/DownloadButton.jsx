import React from 'react';
import { Button } from '@material-ui/core';
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