// imports
const express = require('express');
const Anomaly = require('../Models/Anomaly-Detection');
const queue = require('express-queue');
const {body, query, validationResult} = require('express-validator');

const app = express();

// all the middleware for the server.
app.use(express.json({limit: '2MB'}));
app.use('/', express.static(`Client/public`));
const requestsQueue = queue({activeLimit: 20, queuedLimit: -1});
const port = 9876;

// a GET Request that receives an ID and respond back with the Model associated with this ID
app.get('/api/model',
    query('model_id', 'must send model id').exists().notEmpty(),
    (req, res) => {
        const errors = validationResult(req);
        if (errors.isEmpty()) {
            const model_id = req.query.model_id;
            Anomaly.getModel(model_id)
                .then(model => res.json(model))
                .catch(reason => res.status(404).json({error: reason}));
        } else {
            res.status(400).json({error: errors.array()});
        }
    });

// a GET Request that respond with all the models on the server
app.get('/api/models', (req, res) => {
    Anomaly.getModels().then(models => res.status(200).json({models: models}));
});

// a POST request that receives a detector type as a query and training data in the body, then creates and train a detector
// the request respond with the id of specific model that created
app.post(
    '/api/model',
    requestsQueue,
    query('model_type').exists().withMessage('must send model type').isIn(['hybrid', 'regression']).withMessage('type can only be hybrid or regression'),
    body('train_data', 'must send training data').exists().notEmpty(),
    (req, res) => {
        const errors = validationResult(req);
        if (errors.isEmpty()) {
            const type = req.query.model_type;
            const data = req.body.train_data;
            Anomaly.insertAd(type).then((id) => {
                Anomaly.train(id, data).then(() => console.log('finished train'));
                res.redirect(302, `/api/model?model_id=${id}`);
            }).catch(err => res.status(400).json({error: err}));
        } else
            res.status(400).json({error: errors.array()});
    }
);

// a POST request that receives an ID as a query and data in the body, then used the trained model with the ID and
// find the anomalies in the data received.
app.post(
    '/api/anomaly',
    requestsQueue,
    query('model_id', 'must send model id').exists().notEmpty(),
    body('predict_data', 'must send predict data').exists().notEmpty(),
    (req, res) => {
        const errors = validationResult(req);
        if (errors.isEmpty()) {
            const model_id = req.query.model_id;
            const data = req.body.predict_data;
            Anomaly.getModel(model_id).then(model => {
                if (model.status === 'ready') {
                    Anomaly.detect(model_id, data, result => res.json(result)).then(() => console.log('finished detect'));
                } else {
                    res.redirect(302, `/api/model?model_id=${model_id}`);
                }
            }).catch(err => res.status(400).json({error: err}));
        } else
            res.status(400).json({error: errors.array()});
    }
);

//a DELETE request that receives an ID as a query and delete an
app.delete('/api/model',
    query('model_id', 'must send model id').exists().notEmpty(),
    (req, res) => {
        const errors = validationResult(req);
        if (errors.isEmpty()) {
            const model_id = req.query.model_id;
            Anomaly.removeModel(model_id)
                .then(() => res.sendStatus(200))
                .catch(err => res.status(404).json({errors: err}));
        } else
            res.status(400).json({error: errors.array()});
    });

// starting the server
const server = app.listen(port, () => {
    Anomaly.init();
    server.on('close', () => Anomaly.close());
    console.log("Running on port", port);
});

// making sure the server is closing gracefully

process.stdin.resume();//so the program will not close instantly

function exitHandler(options) {
    if (options.exit) {
        server.close();
        process.exit();
    }
}

//do something when app is closing
process.on('exit', exitHandler.bind(null, {exit: true}));

//catches ctrl+c event
process.on('SIGINT', exitHandler.bind(null, {exit: true}));

// catches "kill pid" (for example: nodemon restart)
process.on('SIGUSR1', exitHandler.bind(null, {exit: true}));
process.on('SIGUSR2', exitHandler.bind(null, {exit: true}));

//catches uncaught exceptions
process.on('uncaughtException', exitHandler.bind(null, {exit: true}));

