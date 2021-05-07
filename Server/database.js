const Datastore = require('nedb');
let dataBase;


exports.loadDatabase = function () {
    dataBase = new Datastore({filename: 'modules.db'});
    dataBase.loadDatabase();
};

function getTime() {
    const now = new Date();
    const timezoneOffset = now.getTimezoneOffset();
    const offsetMs = timezoneOffset * 60 * 1000;
    const timezoneoffsetstring = '+0' + timezoneOffset / -60 + '.00';
    return new Date(now.getTime() - offsetMs).toISOString().replace('Z', timezoneoffsetstring);
}

// todo not returns ID
exports.insertModel = function (detector) {
    const mod = {
        time: getTime(),
        status: 'pending',
        detector: detector
    };
    return dataBase.insert(mod, function (err, doc) {
        return doc._id;
    });
};

exports.delete = function (id) {
    dataBase.remove({_id: id});
};
exports.update = function (id, detector) {
    dataBase.update(
        {_id: id},
        {$set: {detector: detector, status: 'ready'}},
        {},
        (err, numReplaced) => {
            console.log('replaced---->' + numReplaced);
        }
    );
};

exports.getModels = function () {
    const models = dataBase.find({});
    let retModels = [];
    models.forEach((u) => {
        retModels.push({model_id: u._id, upload_time: u.time, status: u.status});
    });
    return retModels;
};

// todo doesn't returns a detector
exports.getDetector = function (id) {
    const model = dataBase.find({_id: id});
    if (model.status === 'pending') {
        return {};
    }
    return model.detector;
};

// todo should be getModel not getModels
exports.getModels = function (id) {
    const model = dataBase.find({_id: id});
    return {model_id: model._id, upload_time: model.time, status: model.status};
};