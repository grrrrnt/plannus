const admin = require('firebase-admin');
const request = require('request');

exports.getModuleListSemester = async (year, semester) => {
    return JSON.parse(await exports.getModuleList(year)).filter(mod => mod.semesters.includes(semester));
}

exports.getModuleList = async year => {
    const docRef = admin.firestore().collection("moduleList").doc(year.toString());
    const cache = await docRef.get();
    if (cache.exists) {
        const data = cache.data();
        if (Date.now() - data.updated < 60000) {
            return data.data;
        }
    }
    const list = await exports.requestModuleList(year);
    await docRef.set({
        data: list,
        updated: Date.now()
    }, {merge: true});
    return list;
}

exports.requestModuleList = year => {
    return new Promise((resolve, reject) => {
        request(`https://nusmods.com/api/v2/${year}-${year + 1}/moduleList.json`, (err, res, body) => {
            if (err) {
                console.log(err);
                reject(err);
            } else {
                resolve(body);
            }
        });
    });
};

exports.getModule = async (year, code) => {
    return JSON.parse(await exports.requestModule(year, code));
}

exports.requestModule = (year, code) => {
    return new Promise((resolve, reject) => {
        request(`https://nusmods.com/api/v2/${year}-${year + 1}/modules/${code}.json`, (err, res, body) => {
            if (err) {
                console.log(err);
                reject(err);
            } else {
                resolve(body);
            }
        });
    });
}
