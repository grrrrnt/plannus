import React from "react";
import { CardMedia } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import RouterLinkButton from "../util/RouterLinkButton";
import logo from "../assets/logo.png";

const useStyles = makeStyles({
    navbar: {
        display: 'flex',
        background: 'linear-gradient(45deg, #F1F1F1 30%, #AED3E6 90%)',
        color: 'white',
        height: '7em',
    },
    'navbar-logo-holder': {
        display: 'flex',
        flex: 1,
        flexDirection: 'row',
        margin: '1em',
    },
    'navbar-logo': {
        display: 'inline',
        flex: 1,
        width:'auto',
        'height': '100%',
        'object-fit': 'cover',
        marginRight: '1em',
    },
    'navbar-logo-name': {
        display: 'inline',
        position: 'relative',
        flex: 3,
        color: '#2F131A',
        '& h1': {
            position: 'absolute',
            bottom: '0px',
            'text-align': 'left',
            marginBottom: '0',
            'font-size': '300%',
            'font-family': 'Comfortaa',
            'font-weight': 'normal',
        },
    },
    'nav-buttons': {
        display: 'flex',
        position: 'relative',
    },
    'nav-button': {
        display: 'inline-flex',
        positon: 'absolute',
        bottom: 0,
        right: 0,
    }
});

export default function NavBar() {
    const styles = useStyles();
    return (
        <React.Fragment>
            <nav className={styles.navbar}>
                <div className={styles.['navbar-logo-holder']}>
                    <CardMedia
                        className={styles.['navbar-logo']}
                        image={logo}
                        title="Logo"
                    />
                    <span className={styles.['navbar-logo-name']}>
                        <h1>planNUS</h1>
                    </span>
                </div>

                <div className={styles["nav-buttons"]}>
                    <RouterLinkButton className={styles["nav-button"]} to="/">
                        Home
                    </RouterLinkButton>
                    <RouterLinkButton className={styles["nav-button"]} to="/generate">
                        Generate
                    </RouterLinkButton>
                    <RouterLinkButton className={styles["nav-button"]} to="/compare">
                        Compare
                    </RouterLinkButton>
                    <RouterLinkButton className={styles["nav-button"]} to="/account">
                        Account
                    </RouterLinkButton>
                </div>
            </nav>
        </React.Fragment>
    );
}