const pg = require('pg')
const axios = require('axios')
const publicIp = require('public-ip')

const pool = new pg.Pool({
    user: 'postgres',
    host: '10.10.0.9',
    database: 'netmonpi',
    password: 'MyikObi14hOS',
    port: 5433,
})

module.exports = {
    getAllDevices: (request, response) => {
        pool.query(`SELECT * 
                    FROM host 
                    ORDER by last_seen DESC`, (error, results) => {
            if (error) {
                throw error
            }
            response.status(200).json(results.rows)
        })
    },
    getOnlineDevices: (request, response) => {
        pool.query(`SELECT * 
                    FROM host WHERE last_seen > (now()-interval '300 s')
                    ORDER by last_seen DESC`, (error, results) => {
            if (error) {
                throw error
            }
            response.status(200).json(results.rows)
        })
    },
    getServicesByMac: (request, response) => {
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
    },
    getExploitsByService: (request, response) => {
        serviceid = request.params.serviceid

        pool.query(`SELECT * 
                    FROM exploit 
                    WHERE exploit_id IN 
                    (SELECT exploit_id 
                    FROM serviceexploit
                    WHERE service_id = $1)`, [serviceid], (error, results) => {
            if (error) {
                throw error
            }
            response.status(200).json(results.rows)
        })
    },
    getNetworkInfo: (request, response) => {
        pool.query(`SELECT network
                                  FROM network
                                `, (error, results) => {
            if (error) {
                throw error
            }
            publicIp.v4({
                fallbackUrls: [
                    'https://ifconfig.co/ip'
                ],
                timeout: 500,
            }).then(public_ip => {
                return ({ public_ip: public_ip, network: results.rows[0]["network"] })
            })
                .then((data) => {
                    let url = `http://ip-api.com/json/${data['public_ip']}`

                    axios({
                        method: 'get',
                        url: url,
                    })
                        .then((answer) => answer.data)
                        .then((answer) => {
                            data["isp"] = answer["isp"];
                            data["country"] = answer["country"];
                            response.status(200).json(data);
                        });
                });
        });
    },
}