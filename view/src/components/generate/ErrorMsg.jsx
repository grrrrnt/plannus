import Alert from '@material-ui/lab/Alert';
import React from 'react';

const ErrorMsg = ({ msg }) => {
    return (
        <Alert severity="error">
            {msg}
        </Alert>

    )
}

export default ErrorMsg

