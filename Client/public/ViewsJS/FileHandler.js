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


onDragEnter = function (evt) {
    evt.preventDefault();
    let dr = document.getElementById('dropContainer');
    dr.style.background = 'lightslategrey';
};

onDrag = function (evt) {
    evt.preventDefault();
};

onDragEnd = function (evt) {
    evt.preventDefault();
    let dr = document.getElementById('dropContainer');
    dr.style.background = 'white';
};

onDrop = function (evt, fileInput) {
    evt.preventDefault();
    let dr = document.getElementById('dropContainer');
    dr.style.background = 'white';
    if (evt.dataTransfer.files.length === 1) {
        fileInput.files = evt.dataTransfer.files;
        let dr = document.getElementById('dropContainer');
        dr.innerText = 'The dropped file is ' + fileInput.files[0].name;
    } else {
        let dr = document.getElementById('dropContainer');
        dr.innerText = 'Wrong amount of files. Drop one CSV file!';
    }
};

updateDrop = function (evt, fileInput) {
    evt.preventDefault();
    if (fileInput.files.length === 1) {
        let dr = document.getElementById('dropContainer');
        dr.innerText = 'The dropped file is ' + fileInput.files[0].name;
    } else {
        let dr = document.getElementById('dropContainer');
        dr.innerText = 'Wrong amount of files. Drop one CSV file!';
    }
};

CSV_reader = async function (fileInput) {
    if (!fileInput || fileInput.files.length === 0 || fileInput.files[0].type !== 'application/vnd.ms-excel') return;
    return fileInput.files[0].text().then(parser);
};