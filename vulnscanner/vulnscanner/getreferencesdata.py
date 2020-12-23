import json

class GetReferencesData():
    def __init__(self, cveItem = None):
        self.cveItem = cveItem
        self.referenceTagAndIndexMap = []
        self.getReferenceData()
        self.referenceDataDict = self.getReferenceItemByIndex()

    def getReferenceData(self):
        for referenceDataItem in self.cveItem.get("cve").get("references").get("reference_data"):
            self.mapReferenceIndexes(referenceDataItem)

    def mapReferenceIndexes(self, referenceDataItem):
        referenceItemIndex = 0
        exploitFlagDict = {}
        vendorAdvisoryFlagDict = {}
        if self.ifExploitExists(referenceDataItem):
            exploitFlagDict["tag"] = "Exploit"
            exploitFlagDict["index"] = str(referenceItemIndex)
            self.referenceTagAndIndexMap.append(exploitFlagDict)
        if self.ifVendorAdvisoryExists(referenceDataItem):
            vendorAdvisoryFlagDict.update({'tag':'Vendor Advisory'})
            vendorAdvisoryFlagDict.update({'index':referenceItemIndex})
            self.referenceTagAndIndexMap.append(vendorAdvisoryFlagDict)
        referenceItemIndex += 1

    def ifExploitExists(self, referenceDataItem):
        if "tags" in referenceDataItem:
            if any("Exploit" in tags for tags in referenceDataItem.get("tags")):
                return True
            return False

    def ifVendorAdvisoryExists(self, referenceDataItem):
        if "tags" in referenceDataItem:
            if any("Vendor Advisory" in tags for tags in referenceDataItem.get("tags")):
                return True
            return False

    def getReferenceItemByIndex(self):
        for tagsMap in self.referenceTagAndIndexMap:
            if tagsMap["tag"] == "Exploit":
                return self.cveItem.get("cve").get("references").get("reference_data")[int(tagsMap["index"])]
                # return self.apiResponse[int(tagsMap["index"])]
            elif tagsMap["tag"] == "Vendor Advisory":
                return self.cveItem.get("cve").get("references").get("reference_data")[int(tagsMap["index"])]
                # return self.apiResponse[int(tagsMap["index"])]
            else:
                return self.cveItem.get("cve").get("references").get("reference_data")[0]
        return self.cveItem.get("cve").get("references").get("reference_data")[0]