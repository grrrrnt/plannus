const assert = require('assert');
const admin = require('firebase-admin');
const test = require('firebase-functions-test')({
    databaseURL: 'https://plannus-cfd18.firebaseio.com',
    projectId: 'plannus-cfd18',
    storageBucket: 'plannus-cfd18.appspot.com',
}, '../../serviceAccountKey.json');

const myFunctions = require('../index');

const testUid = "testUser";
const docRef = admin.firestore().collection("users").doc(testUid);
const context = { auth: { uid: testUid } };

describe("createUser()", () => {
    const wrapped = test.wrap(myFunctions.createUser);
    const delUser = () => docRef.delete();
    before(delUser);
    after(delUser);
    it("creates a user document", () => {
        return wrapped(undefined, context).then(result => {
            assert.deepEqual(result, { success: true })
            return docRef.get()
        }).then(doc => {
            assert.ok(doc.exists, "document does not exist");
            assert.ok(doc.data().hasOwnProperty("dateCreated"), "document does not have property dateCreated");
            return true;
        });
    });
});

describe("generateTimetables()", () => {
    const wrapped = test.wrap(myFunctions.generateTimetables);
    const data = { modules: ["CS3203", "CS3219"], priorities: [] };
    const userDoc = { year: 2020, semester: 1 };
    beforeEach(() => docRef.set(userDoc));
    after(() => docRef.delete());
    it("checks for priorities", () => {
        return wrapped({ modules: ["CS3203", "CS3219"] }).then(result =>
            assert.deepEqual(result, { success: false })
        );
    });
    it("checks for year", () => {
        return docRef.set({}).then(() =>
            wrapped(data, context)
        ).then(result =>
            assert.deepEqual(result, { success: false })
        );
    });
    it("schedules timetables", () => {
        return wrapped(data, context).then(result => {
            assert.ok(result.success, "result success");
            assert.ok(result.hasOwnProperty("timetables"), "timetables property does not exist");
            assert.ok(result.timetables.length > 0, "result does not have timetables");
            console.log(result.timetables.length);
            return true;
        });
    }).timeout(10000);
    it("sets priorities and modules", () => {
        return wrapped(data, context).then(() =>
            docRef.get()
        ).then(doc =>
            assert.deepEqual(doc.data(), { ...userDoc, ...data })
        )
    });
});
