from netscanner.host import Host
from netscanner.network import getAllInterfaces

h1 = Host(ip="10.10.0.2")
h1.getOpenPorts()
for port in h1.ports:
    print(port)

print(getAllInterfaces(skipLocalhost=True, skipDocker=True))