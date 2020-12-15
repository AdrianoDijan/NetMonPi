from vulnscanner.description import VulnDescription
from vulnscanner.findCve import GetCveNumbers
from vulnscanner.referenceData import ReferenceData
from vulnscanner.api import Api
import json

def main():
    apiResponseJson = Api("Mikrotik", "UNKNOWN", "UNKNOWN", "UNKNOWN", "UNKNOWN").apiResponseJson
    cveList = GetCveNumbers(apiResponseJson).baseScoreList
    for item in cveList:
        for key, value in item.items():
            print(key, ' : ', value)
        print("\n\n")



if __name__ == "__main__":
    main()

