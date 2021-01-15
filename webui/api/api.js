const express = require('express');
const path = require('path');
const cors = require('cors')
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

const app = express();
const influxQueries = require('./src/influxDbQueries')
const pgQueries = require('./src/postgreSqlQueries')
const { withAuth, currentUser } = require('./src/middleware');

app.use(bodyParser.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(express.static(path.join(__dirname, '../app/build')));
app.set('port', 3080);
app.listen(app.get('port'))


app.get('/api/v1/bandwidth/lastday', withAuth, influxQueries.getLastDayBandwidth);
app.get('/api/v1/bandwidth/today', withAuth, influxQueries.getTodayBandwidth);
app.get('/api/v1/bandwidth/last/:time', withAuth, influxQueries.getBandwithForTime);

app.get('/api/v1/speedtest/last/:time', withAuth, influxQueries.getSpeedtestForTime);
app.get('/api/v1/speedtest/last', withAuth, influxQueries.getLastSpeedtest);

app.get('/api/v1/devices/all', withAuth, pgQueries.getAllDevices);
app.get('/api/v1/devices/online', withAuth, pgQueries.getOnlineDevices);

app.get('/api/v1/services/:mac', withAuth, pgQueries.getServicesByMac)

app.get('/api/v1/exploits/:serviceid', withAuth, pgQueries.getExploitsByService)
app.get('/api/v1/info', withAuth, pgQueries.getNetworkInfo)

app.get('/checkToken', withAuth, (request, response) => {
    response.sendStatus(200);
});

app.post('/authenticate', pgQueries.login)
app.post('/register', pgQueries.register)
app.get('/logout', (request, response) => {
    response.clearCookie("token")
    response.sendStatus(200)
})
app.get('/currentUser', withAuth, currentUser)
app.post('/changePassword', withAuth, pgQueries.changePassword)


app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../app/build/index.html'));
});