from vulnscanner.description import VulnDescription
from vulnscanner.findCve import GetCveNumbers
from vulnscanner.referenceData import ReferenceData
import json

def main():
    cveList = GetCveNumbers("Mikrotik", None, None, None, None).baseScoreList
    for item in cveList:
        for key, value in item.items():
            print(key, ' : ', value)
        print("\n\n")



if __name__ == "__main__":
    main()

