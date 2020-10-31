import firebase from 'firebase';
import app from 'firebase/app';
import 'firebase/firestore'
import { v4 as uuid } from "uuid"


const config = {
    apiKey: "AIzaSyDnBTK2BzKIBSpoG83mlbKicu4puvrFpnc",
    authDomain: "plannus-cfd18.firebaseapp.com",
    databaseURL: "https://plannus-cfd18.firebaseio.com",
    projectId: "plannus-cfd18",
    storageBucket: "plannus-cfd18.appspot.com",
    messagingSenderId: "4682891865",
    appId: "1:4682891865:web:d5dfd11ca8e684d1336748",
    measurementId: "G-QX1D2DW4FX"
};


class Firebase {
    constructor() {
        firebase.initializeApp(config);

        this.auth = app.auth();
        this.auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL)
        this.functions = app.functions()
    }

    loginAnonymously = () =>
        this.auth.signInAnonymously()

    doLogout = () => this.auth.signOut();

    doPasswordReset = email => this.auth.sendPasswordResetEmail(email);

    doPasswordUpdate = password =>
        this.auth.currentUser.updatePassword(password);

    fetchDefaultTimetable = async () => {
        var getDefaultTimetable = this.functions.httpsCallable('getDefaultTimetable');

        try {
            const result = await getDefaultTimetable({});
            const timetableId = result.data;
            if (timetableId) {
                const timetable = await this.fetchTimetable(timetableId);
                return timetable;
            } else {
                return null
            }
        } catch (err) {
            console.log(err);
        }
    }

    fetchTimetable = async (id) => {
        var getTimetable = this.functions.httpsCallable('getTimetable');
        try {
            const res = await getTimetable({ timetableId: id });
            return res.data;
        } catch (err) {
            console.log(err);
        }
    }

    fetchSavedTimetableIds = async () => {
        var getSavedTimetables = this.functions.httpsCallable('getSavedTimetables');
        try {
            const res = await getSavedTimetables();
            return res.data;
        } catch (err) {
            console.log(err);
        }
    }
}

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

export default Firebase;