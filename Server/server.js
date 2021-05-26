// imports
const express = require('express');
const Anomaly = require('./Anomaly-Detection');
const queue = require('express-queue');
const app = express();

//
app.use(express.json({limit: '2MB'}));
app.use('/', express.static(`Client/public`));

const requestsQueue = queue({activeLimit: 20, queuedLimit: -1});
const port = 9876;

// a GET Request that receives an ID and returns back the Model associated with this ID
app.get('/api/model', (req, res) => {
    const model_id = req.query.model_id;
    Anomaly.getModel(model_id)
        .then(model => res.json(model))
        .catch(reason => res.status(400).json({error: reason}));
});

// a GET Request that returns all the models on the server
app.get('/api/models', (req, res) => {
    Anomaly.getModels().then(models => res.status(200).json({models: models}));
});

// a POST request that receives a
app.post(
    '/api/model',
    requestsQueue,
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
        }).catch(err => res.status(400).json({error: err}));
    }
);


app.post(
    '/api/anomaly',
    requestsQueue,
    (req, res) => {
        const model_id = req.query.model_id;
        const data = req.body;
        Anomaly.getModel(model_id).then(model => {
            if (model.status === 'ready') {
                Anomaly.detect(model_id, data, result => res.json(result)).then(() => console.log('finished detect'));
            } else {
                res.redirect(302, `/api/model?model_id=${model_id}`);
            }
        }).catch(err => res.status(400).json({error: err}));
    }
);


app.delete('/api/model', (req, res) => {
    const model_id = req.query.model_id;
    Anomaly.removeModel(model_id).then(() => res.sendStatus(200));
});


const server = app.listen(port, () => {
    Anomaly.init();
    server.on('close', () => Anomaly.close());
});