import React from "react"
import {LinearProgress} from "@material-ui/core"

import {withFirebase} from "../firebase"
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
                .then((timetable) => {
                    if (signal?.aborted) return
                    
                    setLoading(false)
                    if (timetable) {
                        setTimetable(timetable)
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
                    ? <Timetable json={timetable} {...other}></Timetable>
                    : <div />
            }
        </React.Fragment >
    )
}

export default withFirebase(TimetableItem)