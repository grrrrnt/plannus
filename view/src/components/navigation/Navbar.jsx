import React from "react";

import RouterLinkButton from "./RouterLinkButton";
import { LogoutButton, AuthUserContext } from "../authentication"

import logo from "../../assets/logo.png";
import * as ROUTES from '../../util/Routes';
import "./Navbar.scss"

export default function NavBar() {
    return (
        <React.Fragment>
            <nav className="navbar">
                <div className="navbar-logo-container">
                    <img className="navbar-logo"
                        src={logo}
                        alt="Logo"
                    />
                </div>
                <span className="navbar-name-container">
                    <h1 className="navbar-name">planNUS</h1>
                </span>
                <div className="nav-buttons">
                    <div>
                        <RouterLinkButton activeClassName="nav-button-active" className="nav-button" to={ROUTES.HOME}>
                            Home
                        </RouterLinkButton>
                        <RouterLinkButton activeClassName="nav-button-active" className="nav-button" to={ROUTES.GENERATE}>
                            Generate
                        </RouterLinkButton>
                        <RouterLinkButton activeClassName="nav-button-active" className="nav-button" to={ROUTES.COMPARE}>
                            Compare
                        </RouterLinkButton>

                        <AuthUserContext.Consumer>
                            {authUser =>
                                (authUser && !authUser.isAnonymous) ? <NavigationAuth /> : <NavigationNonAuth />
                            }
                        </AuthUserContext.Consumer>
                    </div>
                </div>
            </nav>
        </React.Fragment>
    );
}

const NavigationAuth = () => (
    <React.Fragment>
        <RouterLinkButton activeClassName="nav-button-active" className="nav-button" to={ROUTES.ACCOUNT}>
            Account
        </RouterLinkButton>
    </React.Fragment>
);

const NavigationNonAuth = () => (
    <RouterLinkButton activeClassName="nav-button-active" className="nav-button" to={ROUTES.LOGIN}>
        Login/Register
    </RouterLinkButton>
);

