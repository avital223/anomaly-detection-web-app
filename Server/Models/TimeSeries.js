class TimeSeries {

    constructor(data) {
        this.data = data;
        this.names = [];
        for (const d in this.data) {
            this.names.push(d);
        }
    }

    getFeatureNames() {
        return this.names;
    };

    getFeatureData(name) {
        return this.data[name];
    };
}

module.exports = TimeSeries;