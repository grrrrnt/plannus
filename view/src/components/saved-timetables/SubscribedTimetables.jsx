import React, { Component } from "react";
import { LinearProgress } from "@material-ui/core"
import { Alert, AlertTitle } from "@material-ui/lab"
import InfiniteScroll from "react-infinite-scroll-component";

import { withFirebase } from '../firebase';
import TimetableItem from "./TimetableItem"

class SubscribedTimetables extends Component {
    constructor(props) {
        super(props);

        this.state = {
            loading: true,
            timetableIds: null,
            displayedTimetableIds: []
        };
        // for cancelling of async taks when unmounted
        this.abortController = new AbortController()
        this.signal = this.abortController.signal
    }

    componentDidMount() {
        this.props.firebase.fetchSubscribedTimetableIds()
            .then((timetableIds) => {
                if (this.signal.aborted) {
                    return
                }
                this.setState({ loading: false })
                if (timetableIds) {
                    this.setState({
                        timetableIds: timetableIds,
                    }, this.fetchMoreData)
                }
            })
    }

    componentWillUnmount() {
        this.abortController.abort()
    }

    render() {
        return (
            <div>
                {(this.state.loading)
                    ? <LinearProgress />
                    : [(this.state.timetableIds && this.state.displayedTimetableIds.length)
                        ? (<InfiniteScroll
                            key={"infinite-scroll"}
                            dataLength={this.state.displayedTimetableIds.length}
                            next={this.fetchMoreData}
                            hasMore={this.state.timetableIds.length !== this.state.displayedTimetableIds.length}
                            loader={<LinearProgress />}
                            scrollableTarget={this.props.parent}
                        >
                            {this.state.displayedTimetableIds.map((id, index) => (
                                <TimetableItem key={index} id={id} setDefault save subscribe isSubscribed />
                            )
                            )}
                        </InfiniteScroll>)
                        : (
                            <Alert icon={false} severity="info" key={"no-subscribed-timetables"}>
                                <AlertTitle><b>No subscribed timetables</b></AlertTitle>
                            </Alert>
                        )]
                }
            </div>
        )
    }

    fetchMoreData = () => {        
        if (this.signal?.aborted) {
            return
        }
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

export default withFirebase(SubscribedTimetables);
