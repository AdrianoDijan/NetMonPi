import requests as rq
import json


class VulnDescription():
    def __init__(self, cveNumber=None):
        self.cveNumber = cveNumber
        self.vulndescription = ""
        self.findVulnDescription(self.cveNumber)

    def findVulnDescription(self, cveNumber):
        apiResponse = rq.get("https://services.nvd.nist.gov/rest/json/cve/1.0/" + cveNumber).json()
        for cveItems in apiResponse["result"]["CVE_Items"]:
            vulnDescription = cveItems.get("cve").get("description").get("description_data")
            for descriptionData in vulnDescription:
                self.vulndescription = descriptionData.get("value")
