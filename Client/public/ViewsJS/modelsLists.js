const pendingList = [];

getModels().then(models => models.forEach(addModelToList));

function addModelToList(model) {
    const id = model.model_id;
    const status = model.status;
    document.getElementById('modelsList').innerHTML +=
        `<option class="${status}" id=${id} value=${id}>${id}</option>`;
    if (status === 'pending') {
        pendingList.push(model.model_id);
    }
}

function removeModelFromList(id) {
    const element = document.getElementById(id);
    element.parentElement.removeChild(element);
}

function checkPending() {
    if (pendingList.length === 0) {
        return;
    }
    pendingList.filter(id => {
        getModelById(id).then(model => {
            if (model.status === 'ready') {
                document.getElementById(id).className = 'ready';
                return false;
            }
            return true;
        });
    });
}

setInterval(checkPending, 5000);
