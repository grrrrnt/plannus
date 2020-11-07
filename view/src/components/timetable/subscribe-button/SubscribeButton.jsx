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
                    setSubscribing(false)
                    if (timetableId) setSubscribeSuccess(true)
                })
        }
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
                    setUnsubscribing(false)
                    if (timetableId) setUnsubscribeSuccess(true)
                })
        }
    }, [unsubscribing, onUnsubscribe]);

    // const style = {
    //     color: !isSubscribed ? "#4CAF50" : "",
    //     borderColor: !isSubscribed ? "#4CAF50" : "",
    //     "&:disabled" {
    //         color: !isSubscribed ? "#C1C1C1" : "",
    //         borderColor: !isSubscribed ? "#C1C1C1" : "",
    //     }
    // }

    const styles = makeStyles({
        root: {
            color: !isSubscribed ? "#4CAF50" : "#DC004E",
            borderColor: !isSubscribed ? "#4CAF50" : "#DC004E",
        },
        disabled: {
            color: "#C1C1C1",
            borderColor: "#C1C1C1",
        },
        hover: {
            borderColor: !isSubscribed ? "#4CAF50" : "#DC004E",
            backgroundColor: !isSubscribed ? "rgba(76, 175, 80, 0.4)" : "rgba(227, 51, 113, 0.4)"
        }
    })();


    return (
        <div>
            <Button
                variant="outlined"
                disabled={subscribing || unsubscribing}
                onClick={isSubscribed ? handleUnsubscribeClick : handleSubscribeClick}
                endIcon={isSubscribed ? <Delete /> : <Bookmark />}
                classes={{root: styles.root, disabled: styles.disabled, hover: styles.hover}}
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
