from vulnscanner.getcvedata import GetCveData
from vulnscanner.getapiresponse import GetApiResponse
from vulnscanner.dbcommunicator import DbCommunication
from vulnscanner.importexploitdata import ImportExploitData
import logging
import os
import requests

'''
Search by product name and check version excluding with data in postgresql
If this condition is true fetch Description and chek for keyword count in description if grater than 1 accept
If API don't retreive result search by product name, get CVE with highest score and notify checking for version
Form an cpe23uri -> Form: cpe:2.3:[part=a/o/h]:[vendor]:[version]:*:*:*:*:*:*:*
'''

def main():
    resultsNum = 0
    logging.basicConfig(filename='vulnScannerLog.log', level=logging.INFO, format='%(asctime)s %(levelname)-8s %(message)s')
    logging.info("Starting VulnScannerV2")
    queryDataList = DbCommunication().queryDataList
    for queryData in queryDataList:
        apiResponseJson = GetApiResponse(
            queryData["product"], queryData["version"], queryData["cpe"]).apiResponseJson
        if queryData["product"] == "Microsoft HTTPAPI httpd":
            test = 0
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
                    #ImportExploitData(exploitList["cveNumber"], exploitList["referenceSource"], exploitList["descriptionValue"], exploitList["baseScore"], exploitList["serviceId"])

                    logging.info("Output exploits")
                    print("Exploit info for: {} - {}".format(queryData["product"], queryData["version"]))
                    for key, value in exploitList.items():
                        print(key, ' : ', value)
                    print("\n")
                    resultsNum += 1
                    break
                exploitCounter += 1
    print(resultsNum)

if __name__ == "__main__":
    main()
