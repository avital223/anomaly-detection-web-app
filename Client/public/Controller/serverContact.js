addNewModel = function (type, data) {
    const optionPost = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({train_data: data})
    };
    fetch(`/api/model?model_type=${type}`, optionPost).then(res => {
        if (res.ok)
            res.json().then(addModelToList);
        else
            res.json().then(console.error);
    });
};

detect = function (id, data) {
    if (id == null) {
        let error = document.getElementById('error');
        error.innerText = "No model chosen.";
        return;
    }
    const optionPostDetect = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({predict_data: data})
    };
    return fetch(`/api/anomaly?model_id=${id}`, optionPostDetect).then(res => {
        if (res.ok)
            return res.json();
        else
            res.json().then(console.error);
    });
};

getModelById = function (id) {
    return fetch(`/api/model?model_id=${id}`).then(res => res.json());
};
deleteModelByID = function (id) {
    console.log(id);
    if (id === "") {
        let error = document.getElementById('error');
        error.innerText = "No model chosen.";
        return;
    }
    const optionDelete = {
        method: 'DELETE'
    };
    fetch(`/api/model?model_id=${id}`, optionDelete).then(() => removeModelFromList(id));
};
getModels = function () {
    return fetch('/api/models').then(result => result.json()).then(models => models.models);
};

setData = function (fileInput, type) {
    if (fileInput.files.length === 0) {
        let error = document.getElementById('error');
        error.innerText = "No file loaded.";
        return;
    }
    CSV_reader(fileInput).then(data => notifyDataSet(data, type));
};


function setDataDetect(id, fileInput) {
    if (fileInput.files.length === 0) {
        let error = document.getElementById('error');
        error.innerText = "No file loaded.";
        return;
    }
    if (id === "") {
        let error = document.getElementById('error');
        error.innerText = "No model chosen.";
        return;
    }
    CSV_reader(fileInput).then(data => notifyDetect(id, data));
}

function notifyFinishDetect(anomalies) {
    markAnomalies(anomalies);
    printTableAnomalies(anomalies);
    drawAnomaly(anomalies);
}

function notifyDetect(id, data) {
    addDataToTable(data);
    drawCharts(data);
    detect(id, data).then(notifyFinishDetect);
}

notifyDataSet = function (data, type) {
    addNewModel(type, data);
    addDataToTable(data);
    drawCharts(data);
};


