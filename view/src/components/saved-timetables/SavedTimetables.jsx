import React, { Component } from "react";
import { LinearProgress, Grid } from "@material-ui/core"
import { Alert, AlertTitle } from "@material-ui/lab"
import InfiniteScroll from "react-infinite-scroll-component";

import { withFirebase } from '../firebase';
import Timetable from "../timetable"

class SavedTimetable extends Component {
    constructor(props) {
        super(props);

        this.state = {
            loading: true,
            timetableIds: null,
            displayedTimetableIds: []
        };
    }

    componentDidMount() {
        this.props.firebase.fetchSavedTimetableIds()
            .then((timetableIds) => {
                this.setState({ loading: false })
                if (timetableIds) {
                    this.setState({
                        timetableIds: timetableIds,
                    }, this.fetchMoreData)
                }
            })
    }

    render() {
        return (
            <div>
                <Grid container justify = "center">
                <h1> Saved Timetables</h1>
                </Grid>
                <div>
                    {(this.state.loading)
                        ? <LinearProgress />
                        : [(this.state.timetableIds && this.state.displayedTimetableIds.length)
                            ? (<InfiniteScroll
                                key={"infinite-scroll"}
                                dataLength={this.state.displayedTimetableIds.length}
                                next={this.fetchMoreData}
                                hasMore={this.state.timetableIds.length != this.state.displayedTimetableIds.length}
                                loader={<LinearProgress />}
                            >
                                {this.state.displayedTimetableIds.map((id, index) => (
                                        <TimetableDisplay key={index} index={index} id={id} firebase={this.props.firebase} />
                                    )
                                )}
                            </InfiniteScroll>)
                            : (
                                <Alert icon={false} severity="info" key={"no-saved-timetables"}>
                                    <AlertTitle><strong>No timetables saved</strong></AlertTitle>
                                        Start generating a timetable!
                                </Alert>
                            )]
                    }
                </div>
            </div>
        )
    }

    fetchMoreData = () => {
        const displayedIds = this.state.displayedTimetableIds
        const allIds = this.state.timetableIds
        const maxDisplayed = displayedIds.length + 5 < allIds.length
            ? displayedIds.length + 5
            : allIds.length

        this.setState({
            displayedTimetableIds: displayedIds.concat(allIds.slice(displayedIds.length, maxDisplayed)),
        })
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
        let isMounted = true;
        if (isMounted) {
            fetchTimetable()
        }
        return () => { isMounted = false };
    }, [timetableId])

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
