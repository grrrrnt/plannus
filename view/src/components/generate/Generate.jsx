import React, { Component } from "react";
import { withAuthenticationConsumer } from "../authentication"
import { withFirebase } from "../firebase"
import SelectSemester from "./SelectSemester";
import RankPriorities from "./priority/RankPriorities";
import SelectModules from "./modules/SelectModules"

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
                <SelectModules />
            </div>
        )
    }
}

export default withAuthenticationConsumer(withFirebase(Generate));