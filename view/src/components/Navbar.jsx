import React from "react";
import { makeStyles } from '@material-ui/core/styles';
import RouterLinkButton from "../util/RouterLinkButton";
import logo from "../assets/logo.png";

const useStyles = makeStyles({
    navbar: {
        display: 'flex',
        background: 'linear-gradient(43deg, #4158D0  0%, #C850C0 100% )',
        color: '#FFCC70',
    },
    'navbar-logo-holder': {
        display: 'flex',
        flexDirection: 'row',
        margin: '10px',
    },
    'navbar-logo': {
        display: 'flex',
        marginLeft: '10px',
        marginRight: '10px',
        maxWidth: '15%',
        height: 'auto',
        objectFit: 'contain',
    },
    'navbar-logo-name': {
        display: 'flex',
        '& h1': {
            'text-align': 'left',
            marginBottom: '15px',
            'font-size': '200%',
            'font-family': 'Comfortaa',
            'font-weight': 'normal',
        },
    },
    'nav-buttons': {
        display: 'flex',
        flexGrow: 1,
        flexDirection: 'row-reverse',
        alignSelf: 'stretch',
        alignItems: 'flex-end',
        '& div': {
            padding: '10px',
        }
    },
    'nav-button': {
        display: 'inline',
        padding: '10px',
        color: 'inherit',
        '&:hover': {
            // fontWeight: '600',
            color: 'white',
            background: 'none'
        },
    },
    'nav-button-active': {
        fontWeight: 'bolder'
    }
});

export default function NavBar() {
    const styles = useStyles();
    return (
        <React.Fragment>
            <nav className={styles.navbar}>
                <img className={styles.['navbar-logo']}
                    src={logo}
                    alt="Logo"
                />
                <span className={styles.['navbar-logo-name']}>
                    <h1>planNUS</h1>
                </span>
                <div className={styles["nav-buttons"]}>
                    <div>
                        <RouterLinkButton activeClassName={styles.["nav-button-active"]} className={styles["nav-button"]} to="/">
                            Home
                        </RouterLinkButton>
                        <RouterLinkButton activeClassName={styles.["nav-button-active"]} className={styles["nav-button"]} to="/generate">
                            Generate
                        </RouterLinkButton>
                        <RouterLinkButton activeClassName={styles.["nav-button-active"]} className={styles["nav-button"]} to="/compare">
                            Compare
                        </RouterLinkButton>
                        <RouterLinkButton activeClassName={styles.["nav-button-active"]} className={styles["nav-button"]} to="/account">
                            Account
                        </RouterLinkButton>
                    </div>
                </div>
            </nav>
        </React.Fragment>
    );
}