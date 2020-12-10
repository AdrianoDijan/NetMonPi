import requests as rq
import json

class ReferenceData():
    def __init__(self, cveNumber = None):
        self.cveNumber = cveNumber

    def getReferenceData(self, cveNumber):
        apiResponse = rq.get("https://services.nvd.nist.gov/rest/json/cve/1.0/" + cveNumber)
        referencesList = []
        referencesDict = {}
        for cveItems in apiResponse["result"]["CVE_Items"]:
            references = cveItems.get("cve").get("references").get("reference_data")
            for referencesItems in references:
                referenceName = referencesItems.get("name")
                referenceSource = referencesItems.get("refsource")
                referenceUrl = referencesItems.get("url")
                referencesDict["referenceName"] = referenceName
                referencesDict["referenceSource"] = referenceSource
                referencesDict["referenceUrl"] = referenceUrl
                referencesItems.append(references)
        return referencesList