import React, { Component, useState } from "react";
import  { withFirebase } from '../firebase';
import Timetable, {formatTimetable} from "../timetable"

class Home extends Component {
    render() {
        console.log("home")
        return (
            <div>
                <h1>Home</h1>
                <Timetable timetable={formatTimetable(this.props.firebase.fetchMainTimetable())}/>
            </div>
        )
    }
}

export default withFirebase(Home);
