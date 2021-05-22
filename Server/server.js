const express = require('express');
//Create new worker
const Anomaly = require('./Anomaly-Detection');
// const data = require('../Client/public/helloworld.json');
// const data = require('../helloworld.json');
const app = express();
app.use(express.json());


app.get('/api/model', (req, res) => {
    const model_id = req.query.model_id;
    Anomaly.getModel(model_id).then((model) => {
        if (model)
            res.json(model);
        else {
            res.status(499).send('no model found');
            res.end();
        }
    });
});

app.get('/api/models', (req, res) => {
    Anomaly.getModels().then(models => res.json({models: models}));
});


app.post('/api/model', (req, res) => {
    const type = req.query.model_type;
    if (type !== 'hybrid' && type !== 'regression') {
        res.status(401).send({error: 'only hybrid and reg supported'});
        return;
    }
    const data = req.body;
    Anomaly.insertAd(type).then((id) => {
        Anomaly.train(data, id);
        res.redirect(302, `/api/model?model_id=${id}`);
    });
});


app.post('/api/anomaly', (req, res) => {
    const model_id = req.query.model_id;
    const data = req.body;
    Anomaly.getModel(model_id).then(async model => {
        if (model.status === 'pending') {
            res.redirect(302, `/api/model?model_id=${model_id}`);
            return;

        }
        Anomaly.detect(model_id, data, result => res.json(result));
    });
});


app.delete('/api/model', (req, res) => {
    const model_id = req.query.model_id;
    Anomaly.removeModel(model_id);
});

app.use('/', express.static(`Client/public`));
app.listen(8080, () => Anomaly.loadDB());


// let data = '{\n';
// for (let i = 0; i < 1000; i++) {
//     const x = Array(1000).fill(0).map(() => Math.round(Math.random() * 40));
//     data += '"speed' + i + '": [' + x + '],\n';
// }
// data += '}';
//
// fs = require('fs');
// fs.writeFile('helloworld.json', data, function (err) {
//     if (err) return console.log(err);
//     console.log('Hello World > helloworld.json');
// });
