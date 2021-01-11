from vulnscanner.getcvedata import GetCveData
from vulnscanner.getapiresponse import GetApiResponse
from vulnscanner.dbcommunicator import DbCommunication
from vulnscanner.importexploitdata import ImportExploitData
import logging
import os
import requests

def main(params=None):
    logging.basicConfig(filename='vulnScannerLog.log', level=logging.INFO, format='%(asctime)s %(levelname)-8s %(message)s')
    logging.info("Starting VulnScannerV2")
    queryDataList = DbCommunication(params=params).queryDataList
    for queryData in queryDataList:
        apiResponseJson = GetApiResponse(
            queryData["product"], queryData["version"], queryData["cpe"]).apiResponseJson
        exploitList = []
        if apiResponseJson != None and apiResponseJson.get("result") != None:
            if "CVE_Items" in apiResponseJson.get("result"):
                for cveItem in apiResponseJson.get("result").get("CVE_Items"):
                    exploitList.append(GetCveData(cveItem, queryData["serviceId"], queryData["product"], queryData["version"]).exploitDict)
        logging.info("Retrieved exploits sorting by base score")
        exploitList = sorted(
            filter(None, exploitList), key=lambda k: k['baseScore'], reverse=True)
        logging.info("Getting 3 best exploits")
        if exploitList:
            exploitCounter = 0
            for exploit in exploitList:
                if exploit["descriptionValue"] != "":
                    exploitList = exploitList[exploitCounter]
                    ImportExploitData(exploitList["cveNumber"], exploitList["referenceSource"], exploitList["descriptionValue"], exploitList["baseScore"], exploitList["serviceId"], params=params)
                    logging.info("Output exploits")
                    break
                exploitCounter += 1

if __name__ == "__main__":
    main(params={'host': 'pgadmin.adrianodijan.com', 'port': '5433', 'database': 'netmonpi', 'user': 'postgres', 'password': 'MyikObi14hOS'})