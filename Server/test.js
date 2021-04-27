const TimeSeries = require('./TimeSeries');
const HybridAnomalyDetector = require('./HybridAnomalyDetector');
const SimpleAnomalyDetector = require('./SimpleAnomalyDetector');

anomaly = {
    speed: [1, 2, 5, 1.4],
    deg: [10000, 10000, 10000, 10000.541]
}
const detectors = []


unifyReport = function (anomalies) {
    unified = [];
    const p = { first: 0, last: 0 };
    for (let i = 0; i < anomalies.length; i++) {
        const anomaly = anomalies[i];
        const prevAnomaly = anomalies[i - 1];
        const nextAnomaly = anomalies[i + 1];
        const ts = anomaly.timeSteps;
        if (i == 0 || (anomaly.feature1 != prevAnomaly.feature1 || anomaly.feature2 != prevAnomaly.feature2) || ts != prevAnomaly.timeSteps + 1) {
            p.first = ts;
        }
        if (i == anomalies.length - 1 || (anomaly.feature1 != nextAnomaly.feature1 || anomaly.feature2 != nextAnomaly.feature2) || ts != nextAnomaly.timeSteps - 1) {
            p.last = ts + 1;
            unified.push(p)
        }
    }
    return unified;
}

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
    const model = {
        ad: ad,
        model_id: detectors.length,
        upload_time: new Date().toISOString(),
        status: 'pending'
    };
    detectors.push(model);
    return model;
}

exports.train = async function (data, model_id) {
    const ts = new TimeSeries(data);
    detectors[model_id].ad.learnNormal(ts).then(() => {
        detectors[model_id].status = 'ready';
    });

    exports.getModel = function (model_id) {
        return detectors[model_id];
    }

}