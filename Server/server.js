const express = require('express');
const test = require('./test');


const app = express();
app.use(express.json({limit: '1mb'}));

app.get('/api/model', (req, res) => {
    const model_id = parseInt(req.query.model_id);
    console.log(model_id);
    const model = test.getModel(model_id);
    console.log(model);
    if (model)
        res.json(model);
    else
        res.status(499).send({error: "model not found"});
});


app.post('/api/model', (req, res) => {
    const type = req.query.model_type;
    if (type !== 'hybrid' && type !== 'regression') {
        res.status(401).json({error: "only hybrid and reg supported"});
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


app.use('/', express.static(`Client/public`));
app.listen(8080, () => console.log("listen in port 8080"));