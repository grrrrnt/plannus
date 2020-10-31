import React, { Component } from "react";

import { withFirebase } from "../firebase"
import SelectSemester from "./SelectSemester";
import RankPriorities from "./priority/RankPriorities";

class Generate extends Component {
    render() {
        return (
            <div>
                <SelectSemester />
                <RankPriorities />
            </div>
        )
    }
}

export default withFirebase(Generate);