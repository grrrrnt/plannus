import React, { Component } from "react";
import RankPriorities from "./priority/RankPriorities";
import SelectModules from "./SelectModules";
import SelectSemester from "./SelectSemester";

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

export default Generate;