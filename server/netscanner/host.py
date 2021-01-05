#!/usr/bin/env python3

import nmap3
import netifaces as ni
import ipaddress
from concurrent.futures import ThreadPoolExecutor
from mac_vendor_lookup import MacLookup
import json
import logging


class Host():
    def __init__(self, ip, mac, hostname):
        self._ip = ip
        self._mac = mac
        self._hostname = hostname
        try:
            self._vendor = "UNKNOWN" if mac == "00:00:00:00:00:00" else MacLookup().lookup(self._mac)
        except:
            self._vendor = "UNKNOWN"
        logging.info("New host created [IP: {}, MAC: {}, Vendor: {}]".format(self._ip, self._mac, self._vendor))
        self._services = []

    def __str__(self):
        return "IP: {0} MAC: {1} OS: {2} Services: {3}".format(self._ip, "", "", [str(service) for service in self._services])

    def as_dict(self):
        return {
            "ip": str(self._ip),
            "mac": str(self._mac),
            "vendor": str(self._vendor),
            "hostname": str(self._hostname),
            "services": [service.as_dict() for service in self._services]
        }

    def getOpenPorts(self):
        logging.info("Scanning open ports for host {}".format(str(self._ip)))
        nmap = nmap3.Nmap()
        ports = nmap.nmap_version_detection(str(self._ip))
        try:
            for port in ports:
                portid = port["port"]
                protocol = port["protocol"]
                try:
                    product = port["service"]["product"]
                except:
                    product = ""
                try:
                    version = port["service"]["version"]
                except:
                    version = ""
                try:
                    cpe = port["cpe"][0]["cpe"]
                except:
                    cpe = ""
                logging.info("New service found [Port: {}, Protocol: {}]".format(portid, protocol))
                self._services.append(Service(product, version, portid, protocol, cpe))
        except:
            logging.error("Error scanning open ports, host: {}".format(str(self._ip)))

    def getOSInfo(self):
        logging.info("Getting OS info for host {}".format(str(self._ip)))
        nmap = nmap3.Nmap()
        results = nmap.nmap_os_detection(str(self._ip))
        logging.info(results)

    def getServices(self):
        return self._services


class Service():
    def __init__(self, product, version, port, protocol, cpe):
        self._product = product
        self._version = version
        self._port = port
        self._protocol = protocol
        self._cpe = cpe

    def __str__(self):
        return "Product: {}, Version: {}, Port: {}, Protocol: {}".format(self._product, self._version, self._port, self._protocol)

    def as_dict(self):
        return {
            "product": self._product,
            "version": self._version,
            "port": self._port,
            "protocol": self._protocol,
            "cpe": self._cpe,
        }
