from netscanner.host import Host
from netscanner.network import Network, Interface
from snmpmonitor import snmp, influx
import sys
import logging
import json
import time
import threading

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
    logging.basicConfig(level=logging.DEBUG, format='%(asctime)s %(levelname)-8s %(message)s')
    logging.info("START")

    snmpThread = threading.Thread(target=snmpMonitoring, args=("10.10.0.1", "hidden_pub"))
    snmpThread.start()

    i1 = Interface("enp4s4")
    logging.info("DONE")
    with open("f1.json", "w") as jsonfile:
        json.dump(i1.as_dict(), jsonfile)

def pushToDb(if_dict):
    name = if_dict["name"]
    #SPREMI IME INTERFACEA
    network = if_dict["network"]
    netaddr = if_dict["network"]["netaddr"]
    netmask = if_dict["network"]["netmask"]
    for host in network["hosts"]:
        ip_addr = host["ip"]
        mac = host["mac"]
        vendor = host["vendor"]
        #SPREMI HOST
        for service in host["services"]:
            product = service["product"]
            version = service["version"]
            port = service["port"]
            protocol = service["protocol"]
            cpe = service["cpe"]
            #SPREMI SERVIS

### Mores queryje samo ka stringove napisati pa cu ih ja ubaciti kad instaliran taj mysql driver

if __name__ == '__main__':
    main()
