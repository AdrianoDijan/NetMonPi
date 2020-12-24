from vulnscanner.getcvedata import GetCveData
from vulnscanner.getapiresponse import GetApiResponse
import logging

def main():
    logging.basicConfig(level=logging.INFO, format='%(asctime)s %(levelname)-8s %(message)s')
    logging.info("Starting VulnScannerV2")
    apiResponseJson = GetApiResponse("Mikrotik", "UNKNOWN", "UNKNOWN", "UNKNOWN", "UNKNOWN").apiResponseJson
    exploitList = []
    for cveItem in apiResponseJson.get("result").get("CVE_Items"):
        exploitList.append(GetCveData(cveItem).exploitDict)

    exploitList = sorted(exploitList, key=lambda k: k['baseScore'], reverse=True)
    exploitList = exploitList[:3]

    for item in exploitList:
        for key, value in item.items():
            print(key, ' : ', value)
        print("\n\n")

if __name__ == "__main__":
    main()