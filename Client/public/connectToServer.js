
const data = {
    speed: [1, 2, 3, 4],
    deg: [2, 4, 6, 8]
};
const data1 = {
    speed: [1, 2, 3, 4],
    deg: [10, 31, 72, 641]
};

const optionPost = {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
};
const optionPostDetect = {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify(data1)
};

const optionDelete = {
    method: 'DELETE'
};

let type = 'hybrid';
fetch(`/api/model?model_type=${type}`, optionPost);
fetch('/api/model?model_id=AVCwGTgaZpn1qvBu').then(res => {
    if (res.ok) {
        res.json().then(console.log);
    } else
        res.text().then(console.log);
});

// fetch('/api/model?model_id=2', optionDelete);
// fetch('/api/models').then(res => res.json()).then(console.log);
fetch('/api/models?model_id=AVCwGTgaZpn1qvBu', optionPostDetect).then(res => res.json()).then(console.log);
