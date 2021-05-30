const pendingList = [];

function addModelToList(model) {
    const id = model.model_id;
    const status = model.status;
    const time = new Date(model.upload_time).toLocaleString('en-GB', {timeZone: 'UTC'});
    document.getElementById('modelsList').innerHTML +=
        `<option class="${status}" id=${id} value=${id}>${id} | ${time}</option>`;
    if (status === 'pending') {
        pendingList.push(model.model_id);
    }
}

getModels().then(models => models.forEach(addModelToList));

function removeModelFromList(id) {
    const element = document.getElementById(id);
    element.parentElement.removeChild(element);
}

setInterval(() => {
    if (pendingList.length !== 0) {
        pendingList.filter(id => getModelById(id).then(model => {
                if (model.status === 'ready') {
                    document.getElementById(id).className = 'ready';
                    return false;
                }
                return true;
            }
        ));
    }
}, 5000);
