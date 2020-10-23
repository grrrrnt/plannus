import React, { Component } from "react";
import { Redirect } from "react-router-dom"

import { LogoutButton } from "../authentication";
import { withAuthenticationConsumer } from "../authentication"
import { LOGIN } from "../../util/Routes"

class Account extends Component {
    render() {
        return (this.props.authUser)
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

export default withAuthenticationConsumer(Account);