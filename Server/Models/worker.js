const workerPool = require('workerpool');

const TimeSeries = require('./TimeSeries');
const HybridAnomalyDetector = require('./HybridAnomalyDetector');
const SimpleAnomalyDetector = require('./SimpleAnomalyDetector');

/**
 * @description a builder that convert the detector from the database to a workable one
 * @param type  the type of the detector
 * @param detector the database detector to convert
 * @returns {HybridAnomalyDetector|SimpleAnomalyDetector} a converter workable detector
 */
createAd = function (type, detector) {
    switch (type) {
        case 'hybrid':
            return new HybridAnomalyDetector(detector);
        case 'regression':
            return new SimpleAnomalyDetector(detector);
        default:
            return undefined;
    }
};

/**
 *
 * @param data the train data
 * @param detector the detector
 * @returns {Promise<HybridAnomalyDetector|SimpleAnomalyDetector>} a trained detector with data
 */
async function train(data, detector) {
    const ts = new TimeSeries(data);
    detector = createAd(detector.type);
    await detector.learnNormal(ts);
    return detector;
}

/**
 *
 * @param data the data to analyze
 * @param detector the detector
 * @returns {Promise<{names: [], anomalies: FlatArray<*[], number>[]}>} the anomalies detected and all the features name
 */
async function detect(data, detector) {
    const ts = new TimeSeries(data);
    detector = createAd(detector.type, detector.detector);
    const anomalies = await detector.detect(ts);
    const names = ts.getFeatureNames();
    return {anomalies, names};
}

workerPool.worker({
    train: train,
    detect: detect
});