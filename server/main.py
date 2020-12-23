from netscanner.host import Host
from netscanner.network import Network, Interface
from snmpmonitor import snmp, influx
import sys
import logging
import json
import time
import threading
import psycopg2
from datetime import datetime
import speedtest

def runSpeedtest(host):
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

    influx.writeSpeedtestMeasurement(host, results)

def speedtestDaemon(host):
    runSpeedtest(host)
    time.sleep(60*30)


def snmpMonitoring(host, community):
    while True:
        try:
            results = snmp.getInterfaceData(host, community)
            for interface in results:
                influx.writeInterfaceMeasurement(host, interface)
        except:
            pass
        time.sleep(1)


def main():
    logging.basicConfig(level=logging.INFO,
                        format='%(asctime)s %(levelname)-8s %(message)s')
    logging.info("START")

    snmpThread = threading.Thread(target=snmpMonitoring, args=("10.10.0.1", "hidden_pub"))
    snmpThread.start()

    daemonThread = threading.Thread(target=loopDaemon, args=("enp4s4",))
    daemonThread.start()

    speedtestThread = threading.Thread(target=speedtestDaemon, args=("10.10.0.9",))
    speedtestThread.start()

    daemonThread.join()
    snmpThread.join()
    speedtestThread.join()

    logging.info("DONE")

def loopDaemon(interface):
    while True:
        daemon(interface)
        time.sleep(30)

def daemon(interface):
    dbConnectionInfo = {
        'host': '10.10.0.9',
        'port': '5433',
        'dbname': 'netmonpi',
        'user': 'postgres',
        'password': 'MyikObi14hOS',
        }
    connStr = "dbname=%(dbname)s user=%(user)s host=%(host)s password='%(password)s' port=%(port)s" % dbConnectionInfo
    try:
        dbConn = psycopg2.connect(connStr)
        cursor = dbConn.cursor()
        logging.info("Connected to database [DB: {0}, host: {1}, port: {2}]".format(
                                dbConnectionInfo['dbname'], dbConnectionInfo['host'], dbConnectionInfo['port']))
    except Exception as e:
        logging.error("Connection to database failed")
        raise e

    try:
        interface = Interface(interface)
    except Exception as e:
        logging.error("Error fetching interface data: {}".format(e))
        raise e
        
    network = interface.getNetwork()
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
        queryValues['interface_name'] = interface.as_dict()['name']
        cursor.execute(query, queryValues)
        dbConn.commit()

    threadPool = []
    network.findHosts(threadPool)
    for thread in threadPool:
        thread.join()

    for host in network.getHosts():
        query = """
                SELECT ip FROM host
                WHERE mac = %(mac)s
                """

        cursor.execute(query, host.as_dict())

        try:
            ip = cursor.fetchone()[0]
            logging.info("Host already exists in database")
            if ip != host.as_dict()['ip']:
                logging.info("IP address changed, updating ({} -> {}".format(ip, host.as_dict()['ip']))
                query = """
                        UPDATE host
                        SET ip = %(ip)s
                        WHERE mac = %(mac)s
                        """
                cursor.execute(query, host.as_dict())
            logging.info("Updating last seen field")
            query = """
                    UPDATE host
                    SET last_seen = %(timestamp)s
                    WHERE mac = %(mac)s
                    """
            queryValues = host.as_dict()
            queryValues['timestamp'] = datetime.now()
            cursor.execute(query, queryValues)
            dbConn.commit()
        except TypeError:
            host.getOpenPorts()
            query = """
                    INSERT INTO host (mac, netaddr, first_seen, last_seen, ip, hostname, vendor)
                    VALUES (%(mac)s, %(netaddr)s, %(timestamp)s, %(timestamp)s, %(ip)s, %(hostname)s, %(vendor)s)
                    """
            queryValues = host.as_dict()
            queryValues['netaddr'] = network.as_dict()['netaddr']
            queryValues['timestamp'] = datetime.now()
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
                        VALUES (%(service)s, %(cpe)s, %(product)s, %(port)s, %(protocol)s)
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

    dbConn.close()

if __name__ == '__main__':
    main()
