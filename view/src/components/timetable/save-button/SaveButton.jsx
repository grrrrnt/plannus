import React from 'react';
import { Button, Snackbar, IconButton } from '@material-ui/core';
import { Close, Save, Delete } from '@material-ui/icons';
import { makeStyles } from '@material-ui/core/styles';

export default function SaveButton(props) {
    const { isSaved, onSave, onUnsave, ...others } = props
    const [saving, setSaving] = React.useState(false);
    const [unsaving, setUnsaving] = React.useState(false);
    const [savedSuccess, setSavedSuccess] = React.useState(false);
    const [unsavedSuccess, setUnsavedSuccess] = React.useState(false);

    // Click save
    const handleSaveClick = () => {
        if (onSave) {
            setSaving(true);
        }
    };

    const handleSnackbarClose = () => savedSuccess ? setSavedSuccess(false) : setUnsavedSuccess(false)

    React.useEffect(() => {
        if (saving) {
            onSave()
                .then((timetableId) => {
                    setSaving(false)
                    if (timetableId) setSavedSuccess(true)
                })
        }
    }, [saving, onSave]);

    // Click unsave
    const handleUnsaveClick = () => {
        if (onUnsave) {
            setUnsaving(true);
        }
    };

    React.useEffect(() => {
        if (unsaving) {
            onUnsave()
                .then((timetableId) => {
                    setUnsaving(false)
                    if (timetableId) setUnsavedSuccess(true)
                })
        }
    }, [unsaving, onUnsave]);

    const styles = makeStyles({
        root: {
            color: "#4CAF50",
            borderColor: "rgba(76, 175, 80, 0.5)",
            "&:hover": {
                borderColor: "#4CAF50",
                backgroundColor: "rgba(76, 175, 80, 0.05)",
            }
        },
    })();

    return (
        <div>
            <Button
                variant="outlined"
                color={isSaved ? "secondary" : "primary"}
                disabled={saving || unsaving}
                onClick={isSaved ? handleUnsaveClick : handleSaveClick}
                endIcon={isSaved ? <Delete /> : <Save />}
                classes={{ outlinedPrimary: styles.root }}
                {...others}
            >
                {isSaved ? "Unsave" : "Save"}
            </Button>
            <Snackbar
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'center',
                }}
                open={savedSuccess || unsavedSuccess}
                autoHideDuration={1500}
                onClose={handleSnackbarClose}
                message={"Timetable " + (savedSuccess ? "saved" : "unsaved") + " successfully"}
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
