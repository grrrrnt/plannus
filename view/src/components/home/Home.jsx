import React, { Component } from "react";
import { LinearProgress } from "@material-ui/core"
import { Alert, AlertTitle } from "@material-ui/lab"
import { Link } from "react-router-dom"

import { withFirebase } from '../firebase';
import Timetable from "../timetable"

import * as ROUTES from "../../util/Routes"
import "./Home.scss"

class Home extends Component {
    constructor(props) {
        super(props);

        this.state = {
            loading: true,
            timetable: null,
        };
    }

    componentDidMount() {
        this.props.firebase.fetchDefaultTimetable()
            .then((timetable) => {
                this.setState({ loading: false })
                if (timetable) {
                    this.setState({ timetable: timetable })
                }
            })
    }
    render() {
        return (
            <div>
                <div className="header-container">
                    <h1>Home</h1>
                    <Link to={ROUTES.SAVEDTIMETABLES} className="saved-timetable-link">View Saved Timetables</Link>
                </div>
                {
                    (this.state.loading)
                        ? <LinearProgress />
                        : [
                            (this.state.timetable)
                                ? <Timetable json={this.state.timetable} />
                                : (
                                    <Alert icon={false} severity="info">
                                        <AlertTitle><strong>No timetable selected</strong></AlertTitle>
                                        Choose one from Saved Timetables or generate one!
                                    </Alert>
                                )
                        ]
                }
            </div>
        )
    }
}

export default withFirebase(Home);
