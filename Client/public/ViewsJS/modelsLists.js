const pendingList = [];

function addModelToList(model) {
    const id = model.model_id;
    document.getElementById("modelsList").innerHTML +=
        `<option class="${model.status}" id=${id} value=${id}>${id}</option>`;
    if (model.status==="pending"){
        pendingList.push(model.model_id);
    }
}

function removeModelFromList(id){
    const element = document.getElementById(id);
    element.parentElement.removeChild(element);
}

getModels().then((models) => {
    let modelsArray = models.models;
    for (const model of modelsArray) {
        addModelToList(model);
    }
});

function checkPendings(){
    if (pendingList.length===0){
        return;
    }
    pendingList.filter(id =>{
        getModelById(id).then(model=>{
            if (model.status==="ready"){
                document.getElementById(id).className="ready";
                return false;
            }
            return true;
        })
    })
}

setInterval(checkPendings,5000);
