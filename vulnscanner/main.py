from vulnscanner.description import VulnDescription
from vulnscanner.findCve import GetCveNumbers
from vulnscanner.referenceData import ReferenceData

def main():
    dict_test = {
        "product": "OpenSSH",
        "version": "None",
        "port": "22",
        "protocol": "tcp"
    }
    cveList = GetCveNumbers(dict_test["product"], None, None, None, None).baseScoreList
    print(cveList)


if __name__ == "__main__":
    main()

