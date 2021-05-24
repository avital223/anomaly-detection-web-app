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


exports.insertModel = async function (type) {
    const mod = {
        time: getTime(),
        status: 'pending',
        type: type,
    };
    let id;
    await new Promise(function (resolve, reject) {
        dataBase.insert(mod, function (err, doc) {
            resolve(doc._id);
        });
    }).then((result) => {
        id = result;
    });
    return id;
};

exports.delete = function (id) {
    dataBase.remove({_id: id});
};
exports.updateDetector = function (id, detector) {
    dataBase.update(
        {_id: id},
        {$set: {detector: detector, status: 'ready'}},
        {},
        (err, numReplaced) => {
            console.log('replaced---->' + numReplaced);
        }
    );
};
exports.getModels = async function () {
    let models;
    await new Promise(function (resolve, reject) {
        dataBase.find({}, function (err, doc) {
            let mods = [];
            doc.forEach(function (u) {
                mods.push({model_id: u._id, upload_time: u.time, status: u.status});
            });
            resolve(mods);
        });
    }).then((result) => {
        models = result;
    });
    return models;
};

exports.getDetector = async function (id) {
    let model;
    await new Promise(function (resolve, reject) {
        dataBase.findOne({_id: id}, function (error, docs) {
            if (docs != null) {
                resolve(docs);
            } else
                resolve({status: 'pending'});
        });
    }).then((result) => {
        model = result;
    });
    // if (model.status === 'pending') {
    //     return {};
    // }
    return {detector: model.detector, type: model.type};
};

exports.getModel = async function (id) {
    let _model;
    await new Promise(function (resolve, reject) {
        dataBase.findOne({_id: id}, function (err, model) {
                if (err) {
                    console.log('err');
                    reject(err);
                    return;
                }
                if (model === null) {
                    reject('model not found');
                    return;
                }
            resolve({model_id: model._id, upload_time: model.time, status: model.status});
        });
    }).then((result) => {
        _model = result;
    });
    return _model;
};