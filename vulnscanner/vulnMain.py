from vulnscanner.getcvedata import GetCveData
from vulnscanner.getapiresponse import GetApiResponse
from vulnscanner.dbcommunicator import DbCommunication
import logging
import os
import requests


def main():
    logging.info("Starting VulnScannerV2")
    queryDataList = DbCommunication().queryDataList
    for queryData in queryDataList:
        apiResponseJson = GetApiResponse(
            queryData["product"], queryData["version"], queryData["cpe"], queryData["vendor"]).apiResponseJson
        exploitList = []
        if apiResponseJson != None and apiResponseJson.get("result") != None:
            if "CVE_Items" in apiResponseJson.get("result"):
                for cveItem in apiResponseJson.get("result").get("CVE_Items"):
                    exploitList.append(GetCveData(cveItem).exploitDict)

        logging.info("Retrieved exploits sorting by base score")
        exploitList = sorted(
            filter(None, exploitList), key=lambda k: k['baseScore'], reverse=True)
        logging.info("Getting 3 best exploits")
        exploitList = exploitList[:3]

        logging.info("Output exploits")
        for item in exploitList:
            for key, value in item.items():
                print(key, ' : ', value)
            print("\n")


if __name__ == "__main__":
    main()
