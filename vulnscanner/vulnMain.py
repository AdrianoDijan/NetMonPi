from vulnscanner.getcvedata import GetCveData
from vulnscanner.getapiresponse import GetApiResponse

def main():
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