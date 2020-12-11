import requests as rq
import json

class ReferenceData():
    def __init__(self, cveNumber = None):
        self.cveNumber = cveNumber
        self.referencesDict = {}
        self.referenceItemIndex = 0
        self.referenceTagsMap = []
        self.apiResponse = self.getApiResponse(cveNumber)
        self.mapReferenceIndexes()
        self.getReferenceData()

    def getApiResponse(self, cveNumber):
        apiResponse = rq.get("https://services.nvd.nist.gov/rest/json/cve/1.0/" + cveNumber)
        return apiResponse.json().get("result").get("CVE_Items")[0].get("cve").get("references").get("reference_data")

    def getReferenceData(self):
        referenceData = self.getReferenceItemByIndex()

        referenceName = referenceData.get("name")
        referenceSource = referenceData.get("refsource")
        referenceUrl = referenceData.get("url")
        self.referencesDict["referenceName"] = referenceName
        self.referencesDict["referenceSource"] = referenceSource
        self.referencesDict["referenceUrl"] = referenceUrl  

    def ifExploitExists(self, referenceItem):
        if "tags" in referenceItem:
            if any("Exploit" in tags for tags in referenceItem.get("tags")):
                return True
            return False

    def ifVendorAdvisoryExists(self, referenceItem):
        if "tags" in referenceItem:
            if any("Vendor Advisory" in tags for tags in referenceItem.get("tags")):
                return True
            return False

    def mapReferenceIndexes(self):
        self.referenceItemIndex = 0
        for referenceItem in self.apiResponse:
            exploitFlagDict = {}
            vendorAdvisoryFlagDict = {}
            if self.ifExploitExists(referenceItem):
                exploitFlagDict["tag"] = "Exploit"
                exploitFlagDict["index"] = str(self.referenceItemIndex)
                self.referenceTagsMap.append(exploitFlagDict)
            if self.ifVendorAdvisoryExists(referenceItem):
                vendorAdvisoryFlagDict.update({'tag':'Vendor Advisory'})
                vendorAdvisoryFlagDict.update({'index':self.referenceItemIndex})
                self.referenceTagsMap.append(vendorAdvisoryFlagDict)
            self.referenceItemIndex += 1

    def getReferenceItemByIndex(self):
        for tagsMap in self.referenceTagsMap:
            if tagsMap["tag"] == "Exploit":
                return self.apiResponse[int(tagsMap["index"])]
            elif tagsMap["tag"] == "Vendor Advisory":
                return self.apiResponse[int(tagsMap["index"])]
            else:
                return self.apiResponse[0]
        return self.apiResponse[0]