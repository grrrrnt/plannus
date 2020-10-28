const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

//const loginUser = require('./users')
//app.post('/login', loginUser);

var request = require('request');
var bodyParser = require('body-parser');

//exports.helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

exports.retrieveModules = functions.https.onCall((data, context) => {
    var startYear = data.year;
    var endYear = startYear + 1;
    var semester = data.semester;
    var yearCode = startYear.toString() + "-" + endYear.toString();

    var getYearModules = function (yearCode) {
        return new Promise(function (resolve, reject) {
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
    db.collection("users").doc(uid).update({
        modules: modules
    })
    .then(function() {
        console.log("Modules updated for user " + uid);
        return { success: true };
    })
    .catch(function(error) {
        console.error("Error updating modules for user " + uid + " " + error);
        return { success: false };
    });
});

exports.setUserPriorities = functions.https.onCall((data, context) => {
    const priorities = data.priorities;
    const uid = context.auth.uid;
    db.collection("users").doc(uid).update({
        priorities: priorities
    })
    .then(function() {
        console.log("Priorities updated for user " + uid);
        return { success: true };
    })
    .catch(function(error) {
        console.error("Error updating priorities for user " + uid + " " + error);
        return { success: false };
    });
});

exports.saveTimetable = functions.https.onCall((data, context) => {
    const timetable = data.timetable;
    const uid = context.auth.uid;

    // Set timetable in timetables record
    var timetableId = db.collection("admin").doc("timetables").get("idGenerator");
    timetableId++;
    timetableId = "timetable" + timetableId.toString();
    db.collection("admin").doc("timetables").update("idGenerator", FieldValue.increment(1));
    db.collection("timetables").doc(timetableId).set({
        timetableId: timetableId,
        timetable: timetable,
        owner: uid,
        dateModified: admin.database.ServerValue.TIMESTAMP
    });

    // Save timetable to users record
    db.collection("users").doc(uid).update({
        timetables: firebase.firestore.FieldValue.arrayUnion(timetableId)
    })
    .then(function() {
        console.log("Timetable saved for user " + uid);
        return { success: true };
    })
    .catch(function(error) {
        console.error("Error saving timetable for user " + uid + " " + error);
        return { success: false };
    });
});

function scoreTimetable(timetable) {

}