const https = require('https');
const admin = require('firebase-admin');

exports.getModuleListSemester = async (year, semester) => {
    return JSON.parse(await exports.getModuleList(year)).filter(mod => mod.semesters.includes(semester));
}

exports.getModuleList = async year => {
    const docRef = admin.firestore().collection("moduleList").doc(year);
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
        const options = {
            host: 'api.nusmods.com',
            path: `/v2/${year}/moduleList.json`
        };

        https.request(options, response => {
            let str = '';

            //another chunk of data has been received, so append it to `str`
            response.on('data', chunk => (str += chunk));

            //the whole response has been received, so we just return it
            response.on('end', () => resolve(str));
        }).end();
    });
};
