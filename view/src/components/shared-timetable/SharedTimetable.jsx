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
            timetableId: null,
        };
    }

    componentDidMount() {
        let id = this.props.match.params.id
        if (id) {
            this.props.firebase.fetchTimetable(id)
            .then((res) => {
                this.setState({ loading: false })
                if (res) {
                    this.setState({ timetable: res.timetable, timetableId: res.timetableId })
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
                                ? <Timetable key="shared-timetable" timetable={this.state.timetable} timetableId={this.state.timetableId} subscribe save setDefault />
                                : (
                                    <Alert key="timetable-not-found" severity="error">
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
