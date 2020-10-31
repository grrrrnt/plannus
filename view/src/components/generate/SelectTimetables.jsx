import React, { useState, useEffect } from "react";
import { withFirebase } from '../firebase';
import Timetable from "../timetable"
const sampleTimetable = {
    "score": 50.0,
    "year": 2020,
    "semester": 1,
    "modules": [
        "CS3219",
        "CS3203",
        "CS1010"
    ],
    "events": [
        {
            "moduleCode": "CS3219",
            "lessonType": "Lecture",
            "location": "COM1-01-01",
            "classNo": "02",
            "day": 3,
            "startTime": 1100,
            "endTime": 1300,
            "evenWeek": true,
            "oddWeek": true,
            "weeks": [
                1,
                2,
                3,
                4,
                5,
                6,
                7,
                8,
                9,
                10,
                11,
                12,
                13
            ]
        },
        {
            "moduleCode": "CS4211",
            "lessonType": "Lecture",
            "location": "COM1-01-01",
            "classNo": "02",
            "day": 2,
            "startTime": 1200,
            "endTime": 1400,
            "evenWeek": true,
            "oddWeek": true,
            "weeks": [
                1,
                2,
                3,
                4,
                5,
                6,
                7,
                8,
                9,
                10,
                11,
                12,
                13
            ]
        }
    ]
}

const SelectTimetables = () => {
    const [state, setState] = useState({
        timetables: [],
        saved: [],
        error: [],
    });

    //const [isLoaded, setIsLoaded] = useState(false);
    useEffect(() => {
        const data = [].push(sampleTimetable);
        setState({ ...state, timetables: data });
    }, []);

    return (
        state.timetables.map(t => {
            return <Timetable json={t} />
        })
    );

}

export default withFirebase(SelectTimetables)