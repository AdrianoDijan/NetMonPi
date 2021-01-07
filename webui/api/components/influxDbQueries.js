const Influx = require('influx');
const influx = new Influx.InfluxDB('http://10.10.0.9:8086/netmonpi');

influx.getMeasurements()
    .catch(error => console.log({ error }));

host = "10.10.0.1"
interface = "pppoe0"

module.exports = {
    getLastDayBandwidth: (request, response) => {
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
    },
    getTodayBandwidth: (request, response) => {
        let startTime = new Date()
        startTime.setHours(0,0,0,0)
        let endTime = new Date()
        endTime.setHours(24,0,0,0)
        let interval = (endTime.getTime()-startTime.getTime())/1000/60
        let query = `SELECT non_negative_derivative(mean("txInOctets"),1s)
                     AS "txInOctets", non_negative_derivative(mean("txOutOctets"),1s)
                     AS "txOutOctets" FROM "ifBandwidth"
                     WHERE time >= ${startTime.getTime()*1000000} AND time <= ${endTime.getTime()*1000000}
                     AND "host"=${Influx.escape.stringLit(host)}
                     AND "interface"='${interface}'
                     group by time(${interval}m/150)
                    `
        influx.query(query)
            .then(result => response.status(200).json(result))
            .catch(error => response.status(500).json({ error }));
    },
    getBandwithForTime: (request, response) => {
        let time = request.params.time
    
        let query = `SELECT non_negative_derivative(mean("txInOctets"),1s)
                     AS "txInOctets", non_negative_derivative(mean("txOutOctets"),1s)
                     AS "txOutOctets" FROM "ifBandwidth"
                     WHERE time > now()-${time} 
                     AND "host"=${Influx.escape.stringLit(host)}
                     AND "interface"='${interface}'
                     group by time(${time}/150)
                    `
        influx.query(query)
            .then(result => response.status(200).json(result))
            .catch(error => response.status(500).json({ error }));
    },
    getSpeedtestForTime: (request, response) => {
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
    },
    getLastSpeedtest: (request, response) => {
        query = `SELECT *
                FROM "speedtest"
                WHERE time > now()-24h
                ORDER BY time DESC
                LIMIT 1
        `
        influx.query(query)
            .then(result => response.status(200).json(result))
            .catch(error => response.status(500).json({ error }));
    },
}