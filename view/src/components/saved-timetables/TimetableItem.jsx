import React from "react"
import {LinearProgress} from "@material-ui/core"

import {withFirebase} from "../../context"
import Timetable from "../timetable"

function TimetableItem(props) {
    const [loading, setLoading] = React.useState(true)
    const [timetable, setTimetable] = React.useState(null)
    const { id, firebase, ...other } = props

    React.useEffect(() => {
        // for cancelling of async taks when unmounted
        const abortController = new AbortController()
        const signal = abortController.signal

        async function fetchTimetable() {
            firebase.fetchTimetable(id)
                .then((res) => {
                    if (signal?.aborted) return
                    
                    setLoading(false)
                    if (res) {
                        setTimetable(res.timetable)
                    }
                })
        }
        fetchTimetable()

        return () => abortController.abort()
    }, [id, firebase])

    return (
        <React.Fragment>
            {(loading)
                ? <LinearProgress style={{ margin: "1em 0" }} />
                : (timetable)
                    ? <Timetable timetable={timetable} timetableId={id} {...other}></Timetable>
                    : <div />
            }
        </React.Fragment >
    )
}

export default withFirebase(TimetableItem)