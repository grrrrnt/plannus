import React from "react"
import { Box } from '@material-ui/core';

import formatTimetable from "./timetable-formatter"
import ShareButton from "./ShareButton"
import "./Timetable.scss"

const days = { 1: "Mon", 2: "Tue", 3: "Wed", 4: "Thu", 5: "Fri", 6: "Sat", 7: "Sun" }

class Timetable extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            timetable: formatTimetable(props.json.timetable),
            timetableId: props.json.timetableId
        }
    }

    render() {
        return (
            <div className="timetable-container">
                <TimeLabels timings={this.state.timetable.timings} />
                <TimetableClasses classes={this.state.timetable.classes}></TimetableClasses>
                <ShareButton timetableId={this.state.timetableId}></ShareButton>
            </div>
        )
    }

}

const TimeLabels = (props) => {
    const timings = props.timings
    return (
        <Box display="flex" justifyContent="flex-start">
            <Slot className="timetable-time-slot timetable-day-slot" flex={0.5}></Slot>
            {
                timings.map((time) => {
                    return (<Slot className="timetable-time-slot" key={time} flex={1}>{time}</Slot>)
                })
            }
        </Box>
    )
}

const TimetableClasses = (props) => {
    const classes = props.classes
    return (
        <React.Fragment>
            {Object.entries(classes).map(([day, slots]) => {
                return (<DayLessons key={day} day={day} slots={slots} />)
            })}
        </React.Fragment>
    )
}

// A row of day
const DayLessons = (props) => {
    const day = props.day
    const slots = props.slots
    return (
        <Box display="flex">
            <Slot className="timetable-day-slot" flex={0.5}>{days[day]}</Slot>
            {
                slots.map((lesson, index) => {
                    return (<LessonSlot key={index} lesson={lesson} />)
                })
            }
        </Box>
    )
}

const LessonSlot = (props) => {
    const lesson = props.lesson
    if (Object.keys(lesson).length == 0) { // No lessons
        return (<Slot flex={1}></Slot>)
    } else { // lessons
        return (
            <Slot flex={lesson.hours} bgcolor={lesson.color}>
                <b>{lesson.moduleCode}</b><br />
                {lesson.lessonType} {lesson.classNo}<br />
                {lesson.location}
            </Slot>
        )
    }
}

const Slot = (props) => {
    return (
        <Box {...props} className={`timetable-slot ${props.className}`} component="span">
            <div>
                {props.children}
            </div>
        </Box>
    )
}

export default Timetable