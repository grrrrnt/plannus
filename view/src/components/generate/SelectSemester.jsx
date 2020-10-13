import React, { Component } from "react";
import selectsemheader from "../../assets/SelectSemester.png";
import { withRouter } from 'react-router-dom'
import * as ROUTES from '../../util/Routes';



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
        if (this.state.semester == '') {
            alert('Please Select a valid semester');
        } else {
            //alert('Sem ' + this.state.semester);
            this.props.history.push('/sigloginnin');
        }
        event.preventDefault();
         //save into firebase, if guest, dont save?
    }

    render() {
        return (
            <div>
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
                        <option value="AY 20/21 Sem 1">AY 20/21 Sem 1</option>
                        <option value="AY 20/21 Sem 2">AY 20/21 Sem 2</option>
                        <option value="AY 20/21 Special Term 1">AY 20/21 Special Term 1</option>
                        <option value="AY 20/21 Special Term 2">AY 20/21 Special Term 2</option>
                    </select>
                    </div>
                <input type="submit" value="Done" />
                </form>
            </div>
        )
    }
}

export default withRouter(SelectSemester);