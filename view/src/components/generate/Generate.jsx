import React, { Component } from "react";
import selectsemheader from "../../assets/SelectSemester.png";


import SelectModules from "./SelectModules";
import SelectSemester from "./SelectSemester";

class Generate extends Component {
    render() {
        return (
            <div>
                <h1>Generate Timetables</h1>
                <SelectSemester />
            </div>
        )
    }
}

export default Generate;