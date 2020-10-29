const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

const moduleData = require('./moduleData');

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
 exports.helloWorld = functions.https.onRequest((request, response) => {
   functions.logger.info("Hello logs!", {structuredData: true});
   response.send("Hello from Firebase!");
 });

exports.setUserSemester = functions.https.onCall(async (data, context) => {

});

exports.retrieveModules = functions.https.onCall(async (data, context) => {
    console.log("auth", context.auth);
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
    const year = user.year.replace("/", "-");
    return {success: true, data: moduleData.getModuleListSemester(year, user.semester)};
});
