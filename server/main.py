from netscanner.host import Host
from netscanner.network import Network, Interface
import sys
import logging
import json

def main():
    logging.basicConfig(level=logging.INFO, format='%(asctime)s %(levelname)-8s %(message)s')
    logging.info("START")
    i1 = Interface("enp4s4")
    logging.info("DONE")
    with open("f1.json", "w") as jsonfile:
        json.dump(i1.as_dict(), jsonfile)

if __name__ == '__main__':
    main()