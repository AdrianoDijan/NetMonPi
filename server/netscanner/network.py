#!/usr/bin/env python3

import nmap3
import netifaces as ni
import ipaddress
import logging
from concurrent.futures import ThreadPoolExecutor
import threading

from .host import Host


class Network():
    def __init__(self, ifaddr="0.0.0.0", netmask="0.0.0.0"):
        logging.info("Network __init__, args: {}".format([ifaddr, netmask]))
        self._net = ipaddress.IPv4Interface(ifaddr + '/' + netmask).network
        self._netaddr = ipaddress.IPv4Interface(
            ifaddr + '/' + netmask).network.network_address
        self._netmask = ipaddress.IPv4Interface(ifaddr + '/' + netmask).netmask
        self._hosts = []

    def __str__(self):
        return "Network: {}\nHosts: {}".format(self._netaddr, [str(host) for host in self._hosts])

    def as_dict(self):
        return {
            "network": str(self._net),
            "netaddr": str(self._netaddr),
            "netmask": str(self._netmask),
            "hosts": [host.as_dict() for host in self._hosts]
        }

    def setNetAddr(self, netaddr):
        self._netaddr = netaddr

    def getNetAddr(self):
        return self._netaddr

    def setNetmask(self, netmask):
        self._netmask = netmask

    def getNetmask(self):
        return self._netmask

    def createHost(self, ip_addr, mac_addr, hostname):
        self._hosts.append(
            Host(
                ipaddress.IPv4Address(ip_addr),
                mac_addr,
                hostname,
            )
        )
        
    def findHosts(self, threadPool):
        nmap = nmap3.NmapScanTechniques()
        logging.info("Network findHosts")
        if str(self._netaddr) not in ("UNKNOWN", "127.0.0.1"):
            logging.info("Finding hosts for interface {}".format(str(ipaddress.IPv4Interface(
                str(self._netaddr) + '/' + str(self._netmask)))))
            results = nmap.nmap_ping_scan(
                str(self._netaddr) + '/' + str(self._net.prefixlen))
            for host in results:
                if host['reason'] != 'localhost-reponse':
                    ip = "0.0.0.0"
                    mac = "00:00:00:00:00:00"
                    try:
                        hostname = host['hostname'][0]['name']
                    except IndexError:
                        hostname = "UNKNOWN"
                    for addr in host['addresses']:
                        if addr['addrtype'] == 'ipv4':
                            ip = addr['addr']
                        elif addr['addrtype'] == 'mac':
                            mac = addr['addr']
                    thread = threading.Thread(target=self.createHost, args=(ip, mac, hostname))
                    threadPool.append(thread)
                    thread.start()
            
    def getHosts(self):
        return self._hosts

class Interface():
    def __init__(self, name):
        self._name = name
        self._network = Network(
            self.getInterfaceAddress(), self.getInterfaceNetmask())

    def __str__(self):
        return "Name: {}\nNetwork: {}".format(self._name, str(self._network))

    def as_dict(self):
        return {
            "name": self._name,
            "network": self._network.as_dict()
        }

    def getInterfaceAddress(self):
        try:
            return ni.ifaddresses(self._name)[ni.AF_INET][0]['addr']
        except:
            return "UNKNOWN"

    def getInterfaceNetmask(self):
        try:
            return ni.ifaddresses(self._name)[ni.AF_INET][0]['netmask']
        except:
            return "UNKNOWN"

    def getAllInterfaces(self, skipDocker=False, skipLocalhost=True):
        interfaces = ni.interfaces()
        if skipDocker:
            interfaces = []
            for interface in ni.interfaces():
                dockerList = ["veth", "br", "docker", "lo"]
                if not any(substring in interface for substring in dockerList):
                    interfaces.append(interface)
        if not skipLocalhost:
            if "lo" not in interfaces:
                interfaces.append("lo")
        return interfaces

    def getNetwork(self):
        return self._network