import React from 'react';
import { Button, Snackbar, IconButton } from '@material-ui/core';
import { Close } from '@material-ui/icons';

export default function SetDefaultButton(props) {
    const { isDefault, onClick, ...others } = props
    const [loading, setLoading] = React.useState(false);
    const [success, setSuccess] = React.useState(false);

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
                    setLoading(false)
                    if (timetableId) setSuccess(true)
                })
        }
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
