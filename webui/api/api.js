const Influx = require('influx');
const express = require('express');
const path = require('path');
const cors = require('cors')
const bodyParser = require('body-parser');
const pg = require('pg')
const Pool = pg.Pool
const app = express();
const influx = new Influx.InfluxDB('http://10.10.0.9:8086/netmonpi');

const host = "10.10.0.1"
const interface = "pppoe0"

const pool = new Pool({
    user: 'postgres',
    host: '10.10.0.9',
    database: 'netmonpi',
    password: 'MyikObi14hOS',
    port: 5433,
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
    let query = `SELECT non_negative_derivative(mean("txInOctets"),1s)
                 AS "txInOctets", non_negative_derivative(mean("txOutOctets"),1s)
                 AS "txOutOctets" FROM "ifBandwidth"
                 WHERE time > now()-24h 
                 AND "host"=${Influx.escape.stringLit(host)}
                 AND "interface"='${interface}'
                 group by time(10m)
                `
    influx.query(query)
        .then(result => response.status(200).json(result))
        .catch(error => response.status(500).json({ error }));
});

app.get('/api/v1/bandwidth/:time', (request, response) => {
    let time = request.params.time

    let query = `SELECT non_negative_derivative(mean("txInOctets"),1s)
                 AS "txInOctets", non_negative_derivative(mean("txOutOctets"),1s)
                 AS "txOutOctets" FROM "ifBandwidth"
                 WHERE time > now()-${time} 
                 AND "host"=${Influx.escape.stringLit(host)}
                 AND "interface"='${interface}'
                 group by time(1m)
                `
    influx.query(query)
        .then(result => response.status(200).json(result))
        .catch(error => response.status(500).json({ error }));
});

app.get('/api/v1/traffic/all', (request, response) => {
    let time = request.params.time
    query = `SELECT mean("txInOctets")
                  AS "mean_txInOctets",
                  mean("txOutOctets")
                  AS "mean_txOutOctets" 
                  FROM "ifBandwidth"
                  WHERE time > now()-${time}
                  group by time(1h)
    `
    influx.query(query)
        .then(result => response.status(200).json(result))
        .catch(error => response.status(500).json({ error }));
});

app.get('/api/v1/speedtest/last/:time', (request, response) => {
    query = `SELECT "download",
                  "upload",
                  "ping",
                  "url"
                  FROM "speedtest"
                  WHERE time > now()-${request.params.time}
    `
    influx.query(query)
        .then(result => response.status(200).json(result))
        .catch(error => response.status(500).json({ error }));
});

app.get('/api/v1/devices/all', (request, response) => {
    pool.query(`SELECT * 
                FROM host 
                ORDER by last_seen DESC`, (error, results) => {
        if (error) {
            throw error
        }
        response.status(200).json(results.rows)
    })
});

app.get('/api/v1/devices/online', (request, response) => {
    pool.query(`SELECT * 
                FROM host WHERE last_seen > (now()-interval '90 s')
                ORDER by last_seen DESC`, (error, results) => {
        if (error) {
            throw error
        }
        response.status(200).json(results.rows)
    })
});

app.get('/api/v1/services/:mac', (request, response) => {
    mac = request.params.mac

    pool.query(`SELECT * 
                FROM service 
                WHERE service_id IN 
                (SELECT service_id 
                FROM hostservice
                WHERE mac = $1)`, [mac], (error, results) => {
        if (error) {
            throw error
        }
        response.status(200).json(results.rows)
    })
})
