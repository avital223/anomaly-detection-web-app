let data;
let id;

addNewModel = function (type, data) {
    const optionPost = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: data
    };
    fetch(`/api/model?model_type=${type}`, optionPost).then(res => res.json()).then(model => id = model.model_id);
}
getModelById = function (id) {
    setTimeout(() => fetch(`/api/model?model_id=${id}`).then(res => {
            if (res.ok) {
                res.json().then(console.log);
            } else
                res.text().then(console.log);
        }),
        2500);
};
deleteModelByID = function (id) {

    const optionDelete = {
        method: 'DELETE'
    };
    fetch(`/api/model?model_id=${id}`, optionDelete).then(() => {
        console.log("deleted");
    });
};
getModels = function () {
    return fetch('/api/models').then((result) => {
        return result.json();
    });
};

setData = function (fileInput) {
    CSV_reader(fileInput).then(notifyDataSet);
}

notifyDataSet = function (data) {
    addNewModel(document.getElementById('type').value, data);
}

detect = function (id, data) {
    const optionPostDetect = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },

        body: data
    };
    return fetch(`/api/anomaly?model_id=${id}`, optionPostDetect).then(res => {
        if (res.ok) {
            res.json().then(console.log);
        } else
            res.text().then(console.log);
    });
}
