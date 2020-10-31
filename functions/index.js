const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

const moduleData = require('./moduleData');

//const loginUser = require('./users')
//app.post('/login', loginUser);

exports.retrieveModules = functions.https.onCall(async (data, context) => {
    const userDocRef = admin.firestore().collection("users").doc(context.auth.uid);
    const userDoc = await userDocRef.get();
    if (!userDoc.exists) {
        console.log(new Error("userDoc does not exist"));
        return {success: false};
    }
    const user = userDoc.data();
    if (!("year" in user) || !("semester" in user)) {
        console.log(new Error("userDoc does not have year or semester"));
        return {success: false};
    }
    return {success: true, data: moduleData.getModuleListSemester(user.year, user.semester)};
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
    const uid = context.auth.uid;
    admin.firestore().collection("users").doc(uid).set({
        dateCreated: admin.firestore.FieldValue.serverTimestamp()
    }, {merge: true})
    .then(() => {
        console.log("User record created: " + uid);
        return { success: true };
    })
    .catch((error) => {
        console.error("Error creating user record " + uid + " " + error);
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

exports.setDefaultTimetable = functions.https.onCall((data, context) => {
    const timetableId = data.timetableId;
    const uid = context.auth.uid;
    admin.firestore().collection("users").doc(uid).set({
        defaultTimetable: timetableId
    }, {merge: true})
    .then(() => {
        console.log("User default timetable set: " + uid);
        return { success: true };
    })
    .catch((error) => {
        console.error("Error setting default timetable for user " + uid + " " + error);
        return { success: false };
    });
});

exports.getDefaultTimetable = functions.https.onCall((data, context) => {
    const uid = context.auth.uid;
    var userRef = admin.firestore().collection("users").doc(uid);
    return userRef.get().then((doc) => {
        if (doc.exists && doc.data().defaultTimetable !== null) {
            return doc.data().defaultTimetable;
        } else {
            return console.error("No default timetable");
        }
    }).catch((error) => {
        console.error("No default timetable: " + error);
    });
});

exports.getSavedTimetables = functions.https.onCall((data, context) => {
    const uid = context.auth.uid;
    var userRef = admin.firestore().collection("users").doc(uid);
    return userRef.get().then((doc) => {
        if (doc.exists && doc.data().timetables !== null) {
            return doc.data().timetables;
        } else {
            return console.error("No saved timetables");
        }
    }).catch((error) => {
        console.error("No saved timetables: " + error);
    });
});

exports.saveTimetable = functions.https.onCall((data, context) => {
    const timetable = data.timetable;
    const timetableId = data.timetableId;
    const uid = context.auth.uid;

    // Set timetable in timetables collection if it doesn't yet exist
    const timetableRef = admin.firestore().collection("timetables").doc(timetableId);
    timetableRef.get()
        .then((docSnapshot) => {
            if (! docSnapshot.exists) {
                admin.firestore().collection("timetables").doc(timetableId).set({
                    timetableId: timetableId,
                    timetable: timetable,
                    owner: uid,
                    dateModified: admin.firestore.FieldValue.serverTimestamp()
                });
                console.log("Timetable set with ID: " + timetableId);
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
