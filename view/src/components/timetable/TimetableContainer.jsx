import React from "react"
import { exportComponentAsPNG } from 'react-component-export-image'
import { Button } from "@material-ui/core"

import Timetable from "./Timetable"
import ShareButton from "./ShareButton"
import DownloadButton from "./DownloadButton"
import "./Timetable.scss"

class TimetableContainer extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            timetable: this.formatTimetable(props.json.timetable),
            timetableId: props.json.timetableId
        }
        this.timetableRef = React.createRef()
    }

    render() {
        return (
            <div className="timetable-container">
                <Timetable timetable={this.state.timetable} ref={this.timetableRef} />
                <div className="timetable-buttons-container">
                    {this.props.download
                        ? <DownloadButton className="timetable-button" onClick={() => exportComponentAsPNG(this.timetableRef, "Timetable", "#FFFFFF")} />
                        : ''
                    }

                    {this.props.share
                        ? <ShareButton className="timetable-button" timetableId={this.state.timetableId}></ShareButton>
                        : ''
                    }
                </div>
            </div>
        )
    }

    formatTimetable = (timetable) => {
        const timings = []
        const classes = {}
        this.getTimings(timetable, timings)
        const moduleColors = this.assignModuleColor(timetable)
        this.formatClassDetails(timetable, timings, moduleColors, classes)
        this.fillInEmptySlots(timings, classes)
        const formattedTimetable = {
            timings: timings,
            classes: classes
        }
        return formattedTimetable
    }

    getTimings = (timetable, timings) => {
        var earlestTime = 1000
        var latestTime = 1800

        if (timetable.events.length > 0) {
            for (var i in timetable.events) {
                const module = timetable.events[i]
                if (module.startTime < earlestTime) {
                    earlestTime = module.startTime
                }
                if (module.endTime > latestTime) {
                    latestTime = module.endTime
                }
            }
        }


        for (var time = earlestTime; time < latestTime; time += 100) {
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
                hours: (lesson.endTime - lesson.startTime) / 100,
                color: moduleColors[lesson.moduleCode]
            }
            const index = (lesson.startTime - startTime) / 100 // Slot # of day
            if (classes[lesson.day] === undefined) {
                classes[lesson.day] = [] // Set empty array
            }
            classes[lesson.day][index] = details
        }
    }

    fillInEmptySlots = (timings, classes) => {
        const totalHrs = timings.length
        const includesWkends = () => Object.keys(classes).filter(x => x == 6 || x == 7).length > 0
        const daysCount = includesWkends() ? 7 : 5
        // Fill other slots with empty {}
        for (var day = 1; day <= daysCount; day++) {
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

                noHrs -= ((Object.keys(daylessons[i]).length == 0) ? 1 : daylessons[i].hours)
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

export default TimetableContainer