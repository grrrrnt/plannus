import firebase from 'firebase';
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
                    if (authUser.metadata.creationTime === authUser.metadata.lastSignInTime) {
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

    fetchDefaultTimetableId = () => {
        if (!this.isLoggedIn) {
            return null
        }

        var getDefaultTimetable = this.functions.httpsCallable('getDefaultTimetable');
        return getDefaultTimetable({})
            .then((result) => {
                return result.data
            }).catch((err) => {
                return console.error(err);
            });
    }

    fetchDefaultTimetable = async () => {
        if (!this.isLoggedIn) {
            return null
        }

        try {
            const timetableId = await this.fetchDefaultTimetableId();
            if (timetableId) {
                const timetable = await this.fetchTimetable(timetableId);
                return timetable;
            } else {
                return null
            }
        } catch (err) {
            console.error(err);
        }
    }

    fetchTimetable = async (id) => {
        var getTimetable = this.functions.httpsCallable('getTimetable');
        try {
            const res = await getTimetable({ timetableId: id });
            return res.data;
        } catch (err) {
            console.error(err);
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

    fetchSubscribedTimetableIds = async () => {
        if (!this.isLoggedIn) {
            return null
        }
        // var subscribeToTimetable = this.functions.httpsCallable('subscribeToTimetable')
        // subscribeToTimetable({ timetableId: "6f63aebe-45b3-4122-b054-ce1b83307191" })
        var getSubscribedTimetables = this.functions.httpsCallable('getSubscribedTimetables');
        try {
            const res = await getSubscribedTimetables();
            return res.data;
        } catch (err) {
            console.error(err);
        }
    }

    fetchModules = async (year, sem) => {
        var retrieveModules = this.functions.httpsCallable('retrieveModules');
        try {
            const result = await retrieveModules({ year: year, semester: sem })
            console.log(result);
            return result.data;
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

    getSemester = async () => {
        var getUserSemester = this.functions.httpsCallable('getUserSemester');
        try {
            const res = await getUserSemester();
            return res.data;

        } catch (err) {
            console.error(err);
        }

    }

    getUserModules = () => {
        var getUserModules = this.functions.httpsCallable('getUserModules');
        getUserModules()
            .then((res) => {
                return res.data.modules;
            }
            ).catch((err) => { console.log(err) })
    }

    getPriorities = async () => {
        const func = () => {
            var getUserPriorities = this.functions.httpsCallable('getUserPriorities');
            try {
                const res = await getUserPriorities();
                console.log(res);
                return res.data;
            } catch (err) {
                console.error(err);
            }
        }
    
        // log in anon if no user is logged in
        if (!this.isLoggedIn) {
            return this.loginAnonymously(func)
        } else {
            return func()
        }
    }

    generateTimetables = async () => {
        var generateTimetables = this.functions.httpsCallable('generateTimetables');
        try {
            const res = await generateTimetables();
            console.log(res);
            return res.data;
        } catch (err) {
            console.error(err);
        }
    }

    setDefaultTimetable = (timetableId, timetable) => {
        const func = async () => {
            if (!timetableId) {
                timetableId = await this.saveTimetable(timetable)
            }

            var setDefaultTimetable = this.functions.httpsCallable('setDefaultTimetable')
            return setDefaultTimetable({ timetableId: timetableId })
                .then((res) => {
                    console.log(res)
                    if (res.data.success) {
                        return timetableId
                    } else {
                        return null
                    }
                }).catch((err) => {
                    return console.error(err);
                });
        }
        // log in anon if no user is logged in
        if (!this.isLoggedIn) {
            return this.loginAnonymously(func)
        } else {
            return func()
        }
    }

    saveTimetable = (timetable) => {
        const func = () => {
            var saveTimetable = this.functions.httpsCallable('saveTimetable')
            return saveTimetable({ timetable: timetable })
                .then((res) => {
                    if (res.data.timetableId) {
                        return res.data.timetableId
                    } else {
                        return null
                    }
                }).catch((err) => {
                    return console.error(err);
                });
        }
        // log in anon if no user is logged in
        if (!this.isLoggedIn) {
            return this.loginAnonymously(func)
        } else {
            return func()
        }
    }

    unsaveTimetable = (timetableId) => {
        var saveTimetable = this.functions.httpsCallable('saveTimetable')
        saveTimetable({ timetable: sampleTimetable })
        var unsaveTimetable = this.functions.httpsCallable('unsaveTimetable');
        return unsaveTimetable({ timetableId: timetableId })
            .then(
                (result) => {
                    if (result.data.timetableId) {
                        return result.data.timetableId
                    } else {
                        return null
                    }
                }
            ).catch(
                (err) => {
                    return console.error(err);
                }
            );
    }

    subscribeTimetable = (timetableId) => {
        const func = () => {
            var subscribeToTimetable = this.functions.httpsCallable('subscribeToTimetable');
            return subscribeToTimetable({ timetableId: timetableId })
                .then((res) => {
                    if (res.data.timetableId) {
                        return res.data.timetableId
                    } else {
                        return null
                    }
                }).catch(
                    (err) => {
                        return console.error(err);
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

    unsubscribeTimetable = (timetableId) => {
        var unsubscribeFromTimetable = this.functions.httpsCallable('unsubscribeFromTimetable');
        return unsubscribeFromTimetable({ timetableId: timetableId })
            .then(
                (result) => {
                    if (result.data.timetableId) {
                        return result.data.timetableId
                    } else {
                        return null
                    }
                }
            ).catch(
                (err) => {
                    return console.error(err);
                }
            );
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
            "startTime": 1100,
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