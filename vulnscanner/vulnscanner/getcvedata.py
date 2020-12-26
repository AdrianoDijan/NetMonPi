from vulnscanner.getreferencesdata import GetReferencesData
from vulnscanner.getdescriptiondata import GetDescriptionData
from vulnscanner.getimpactdata import GetImpactData
import json
import logging

getCveDataLogger = logging.getLogger(__name__)

class GetCveData():
    def __init__(self, cveItem=None):
        getCveDataLogger.info("Initializing GetCveData __init__")
        self.cveItem = cveItem
        self.exploitDict = {}
        self.getCveDataDict()

    def getCveDataDict(self):
        getCveDataLogger.info("CVE number retrieval")
        cveNumber = self.cveItem.get("cve").get("CVE_data_meta").get("ID")
        if cveNumber != None:
            getCveDataLogger.info("CVE number retrieval successfull: {}".format(cveNumber))
        else:
            getCveDataLogger.info("Error in CVE number retrieval: {}")
        getCveDataLogger.info("Reference data retrieval")
        referenceDataDict = GetReferencesData(self.cveItem).referenceDataDict
        getCveDataLogger.info("Description data retrieval")
        descriptionValue = GetDescriptionData(self.cveItem).descriptionValue
        getCveDataLogger.info("Base score retrieval")
        baseScore = GetImpactData(self.cveItem).baseScore
        getCveDataLogger.info("Generating exploitDict")
        if baseScore != 0:
            self.exploitDict.update(cveNumber=cveNumber, referenceSource=referenceDataDict["url"],
                                    descriptionValue=descriptionValue, baseScore=baseScore)
