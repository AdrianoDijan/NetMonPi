const Influx = require('influx');
const express = require('express');
const path = require('path');
const cors = require('cors')
const bodyParser = require('body-parser');
const pg = require('pg')
const Pool = pg.Pool
const app = express();
const influx = new Influx.InfluxDB('http://10.10.0.9:8086/netmonpi');

const pool = new Pool({
    user: 'postgres',
    host: '10.10.0.9',
    database: 'netmonpi',
    password: 'MyikObi14hOS',
    port: 5433
})

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());
app.set('port', 3080);

influx.getMeasurements()
    .then(names => console.log('My measurement names are: ' + names.join(', ')))
    .then(() => {
        app.listen(app.get('port'), () => {
            console.log(`Listening on ${app.get('port')}.`);
        });
    })
    .catch(error => console.log({ error }));

app.get('/api/v1/bandwidth/lastday', (request, response) => {
    influx.query(`
    SELECT non_negative_derivative(mean("txInOctets"),1s)
    AS "txInOctets", non_negative_derivative(mean("txOutOctets"),1s)
    AS "txOutOctets" FROM "ifBandwidth"
    WHERE time > now()-24h 
    AND "host"=${Influx.escape.stringLit('10.10.0.1')}
    AND "interface"='pppoe0'
    group by time(15m)
    `)
        .then(result => response.status(200).json(result))
        .catch(error => response.status(500).json({ error }));
});

app.get('/api/v1/traffic/all', (request, response) => {
    influx.query(`
     SELECT mean("txInOctets")
      AS "mean_txInOctets", mean("txOutOctets") as "mean_txOutOctets" 
      FROM "ifBandwidth"
       WHERE time > now()-48h AND "host"=${Influx.escape.stringLit('10.10.0.1')}
        AND "interface"='pppoe0'
        group by time(1s)
    `)
        .then(result => response.status(200).json(result))
        .catch(error => response.status(500).json({ error }));
});

app.get('/api/v1/devices/all', (request, response) => {
    pool.query('SELECT * FROM host ORDER by last_seen DESC', (error, results) => {
        if (error) {
            throw error
        }
        response.status(200).json(results.rows)
    })
});

app.get('/api/v1/services/:mac', (request, response) => {
    mac = request.params.mac

    pool.query('SELECT * FROM service WHERE service_id IN (SELECT service_id from hostservice where mac = $1)', [mac], (error, results) => {
        if (error) {
            throw error
        }
        response.status(200).json(results.rows)
    })
})
