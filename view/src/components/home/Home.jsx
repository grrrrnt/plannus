import React, { Component } from "react";
import { LinearProgress } from "@material-ui/core"
import { Alert, AlertTitle } from "@material-ui/lab"

import { withFirebase } from '../firebase';
import Timetable from "../timetable"

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
                <h1>Home</h1>
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
