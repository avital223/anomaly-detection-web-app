let parser = function (result) {
    let array = result.split('\r');
    let headers = array[0].split(',');
    let data = {};
    for (let i = 0; i < headers.length; i++) {
        data[headers[i]] = [];
    }
    for (let i = 1; i < array.length - 1; i++) {
        let str = array[i];
        let s = '';
        let flag = 0;
        for (let ch of str) {
            if (ch === '"' && flag === 0) {
                flag = 1;
            } else if (ch === '"' && flag === 1) flag = 0;
            if (ch === ',' && flag === 0) ch = '|';
            if (ch !== '"') s += ch;
        }
        let properties = s.split('|');
        for (let j in headers) {
            if (properties[j].includes(',')) {
                let string = properties[j].split(',').map(item => item.trim());
                data[headers[j]].push(parseFloat(string[0]));
            } else data[headers[j]].push(parseFloat(properties[j]));
        }
    }
    return data;
};


onDrag = function (evt) {
    evt.preventDefault();
};

onDrop = function (evt, fileInput) {
    if (evt.dataTransfer.files.length === 1) {
        fileInput.files = evt.dataTransfer.files;
    }
};

CSV_reader = async function (fileInput) {
    if (!fileInput || fileInput.files.length === 0 || fileInput.files[0].type !== 'application/vnd.ms-excel') return;
    return fileInput.files[0].text().then(parser);
};