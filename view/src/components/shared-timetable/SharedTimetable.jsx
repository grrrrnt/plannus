import React, { Component } from "react";
import { LinearProgress } from "@material-ui/core"
import { Alert, AlertTitle } from "@material-ui/lab"

import { withFirebase } from '../firebase';
import Timetable from "../timetable"

class SharedTimetable extends Component {
    constructor(props) {
        super(props);

        this.state = {
            loading: true,
            timetable: null,
        };
    }

    componentDidMount() {
        let id = this.props.match.params.id
        if (id) {
            this.props.firebase.fetchTimetable(id)
            .then((timetable) => {
                this.setState({ loading: false })
                if (timetable) {
                    this.setState({ timetable: timetable })
                }
            })
        }
    }
    render() {
        return (
            <div>
                <h1>Shared Timetable</h1>
                {
                    (this.state.loading)
                        ? <LinearProgress />
                        : [
                            (this.state.timetable)
                                ? <Timetable json={this.state.timetable} />
                                : (
                                    <Alert severity="error">
                                        <AlertTitle><strong>Timetable not found</strong></AlertTitle>
                                    </Alert>
                                )
                        ]
                }
            </div>
        )
    }
}

export default withFirebase(SharedTimetable);
