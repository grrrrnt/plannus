import React from "react"
import { Box } from '@material-ui/core';

const Timetable = React.forwardRef((props, ref) => (
    <div ref={ref}>
        <TimeLabels timings={props.timetable.timings} />
        <TimetableClasses classes={props.timetable.classes}></TimetableClasses>
    </div>
))

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

const days = { 0: "Mon", 1: "Tue", 2: "Wed", 3: "Thu", 4: "Fri", 5: "Sat", 6: "Sun" }
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
    if (Object.keys(lesson).length === 0) { // No lessons
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
        <Box {...props} className={`timetable-slot ${props.className}`} p={0.5 * props.flex} component="span">
            <div>
                {props.children}
            </div>
        </Box>
    )
}

export default Timetable