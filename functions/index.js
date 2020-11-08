const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

const moduleData = require('./moduleData');
const { v4: uuid } = require('uuid');

//const loginUser = require('./users')
//app.post('/login', loginUser);

exports.setUserSemester = functions.https.onCall(async (data, context) => {
    if (!("year" in data) || !("semester" in data)) {
        console.log(data, new Error("data does not have year or semester"));
        return {success: false};
    }
    await admin.firestore().collection("users").doc(context.auth.uid).set({
        year: data.year,
        semester: data.semester
    }, {merge: true});
    return {success: true};
});

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
    return {success: true, modules: await moduleData.getModuleListSemester(user.year, user.semester)};
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
        console.error(error);
        console.log("Error updating modules for user " + uid);
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
        console.error(error);
        console.log("Error updating priorities for user " + uid);
        return { success: false };
    });
});

exports.getUserSemester = functions.https.onCall((data, context) => {
    const uid = context.auth.uid;
    var userRef = admin.firestore().collection("users").doc(uid);
    return userRef.get().then((doc) => {
        if (doc.exists && doc.data().semester !== null && doc.data().year !== null) {
            var semester = doc.data().semester;
            var year = doc.data().year;
            return { year: year, semester: semester };
        } else {
            return { year: 0, semester: 0 };
        }
    }).catch((error) => {
        console.log("No year and semester saved for user " + uid);
    });
});

exports.getUserModules = functions.https.onCall((data, context) => {
    const uid = context.auth.uid;
    var userRef = admin.firestore().collection("users").doc(uid);
    return userRef.get().then((doc) => {
        if (doc.exists && doc.data().modules !== null) {
            var modules = doc.data().modules;
            return { modules: modules };
        } else {
            return { modules: [] };
        }
    }).catch((error) => {
        console.log("No modules saved for user " + uid);
    });
});

exports.getUserPriorities = functions.https.onCall((data, context) => {
    const uid = context.auth.uid;
    var userRef = admin.firestore().collection("users").doc(uid);
    return userRef.get().then((doc) => {
        if (doc.exists && doc.data().priorities !== null) {
            var priorities = doc.data().priorities;
            return { priorities: priorities };
        } else {
            return { priorities: [] };
        }
    }).catch((error) => {
        console.log("No priorities saved for user " + uid);
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
        console.error(error);
        console.log("Error creating user record " + uid);
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
            return null;
        }
    }).catch((error) => {
        console.log("Error getting timetable: " + error);
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
        console.error(error);
        console.log("Error setting default timetable for user " + uid);
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
            return null;
        }
    }).catch((error) => {
        console.log("No default timetable: " + error);
    });
});

exports.getSavedTimetables = functions.https.onCall((data, context) => {
    const uid = context.auth.uid;
    var userRef = admin.firestore().collection("users").doc(uid);
    return userRef.get().then((doc) => {
        if (doc.exists && doc.data().savedTimetables !== null) {
            return doc.data().savedTimetables;
        } else {
            return [];
        }
    }).catch((error) => {
        console.log("No saved timetables: " + error);
    });
});

exports.getSubscribedTimetables = functions.https.onCall((data, context) => {
    const uid = context.auth.uid;
    var userRef = admin.firestore().collection("users").doc(uid);
    return userRef.get().then((doc) => {
        if (doc.exists && doc.data().subscribedTimetables !== null) {
            return doc.data().subscribedTimetables;
        } else {
            return [];
        }
    }).catch((error) => {
        console.log("No subscribed timetables: " + error);
    });
});

exports.saveTimetable = functions.https.onCall((data, context) => {
    const timetable = data.timetable;
    const timetableId = uuid();
    const uid = context.auth.uid;

    // Set timetable in timetables collection
    admin.firestore().collection("timetables").doc(timetableId).set({
        timetableId: timetableId,
        timetable: timetable,
        owner: uid,
        dateModified: admin.firestore.FieldValue.serverTimestamp()
    })
    .then(() => {
        console.log("Timetable saved with ID: " + timetableId);
    })
    .catch((error) => {
        console.error(error);
        console.log("Error saving timetable " + timetableId);
        return { success: false };
    });

    // Save timetableId to users collection
    admin.firestore().collection("users").doc(uid).set({
        savedTimetables: admin.firestore.FieldValue.arrayUnion(timetableId)
    }, {merge: true})
    .then(() => {
        console.log("Timetable saved for user " + uid);
        return { success: true };
    })
    .catch((error) => {
        console.error(error);
        console.log("Error saving timetable for user " + uid);
        return { success: false };
    });
    return { timetableId: timetableId };
});

exports.unsaveTimetable = functions.https.onCall((data, context) => {
    const timetableId = data.timetableId;
    const uid = context.auth.uid;

    // Delete timetable document timetables collection
    admin.firestore().collection("timetables").doc(timetableId).delete()
    .then(() => {
        console.log("Timetable deleted: " + timetableId);
        return { success: true };
    })
    .catch((error) => {
        console.error(error);
        console.log("Error deleting timetable " + timetableId);
        return { success: false };
    });

    // Remove timetableId from users savedTimetables
    admin.firestore().collection("users").where("savedTimetables", "array-contains", timetableId).get()
        .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                doc.ref.set({
                    savedTimetables: admin.firestore.FieldValue.arrayRemove(timetableId)
                }, {merge: true})
                .then(() => {
                    console.log("Saved timetable " + timetableId + " removed for user " + uid);
                    return { success: true };
                })
            })
            .catch((error) => {
                console.error(error);
                console.log("Error removing saved timetable " + timetableId + " for user " + uid);
                return { success: false };
            });;
            return timetableId;
        })
        .catch((error) => {
            console.error(error);
            console.log("Error removing saved timetable " + timetableId);
        });

    // Remove timetableId from users subscribedTimetables
    admin.firestore().collection("users").where("subscribedTimetables", "array-contains", timetableId).get()
        .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                doc.ref.set({
                    subscribedTimetables: admin.firestore.FieldValue.arrayRemove(timetableId)
                }, {merge: true})
                .then(() => {
                    console.log("Subscribed timetable " + timetableId + " removed for user " + uid);
                    return { success: true };
                })
            })
            .catch((error) => {
                console.error(error);
                console.log("Error removing subscribed timetable " + timetableId + " for user " + uid);
                return { success: false };
            });;
            return timetableId;
        })
        .catch((error) => {
            console.error(error);
            console.log("Error removing subscribed timetable " + timetableId);
        });

    return { timetableId: timetableId };
});

exports.subscribeToTimetable = functions.https.onCall((data, context) => {
    const timetableId = data.timetableId;
    const uid = context.auth.uid;
    admin.firestore().collection("users").doc(uid).set({
        subscribedTimetables: admin.firestore.FieldValue.arrayUnion(timetableId)
    }, {merge: true})
    .then(() => {
        console.log("User " + uid + " subscribed to timetable " + timetableId);
        return { success: true };
    })
    .catch((error) => {
        console.error(error);
        console.log("Error subscribing to timetable " + timetableId);
        return { success: false };
    });
    return { timetableId: timetableId };
});

exports.unsubscribeFromTimetable = functions.https.onCall((data, context) => {
    const timetableId = data.timetableId;
    const uid = context.auth.uid;
    admin.firestore().collection("users").doc(uid).update({
        subscribedTimetables: admin.firestore.FieldValue.arrayRemove(timetableId)
    })
    .then(() => {
        console.log("User " + uid + " unsubscribed from timetable " + timetableId);
        return { success: true };
    })
    .catch((error) => {
        console.error(error);
        console.log("Error unsubscribing from timetable " + timetableId);
        return { success: false };
    });
    return { timetableId: timetableId };
});