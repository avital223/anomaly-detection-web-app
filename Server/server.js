const express = require('express');
const test = require('./test');


const app = express();
app.use(express.json({limit: '1mb'}));

app.get('/api/model', (req, res) => {
    const model_id = parseInt(req.query.model_id);
    console.log('here');
    const model = test.getModel(model_id);
    if (model)
        res.json(model);
    else {
        res.status(499).send('no model found');
        res.end();
    }
});

app.get('/api/models', (req, res) => {
    res.json({models: test.getModels()});
});


app.post('/api/model', (req, res) => {
    const type = req.query.model_type;
    if (type !== 'hybrid' && type !== 'regression') {
        res.status(401).json({error: 'only hybrid and reg supported'});
        return;
    }
    const model = test.createAd(type);
    test.train(req.body, model.model_id);
    res.json({
        model_id: model.model_id,
        upload_time: model.upload_time,
        status: model.status
    });
});

app.post('/api/models', (req, res) => {
    const model_id = parseInt(req.query.model_id);
    const data = req.body;
    const model = test.getModel(model_id);
    if (model.status === 'pending') {
        res.redirect(302,'/api/model')
        return;
    }
    res.json({anomalies: test.detect(model_id, data)});
});


app.delete('/api/model', (req, res) => {
    const model_id = parseInt(req.query.model_id);
    test.removeModel(model_id);
});

app.use('/', express.static(`Client/public`));
app.listen(8080, () => console.log('listen in port 8080'));