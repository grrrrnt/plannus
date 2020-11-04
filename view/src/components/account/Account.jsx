import React, { Component } from "react";
import { Redirect } from "react-router-dom"

import { LogoutButton } from "../authentication";
import { withAuthUserConsumer } from "../authentication"
import { LOGIN } from "../../util/Routes"

class Account extends Component {
    render() {
        return (this.props.authUser.loggedIn)
            ? (
                <div>
                    <h1>Account</h1>
                    <LogoutButton />
                </div>
            )
            : (
                <Redirect to={LOGIN} />
            )
    }
}

export default withAuthUserConsumer(Account);