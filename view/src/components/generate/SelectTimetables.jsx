import React, { useState, useEffect } from "react";
import { withFirebase } from '../firebase';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import { LinearProgress } from "@material-ui/core"
import * as ROUTES from '../../util/Routes';
import { withRouter } from 'react-router-dom'
import { useHistory } from 'react-router-dom';



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

const sampleTimetable2 = {
    "score": 50.0,
    "year": 2020,
    "semester": 1,
    "modules": [
        "CS1101S",
        "CS2107",
        "CS1010"
    ],
    "events": [
        {
            "moduleCode": "CS1101S",
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
            "moduleCode": "CS2107",
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

const timetabless = [sampleTimetable, sampleTimetable2];

const SelectTimetables = (props) => {
    const history = useHistory();
    const [timetables, setTimetables] = useState([]);

    const [isLoaded, setIsLoaded] = useState(false);
    const [defaultTimetable, setDefaultTimetable] = useState(null);

    useEffect(() => {
        const controller = new AbortController();
        const { signal } = controller;
        //const data = props.firebase.generateTimetables(props.mods, props.priorities);
        let toSubmit = [];
        for (var x of props.mods) {
            toSubmit.push(x.moduleCode);
        }
        props.firebase.generateTimetables(props.priorities, toSubmit)
        .then(res => {
            if (signal.aborted) {
                return;
            }
            setTimetables(res.timetables);
            setIsLoaded(true);
        });       
        
        //setTimetables(timetabless);
        
        
        return () => {
            controller.abort()
        }
    }, []);

    function onClick() {
        history.push(ROUTES.HOME)
    }

    return (
        <div>
            {
                !isLoaded ? <LinearProgress /> :
                    <Grid>
                        <Box maxHeight={600} overflow="auto">
                            {
                                timetables.map((t, index) => {
                                    return <Timetable key={index} timetable={t} save setDefault />
                                })
                            }
                        </Box>
                        <Box display="flex" flexDirection="row-reverse">
                            <Button style={{ margin: "5px" }} variant="outlined" color="primary" onClick={onClick}>
                                Done
                            </Button>
                        </Box>
                    </Grid>
            }

        </div>
    );

}

export default withRouter(withFirebase(SelectTimetables))