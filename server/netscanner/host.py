#!/usr/bin/env python3

import nmap3
import netifaces as ni
import ipaddress

class Host():
    def __init__(self, ip=ipaddress.IPv4Address("0.0.0.0"), mac="00:00:00:00:00:00", portlist=[]):
        self.ip = ip
        self.mac = mac
        self.ports = portlist

    def getOpenPorts(self):
        nmap = nmap3.NmapHostDiscovery()
        ports = nmap.nmap_portscan_only(str(self.ip))
        for port in ports[self.ip]:
            self.ports.append({"portid": port["portid"], "protocol": port["protocol"], "service": port["service"]["name"]})
        
