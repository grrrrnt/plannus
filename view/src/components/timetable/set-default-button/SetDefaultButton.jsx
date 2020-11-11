import React from 'react';
import { Button, Snackbar, IconButton } from '@material-ui/core';
import { Close } from '@material-ui/icons';

export default function SetDefaultButton(props) {
    const { isDefault, onClick, ...others } = props
    const [loading, setLoading] = React.useState(false);
    const [success, setSuccess] = React.useState(false);
    // for cancelling of async taks when unmounted
    const abortController = new AbortController()
    const signal = abortController.signal

    const handleButtonClick = () => {
        if (onClick) {
            setLoading(true);
        }
    };

    const handleSnackbarClose = () => setSuccess(false)

    React.useEffect(() => {
        if (loading) {
            onClick()
                .then((timetableId) => {
                    if (signal.aborted) return
                    setLoading(false)
                    if (timetableId) setSuccess(true)
                })
        }
        return () => abortController.abort()
    }, [loading, onClick]);

    return (
        <div>
            <Button
                variant="outlined"
                color="primary"
                disabled={loading || isDefault}
                onClick={handleButtonClick}
                {...others}
            >
                {isDefault ? "Default" : "Set as default"}
            </Button>
            <Snackbar
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'center',
                }}
                open={success}
                autoHideDuration={1500}
                onClose={handleSnackbarClose}
                message="Timetable set as default"
                action={
                    <React.Fragment>
                        <IconButton size="small" aria-label="close" color="inherit" onClick={handleSnackbarClose}>
                            <Close fontSize="small" />
                        </IconButton>
                    </React.Fragment>
                }
            />
        </div>
    );
}
