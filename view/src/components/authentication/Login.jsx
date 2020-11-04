import React from 'react';
import { Redirect, Link } from "react-router-dom"
import { withAuthUserConsumer } from "./context"
import { FirebaseAuth } from '../firebase';
import * as ROUTES from "../../util/Routes"

import "./Login.scss"
import logo from "../../assets/logo.png";

function Login(props) {
  return (!props.authUser.loggedIn || props.authUser.isUserAnonymous)
    ? (
      <div className="login-container">
        <div className="login-logo-container">
          <Link to={ROUTES.HOME}>
            <img className="login-logo"
              src={logo}
              alt="Logo"
            />
          </Link>
          <h2>planNUS helps you schedule your next timetable!</h2>
        </div>
        <div className="login-button-container">
          <h1>Login/Register</h1>
          <FirebaseAuth />
        </div>
      </div>
    )
    : (
      <Redirect to={ROUTES.HOME} />
    )
}

export default withAuthUserConsumer(Login)