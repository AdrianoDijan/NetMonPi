const express = require('express');
const path = require('path');
const cors = require('cors')
const bodyParser = require('body-parser');

const app = express();
const influxQueries = require('./src/influxDbQueries')
const pgQueries = require('./src/postgreSqlQueries')

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(express.static(path.join(__dirname, '../app/build')));
app.set('port', 3080);
app.listen(app.get('port'))

app.get('/api/v1/bandwidth/lastday', influxQueries.getLastDayBandwidth);
app.get('/api/v1/bandwidth/today', influxQueries.getTodayBandwidth);
app.get('/api/v1/bandwidth/last/:time', influxQueries.getBandwithForTime);

app.get('/api/v1/speedtest/last/:time', influxQueries.getSpeedtestForTime);
app.get('/api/v1/speedtest/last', influxQueries.getLastSpeedtest);

app.get('/api/v1/devices/all', pgQueries.getAllDevices);
app.get('/api/v1/devices/online', pgQueries.getOnlineDevices);

app.get('/api/v1/services/:mac', pgQueries.getServicesByMac)

app.get('/api/v1/exploits/:serviceid', pgQueries.getExploitsByService)
app.get('/api/v1/info', pgQueries.getNetworkInfo)

app.get('*', (req,res) => {
    res.sendFile(path.join(__dirname, '../app/build/index.html'));
});