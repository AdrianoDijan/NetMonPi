import json
import logging

getReferenceDataLogger = logging.getLogger(__name__)

class GetReferencesData():
    def __init__(self, cveItem = None):
        getReferenceDataLogger.info("Initializing GetReferencesData __init__")
        self.cveItem = cveItem
        self.referenceTagAndIndexMap = []
        self.getReferenceData()
        self.referenceDataDict = self.getReferenceItemByIndex()

    def getReferenceData(self):
        getReferenceDataLogger.info("Looping through reference data list")
        for referenceDataItem in self.cveItem.get("cve").get("references").get("reference_data"):
            self.mapReferenceIndexes(referenceDataItem)

    def mapReferenceIndexes(self, referenceDataItem):
        getReferenceDataLogger.info("Mapping reference indexes")
        referenceItemIndex = 0
        exploitFlagDict = {}
        vendorAdvisoryFlagDict = {}
        getReferenceDataLogger.info("Checking for \"Exploit\" tag")
        if self.ifExploitExists(referenceDataItem):
            getReferenceDataLogger.info("Tag \"Exploit\" exists")
            exploitFlagDict["tag"] = "Exploit"
            exploitFlagDict["index"] = str(referenceItemIndex)
            self.referenceTagAndIndexMap.append(exploitFlagDict)
        getReferenceDataLogger.info("Checking for \"Vendor Advisory\" tag")
        if self.ifVendorAdvisoryExists(referenceDataItem):
            getReferenceDataLogger.info("Tag \"Vendor Advisory\" exists")
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
        getReferenceDataLogger.info("Reference item retrieval by index")
        for tagsMap in self.referenceTagAndIndexMap:
            if tagsMap["tag"] == "Exploit":
                return self.cveItem.get("cve").get("references").get("reference_data")[int(tagsMap["index"])]
            elif tagsMap["tag"] == "Vendor Advisory":
                return self.cveItem.get("cve").get("references").get("reference_data")[int(tagsMap["index"])]
            else:
                return self.cveItem.get("cve").get("references").get("reference_data")[0]
        return self.cveItem.get("cve").get("references").get("reference_data")[0]