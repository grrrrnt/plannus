import React, {useState, useEffect} from "react";
const SelectTimetables = () => {
    const [state, setState] = useState({
        timetables: [],
        saved:[],
        error:[],
    });

    const [isLoaded, setIsLoaded] = useState(false);
    useEffect(() => {
        fetchTimetables()
    }, []);


}

export default withFirebase(SelectTimetables)