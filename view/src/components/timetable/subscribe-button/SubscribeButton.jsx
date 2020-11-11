import React from 'react';
import { Button, Snackbar, IconButton } from '@material-ui/core';
import { Close, Bookmark, Delete } from '@material-ui/icons';
import { makeStyles } from '@material-ui/core/styles';

export default function SubscribeButton(props) {
    const { isSubscribed, onSubscribe, onUnsubscribe, ...others } = props
    const [subscribing, setSubscribing] = React.useState(false);
    const [unsubscribing, setUnsubscribing] = React.useState(false);
    const [subscribeSuccess, setSubscribeSuccess] = React.useState(false);
    const [unsubscribeSuccess, setUnsubscribeSuccess] = React.useState(false);
    // for cancelling of async taks when unmounted
    const abortController = new AbortController()
    const signal = abortController.signal

    // Click subscribe
    const handleSubscribeClick = () => {
        if (onSubscribe) {
            setSubscribing(true);
        }
    };

    const handleSnackbarClose = () => subscribeSuccess ? setSubscribeSuccess(false) : setUnsubscribeSuccess(false)

    React.useEffect(() => {
        if (subscribing) {
            onSubscribe()
                .then((timetableId) => {
                    if (signal?.aborted) return
                    setSubscribing(false)
                    if (timetableId) setSubscribeSuccess(true)
                })
        }
        return () => abortController.abort()
    }, [subscribing, onSubscribe]);

    // Click unsubscribe
    const handleUnsubscribeClick = () => {
        if (onUnsubscribe) {
            setUnsubscribing(true);
        }
    };

    React.useEffect(() => {
        if (unsubscribing) {
            onUnsubscribe()
                .then((timetableId) => {
                    if (signal?.aborted) return
                    setUnsubscribing(false)
                    if (timetableId) setUnsubscribeSuccess(true)
                })
        }
        return () => abortController.abort()
    }, [unsubscribing, onUnsubscribe]);

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
                color={isSubscribed ? "secondary" : "primary"}
                disabled={subscribing || unsubscribing}
                onClick={isSubscribed ? handleUnsubscribeClick : handleSubscribeClick}
                endIcon={isSubscribed ? <Delete /> : <Bookmark />}
                classes={{ outlinedPrimary: styles.root }}
                {...others}
            >
                {isSubscribed ? "Unsubscribe" : "Subscribe"}
            </Button>
            <Snackbar
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'center',
                }}
                open={subscribeSuccess || unsubscribeSuccess}
                autoHideDuration={1500}
                onClose={handleSnackbarClose}
                message={"Timetable " + (subscribeSuccess ? "subscribed" : "unsubscribed") + " successfully"}
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
