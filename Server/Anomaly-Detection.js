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

exports.insertAd = async function (type) {
    return db.insertModel({detectorType: type}).then(result => result);
};

createAd = function (type, detector) {
    switch (type) {
        case 'hybrid':
            return new HybridAnomalyDetector(detector);
        case 'regression':
            return new SimpleAnomalyDetector(detector);
        default:
            return;
    }
};

exports.getModels = function () {
    return db.getModels().then(models => models);
};

exports.train = async function (data, model_id) {
    const ts = new TimeSeries(data);
    let ad = await db.getDetector(model_id);
    ad = createAd(ad.type.detectorType);
    ad.learnNormal(ts).then(() => {
        db.updateDetector(model_id, ad);
    });
};

exports.getModel = function (model_id) {
    if (model_id)
        return db.getModel(model_id);
};

exports.detect = async function (model_id, data) {
    let ad = await db.getDetector(model_id);
    console.log(ad);
    console.log(model_id);
    ad = createAd(ad.type.detectorType, ad.detector);
    const ts = new TimeSeries(data);
    const ans = ad.detect(ts);
    if (ans.length)
        return unifyReport(ans, ts);
};