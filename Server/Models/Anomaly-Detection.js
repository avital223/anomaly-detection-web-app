const db = require('./database');
const util = require('./anomaly_detection_util');
const workerPool = require('workerpool');
let pool;

// a function that gets a list of anomalies and a list of the features names and make a unified report
unifyReport = function (anomalies_full, names) {
    const reports = [];
    // making the report for all the data columns
    for (const name of names) {
        const unified = [];
        const reasons = [];
        const p = {start: 0, end: 0};
        const anomalies = anomalies_full.filter((a) => a.feature1 === name || a.feature2 === name);
        let reason = '';
        let devs = [];
        for (let i = 0; i < anomalies.length; i++) {
            const anomaly = anomalies[i];
            const prevAnomaly = anomalies[i - 1];
            const nextAnomaly = anomalies[i + 1];
            const ts = anomaly.timeSteps;
            if (i === 0 || (anomaly.feature1 !== prevAnomaly.feature1 || anomaly.feature2 !== prevAnomaly.feature2) || ts !== prevAnomaly.timeSteps + 1) {
                p.start = ts;
                reason = anomaly.feature1 === name ? anomaly.feature2 : anomaly.feature1;
            }
            devs.push(anomaly.dev);
            if (i === anomalies.length - 1 || (anomaly.feature1 !== nextAnomaly.feature1 || anomaly.feature2 !== nextAnomaly.feature2) || ts !== nextAnomaly.timeSteps - 1) {
                p.end = ts + 1;
                unified.push({start: p.start, end: p.end});
                const stats = util.stats(devs);
                reasons.push({
                    otherFeature: reason,
                    maxDev: stats.max,
                    minDev: stats.min,
                    avgDev: stats.avg
                });
                devs = [];
            }
        }
        reports.push({[name]: unified, reason: reasons});
    }
    return reports;
};

// removes a model with model_id from the database
exports.removeModel = function (model_id) {
    return db.delete(model_id);
};


// initialize the Anomaly Detection unit
exports.init = function () {
    // loading the database
    db.loadDatabase();

    // initialize a worker pool
    pool = workerPool.pool('./Server/worker.js', {
        maxQueueSize: 20
    });
};

// creating a new detector with a given type
exports.insertAd = async function (type) {
    return db.insertModel(type);
};

// closing all the used data
exports.close = async function () {
    pool.terminate();
};

// return all the model in the database
exports.getModels = function () {
    return db.getModels().then(models => models);
};

// train the model with model id with the data given
exports.train = async function (model_id, data) {
    const ad = await db.getDetector(model_id);
    pool.proxy()
        .then(worker => worker.train(data, ad))
        .then(ad => db.updateDetector(model_id, ad));
};

// return the model with model_id
exports.getModel = function (model_id) {
    return db.getModel(model_id);
};

// trying to detect anomalies in the data based on the already trained model with model_id and return the result through a callback
exports.detect = async function (model_id, data, callback) {
    const ad = await db.getDetector(model_id);
    pool.proxy()
        .then(worker => worker.detect(data, ad))
        .then(result => callback(unifyReport(result.anomalies, result.names)));
};

