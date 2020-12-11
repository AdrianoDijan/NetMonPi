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

    # def checkReference(self, referenceItem, flag):
    #     if "tags" in referenceItem:
    #         for tag in referenceItem.get("tags"):
    #             if flag == True:
    #                 return True
    #             if (flag == False) and (tag == "Vendor Advisory"):
    #                 return True

    # def ifExploitExists(self, referenceData):
    #     itemIndex = 0
    #     for referenceItem in referenceData:
    #         for tag in referenceItem.get("tags"):
    #             if tag == "Exploit":
    #                 self.itemIndex = itemIndex
    #                 return True
    #             itemIndex += 1
    #     self.itemIndex = itemIndex
    #     return False

    # def checkReference(self, referenceItem, exploitFlag, vendorAdvisoryFlag):
    #     if exploitFlag:

        

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
            # else:
            #     exploitFlagDict["exploitExists"] = False
            #     exploitFlagDict["index"] = None
            #     self.referenceTagsMap.append(exploitFlagDict)
            if self.ifVendorAdvisoryExists(referenceItem):
                vendorAdvisoryFlagDict.update({'tag':'Vendor Advisory'})
                vendorAdvisoryFlagDict.update({'index':self.referenceItemIndex})
                # vendorAdvisoryFlagDict["tag"] = "Vendor Advisory"
                # vendorAdvisoryFlagDict["index"] = str(self.referenceItemIndex)
                self.referenceTagsMap.append(vendorAdvisoryFlagDict)
            # else:
            #     vendorAdvisoryFlagDict["vendorAdvisoryExists"] = False
            #     vendorAdvisoryFlagDict["index"] = None
            #     self.referenceTagsMap.append(vendorAdvisoryFlagDict)
            self.referenceItemIndex += 1

    def getReferenceItemByIndex(self):
        for tagsMap in self.referenceTagsMap:
            # for index, tag in tagsMap:
            if tagsMap["tag"] == "Exploit":
                return self.apiResponse[int(tagsMap["index"])]
            elif tagsMap["tag"] == "Vendor Advisory":
                return self.apiResponse[int(tagsMap["index"])]
            else:
                return self.apiResponse[0]
        return self.apiResponse[0]
        # if self.referenceTagsMap[0]["tag"] == "Exploit":
        #     return self.apiResponse[int(self.referenceTagsMap[0]["index"])]
        # elif self.referenceTagsMap[0]["tag"] == "Vendor Advisory":
        #     print(self.referenceTagsMap[0]["index"])
        #     return self.apiResponse[int(self.referenceTagsMap[0]["index"])]


    # def getReferenceByIndex(self, cveNumber):
    #     apiResponse = rq.get("https://services.nvd.nist.gov/rest/json/cve/1.0/" + cveNumber)
    #     apiResponse = apiResponse.json().get("result").get("CVE_Items")[0].get("cve").get("references").get("reference_data")
    #     flag = self.ifExploitExists(apiResponse)
    #     referenceName = apiResponse[self.itemIndex].get("name")
    #     referenceSource = apiResponse[self.itemIndex].get("refsource")
    #     referenceUrl = apiResponse[self.itemIndex].get("url")
    #     self.referencesDict["referenceName"] = referenceName
    #     self.referencesDict["referenceSource"] = referenceSource
    #     self.referencesDict["referenceUrl"] = referenceUrl