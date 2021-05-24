const db = require('./database');

const workerPool = require('workerpool');
let pool;


unifyReport = function (anomalies_full, names) {
    const reports = [];
    for (const name of names) {
        const unified = [];
        const p = {start: 0, end: 0};
        const anomalies = anomalies_full.filter((a) => a.feature1 === name || a.feature2 === name);
        for (let i = 0; i < anomalies.length; i++) {
            const anomaly = anomalies[i];
            const prevAnomaly = anomalies[i - 1];
            const nextAnomaly = anomalies[i + 1];
            const ts = anomaly.timeSteps;
            if (i === 0 || (anomaly.feature1 !== prevAnomaly.feature1 || anomaly.feature2 !== prevAnomaly.feature2) || ts !== prevAnomaly.timeSteps + 1) {
                p.start = ts;
            }
            if (i === anomalies.length - 1 || (anomaly.feature1 !== nextAnomaly.feature1 || anomaly.feature2 !== nextAnomaly.feature2) || ts !== nextAnomaly.timeSteps - 1) {
                p.end = ts + 1;
                unified.push({start: p.start, end: p.end});
            }
        }
        reports.push({[name]: unified, reason: ''});
    }
    return reports;
};
exports.removeModel = function (model_id) {
    db.delete(model_id);
};

exports.init = function () {
    db.loadDatabase();
    pool = workerPool.pool('./Server/worker.js', {
        maxQueueSize: 20
    });
};

exports.insertAd = async function (type) {
    return db.insertModel(type).then(result => result);
};

exports.close = async function (type) {
    pool.terminate();
};


exports.getModels = function () {
    return db.getModels().then(models => models);
};


exports.train = async function (model_id, data) {
    const ad = await db.getDetector(model_id);
    pool.proxy()
        .then(worker => worker.train(data, ad))
        .then(ad => db.updateDetector(model_id, ad));
};

exports.getModel = function (model_id) {
    return db.getModel(model_id);
};


exports.detect = async function (model_id, data, callback) {
    const ad = await db.getDetector(model_id);
    pool.proxy()
        .then(worker => worker.detect(data, ad))
        .then(result => {
            if (result.ans.length) {
                //console.log(result);
                callback(unifyReport(result.ans, result.names));
            }
        });
};

