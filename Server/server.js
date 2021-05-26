const express = require('express');
const Anomaly = require('./Anomaly-Detection');
const queue = require('express-queue');
// const data = require('../Client/public/helloworld.json');
// const data = require('../helloworld.json');
const app = express();


app.use(express.json({limit:'2MB'}));

app.get('/api/model', (req, res) => {
    const model_id = req.query.model_id;
    Anomaly.getModel(model_id).then(model => res.json(model)).catch(reason => res.status(400).send({error: reason}));
});

app.get('/api/models', (req, res) => {
    Anomaly.getModels().then(models => res.json({models: models}));
});

app.post(
    '/api/model',
    queue({activeLimit: 20, queuedLimit: -1}),
    (req, res) => {
        const type = req.query.model_type;
        if (type !== 'hybrid' && type !== 'regression') {
            res.status(400).send({error: 'only hybrid and regression supported'});
            return;
        }
        const data = req.body;
        Anomaly.insertAd(type).then((id) => {
            Anomaly.train(id, data).then(() => console.log('finished train'));
            res.redirect(302, `/api/model?model_id=${id}`);
        }).catch(err => res.json({error: err}));
    }
);


app.post(
    '/api/anomaly',
    queue({activeLimit: 20, queuedLimit: -1}),
    (req, res) => {
        const model_id = req.query.model_id;
        const data = req.body;
        Anomaly.getModel(model_id).then(model => {
            if (model.status === 'ready') {
                Anomaly.detect(model_id, data, result => res.json(result)).then(() => console.log('finished detect'));
            } else {
                res.redirect(302, `/api/model?model_id=${model_id}`);
            }
        }).catch(err => res.json({error: err}));
    }
);


app.delete('/api/model', (req, res) => {
    const model_id = req.query.model_id;
    Anomaly.removeModel(model_id);
});

app.use('/', express.static(`Client/public`));
const server = app.listen(9876, () => {
    Anomaly.init();
    server.on('close', () => Anomaly.close());
});


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
