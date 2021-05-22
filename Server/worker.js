const TimeSeries = require('./TimeSeries');
const db = require('./database');
const HybridAnomalyDetector = require('./HybridAnomalyDetector');
const SimpleAnomalyDetector = require('./SimpleAnomalyDetector');
const {isMainThread, parentPort} = require('worker_threads');

if (!isMainThread) {
    db.loadDatabase();
}


parentPort.on('message', message => {
    const msg = message.msg;
    const data = message.data;
    if (msg === 'train') {
        train(data.data, data.model_id).then(ad => parentPort.postMessage(ad));
    }
    if (msg === 'detect') {
        detect(data.data, data.model_id).then(ans => parentPort.postMessage(ans));
    }
});

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

async function train(data, model_id) {
    if (!isMainThread) {
        const ts = new TimeSeries(data);
        let ad = await db.getDetector(model_id);
        ad = createAd(ad.type.detectorType);
        await ad.learnNormal(ts);
        return ad;
    }
}

async function detect(data, model_id) {
    let ad = await db.getDetector(model_id);
    ad = createAd(ad.type.detectorType, ad.detector);
    const ts = new TimeSeries(data);
    const ans = ad.detect(ts);
    // console.log(ans);
    const names = ts.getFeatureNames();
    return {ans, names};
}