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
            timetableId: null,
        };
        // for cancelling of async taks when unmounted
        this.abortController = new AbortController()
        this.signal = this.abortController.signal
    }

    componentDidMount() {
        this.props.firebase.fetchDefaultTimetable()
            .then((res) => {
                if (this.signal.aborted) {
                    return
                }
                this.setState({ loading: false })
                if (res) {
                    this.setState({ timetable: res.timetable, timetableId: res.timetableId })
                }
            })
    }

    componentWillUnmount() {
        this.abortController.abort()
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
                                ? <Timetable key={"default-timetable"} timetable={this.state.timetable} timetableId={this.state.timetableId} share download isSaved />
                                : (
                                    <Alert icon={false} severity="info" key={"no-default-timetable"}>
                                        <AlertTitle><strong>No timetable selected</strong></AlertTitle>
                                        Choose one from your <Link style={{color: "#0d3c61"}} to={ROUTES.SAVEDTIMETABLES}>saves</Link> or <Link style={{color: "#0d3c61"}} to={ROUTES.GENERATE}>generate</Link> one!
                                    </Alert>
                                )
                        ]
                }
            </div>
        )
    }
}

export default withFirebase(Home);
