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
    const timezoneoffsetstring = '+0' + timezoneOffset / -60 + ':00';
    return new Date(now.getTime() - offsetMs).toISOString().replace('Z', timezoneoffsetstring);
}


exports.insertModel = function (type) {
    const mod = {
        time: getTime(),
        status: 'pending',
        type: type,
    };
    return new Promise(function (resolve, reject) {
        dataBase.insert(mod, function (err, doc) {
            if (err)
                reject(err);
            else
                resolve(doc._id);
        });
    });
};

exports.delete = async function (id) {
    return exports.getModel(id)
        .then(() => dataBase.remove({_id: id}));
};
exports.updateDetector = (id, detector) => {
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
    return new Promise(function (resolve, reject) {
        dataBase.find({}, (err, doc) => {
            if (err)
                reject(err);
            else {
                let mods = [];
                doc.forEach(u => mods.push({model_id: u._id, upload_time: u.time, status: u.status}));
                resolve(mods);
            }
        });
    });
};

exports.getDetector = function (id) {
    return new Promise(function (resolve, reject) {
        dataBase.findOne({_id: id}, (err, docs) => {
            if (err)
                reject(err);
            else if (docs === null)
                reject('model not found');
            else
                resolve({detector: docs.detector, type: docs.type});
        });
    });
};

exports.getModel = function (id) {
    return new Promise(function (resolve, reject) {
        dataBase.findOne({_id: id}, function (err, model) {
            if (err) {
                reject(err);
                return;
            }
            if (model === null) {
                reject('model not found');
                return;
            }
            resolve({model_id: model._id, upload_time: model.time, status: model.status});
        });
    });
};