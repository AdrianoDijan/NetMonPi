import json
import logging

getImpactDataLogger = logging.getLogger(__name__)

class GetImpactData():
    def __init__(self, cveItem):
        getImpactDataLogger.info("Initializing GetImpactData __init__")
        self.cveItem = cveItem
        self.baseScore = 0
        self.getBaseScore()

    def getBaseScore(self):
        getImpactDataLogger.info("Exploit base score retrieval")
        if "impact" in self.cveItem:
            self.cveItem = self.cveItem.get("impact")
            if "baseMetricV3" in self.cveItem:
                if self.getBaseMetricV3Score() != True:
                    self.baseScore = 0
                getImpactDataLogger.info("Exploit base score V3 retrieval")
            if "baseMetricV2" and not "baseMetricV3" in self.cveItem:
                if self.getBaseMetricV2Score() != True:
                    self.baseScore = 0
                getImpactDataLogger.info("Exploit base score V2 retrieval")

    def getBaseMetricV3Score(self):
        if "cvssV3" in self.cveItem.get("baseMetricV3"):
            if "baseScore" in self.cveItem.get("baseMetricV3").get("cvssV3"):
                self.baseScore = self.cveItem.get("baseMetricV3").get("cvssV3").get("baseScore")
                if self.checkBaseScore():
                    return True

    def getBaseMetricV2Score(self):
        if "cvssV2" in self.cveItem.get("baseMetricV2"):
            if "baseScore" in self.cveItem.get("baseMetricV2").get("cvssV2"):
                self.baseScore = self.cveItem.get("baseMetricV2").get("cvssV2").get("baseScore")
                if self.checkBaseScore():
                    return True

    def checkBaseScore(self):
        if self.baseScore > 5.0:
            return True
        return True