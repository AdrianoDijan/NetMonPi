const Influx = require('influx');
const express = require('express');
const path = require('path');
const os = require('os');
const bodyParser = require('body-parser');
const app = express();
const influx = new Influx.InfluxDB('http://10.10.0.9:8086/netmonpi');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(express.static(path.join(__dirname, 'public')));
app.set('port', 3080);

influx.getMeasurements()
    .then(names => console.log('My measurement names are: ' + names.join(', ')))
    .then(() => {
        app.listen(app.get('port'), () => {
            console.log(`Listening on ${app.get('port')}.`);
        });
    })
    .catch(error => console.log({ error }));

app.get('/api/v1/usage', (request, response) => {
    influx.query(`
     SELECT non_negative_derivative(mean("txInOctets"),1s)
      AS "mean_txInOctets" FROM "ifBandwidth"
       WHERE time > now()-12h AND "host"=${Influx.escape.stringLit('10.10.0.1')}
        AND "interface"='pppoe0'
        group by time(1m)
    `)
        .then(result => response.status(200).json(result))
        .catch(error => response.status(500).json({ error }));
});
