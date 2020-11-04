import firebase, { auth } from 'firebase';
import app from 'firebase/app';
import 'firebase/firestore'
import 'firebase/functions'

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
    currentUser = null
    isLoggedIn = localStorage.getItem("plannus-login")
    authStateCallback = null

    constructor() {
        firebase.initializeApp(config);

        this.auth = app.auth();
        this.functions = app.functions()

        this.auth.onAuthStateChanged(
            authUser => {
                this.currentUser = authUser
                if (this.authStateCallback) {
                    this.authStateCallback(authUser)
                }
                if (authUser) {
                    if (authUser.metadata.creationTime == authUser.metadata.lastSignInTime) {
                        this.createUser()
                    }
                    localStorage.setItem("plannus-login", true)
                    this.isLoggedIn = true
                } else {
                    localStorage.removeItem("plannus-login")
                    this.isLoggedIn = false
                }
            }
        )
    }

    setAuthStateCallback(callback) {
        this.authStateCallback = callback
        return () => this.authStateCallback = null
    }

    loginAnonymously = (callback) =>
        this.auth.signInAnonymously()
            .then((res) => {
                if (callback) {
                    return callback()
                }
            })

    doLogout = () => this.auth.signOut();

    doPasswordReset = email => this.auth.sendPasswordResetEmail(email);

    doPasswordUpdate = password =>
        this.auth.currentUser.updatePassword(password);

    createUser = () => {
        var createUser = this.functions.httpsCallable('createUser');
        createUser().catch(
            (err) => {
                console.error(err);
            }
        );
    }

    fetchDefaultTimetable = async () => {
        if (!this.isLoggedIn) {
            return null
        }

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
        if (!this.isLoggedIn) {
            return null
        }
        // var saveTimetable = this.functions.httpsCallable('saveTimetable')
        // saveTimetable({ timetable: sampleTimetable })
        var getSavedTimetables = this.functions.httpsCallable('getSavedTimetables');
        try {
            const res = await getSavedTimetables();
            return res.data;
        } catch (err) {
            console.error(err);
        }
    }

    fetchModules = async () => {
        var retrieveModules = this.functions.httpsCallable('retrieveModules');
        try {
            const result = await retrieveModules()
            console.log(result)
            return result.data.modules
        } catch (err) {
            console.error(err);
        }
    }

    setModules = (modules) => {
        const func = () => {
            var setUserModules = this.functions.httpsCallable('setUserModules');
            setUserModules({ modules: modules })
                .then(
                    (result) => {
                        console.log(result);
                    }
                ).catch(
                    (err) => {
                        console.log(err);
                    }
                );
        }
        // log in anon if no user is logged in
        if (!this.isLoggedIn) {
            return this.loginAnonymously(func)
        } else {
            return func()
        }
    }

    setSemester = (year, sem) => {
        const func = () => {
            var setUserSemester = this.functions.httpsCallable('setUserSemester');
            setUserSemester({ year: year, semester: sem })
                .then(
                    (result) => {
                        console.log(result);
                    }
                ).catch(
                    (err) => {
                        console.log(err);
                    }
                );
        }
        // log in anon if no user is logged in
        if (!this.isLoggedIn) {
            return this.loginAnonymously(func)
        } else {
            return func()
        }
    }

    setPriorities = (priorities) => {
        const func = () => {
            var setUserPriorities = this.functions.httpsCallable('setUserPriorities');
            setUserPriorities({ priorities: priorities })
                .then(
                    (result) => {
                        console.log(result);
                    }
                ).catch(
                    (err) => {
                        console.log(err);
                    }
                );
        }
        // log in anon if no user is logged in
        if (!this.isLoggedIn) {
            return this.loginAnonymously(func)
        } else {
            return func()
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
            "day": 1,
            "startTime": 900,
            "endTime": 1200,
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
            "moduleCode": "GET1019",
            "lessonType": "Lecture",
            "location": "COM1-01-01",
            "classNo": "02",
            "day": 5,
            "startTime": 1600,
            "endTime": 1800,
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
            "moduleCode": "CS3230",
            "lessonType": "Lecture",
            "location": "COM1-01-01",
            "classNo": "02",
            "day": 2,
            "startTime": 1000,
            "endTime": 1200,
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