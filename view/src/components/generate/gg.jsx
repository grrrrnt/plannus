import React, { Component } from "react";
import rankprioritiesheader from "../../assets/RankPriorities.png";
import { withRouter } from 'react-router-dom'
import * as ROUTES from '../../util/Routes';
import { withFirebase } from '../firebase';


class RankPriorities extends Component {
    constructor(props) {
        super(props);
        this.state = {
            priorities: [],
        }   
    }

    addPriority(e) {
        e.preventDefault();
        console.log(e.target.value);
        if (e.target.value == null) {
            alert("Please select a valid priority");
        } else {
            this.setState({
                priorities: this.state.priorities.concat(e.target.value)
            })
            console.log(this.state.priorities);
        }
    }

    selectPriority(e) {
        var length = this.state.priorities.length;
        var newPriorities = this.state.priorities;
        newPriorities[length - 1] = e.target.value;
        this.setState({
            priorities: newPriorities
        })
    }

    

    render() {
        return (
            <div>
                <img className="headerpic"
                    src={rankprioritiesheader}
                    alt="rankprioritiesheader"
                />
                <h2> Which Priorities are important for you? </h2>
                <h3> Step 1: Add the priority</h3>
                <form onSubmit={this.addPriority}>
                    <select>
                        <option value="">Select Scheduling Priority</option>
                        <option value="I want as many free days as possible">I want as many free days as possible</option>
                        <option value="Avoid Lessons before ">Avoid Lessons before </option>
                    </select>
                <input type="submit" value="+" />
                </form>
            </div>
        )
    }

}