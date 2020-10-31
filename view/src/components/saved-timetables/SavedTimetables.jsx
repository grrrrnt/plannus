import React, { Component } from "react";
import { LinearProgress } from "@material-ui/core"
import { Alert, AlertTitle } from "@material-ui/lab"
import LazyLoad from "react-lazyload"

import { withFirebase } from '../firebase';
import Timetable from "../timetable"

class SavedTimetable extends Component {
    constructor(props) {
        super(props);

        this.state = {
            loading: true,
            timetableIds: null,
        };
    }

    componentDidMount() {
        this.props.firebase.fetchSavedTimetableIds()
            .then((timetableIds) => {
                this.setState({ loading: false })
                if (timetableIds) {
                    this.setState({ timetableIds: timetableIds })
                }
            })
    }

    render() {
        return (
            <div>
                <h1>Saved Timetable</h1>
                {
                    (this.state.loading)
                        ? <LinearProgress />
                        : [
                            (this.state.timetableIds)
                                ? (
                                    this.state.timetableIds.map((id, index) => {
                                        return (
                                            <React.Fragment>
                                                <LazyLoad key={index} height={200} once>
                                                    <TimetableDisplay key={index} index={index} id={id} firebase={this.props.firebase} />
                                                </LazyLoad>
                                            </React.Fragment>
                                        )
                                    })
                                )
                                : (
                                    <Alert icon={false} severity="info">
                                        <AlertTitle><strong>No timetables saved</strong></AlertTitle>
                                        Start generating a timetable!
                                    </Alert>
                                )
                        ]
                }
            </div>
        )
    }
}

function TimetableDisplay(props) {
    const [timetable, setTimetable] = React.useState(null)
    const timetableId = props.id
    React.useEffect(() => {
        async function fetchTimetable() {
            props.firebase.fetchTimetable(timetableId)
                .then((timetable) => {
                    if (timetable) {
                        setTimetable(timetable)
                    }
                })
        }
        fetchTimetable()
    }, [])

    return (
        <React.Fragment>
            {
                (timetable)
                    ? <Timetable json={timetable}></Timetable>
                    : <div />
            }
        </React.Fragment>
    )
}

export default withFirebase(SavedTimetable);
