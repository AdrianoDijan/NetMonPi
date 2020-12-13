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

if __name__ == '__main__':
    main()
