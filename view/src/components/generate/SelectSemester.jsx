import React, { Component } from "react";
import selectsemheader from "../../assets/SelectSemester.png";
import { withRouter } from 'react-router-dom'
import * as ROUTES from '../../util/Routes';
import { withFirebase } from '../firebase';

class SelectSemester extends Component {
    constructor(props) {
        super(props);
        this.state = {
            semester: '',
        }   
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(event) {
        this.setState({
            semester : event.target.value
        })
    }
    
    handleSubmit(event) {
        event.preventDefault();
        if (this.state.semester == '' ||this.state.semester == null) {
            alert('Please Select a valid semester');
        } else {
            //alert('Sem ' + this.state.semester);
            const year = this.state.semester.split(" ")[0];
            const sem = this.state.semester.split(" ")[1];
            alert(year + ' ' + sem);
            this.props.history.push(ROUTES.SELECTMODULES);
        }
         //save year and sem into firebase sanq
    }

    render() {
        return (
            <div>
                <h1>Generate Timetables</h1>
                <img className="headerpic"
                    src={selectsemheader}
                    alt="selectsemheader"
                />
                <h2> Which Semester are you planning for?</h2>
                <form onSubmit={this.handleSubmit}>
                    <div>
                    <select
                        onChange={this.handleChange}>
                        <option value="">Select Semester</option>
                        <option value="2020/2021 1">AY 20/21 Sem 1</option>
                        <option value="2020/2021 2">AY 20/21 Sem 2</option>
                        <option value="2020/2021 3">AY 20/21 Special Term 1</option>
                        <option value="2020/2021 4">AY 20/21 Special Term 2</option>
                    </select>
                    </div>
                <input type="submit" value="Done" />
                </form>
            </div>
        )
    }
}

export default withRouter(withFirebase(SelectSemester));