const TimeSeries = require('./TimeSeries');

const HybridAnomalyDetector = require('./HybridAnomalyDetector');

const SimpleAnomalyDetector = require('./SimpleAnomalyDetector');
anomaly = {
    speed: [1, 2, 5, 1.4],
    deg: [10000, 10000, 10000, 10000.541]
};
const detectors = [];

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
    if (model_id < detectors.length)
        detectors.splice(model_id, 1);
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
            break;
    }
    const now = new Date();
    const timezoneOffset = now.getTimezoneOffset();
    const offsetMs = timezoneOffset * 60 * 1000;
    const timezoneoffsetstring = '+0' + timezoneOffset / -60 + '.00';
    const dateLocal = new Date(now.getTime() - offsetMs).toISOString().replace('Z', timezoneoffsetstring);
    const model = {
        ad: ad,
        model_id: detectors.length,
        upload_time: dateLocal,
        status: 'pending'
    };
    detectors.push(model);
    return model;
};

exports.getModels = function () {
    return detectors;
};

exports.train = function (data, model_id) {
    const ts = new TimeSeries(data);
    detectors[model_id].ad.learnNormal(ts).then(() => {
        detectors[model_id].status = 'ready';
    });

    exports.getModel = function (model_id) {
        return detectors[model_id];
    };
};

exports.detect = function (model_id, data) {
    const model = detectors[model_id];
    const ad = model.ad;
    const ts = new TimeSeries(data);
    const ans = ad.detect(ts);
    console.log(ans);
    if (ans)
        return unifyReport(ans, ts);
};
