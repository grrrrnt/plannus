import React from "react"
import { Box } from '@material-ui/core';

var defaultHeight = 80

const Timetable = React.forwardRef((props, ref) => {
    const { timetable } = props
    const [minuteWidth, setMinuteWidth] = React.useState(0)
    const [offsetWidth, setOffsetWidth] = React.useState(0)

    return (
        <div ref={ref}>
            <TimeLabels timings={timetable.timings} onresize={width => setMinuteWidth(width)} setOffset={width => setOffsetWidth(width)} />
            <TimetableClasses classes={props.timetable.classes} slots={timetable.timings.length} minuteWidth={minuteWidth} offsetWidth={offsetWidth}></TimetableClasses>
        </div>
    )
})

const toHour = (mins) => {
    return mins / 60
}

const TimeLabels = (props) => {
    const { timings, onresize, setOffset } = props
    var slotRef = React.useRef()
    var offsetRef = React.useRef()

    React.useEffect(() => {
        if (slotRef) onresize(slotRef.current.getBoundingClientRect().width / 60)
        if (offsetRef) setOffset(offsetRef.current.offsetWidth)
    }, [offsetRef, slotRef, onresize, setOffset])

    window.addEventListener("resize", () => {
        if (slotRef) onresize(slotRef.current.getBoundingClientRect().width / 60)
        if (offsetRef) setOffset(offsetRef.current.offsetWidth)
    })
    return (
        <Box display="flex">
            <Slot className="timetable-time-slot timetable-day-slot" flex={30} height={defaultHeight / 2} ref={offsetRef}></Slot>
            {
                timings.map((time, index) => {
                    return (<Slot className="timetable-time-slot" key={"timing-" + index} index={index} flex={60} height={defaultHeight / 2} ref={index === 0 ? slotRef : null}>{toHour(time)}</Slot>)
                })
            }
        </Box>
    )
}

const TimetableClasses = (props) => {
    const { classes, slots, minuteWidth, offsetWidth } = props
    return (
        <React.Fragment>
            {Object.entries(classes).map(([day, lessons]) => {
                return (<DayLessons key={day} day={day} lessons={lessons} slots={slots} minuteWidth={minuteWidth} offsetWidth={offsetWidth} />)
            })}
        </React.Fragment>
    )
}

const days = { 0: "Mon", 1: "Tue", 2: "Wed", 3: "Thu", 4: "Fri", 5: "Sat", 6: "Sun" }
// A row of day
const DayLessons = (props) => {
    const { day, lessons, slots, minuteWidth, offsetWidth } = props
    const dayText = days[day]
    const rowHeight = lessons.length ? defaultHeight * (Math.max(...lessons.map(l => l.overlap)) + 1) : defaultHeight / 2
    var overlap = 0
    return (
        <Box display="flex" height={rowHeight} position="relative">
            <Slot className="timetable-day-slot" flex={30} height={rowHeight}>{dayText}</Slot>
            {
                [...Array(slots)].map((e, i) => (
                    <Slot index={i} key={dayText + "-slot-" + i} flex={60} height={rowHeight} />
                ))
            }
            {lessons.length > 0
                ?
                lessons.map((lesson, i) => {
                    var top = 0
                    var height = rowHeight
                    if (lesson.overlap) {
                        height = height / (lesson.overlap + 1)
                        top = overlap
                        overlap += 1
                    }
                    return (
                        <Box key={dayText + "-lesson-" + i}
                            display="flex" alignItems="center"
                            position="absolute"
                            width={lesson.mins * minuteWidth}
                            left={(lesson.offset * minuteWidth) + offsetWidth}
                            height={height}
                            top={top * height}
                            bgcolor={lesson.color}
                        >
                            <Box m={lesson.mins / 60 * 0.5}>
                                <b>{lesson.moduleCode}</b><br />
                                {lesson.lessonType} {lesson.classNo}<br />
                                {lesson.location}
                                {(lesson.oddWeek && !lesson.evenWeek)
                                    ? (<React.Fragment><br />Odd week</React.Fragment>)
                                    : ''
                                }
                                {(!lesson.oddWeek && lesson.evenWeek)
                                    ? (<React.Fragment><br />Even week</React.Fragment>)
                                    : ''
                                }
                            </Box>
                        </Box>
                    )
                })
                : ''
            }
        </Box>
    )
}

const Slot = React.forwardRef((props, ref) => {
    const { className, ...others } = props
    return (
        <Box ref={ref} {...others} className={`timetable-slot ${className}`} >
            <div>
                {props.children}
            </div>
        </Box>
    )
})

export default Timetable