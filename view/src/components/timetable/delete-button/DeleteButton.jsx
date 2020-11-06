import React from 'react';
import { Button, Popover, Box, IconButton, CircularProgress } from '@material-ui/core';
import { Delete, Done } from '@material-ui/icons';

import "./DeleteButton.scss"

export default function DeleteButton(props) {
    const { className, onClick } = props
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [loading, setLoading] = React.useState(null);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleConfirm = () => {
        setLoading(true)
        onClick()
    }

    const open = Boolean(anchorEl);

    return (
        <div className={className}>
            <Button
                variant="outlined"
                color="secondary"
                endIcon={<Delete />}
                onClick={handleClick}
            >
                Delete
            </Button>
            <Popover
                className="delete-timetable-popup"
                open={open}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
            >
                <Box className="delete-timetable-popup-content">
                    <Box marginRight={1}>Confirm Delete?</Box>
                    {loading ? <CircularProgress size={24} color="secondary" />
                        : (
                            <IconButton size="small" color="secondary" onClick={handleConfirm}>
                                <Done />
                            </IconButton>
                        )}

                </Box>
            </Popover>
        </div>
    );
}
