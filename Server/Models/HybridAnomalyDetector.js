const Circle = require('./micCircle');
const SimpleAnomalyDetector = require('./SimpleAnomalyDetector');


class HybridAnomalyDetector extends SimpleAnomalyDetector {
    /**
     *
     * @param detector
     */
    constructor(detector) {
        super(detector);
    }

    /**
     * @inheritDoc
     */
    toPush(cf) {
        return Math.abs(cf.correlation) > 0.5;
    }

    /**
     * @inheritDoc
     */
    getDistance(correlatedFeatures, point) {
        if (super.toPush(correlatedFeatures)) {
            return super.getDistance(correlatedFeatures, point);
        } else
            return Circle.distance(point, correlatedFeatures.min_circle.center);
    }

    /**
     * @inheritDoc
     */
    fillCF(cf, points) {
        if (Math.abs(cf.correlation) > this.correlationThreshold) {
            super.fillCF(cf, points);
        } else if (Math.abs(cf.correlation) > 0.5) {
            cf.min_circle = Circle.findMinCircle(points);
            cf.threshold = cf.min_circle.radius * 1.1;
        }
    }
}

module.exports = HybridAnomalyDetector;