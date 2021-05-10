const express = require('express');
const Anomaly = require('./Anomaly-Detection');


const app = express();
app.use(express.json({limit: '1mb'}));

app.get('/api/model', (req, res) => {
    const model_id = parseInt(req.query.model_id);
    console.log('here');
    const model = Anomaly.getModel(model_id);
    if (model)
        res.json(model);
    else {
        res.status(499).send('no model found');
        res.end();
    }
});

app.get('/api/models', (req, res) => {
    res.json({models: Anomaly.getModels()});
});


app.post('/api/model', (req, res) => {
    const type = req.query.model_type;
    if (type !== 'hybrid' && type !== 'regression') {
        res.status(401).send({error: 'only hybrid and reg supported'});
        return;
    }
    const model = Anomaly.createAd(type);
    const id = 'mTwsLLRf0qhqjOj0';
    Anomaly.train(req.body, id).then(() => {
        console.log("here 1");
    });
    res.json(Anomaly.getModel(id));
});

app.post('/api/models', (req, res) => {
    const model_id = parseInt(req.query.model_id);
    const data = req.body;
    const model = Anomaly.getModel(model_id);
    if (model.status === 'pending') {
        res.redirect(302, '/api/model');
        return;
    }
    res.json({anomalies: Anomaly.detect(model_id, data)});
});


app.delete('/api/model', (req, res) => {
    const model_id = parseInt(req.query.model_id);
    Anomaly.removeModel(model_id);
});

app.use('/', express.static(`Client/public`));
app.listen(8080, () => Anomaly.loadDB());