import React, { Component } from "react";
import RankPriorities from "./RankPriorities";
import SelectModules from "./SelectModules";
import SelectSemester from "./SelectSemester";

class Generate extends Component {
    render() {
        return (
            <div>
                <SelectSemester />
            </div>
        )
    }
}

export default Generate;