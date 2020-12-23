import json

class GetImpactData():
    def __init__(self, cveItem):
        self.cveItem = cveItem
        self.baseScore = 0
        self.getBaseScore()

    def getBaseScore(self):
        if "impact" in self.cveItem:
            self.cveItem = self.cveItem.get("impact")
        if "baseMetricV3" in self.cveItem:
            if self.getBaseMetricV3Score() != True:
                self.baseScore = 0
        if "baseMetricV2" and not "baseMetricV3" in self.cveItem:
            if self.getBaseMetricV2Score() != True:
                self.baseScore = 0

    def getBaseMetricV3Score(self):
        self.baseScore = self.cveItem.get("baseMetricV3").get("cvssV3").get("baseScore")
        if self.checkBaseScore():
            return True

    def getBaseMetricV2Score(self):
        self.baseScore = self.cveItem.get("baseMetricV2").get("cvssV2").get("baseScore")
        if self.checkBaseScore():
            return True

    def checkBaseScore(self):
        if self.baseScore > 5.0:
            return True
        return False