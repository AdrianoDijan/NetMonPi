import requests as rq
import json
from vulnscanner.description import VulnDescription
from vulnscanner.referenceData import ReferenceData

class GetCveNumbers():
    def __init__(self, product = None, version = None, port = None, protocol = None, cpe = None):
        self.product = product
        self.version = version
        self.port = port
        self.protocol = protocol
        self.cpe = cpe
        self.baseScoreList = []
        self.getBaseScore()

    def getBaseScore(self):
        if self.product or self.version:
            if self.product:
                requestUrl = "https://services.nvd.nist.gov/rest/json/cves/1.0?keyword=" + self.product
            elif self.version:
                requestUrl = requestUrl + " " + self.version
        elif self.cpe:
            requestUrl = "https://services.nvd.nist.gov/rest/json/cves/1.0?cpeMatchString=" + self.cpe
            
        apiResponse = rq.get(requestUrl)

        for cveItem in apiResponse.json().get("result").get("CVE_Items"):
            baseScoreDict = {}
            if "impact" in cveItem:
                impact = cveItem.get("impact")
                if "baseMetricV3" in impact:
                    baseMetricV3 = impact.get("baseMetricV3")
                    cvssV3 = baseMetricV3.get("cvssV3")
                    baseScore = cvssV3.get("baseScore")
                    if self.checkBaseScore(baseScore):     
                        cveNumber = self.getCveNumber(cveItem)
                        vulnDescription = VulnDescription(cveNumber).vulndescription
                        baseScoreDict["cveNumber"] = cveNumber
                        baseScoreDict["baseScore"] = baseScore
                        baseScoreDict["vulnDescription"] = vulnDescription
                        baseScoreDict = self.formatReferenceData(ReferenceData(cveNumber).referencesDict, baseScoreDict)
                        self.baseScoreList.append(baseScoreDict)
                elif "baseMetricV2" and not "baseMetricV3" in impact:
                    baseMetricV2 = impact.get("baseMetricV2")
                    cvssV2 = baseMetricV2.get("cvssV2")
                    baseScore = cvssV2.get("baseScore")
                    cveNumber = self.getCveNumber(cveItem)
                    vulnDescription = VulnDescription(cveNumber).vulndescription
                    baseScoreDict["cveNumber"] = cveNumber
                    baseScoreDict["baseScore"] = baseScore
                    baseScoreDict["vulnDescription"] = vulnDescription
                    self.baseScoreList.append(baseScoreDict)
        self.baseScoreList = sorted(self.baseScoreList, key=lambda k: k['baseScore'], reverse=True)
        self.baseScoreList = self.baseScoreList[:3]

    def getCveNumber(self, cveItem):
        return cveItem.get("cve").get("CVE_data_meta").get("ID")

    def checkBaseScore(self, baseScore):
        if baseScore > 5.0:
            return True

    def formatReferenceData(self, referenceDict, baseScoreDict):
        for key, value in referenceDict.items():
            baseScoreDict[key] = value
        return baseScoreDict
