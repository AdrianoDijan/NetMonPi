from influxdb import InfluxDBClient
from datetime import datetime
import logging

def writeInterfaceMeasurement(host, if_dict):
    client = InfluxDBClient("10.10.0.9", 8086)

    dbs = 0

    try:
        dbs = client.get_list_database()
    except:
        logging.error("Connection to database failed.")
        raise ConnectionError

    dbExists = False
    for db in dbs:
        if db['name'] == "netmonpi":
            dbExists = True
            break

    if not dbExists:
        logging.info("Database doesn't exist")
        logging.info("Creating database netmonpi")
        client.create_database('netmonpi')

    client.switch_database('netmonpi')

    json_body = [{
        "measurement": "ifBandwidth",
        "tags": {
            "host": host,
            "interface": if_dict['name'],
        },
        "time": datetime.utcnow().strftime('%Y-%m-%dT%H:%M:%SZ'),
        "fields": {
            "txInOctets": if_dict["txInOctets"],
            "txOutOctets": if_dict["txOutOctets"]
        }
    }]

    if client.write_points(json_body, time_precision='ms'):
        logging.debug("Data written to influxdb for interface {}, host {}".format(if_dict['name'], host))


from influxdb import InfluxDBClient
from datetime import datetime
import logging

def writeSpeedtestMeasurement(host, result_dict):
    client = InfluxDBClient("10.10.0.9", 8086)

    dbs = 0

    try:
        dbs = client.get_list_database()
    except:
        logging.error("Connection to database failed.")
        raise ConnectionError

    dbExists = False
    for db in dbs:
        if db['name'] == "netmonpi":
            dbExists = True
            break

    if not dbExists:
        logging.info("Database doesn't exist")
        logging.info("Creating database netmonpi")
        client.create_database('netmonpi')

    client.switch_database('netmonpi')

    json_body = [{
        "measurement": "speedtest",
        "tags": {
            "host": host,
        },
        "time": datetime.utcnow().strftime('%Y-%m-%dT%H:%M:%SZ'),
        "fields": result_dict,
    }]

    if client.write_points(json_body, time_precision='ms'):
        logging.info("Speedtest data written to influxdb [{}], host {}".format((result_dict), host))
