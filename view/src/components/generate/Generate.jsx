import { auth } from "firebase";
import React, { Component } from "react";

import { AuthUserContext, withAuthenticationConsumer } from "../authentication"
import { withFirebase } from "../firebase"
import SelectModules from "./SelectModules";
import SelectSemester from "./SelectSemester";
import RankPriorities from "./priority/RankPriorities";

class Generate extends Component {
    componentDidMount() {
        if (!this.props.authUser) {
            this.props.firebase.loginAnonymously()
        }
    }

    render() {
        return (
            <div>
                <SelectSemester />
                <RankPriorities />
            </div>
        )
    }
}

export default withAuthenticationConsumer(withFirebase(Generate));