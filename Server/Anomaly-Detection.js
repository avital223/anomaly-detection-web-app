const TimeSeries = require('./TimeSeries');

const HybridAnomalyDetector = require('./HybridAnomalyDetector');

const SimpleAnomalyDetector = require('./SimpleAnomalyDetector');

const db = require('./database');


anomaly = {
    speed: [1, 2, 5, 1.4],
    deg: [10000, 10000, 10000, 10000.541]
};

unifyReport = function (anomalies_full, ts) {
    const names = ts.getFeatureNames();
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
            if (i === anomalies.length - 1 || (anomaly.feature1 !== nextAnomaly.feature1 || anomaly.feature2 !== nextAnomaly.feature2) || ts != nextAnomaly.timeSteps - 1) {
                p.end = ts + 1;
                unified.push(p);
            }
        }
        reports.push({[name]: unified});
    }
    return reports;
};
exports.removeModel = function (model_id) {
    db.delete(model_id);
};

exports.loadDB = function () {
    db.loadDatabase();
};

exports.createAd = function (type) {
    let ad;
    switch (type) {
        case 'hybrid':
            ad = new HybridAnomalyDetector();
            break;
        case 'regression':
            ad = new SimpleAnomalyDetector();
            break;
        default:
            return;
    }
    const ans = db.insertModel(ad);
    console.log(ans);
    return ans;
};

exports.getModels = function () {
    return db.getModels();
};

exports.train = function (data, model_id) {
    const ts = new TimeSeries(data);
    const ad = db.getDetector(model_id);
    console.log(ad);
    ad.learnNormal(ts).then(() => {
        db.update(model_id, ad);
    });
};

exports.getModel = function (model_id) {
    return db.getModels(model_id);
};

exports.detect = function (model_id, data) {
    const ad = db.getDetector(model_id);
    const ts = new TimeSeries(data);
    const ans = ad.detect(ts);
    if (ans.length)
        return unifyReport(ans, ts);
};
