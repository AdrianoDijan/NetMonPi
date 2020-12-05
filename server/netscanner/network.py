#!/usr/bin/env python3

import nmap3
import netifaces as ni
import ipaddress

from .host import Host

class Network():
    def __init__(self, netaddr="0.0.0.0", netmask="0.0.0.0"):
        self.netaddr = netaddr
        self.netmask = netmask

def getInterfaceAddress(interface):
    try:
        return ni.ifaddresses(interface)[ni.AF_INET][0]['addr']
    except:
        return "UNKNOWN"


def getInterfaceNetmask(interface):
    try:
        return ni.ifaddresses(interface)[ni.AF_INET][0]['netmask']
    except:
        return "UNKNOWN"


def calculateNetwork(host, netmask):
    try:
        IP = ipaddress.IPv4Address(host)
        network = ipaddress.IPv4Network(host + '/' + netmask, False)
        return str(ipaddress.IPv4Address(int(IP) & int(network.netmask))) + '/' + str(network.prefixlen)
    except:
        return "UNKNOWN"


def getAllInterfaces(skipDocker=False, skipLocalhost=True):
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


def findOnlineHosts(interfaces):
    nmap = nmap3.NmapHostDiscovery()
    hosts_up = []

    for interface in interfaces:
        if getInterfaceAddress(interface) not in ("UNKNOWN", "127.0.0.1"):
            subnet = calculateNetwork(getInterfaceAddress(
                interface), getInterfaceNetmask(interface))
            results = nmap.nmap_no_portscan(subnet)
            hosts = {"subnet": subnet, "hosts": results["hosts"]}
            hosts_up.append(hosts)

    return hosts_up