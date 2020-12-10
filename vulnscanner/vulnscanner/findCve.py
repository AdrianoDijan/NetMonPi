import requests as rq
import json

class GetCveNumbers():
    def __init__(self, product = None, version = None, port = None, protocol = None, cpe = None):
        self.product = product
        self.version = version
        self.port = port
        self.protocol = protocol
        self.cpe = cpe
        self.baseScoreDict = {}
        self.baseScoreList = []

    def getBaseScore(self, vendorName, protocol):
        if self.product:
            apiResponse = rq.get("https://services.nvd.nist.gov/rest/json/cves/1.0?keyword=" + self.product + " " + self.version + "&resultsPerPage=5") # Returns latest 5 exploits
        elif self.cpe:
            apiResponse = rq.get("https://services.nvd.nist.gov/rest/json/cves/1.0?cpeMatchString=" + self.cpe + "&resultsPerPage=5") # Returns latest 5 exploits

        for cveItem in apiResponse.json().get("result").get("CVE_Items"):
            impact = cveItem.get("impact")
            if "baseMetricV3" in impact:
                cvssV3 = impact.get("cvssV3")
                baseScore = cvssV3.get("baseScore")
                cveNumber = self.getCveNumber(cveItem)
                self.baseScoreDict["cveNumber"] = cveNumber
                self.baseScoreDict["baseScore"] = baseScore
                self.baseScoreList.append(self.baseScoreDict)
            elif "baseMetricV2" in impact:
                cvssV2 = impact.get("cvssV2")
                baseScore = cvssV2.get("baseScore")
                cveNumber = self.getCveNumber(cveItem)
                self.baseScoreDict["cveNumber"] = cveNumber
                self.baseScoreDict["baseScore"] = baseScore
                self.baseScoreList.append(self.baseScoreDict)
            else: # Unknown basescore
                self.baseScoreDict["cveNumber"] = "Unknown"
                self.baseScoreDict["baseScore"] = "Unknown"
                self.baseScoreList.append(self.baseScoreDict)
        self.baseScoreList = sorted(self.baseScoreList, key=lambda k: k['baseScore'])

    def getCveNumber(self, cveItem):
        return cveItem.get("cve").get("CVE_data_meta").get("ID")
















    # def loopThroughNodesData(self, deviceName, protocol):
    #     if deviceName:
    #         response = rq.get("https://services.nvd.nist.gov/rest/json/cves/1.0?cpeMatchString=cpe:2.3:*:" + deviceName)
    #     else:
    #         response = rq.get("https://services.nvd.nist.gov/rest/json/cves/1.0?cpeMatchString=cpe:2.3:*:" + protocol)

    #     for cveItem in response.json().get("result").get("CVE_Items"):
    #         if "configurations" in cveItem:
    #             nodes = cveItem.get("configurations").get("nodes") 
    #             cpeDataList = []
    #             for nodesItem in nodes:
    #                 if "children" in nodesItem:
    #                     children = nodesItem.get("children")
    #                     for childrenItems in children:
    #                         cpeMatch = childrenItems.get("cpe_match")
    #                         cpe23Uri = self.getCpe23UriSplited(cpeMatch)
    #                         for cpeDataSet in returnedCpeDataList:
    #                             cpeDataList.append(cpeDataSet)
    #                 else:
    #                     cpeMatchList = nodesItem.get("cpe_match")
    #                     cpe23Uri = self.getCpe23UriSplited(cpeMatchList)
    #                     for cpeDataSet in returnedCpeDataList:
    #                             cpeDataList.append(cpeDataSet)
    #             printCve23UriData_v2(cpeDataList)
    #         else:
    #             pass #Set some var to None or Unknown -> cpe23 uri does not existž

    # def getCpe23UriSplited(self, cpeMatch):
    #     for cpeMatchItem in cpeMatch:
    #         cpe23Uri = cpeMatchItem.get("cpe23Uri")
    #         cpe23UriSplited = cpe23Uri.split(":")

    #     return cpe23UriSplited

