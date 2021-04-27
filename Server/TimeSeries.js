
class TimeSeries {

    constructor(data) {
        this.data = data;

    }

    getFeatureNames = function () {
        const names = [];
        for (let d in this.data) {
            names.push(d);
        }
        return names;
    }

    getFeatureData = function (name) {
        return this.data[name];
    }
};

module.exports = TimeSeries;