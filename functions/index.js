const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

//const loginUser = require('./users')
//app.post('/login', loginUser);

var uuid = require('uuid');
var request = require('request');
var bodyParser = require('body-parser');

exports.retrieveModules = functions.https.onCall((data, context) => {
    var startYear = data.year;
    var endYear = startYear + 1;
    var semester = data.semester;
    var yearCode = startYear.toString() + "-" + endYear.toString();

    var getYearModules = function (yearCode) {
        return new Promise((resolve, reject) => {
            request("https://nusmods.com/api/v2/" + yearCode + "/moduleList.json", (err, res, body) => {
                if (err) {
                    console.log(err);
                    reject(err)
                } else {
                    resolve(JSON.parse(body));
                }
            });
        });
    };

    return getYearModules(yearCode).then((yearModules) => {
        var semesterModules = yearModules.filter((module) => {
            return module.semesters.includes(semester);
        });

        return { modules: semesterModules };
    });
});

exports.setUserModules = functions.https.onCall((data, context) => {
    const modules = data.modules;
    const uid = context.auth.uid;
    admin.firestore().collection("users").doc(uid).set({
        modules: modules
    }, {merge: true})
    .then(() => {
        console.log("Modules updated for user " + uid);
        return { success: true };
    })
    .catch((error) => {
        console.error("Error updating modules for user " + uid + " " + error);
        return { success: false };
    });
});

exports.setUserPriorities = functions.https.onCall((data, context) => {
    const priorities = data.priorities;
    const uid = context.auth.uid;
    admin.firestore().collection("users").doc(uid).set({
        priorities: priorities
    }, {merge: true})
    .then(() => {
        console.log("Priorities updated for user " + uid);
        return { success: true };
    })
    .catch((error) => {
        console.error("Error updating priorities for user " + uid + " " + error);
        return { success: false };
    });
});

exports.createUser = functions.https.onCall((data, context) => {
    const userId = data.userId;
    const uid = context.auth.uid;
    admin.firestore().collection("users").doc(uid).set({
        userId: userId,
        dateCreated: admin.firestore.FieldValue.serverTimestamp()
    }, {merge: true})
    .then(() => {
        console.log("User with userId " + userId + " created: " + uid);
        return { success: true };
    })
    .catch((error) => {
        console.error("Error creating user " + uid + " " + error);
        return { success: false };
    });
});

exports.getTimetable = functions.https.onCall((data, context) => {
    const timetableId = data.timetableId;
    var timetableRef = admin.firestore().collection("timetables").doc(timetableId);
    return timetableRef.get().then((doc) => {
        if (doc.exists) {
            return doc.data();
        } else {
            return console.error("No such timetable");
        }
    }).catch((error) => {
        console.error("Error getting timetable: " + error);
    });
});

exports.saveTimetable = functions.https.onCall((data, context) => {
    const timetable = data.timetable;
    const timetableId = data.timetableId;
    const uid = context.auth.uid;

    // Set timetable in timetables collection if it doesn't yet exist
    const userRef = admin.firestore().collection("users").doc(uid);
    var userId;
    userRef.get()
        .then((doc) => {
            if (doc.exists) {
                userId = doc.data().userId;
            } else {
                userId = "Anonymous";
            }
            return userId;
        }).catch((error) => { console.log(error); });
    const timetableRef = admin.firestore().collection("timetables").doc(timetableId);
    timetableRef.get()
        .then((docSnapshot) => {
            if (! docSnapshot.exists) {
                admin.firestore().collection("timetables").doc(timetableId).set({
                    timetableId: timetableId,
                    timetable: timetable,
                    owner: userId,
                    dateModified: admin.firestore.FieldValue.serverTimestamp()
                });
                console.log("Timetable owned by " + userId + " set with ID: " + timetableId);
            }
            return timetableId;
        })
        .catch((error) => { console.log(error); });

    // Save timetableId to users collection
    admin.firestore().collection("users").doc(uid).set({
        timetables: admin.firestore.FieldValue.arrayUnion(timetableId)
    }, {merge: true})
    .then(() => {
        console.log("Timetable saved for user " + uid);
        return { success: true };
    })
    .catch((error) => {
        console.error("Error saving timetable for user " + uid + " " + error);
        return { success: false };
    });
});

function scoreTimetable(timetable) {

}