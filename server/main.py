from netscanner.network import Interface, Network
from snmpmonitor import snmp, influx

from vulnscanner.getcvedata import GetCveData
from vulnscanner.getapiresponse import GetApiResponse
from vulnscanner.dbcommunicator import DbCommunication
from vulnscanner.importexploitdata import ImportExploitData

import os
import logging
import time
import threading
import psycopg2
from datetime import datetime, timezone
import speedtest
import argparse
import configparser

def getSnmpDevices():
    devices = []
    for key in os.environ.items():
        if "SNMP_" in key:
            device = {}
            if "IP" in key:
                device['ip'] = os.environ.get(key)
            if "COMMUNITY" in key:
                device['community'] = os.environ.get(key)
            devices.append(device)
    return devices

def main():
    config = {
        "database": {
            "host": os.environ.get("POSTGRES_HOST"),
            "port": os.environ.get("POSTGRES_PORT"),
            "dbname": "netmonpi",
            "user": os.environ.get("POSTGRES_USER"),
            "password": os.environ.get("POSTGRES_PASSWORD")
        },
        "snmp": getSnmpDevices(),
        "network": {
            "interface": os.environ.get("NETWORK_IF"),
            "network": os.environ.get("NETWORK_ADDR"),
            "host": os.environ.get("NETWORK_HOST"),
            "gateway": os.environ.get("NETWORK_GATEWAY"),
            "netmask": os.environ.get("NETWORK_NETMASK")
        },
        "influxdb": {
            "host": os.environ.get("INFLUX_HOST"),
            "port": os.environ.get("INFLUX_PORT")
        }
    }

    loglevel = getattr(logging, "DEBUG", None)

    logging.basicConfig(level=loglevel,
                        format='%(asctime)s %(levelname)-8s %(message)s')
    logging.info("START")

    snmpThreads = []
    
    for device in config['snmp']:
        snmpThread = threading.Thread(target=snmpMonitoring, args=(device,config,))
        snmpThreads.append(snmpThread)

    for thread in snmpThreads:
        thread.start()

    daemonThread = threading.Thread(target=loopDaemon, args=(config['database'], config['network']))
    daemonThread.start()

    speedtestThread = threading.Thread(target=speedtestDaemon, args=(config,))
    speedtestThread.start()

    daemonThread.join()
    for thread in snmpThreads:
        thread.join()
    speedtestThread.join()

    logging.info("DONE")

def configParser(configFile):
    config = configparser.ConfigParser(strict=False)
    config.read(configFile)
    return {s:dict(config.items(s)) for s in config.sections()}


def runSpeedtest(config):
    threads = 4
    logging.info("Running speedtest")
    st = speedtest.Speedtest()
    st.get_best_server()
    st.download(threads=threads)
    st.upload(pre_allocate=False, threads=threads)
    st.results.share()

    results = st.results.dict()
    results = {
        "download": results["download"],
        "upload": results["upload"],
        "ping": results["ping"],
        "url": results["share"],
    }

    influx.writeSpeedtestMeasurement(config['network']['network'], results, config['influxdb'])

def speedtestDaemon(device):
    while True:
        runSpeedtest(device)
        time.sleep(30*60)


def snmpMonitoring(device, config):
    while True:
        try:
            results = snmp.getInterfaceData(device['ip'], device['community'])
            for interface in results:
                influx.writeInterfaceMeasurement(device['ip'], interface, config['influxdb'])
        except:
            pass
        time.sleep(1)

def loopDaemon(database, network):
    vulnScannerCount = 0
    while True:
        daemon(database, network)
        time.sleep(30)
        if not vulnScannerCount%5:
            vulnScanner(database)
        vulnScannerCount+=1

def daemon(database, network_conf):
    connStr = "dbname=%(dbname)s user=%(user)s host=%(host)s password='%(password)s' port=%(port)s" % database
    try:
        dbConn = psycopg2.connect(connStr)
        cursor = dbConn.cursor()
        logging.info("Connected to database [DB: {0}, host: {1}, port: {2}]".format(
                                database['dbname'], database['host'], database['port']))
    except Exception as e:
        logging.error("Connection to database failed")
        raise e

    # try:
    #     interface = Interface(network['interface'])
    # except Exception as e:
    #     logging.error("Error fetching interface data: {}".format(e))
        

    network = Network(network_conf['network'].split('/')[0], network_conf['netmask'])

    queryValues = network.as_dict()
    query = """
            SELECT netaddr FROM network 
            WHERE netaddr = %(netaddr)s
            """

    cursor.execute(query, queryValues)

    try:
        cursor.fetchone()[0]
        logging.info("Network already exists in database")
    except TypeError:
        logging.info("Adding network to database")
        query = """
                INSERT INTO network (netaddr, interface_name, network, netmask)
                VALUES(%(netaddr)s, %(interface_name)s, %(network)s, %(netmask)s)
                """
        queryValues = network.as_dict()
        try:
            queryValues['interface_name'] = interface.as_dict()['name']
        except:
            queryValues['interface_name'] = network_conf['interface']
        cursor.execute(query, queryValues)
        dbConn.commit()

    threadPool = []
    network.findHosts(threadPool)
    for thread in threadPool:
        thread.join()

    hostsRescanned = False

    def manageHost(host):
        with dbConn.cursor() as cursor:
            query = """
                    SELECT ip FROM host
                    WHERE mac = %(mac)s
                    """
            cursor.execute(query, host.as_dict())

            try:
                ip = cursor.fetchone()[0]
                logging.info("Host already exists in database")
                query = """
                        SELECT last_scanned
                        FROM host
                        WHERE mac = %(mac)s
                        """
                queryValues = host.as_dict()
                cursor.execute(query, queryValues)
                last_scanned = cursor.fetchone()[0]

                logging.info("Updating last seen field")
                query = """
                        UPDATE host
                        SET last_seen = %(timestamp)s, hostname = %(hostname)s
                        WHERE mac = %(mac)s
                        """
                queryValues = host.as_dict()
                queryValues['timestamp'] = datetime.now()
                cursor.execute(query, queryValues)
                dbConn.commit()

                if (divmod((datetime.now(timezone.utc) - last_scanned).total_seconds(), 3600)[0] >= 2):
                    logging.info("Updating services for host {}".format(host.as_dict()["hostname"]))
                    host.getOpenPorts()
                    queryValues = host.as_dict()
                    queryValues['netaddr'] = network.as_dict()['netaddr']
                    queryValues['timestamp'] = datetime.now()
                    query = """
                        UPDATE host
                        SET last_scanned = %(timestamp)s
                        WHERE mac = %(mac)s
                        """
                    cursor.execute(query, queryValues)
                    hostsRescanned = True

                if ip != host.as_dict()['ip']:
                    logging.info("IP address changed, updating ({} -> {}".format(ip, host.as_dict()['ip']))
                    query = """
                            UPDATE host
                            SET ip = %(ip)s
                            WHERE mac = %(mac)s
                            """
                    cursor.execute(query, host.as_dict())

                dbConn.commit()
            except:
                host.getOpenPorts()
                query = """
                        INSERT INTO host (mac, netaddr, first_seen, last_seen, ip, hostname, vendor)
                        VALUES (%(mac)s, %(netaddr)s, %(timestamp)s, %(timestamp)s, %(ip)s, %(hostname)s, %(vendor)s)
                        """
                queryValues = host.as_dict()
                queryValues['netaddr'] = network.as_dict()['netaddr']
                queryValues['timestamp'] = datetime.now()
                cursor.execute(query, queryValues)
                query = """
                        UPDATE host
                        SET last_scanned = %(timestamp)s
                        WHERE mac = %(mac)s
                        """
                cursor.execute(query, queryValues)
                dbConn.commit()
            
            for service in host.getServices():
                query = """
                        SELECT service_id FROM service
                        WHERE product = %(product)s
                        AND version = %(version)s
                        AND port = %(port)s
                        AND protocol = %(protocol)s
                        AND cpe = %(cpe)s
                        """

                queryValues = service.as_dict()
                cursor.execute(query, queryValues)

                try:
                    service_id = cursor.fetchone()[0]
                except TypeError:
                    query = """
                            INSERT INTO service (version, cpe, product, port, protocol)
                            VALUES (%(version)s, %(cpe)s, %(product)s, %(port)s, %(protocol)s)
                            RETURNING service_id
                            """
                    queryValues = service.as_dict()
                    cursor.execute(query, queryValues)
                    dbConn.commit()
                    service_id = cursor.fetchone()[0]

                query = """
                        SELECT service_id
                        FROM hostservice
                        WHERE mac = %(mac)s
                        AND service_id = %(service_id)s
                        """
                queryValues = {
                            'mac': host.as_dict()['mac'],
                            'service_id': service_id,
                            }
                cursor.execute(query, queryValues)
                dbConn.commit()

                try:
                    service_id = cursor.fetchone()[0]
                    logging.info("Item already exists in hostservice table")
                except TypeError:
                    query = """
                            INSERT INTO hostservice (mac, service_id)
                            VALUES (%(mac)s, %(service_id)s)
                            """
                    cursor.execute(query, queryValues)
                    dbConn.commit()

    threadList = []
    for host in network.getHosts():
        threadList.append(threading.Thread(target=manageHost, args=(host,)))

    for thread in threadList:
        thread.start()

    for thread in threadList:
        thread.join()
            
    dbConn.close()

    # logging.info("Running vulnscanner")
    # vulnScanner(database)

def vulnScanner(params=None):
    logging.info("Starting VulnScannerV2")
    queryDataList = DbCommunication(params=params).queryDataList
    for queryData in queryDataList:
        apiResponseJson = GetApiResponse(
            queryData["product"], queryData["version"], queryData["cpe"]).apiResponseJson
        exploitList = []
        if apiResponseJson != None and apiResponseJson.get("result") != None:
            if "CVE_Items" in apiResponseJson.get("result"):
                for cveItem in apiResponseJson.get("result").get("CVE_Items"):
                    exploitList.append(GetCveData(cveItem, queryData["serviceId"], queryData["product"], queryData["version"]).exploitDict)
        logging.info("Retrieved exploits sorting by base score")
        exploitList = sorted(
            filter(None, exploitList), key=lambda k: k['baseScore'], reverse=True)
        logging.info("Getting 3 best exploits")
        if exploitList:
            exploitCounter = 0
            for exploit in exploitList:
                if exploit["descriptionValue"] != "":
                    exploitList = exploitList[exploitCounter]
                    ImportExploitData(exploitList["cveNumber"], exploitList["referenceSource"], exploitList["descriptionValue"], exploitList["baseScore"], exploitList["serviceId"], params=params)
                    logging.info("Output exploits")
                    break
                exploitCounter += 1

if __name__ == '__main__':
    main()
