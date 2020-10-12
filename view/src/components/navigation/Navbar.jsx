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
                <img className="navbar-logo"
                    src={logo}
                    alt="Logo"
                />
                <span className="navbar-logo-name">
                    <h1>planNUS</h1>
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
                                authUser ? <NavigationAuth /> : <NavigationNonAuth />
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
        <LogoutButton />
    </React.Fragment>
);

const NavigationNonAuth = () => (
    <RouterLinkButton activeClassName="nav-button-active" className="nav-button" to={ROUTES.LOGIN}>
        Login
    </RouterLinkButton>
);

