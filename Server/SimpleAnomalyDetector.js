const util = require('./anomaly_detection_util');


class SimpleAnomalyDetector {

    constructor(detector) {
        if (detector) {
            this.correlations = [...detector.correlations];
            this.correlationThreshold = detector.correlationThreshold;
        } else {
            this.correlations = [];
            this.correlationThreshold = 0.9;
        }
    }

    /**
     *
     * @param ts - Time Series with the data to analyze
     * @returns {Promise<FlatArray<*[], number>[]>} all the anomalies found
     */
    async detect(ts) {
        const anomalyReport = [];
        for (const cf of this.correlations) {
            const feature1 = ts.getFeatureData(cf.feature1);
            const feature2 = ts.getFeatureData(cf.feature2);
            if (!feature1 || !feature2)
                continue;
            // make sure to work only with usable data
            const len = Math.min(feature1.length, feature2.length);
            anomalyReport.push(
                Array.from(
                    Array(len).keys())
                    .map((val, i) => ({
                        x: feature1[i],
                        y: feature2[i],
                        i: i
                    }))
                    .filter(p => this.getDistance(cf, p) > cf.threshold)
                    .reduce((acc, p) => {
                        acc.push({
                            feature1: cf.feature1,
                            feature2: cf.feature2,
                            timeSteps: p.i,
                            dev: this.getDistance(cf, p)
                        });
                        return acc;
                    }, []));
        }
        return anomalyReport.flat(1);
    }

    /**
     *
     * @param cf a correlated feature pair
     * @param point a point to check
     * @returns {number} - the distance of the point from correlation
     */
    getDistance(cf, point) {
        return util.dev(point, cf.line_reg);
    }

    /**
     *
     * @param ts a Time Series
     * @param features all the features in the Time Series
     * @param i the place in the features array
     * @returns {{feature2: string, correlation: number, feature1}} a correlated feature pair
     */
    getMaxCorr(ts, features, i) {
        let maxCor = 0;
        let maxFeature = '';
        const feature1 = ts.getFeatureData(features[i]);

        const len = features.length;
        for (let j = i + 1; j < len; j++) {
            const feature2 = ts.getFeatureData(features[j]);
            const correlation = util.pearson(feature1, feature2);
            // creating the points array and the line regression
            if (Math.abs(maxCor) < Math.abs(correlation)) {
                maxCor = correlation;
                maxFeature = features[j];
            }
        }
        return {
            feature1: features[i],
            feature2: maxFeature,
            correlation: maxCor
        };
    }

    /**
     *
     * @param cf - a correlated feature pair
     * @returns {boolean} if the correlated feature is significant enough
     */
    toPush(cf) {
        return Math.abs(cf.correlation) > this.correlationThreshold;
    }

    /**
     * @description adding correlated feature pair to the detector
     * @param ts
     * @param cf
     */
    createCorrelatedFeatures(ts, cf) {
        // creating the data points
        const feature1 = ts.getFeatureData(cf.feature1);
        const feature2 = ts.getFeatureData(cf.feature2);
        const len = Math.min(feature1.length, feature2.length);

        const points = Array.from(Array(len)
            .keys())
            .map(i => ({
                x: feature1[i],
                y: feature2[i]
            }));

        this.fillCF(cf, points);

        this.correlations.push(cf);
    };

    /**
     * @description filling the correlated feature pair with the appropriate data
     * @param cf
     * @param points
     */
    fillCF(cf, points) {
        const line_reg = util.linear_reg(points);
        // calculating the max deviation for all the points
        cf.line_reg = line_reg;
        const max = points.reduce((acc, curr) => {
            const dev = util.dev(curr, line_reg);
            return acc <= dev ? dev : acc;
        }, util.dev(points[0], line_reg));
        cf.threshold = max * 1.5;
    }


    /**
     * @description learn the data and extrapolate the correlation from it
     * @param ts Time Series
     * @returns {Promise<void>}
     */
    async learnNormal(ts) {
        const features = ts.getFeatureNames();
        /* runs from the first feature to the one before last no need to check the
         last one as i check them in pairs */
        for (let i = 0; i < features.length - 1; i++) {
            const cf = this.getMaxCorr(ts, features, i);
            if (this.toPush(cf)) {
                this.createCorrelatedFeatures(ts, cf, i);
            }
        }
    }
}

module.exports = SimpleAnomalyDetector;