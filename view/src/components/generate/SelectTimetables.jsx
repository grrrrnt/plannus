import React, { useState, useEffect } from "react";
import { withFirebase } from '../firebase';
import Timetable, { formatTimetable } from "../timetable"


const SelectTimetables = () => {
    const [state, setState] = useState({
        timetables: [],
        saved: [],
        error: [],
    });

    //const [isLoaded, setIsLoaded] = useState(false);
    useEffect(() => {
        const data = [].push(this.props.firebase.fetchMainTimetable());
        setState({ ...state, timetables: data })
    }, []);
    
    return(
            state.timetables.map(t=> {
                <Timetable timetable={formatTimetable(t)}/>
            }
            )
    );

}

export default withFirebase(SelectTimetables)