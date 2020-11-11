const admin = require('firebase-admin');
const request = require('request');

const cacheDurationMs = 600000;

exports.getModuleListSemester = async (year, semester) =>
    JSON.parse(await exports.getModuleListString(year)).filter(mod => mod.semesters.includes(semester));

exports.getModuleListString = async year =>
    cachedRequest(() => exports.requestModuleListString(year), `${year}-moduleList`);

exports.requestModuleListString = year =>
    requestUrl(`https://nusmods.com/api/v2/${year}-${year + 1}/moduleList.json`);

exports.getModule = async (year, code) => JSON.parse(await exports.getModuleString(year, code));

exports.getModuleString = async (year, code) =>
    cachedRequest(() => exports.requestModuleString(year, code), `${year}-modules-${code}`);

exports.requestModuleString = (year, code) =>
    requestUrl(`https://nusmods.com/api/v2/${year}-${year + 1}/modules/${code}.json`);

async function cachedRequest(requestData, doc) {
    const docRef = admin.firestore().collection("cache").doc(doc);
    const cache = await docRef.get();
    if (cache.exists) {
        const data = cache.data();
        if (Date.now() - data.updated.toMillis() < cacheDurationMs) {
            console.log(doc, Date.now() - data.updated.toMillis());
            return data.data;
        }
    }
    const data = await requestData();
    await docRef.set({
        data: data,
        updated: admin.firestore.Timestamp.fromDate(new Date())
    }, {merge: true});
    return data;
}

function requestUrl(url) {
    return new Promise((resolve, reject) => {
        request(url, (err, res, body) => {
            if (err) {
                console.log(err);
                reject(err);
            } else {
                resolve(body);
            }
        });
    });
}
