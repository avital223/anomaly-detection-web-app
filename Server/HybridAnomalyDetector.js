const Circle = require('./micCircle');
const SimpleAnomalyDetector = require('./SimpleAnomalyDetector');


class HybridAnomalyDetector extends SimpleAnomalyDetector {

    constructor() {
        super();
    }

    toPush(cf) {
        return Math.abs(cf.correlation) > 0.5;
    }

    getDistance(correlatedFeatures, point) {
        if (super.toPush(correlatedFeatures)) {
            return super.getDistance(correlatedFeatures, point);
        } else
            return Circle.distance(point, correlatedFeatures.min_circle.center);
    }


    fillCF(cf, points) {
        if (Math.abs(cf.correlation) > this.correlationThreshold) {
            super.fillCF(cf, points);
            return;
        }
        if (Math.abs(cf.correlation) > 0.5) {
            const cf1 = cf;
            cf1.min_circle = Circle.findMinCircle(points);
            cf1.threshold = cf1.min_circle.radius * 1.1;
            cf = cf1;
        }
    }
}

module.exports = HybridAnomalyDetector;