
class ModelList{
    target;
    constructor(list) {
        this.target=list;
    }
    setListItems = function (models) {
        let modelsArray =  models;
        for (let i = 0; i < modelsArray.length; i++) {
            this.target.innerHTML += '<option value="' + modelsArray[i].model_id + '"></option>';
        }
    }
}
