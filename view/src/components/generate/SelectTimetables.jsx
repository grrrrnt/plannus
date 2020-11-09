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

const SelectTimetables = (props) => {
    const history = useHistory();
    const [timetables, setTimetables] = useState([]);

    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        const controller = new AbortController();
        const { signal } = controller;
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
                    <div>
                        <Grid
                            container
                            direction="column"
                            justify="flex-start"
                            alignItems="center"
                        >
                            <h2> Select Timetables</h2>
                            {
                                timetables.length === 0 ?
                                    <div> No timetable can be generated. Please reselect your modules and/or priorities!</div>

                                    :
                                    <Box maxHeight={600} overflow="auto">
                                        <div> Timetables are ordered according to how well they satisfy your priorities. Click on the 'Save' button to save or unsave timetables.</div>
                                        {
                                            timetables.map((t, index) => {
                                                return (
                                                    <Box key={index}>
                                                        <h4>Timetable Score = {t.score}</h4>
                                                        <Timetable timetable={t} save setDefault />
                                                    </Box>
                                                );
                                            })
                                        }
                                    </Box>
                            }
                        </Grid>
                        <Box display="flex" flexDirection="row-reverse">
                            <Button style={{ margin: "10px" }} variant="outlined" color="primary" onClick={onClick}>
                                Done
                            </Button>
                        </Box>
                    </div>
            }
        </div>


    );

}

export default withRouter(withFirebase(SelectTimetables))