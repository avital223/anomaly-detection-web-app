const util = require("./anomaly_detection_util");


class SimpleAnomalyDetector {

    constructor() {
        this.correlations = [];
        this.correlationThreshold = 0.9
    }

    // virtual vector<AnomalyReport>    
    detect(ts) {
        const anomalyReport = [];
        for (const cf of this.correlations) {
            const feature1 = ts.getFeatureData(cf.feature1);
            const feature2 = ts.getFeatureData(cf.feature2);
            const len = Math.min(feature1.length, feature2.length);

            for (let i = 0; i < len; i++) {
                const p = {
                    x: feature1[i],
                    y: feature2[i]
                }
                if (this.getDistance(cf, p) > cf.threshold) {
                    anomalyReport.push({
                        feature1: cf.feature1,
                        feature2: cf.feature2,
                        timeSteps: i
                    })
                }

            }
            return anomalyReport;
        }
    }

    getDistance(cf, point) {
        return util.dev(point, cf.line_reg);
    }


    getMaxCorr(ts, features, i) {
        let maxCor = 0;
        let maxFeature = "";
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


    toPush(cf) {
        return Math.abs(cf.correlation) > this.correlationThreshold;
    }


    createCorrelatedFeatures = function (ts, cf) {
        // creating the data points
        const feature1 = ts.getFeatureData(cf.feature1);
        const feature2 = ts.getFeatureData(cf.feature2);
        const points = [];
        const len = Math.min(feature1.length, feature2.length);
        for (let i = 0; i < len; i++) {
            points.push({
                x: feature1[i],
                y: feature2[i]
            })
        }
        this.fillCF(cf, points);

        this.correlations.push(cf);
    }

    fillCF(cf, points) {
        const cf1 = cf;
        cf1.line_reg = util.linear_reg(points);

        // calculating the max deviation for all the points
        const line_reg = cf1.line_reg;
        const max = points.reduce((acc, curr) => {
            const dev = util.dev(curr, line_reg);
            return acc <= dev ? dev : acc;
        }, util.dev(points[0], line_reg));
        cf1.threshold = max * 1.5;
        cf = cf1;
    }


    //virtual void 
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