const optionDelete = {
    method: 'DELETE'
};

let type = 'hybride';
let id;

addNewModel = function (type, data) {
    const optionPost = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    };
    fetch(`/api/model?model_type=${type}`, optionPost).then(res => res.json()).then(console.log);
};
getDetectorByID = function (id) {
    fetch(`/api/model?model_id=${id}`).then(res => {
        res.json().then(console.log);
    });

};
deleteModelByID = function (id) {
    fetch(`/api/model?model_id=${id}`, optionDelete).then(() => {
        console.log('deleted');
    });
};
getModels = function () {
    let models;
    fetch('/api/models').then((result) => {
        models = result.json();
        return models;
    }).then(printRes);
};
printRes = function (result) {
    for (let i = 0; i < result.models.length; i++) {
        console.log(result.models[i]);
    }
};

detect = function (id, data) {

    const optionPostDetect = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    };
    fetch(`/api/anomaly?model_id=${id}`, optionPostDetect).then(res => {
        res.json().then(console.log);
    });
};
