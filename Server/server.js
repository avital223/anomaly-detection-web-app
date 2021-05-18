const express = require('express');
const Anomaly = require('./Anomaly-Detection');


const app = express();
app.use(express.json({limit: '1mb'}));

app.get('/api/model', (req, res) => {
    const model_id = req.query.model_id;
    console.log(model_id);
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
    Anomaly.insertAd(type).then((id) => {
        Anomaly.train(req.body, id).then(() => {
            Anomaly.getModel(id).then(model => {
                res.json(model);
            });
        });
    });
});

app.post('/api/anomaly', (req, res) => {
    const model_id = req.query.model_id;
    const data = req.body;
    Anomaly.getModel(model_id).then(model => {

            if (model.status === 'pending') {

                res.redirect(302, `/api/model?model_id=${model_id}`);
                return;
            }
            Anomaly.detect(model_id, data).then(anomalies => res.json({anomalies: anomalies}));
        }
    );
});


app.delete('/api/model', (req, res) => {
    const model_id = req.query.model_id;
    Anomaly.removeModel(model_id);
});

app.use('/', express.static(`Client/public`));
app.listen(8080, () => Anomaly.loadDB());