class TimeSeries {

    constructor(data) {
        this.data = data;

    }

    getFeatureNames() {
        const names = [];
        for (let d in this.data) {
            names.push(d);
        }
        return names;
    };

    getFeatureData(name) {
        return this.data[name];
    };
}

module.exports = TimeSeries;