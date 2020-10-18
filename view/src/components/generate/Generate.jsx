import { auth } from "firebase";
import React, { Component } from "react";

import { AuthUserContext, withAuthenticationConsumer } from "../authentication"
import { withFirebase } from "../firebase"
import SelectSemester from "./SelectSemester";
import RankPriorities from "./priority/RankPriorities";

class Generate extends Component {
    constructor(props) {
        super(props)

        if (!props.authUser) {
            props.firebase.loginAnonymously()
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