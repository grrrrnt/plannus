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

exports.retrieveModules = functions.https.onCall(async (data, context) => {
    const userDocRef = admin.firestore().collection("users").doc(context.auth.uid);
    const userDoc = await userDocRef.get();
    if (!userDoc.exists) {
        throw new Error("userDoc does not exist");
    }
    const user = userDoc.data();
    if (!("year" in user) || !("semester" in user)) {
        throw new Error("userDoc does not have year or semester");
    }
    const year = user.year.replace("/", "-");
    return moduleData.getModuleListSemester(year, user.semester);
});
