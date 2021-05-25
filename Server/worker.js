const workerPool = require('workerpool');

const TimeSeries = require('./TimeSeries');
const HybridAnomalyDetector = require('./HybridAnomalyDetector');
const SimpleAnomalyDetector = require('./SimpleAnomalyDetector');

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

async function train(data, ad) {
    const ts = new TimeSeries(data);
    ad = createAd(ad.type);
    await ad.learnNormal(ts);
    return ad;
}

async function detect(data, ad) {
    const ts = new TimeSeries(data);
    ad = createAd(ad.type, ad.detector);
    const anomalies = await ad.detect(ts);
    const names = ts.getFeatureNames();
    return {anomalies, names};
}

workerPool.worker({
    train: train,
    detect: detect
});