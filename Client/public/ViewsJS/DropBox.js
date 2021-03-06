
onDragEnter = function (evt) {
    evt.preventDefault();
    let dr = document.getElementById('dropContainer');
    dr.style.background = '#00796b'
    dr.style.color = '#fafafa';
};

onDrag = function (evt) {
    evt.preventDefault();
};

onDragEnd = function (evt) {
    evt.preventDefault();
    let dr = document.getElementById('dropContainer');
    dr.style.background = '#fafafa';
    dr.style.color = '#000000';
};

onDrop = function (evt, fileInput) {
    evt.preventDefault();
    let dr = document.getElementById('dropContainer');
    dr.style.background = '#fafafa';
    dr.style.color = '#000000';
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