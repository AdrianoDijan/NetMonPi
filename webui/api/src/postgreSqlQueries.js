const pg = require('pg')
const axios = require('axios')
const publicIp = require('public-ip')
const bcrypt = require('bcrypt')
var jwt = require('jsonwebtoken');

const pool = new pg.Pool({
    user: 'postgres',
    host: '10.10.0.9',
    database: 'netmonpi',
    password: 'MyikObi14hOS',
    port: 5433,
})

const secret = "wX65FYILUZOFSi9C7UhcL7ke6tRyx9wbMbTQy3p+ZXI0ymAOnyIPkhqIVwaleYnwO2aDn39beLplRsO67Ejl+n7And39vgbZ71gEK/C48Tr2Od5nBHWD6RCtxTGbxoxoeV/JsyHb+qMrgA9EmmDKEeHVbubbp+HVlC3/x5+AHWJU40abE1ykX4jSw7AsLk5035XIsIhfRTDWc3kEmY7XMyCmwGdYYpk3srFQFQ=="

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
            for (let i = 0; i < results.rows.length; i++) {
                pool.query(`SELECT * 
                    FROM exploit 
                    WHERE exploit_id IN 
                    (SELECT exploit_id 
                    FROM serviceexploit
                    WHERE service_id = $1)`, [results.rows[i].service_id], (error, resultsExploit) => {
                    if (error) {
                        throw error
                    }
                    results.rows[i].exploits = resultsExploit.rows || []
                    if (i === results.rows.length - 1) {
                        response.status(200).json(results.rows)
                    }
                })
            }
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
    login: (request, response) => {
        let { username, password } = request.body;

        pool.query(`
            SELECT * 
            FROM users
            WHERE username = $1
        `, [username], (error, results) => {
            if (error) {
                throw error
            }
            if (results.rows[0]) {
                bcrypt.compare(password, results.rows[0].password, (error, same) => {
                    if (same) {
                        const payload = { username };
                        const token = jwt.sign(payload, secret, {
                            expiresIn: '24h'
                        });
                        response.cookie('token', token, { httpOnly: true }).sendStatus(200);
                    }
                    else {
                        response.status(401).json({ message: "Wrong password!" })
                    }
                })
            } else {
                response.status(404).json({ message: "User not found!" })
            }
        })
    },
    register: (request, response) => {
        const saltRounds = 10;
        let { username, password } = request.body;

        bcrypt.hash(password, saltRounds, (error, hashedPassword) => {
            if (error) {
                throw (error)
            }
            else {
                pool.query(`
                INSERT INTO users (username, password)
                VALUES ('${username}', '${hashedPassword}')
                RETURNING username, password, date_created
            `, (error, results) => {
                    if (error) {
                        response.status(500).send(error)
                    }
                    else {
                        response.status(200).json(results.rows[0])
                    }
                })
            }
        })
    },
    changePassword: (request, response) => {
        const saltRounds = 10;
        let { password, newPassword } = request.body;

        pool.query(`
            SELECT * 
            FROM users
            WHERE username = $1
        `, [username], (error, results) => {
            if (error) {
                throw error
            }
            bcrypt.compare(password, results.rows[0].password, (error, same) => {
                if (same) {
                    bcrypt.hash(newPassword, saltRounds, (error, hashedPassword) => {
                        if (error) {
                            throw (error)
                        }
                        else {
                            pool.query(`
                                UPDATE users 
                                SET password = ${hashedPassword}
                                WHERE username = ${usename}
                            `, (error, results) => {
                                if (error) {
                                    response.status(500).send(error)
                                }
                                else {
                                    response.sendStatus(200)
                                }
                            })
                        }
                    })
                }
                else {
                    response.status(401).send("Unauthorized")
                }
            })
        })
    }
}
