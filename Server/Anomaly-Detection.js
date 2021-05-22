const db = require('./database');

const {Worker} = require('worker_threads');

let result_;

anomaly = {
    speed: [1, 2, 5, 1.4],
    deg: [10000, 10000, 10000, 10000.541]
};

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
                unified.push(p);
            }
        }
        reports.push({[name]: unified, reason: ''});
    }
    return reports;
};
exports.removeModel = function (model_id) {
    db.delete(model_id);
};

exports.loadDB = function () {
    db.loadDatabase();
};

exports.insertAd = async function (type) {
    return db.insertModel({detectorType: type}).then(result => result);
};


exports.getModels = function () {
    return db.getModels().then(models => models);
};

exports.train = async function (data, model_id) {
    const worker = new Worker('./Server/worker.js');
    //Listen for a message from worker
    worker.on('message', result => {
        db.updateDetector(model_id, result);
    });

    worker.on('error', error => {
        console.log(error);
    });
    worker.postMessage({msg: 'train', data: {data, model_id}});
};

exports.getModel = function (model_id) {
    return db.getModel(model_id);
};


exports.detect = async function (model_id, data, callback) {
    const worker = new Worker('./Server/worker.js');
    //Listen for a message from worker
    worker.on('message', result => {
        if (result.ans.length)
            callback(unifyReport(result.ans, result.names));
    });

    worker.on('error', error => {
        console.log(error);
    });
    worker.postMessage({msg: 'detect', data: {data, model_id}});
};


exports.getResult = function () {
    return result_;
};

