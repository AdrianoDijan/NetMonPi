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
    network = if_dict["network"]
    cidrNetwork = if_dict["network"]["network"]
    netaddr = if_dict["network"]["netaddr"]
    netmask = if_dict["network"]["netmask"]
    # Relacija -> network
    #   INSERT INTO network (netaddr, interface_name, network, netmask)
    #   VALUES('/*netaddr*/', '/*name*/', '/*cidrNetwork*/', '/*netmask*/')
    for host in network["hosts"]:
        ip_addr = host["ip"]
        mac = host["mac"]
        vendor = host["vendor"]
        #SPREMI HOST
        #Relacija -> host
        #   INSERT INTO host (mac, netaddr, last_seen, ip, hostname)
        #   VALUES ('/*mac*/', /*netaddr*/ '/*datetime.datetime.now()*/', '/*ip*/', '/*hostname*/')
        for service in host["services"]:
            product = service["product"]
            version = service["version"]
            port = service["port"]
            protocol = service["protocol"]
            cpe = service["cpe"]
            #SPREMI SERVIS
            #Relacija -> service
            #   INSERT INTO service (version, cpe, product, port, protocol)
            #   VALUES ('/*version*/', '/*cpe*/', '/*product*/', '/*port*/', '/*protocol*/')
            #--------------------------------------------------------------------------> ova dva upita gornji i donji tribaju ic tim redom inace nece radit
            #   INSERT INTO hostservice (mac, service_id)
            #   VALUES ('/*mac*/', (SELECT service_id FROM service WHERE product = product AND version = version AND port = port AND protocol = protocol AND cpe = cpe)) -> ovdi nakon where znaci (stupac u relaciji) = (varijabla u kodu)
            #Ako mozes dodaj uvijet da ispituje po bazi ako npr. vec taj service postoji tj upisan je u bazu, jer sam stavija da je PK serial tj sam se generira pa nece javit gresku da su isti redovi u tablici
            #To ispitivanje mozes napravit za sve i onda mogu ako triba napravit da ako postoji da update-a taj redak
            #ovo kod VALUES unutar zagrade npr. '/*mac*/' znaci da zapravo triba bit ovako -> 'vrijednost mac varijable'
### Mores queryje samo ka stringove napisati pa cu ih ja ubaciti kad instaliran taj mysql driver

if __name__ == '__main__':
    main()
