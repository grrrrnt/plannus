import React from "react"
import { exportComponentAsPNG } from 'react-component-export-image'

import { withFirebase } from "../firebase"
import Timetable from "./Timetable"
import ShareButton from "./share-button/ShareButton"
import DownloadButton from "./download-button/DownloadButton"

import "./Timetable.scss"
import SetDefaultButton from "./set-default-button/SetDefaultButton"
import SaveButton from "./save-button/SaveButton"
import SubscribeButton from "./subscribe-button/SubscribeButton"

/**
 * Component for displayng timetables. Includes a Timetable component and 
 *      buttons for performing actions with the timetble.
 * props:
 * - timetable: timetable object to display.
 * - timetableId: id of timetable object
 * - save: SaveButton appears if set to true.
 * - subscribe: SubscribeButton appears if set to true.
 * - share: ShareButton appears if set to true.
 * - download: DownloadButton appears if set to true.
 * - setDefault: SetDefaultButton appears if this prop is set to true.
 * - isDefault: Boolean for whether the timetable is selected as default
 * - onSetDefault: A callback to be called after timetable is set as default.
 */
class TimetableContainer extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            timetable: this.formatTimetable(props.timetable),
            savedId: props.isSaved ? props.timetableId : null,
            subscribedId: props.isSubscribed ? props.timetableId : null,
        }
        this.timetableRef = React.createRef()
        // for cancelling of async taks when unmounted
        this.abortController = new AbortController()
        this.signal = this.abortController.signal
    }

    componentWillUnmount() {
        this.abortController.abort()
    }

    render() {
        return (
            <React.Fragment>
                <div className="timetable-container">
                    <div>
                        <Timetable timetable={this.state.timetable} ref={this.timetableRef} />
                        <div className="timetable-buttons-container">
                            {this.props.download && this.state.savedId
                                ? <DownloadButton className="timetable-button" onClick={() => exportComponentAsPNG(this.timetableRef, "Timetable", "#FFFFFF")} />
                                : ''
                            }
                            {this.props.share && this.state.savedId
                                ? <ShareButton className="timetable-button" timetableId={this.state.savedId}></ShareButton>
                                : ''
                            }
                            {this.props.setDefault
                                ? <SetDefaultButton className="timetable-button" onClick={this.onSetDefault} />
                                : ''
                            }
                            {this.props.save
                                ? <SaveButton className="timetable-button" isSaved={this.state.savedId !== null} onSave={this.onSave} onUnsave={this.onUnsave} />
                                : ''
                            }
                            {this.props.subscribe
                                ? <SubscribeButton className="timetable-button" isSubscribed={this.state.subscribedId !== null} onSubscribe={this.onSubscribe} onUnsubscribe={this.onUnsubscribe} />
                                : ''
                            }
                        </div>
                    </div>
                </div>
            </React.Fragment>
        )
    }

    // MARK: onSave function
    onSave = () => {
        return this.props.firebase.saveTimetable(this.props.timetable)
            .then((timetableId) => {
                if (this.signal?.aborted) return
                if (timetableId) this.setState({ savedId: timetableId })
                return timetableId;
            })
    }

    // MARK: onUnsave function
    onUnsave = () => {
        return this.props.firebase.unsaveTimetable(this.state.savedId)
            .then((timetableId) => {
                if (this.signal?.aborted) return
                if (timetableId) this.setState({ savedId: null })
                return timetableId;
            })
    }

    // MARK: onSubscribe function
    onSubscribe = () => {
        return this.props.firebase.subscribeTimetable(this.props.timetableId)
            .then((timetableId) => {
                if (this.signal?.aborted) return
                if (timetableId) this.setState({ subscribedId: timetableId })
                console.log("subscribe id: " + timetableId)
                return timetableId;
            })
    }

    // MARK: onUnsubscribe function
    onUnsubscribe = () => {
        return this.props.firebase.unsubscribeTimetable(this.state.subscribedId)
            .then((timetableId) => {
                if (this.signal?.aborted) return
                if (timetableId) this.setState({ subscribedId: null })
                return timetableId;
            })
    }

    // MARK: onSetDefault function
    onSetDefault = () => {
        return this.props.firebase.setDefaultTimetable(this.state.savedId, this.props.timetable)
            .then((timetableId) => {
                if (this.signal?.aborted) return
                if (timetableId) {
                    this.setState({ savedId: timetableId })
                    // execute callback if exists
                    if (this.props.onSetDefault) this.props.onSetDefault(timetableId)
                }
                return timetableId
            })
    }

    // Format timetable for display
    formatTimetable = (timetable) => {
        const timings = []
        const classes = {0: [], 1: [], 2: [], 3: [], 4: []}
        this.getTimings(timetable, timings)
        const moduleColors = this.assignModuleColor(timetable)
        this.formatClassDetails(timetable, timings, moduleColors, classes)
        // this.fillInEmptySlots(timings, classes)
        const formattedTimetable = {
            timings: timings,
            classes: classes
        }
        return formattedTimetable
    }

    // Timings calculated in mins
    getTimings = (timetable, timings) => {
        var earlestTime = 600
        var latestTime = 1080

        if (timetable.events.length > 0) {
            for (var i in timetable.events) {
                const module = timetable.events[i]
                const startTime = module.startTime
                const endTime = module.endTime
                if (startTime < earlestTime) {
                    earlestTime = startTime
                }
                if (endTime > latestTime) {
                    latestTime = endTime
                }
            }
        }
         // Make timings hourly marked (For display to be timings like 1000 instead of 1030)
        earlestTime = earlestTime - (earlestTime % 60)

        for (var time = earlestTime; time < latestTime; time += 60) {
            timings.push(time)
        }
    }

    formatClassDetails = (timetable, timings, moduleColors, classes) => {
        const startTime = timings[0]

        // Add lesson slots
        for (const i in timetable.events) {
            const lesson = timetable.events[i]
            var details = {
                moduleCode: lesson.moduleCode,
                lessonType: lesson.lessonType,
                location: lesson.location,
                classNo: lesson.classNo,
                mins: lesson.endTime - lesson.startTime,
                oddWeek: lesson.oddWeek,
                evenWeek: lesson.evenWeek,
                offset: lesson.startTime - startTime,
                color: moduleColors[lesson.moduleCode],
                overlap: 0 // no of lessons with overlapping timeslot as it
            }
            if (classes[lesson.day] === undefined) {
                classes[lesson.day] = [] // Set empty array
            }
            this.checkOverlappingLesson(classes[lesson.day], details)
            classes[lesson.day].push(details)
        }
    }

    checkOverlappingLesson = (dayLessons, lesson) => {
        for (var i in dayLessons) {
            var otherLesson = dayLessons[i]
            const otherEnd = otherLesson.offset + otherLesson.mins
            const lessonEnd = lesson.offset + lesson.mins
            if (otherLesson.offset < lessonEnd || lesson.offset < otherEnd) {
                lesson.overlap = lesson.overlap + 1
                otherLesson.overlap = otherLesson.overlap + 1
            }
        }
    }

    fillInEmptySlots = (timings, classes) => {
        const totalHrs = timings.length
        const includesWkends = () => Object.keys(classes).filter(x => x === 5 || x === 6).length > 0
        const daysCount = includesWkends() ? 7 : 5
        // Fill other slots with empty {}
        for (var day = 0; day < daysCount; day++) {
            if (!classes[day]) {
                classes[day] = []
            }
            var noHrs = totalHrs
            var i = 0
            var daylessons = classes[day]

            do {
                if (daylessons[i] === undefined) {
                    daylessons[i] = {}
                }

                noHrs -= ((Object.keys(daylessons[i]).length === 0) ? 1 : daylessons[i].hours)
                i++
            } while (noHrs > 0)
        }
    }

    colors = ["#E59CA0", "#E1B298", "#DAD6A1", "#A6CFA1", "#8BB9D4", "#AE9CD6"]

    assignModuleColor = (timetable) => {
        const modules = timetable.events
            .map(mod => mod.moduleCode) // extract module code
            .filter((v, i, a) => a.indexOf(v) === i); // unique
        const moduleColors = {}
        for (var i = 0; i < modules.length; i++) {
            moduleColors[modules[i]] = this.colors[i % this.colors.length]
        }
        return moduleColors
    }
}

export default withFirebase(TimetableContainer)