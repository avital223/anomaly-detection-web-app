const data = {
    speed: [1, 2, 3, 4],
    deg: [2, 4, 6, 8]
};
const data1 = {
    speed: [1, 2, 3, 4],
    deg: [10, 31, 72, 641]
};

const optionPost = {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
};
const optionPostDetect = {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify(data1)
};

const optionDelete = {
    method: 'DELETE'
};

let type = 'hybrid';
let id;

addNewModel = function (type) {
    fetch(`/api/model?model_type=${type}`, optionPost).then(res => res.json()).then(model => id = model.model_id);


}
getDetectorByID = function (id) {
    setTimeout(() => fetch(`/api/model?model_id=${id}`).then(res => {
            if (res.ok) {
                res.json().then(console.log);
            } else
                res.text().then(console.log);
        }),
        2500);

}
deleteModelByID = function (id) {
    fetch(`/api/model?model_id=${id}`, optionDelete).then(r => {
        console.log("deleted");
    });
}
getModels = function () {
    let models;
    fetch('/api/models').then((result) => {
        models = result.json();
        return models;
    }).then(printRes);
}
printRes = function (result) {
    for (let i = 0; i < result.models.length; i++) {
        console.log(result.models[i]);
    }
}

detect = function (id) {
    setTimeout(() => fetch(`/api/anomaly?model_id=${id}`, optionPostDetect).then(res => {
            if (res.ok) {
                res.json().then(console.log);
            } else
                res.text().then(console.log);
        }),
        5000);
}
