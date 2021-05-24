
let data;
let id;
let models;

addNewModel = function (type) {
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
    fetch('/api/models').then((result) => {
        models = result.json();
    }).then(notifyList);
};
notifyList = function (result) {

};

getData = function () {
    document.getElementById("demo").innerHTML = data.deg;
};
getCurrentData = function () {
    return data;
}

setData = function (fileInput) {
    if (fileInput.files.length == 0)
        return;
    if (fileInput.files[0].type != "application/vnd.ms-excel")
        return;
    const reader = new FileReader();
    reader.addEventListener('load', (event) => {
        let array = event.target.result.split('\r');
        let result = [];
        let headers = array[0].split(",");
        let obj = {};
        for (let i = 0; i < headers.length; i++) {
            obj[headers[i]] = [];
        }
        for (let i = 1; i < array.length - 1; i++) {
            let str = array[i];
            let s = '';
            let flag = 0;
            for (let ch of str) {
                if (ch === '"' && flag === 0) {
                    flag = 1
                } else if (ch === '"' && flag == 1) flag = 0;
                if (ch === ',' && flag === 0) ch = '|';
                if (ch !== '"') s += ch;
            }
            let properties = s.split("|");
            for (let j in headers) {
                if (properties[j].includes(",")) {
                    let string = properties[j].split(",").map(item => item.trim());
                    obj[headers[j]].push(parseFloat(string[0]));
                } else obj[headers[j]].push(parseFloat(properties[j]));
            }
        }
        data = JSON.stringify(obj);
        notifyDataSet();
    });
    reader.readAsText(fileInput.files[0]);
}

notifyDataSet = function () {

}

onDrag = function (evt) {
    evt.preventDefault();
}

onDrop = function (evt, fileInput) {
    fileInput.files = evt.dataTransfer.files;
    evt.preventDefault();
}

detect = function (id) {
    const optionPostDetect = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },

        body: data
    };
    setTimeout(() => fetch(`/api/anomaly?model_id=${id}`, optionPostDetect).then(res => {
            if (res.ok) {
                res.json().then(console.log);
            } else
                res.text().then(console.log);
        }),
        5000);
}

getModels();
