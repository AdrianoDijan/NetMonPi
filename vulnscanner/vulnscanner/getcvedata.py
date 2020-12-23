from vulnscanner.getreferencesdata import GetReferencesData
from vulnscanner.getdescriptiondata import GetDescriptionData
from vulnscanner.getimpactdata import GetImpactData
import json

class GetCveData():
    def __init__(self, cveItem=None):
        self.cveItem = cveItem
        self.exploitDict = {}
        self.getCveDataDict()

    def getCveDataDict(self):
        cveNumber = self.cveItem.get("cve").get("CVE_data_meta").get("ID")
        referenceDataDict = GetReferencesData(self.cveItem).referenceDataDict
        descriptionValue = GetDescriptionData(self.cveItem).descriptionValue
        baseScore = GetImpactData(self.cveItem).baseScore
        self.exploitDict.update(cveNumber=cveNumber, referenceSource=referenceDataDict["url"],
                                descriptionValue=descriptionValue, baseScore=baseScore)
