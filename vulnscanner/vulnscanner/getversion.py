import json

class GetVersion():
    def __init__(self, cveItem=None):
        self.cveItem = cveItem
        self.verOpDict = {}
        self.versionEndExcluding = []
        self.versionData = {}
        self.loopNodes()

    def getNodes(self):
        if self.cveItem and "configurations" in self.cveItem:
            if "nodes" in self.cveItem.get("configurations"):
                return self.cveItem.get("configurations").get("nodes")
        
    def loopNodes(self, flag=False):
        nodes = self.getNodes()
        childrenFlag = None
        versionStr = None
        searchMethod = self.searchMethod(flag)
        if nodes != None:
            for node in nodes:
                nodeOperator = node.get("operator")
                if nodeOperator == "AND":
                    if "children" in node:
                        childrenFlag = True
                        for children in node.get("children"):
                            childrenOperator = children.get("operator")
                            for cpeMatch in children.get("cpe_match"):
                                for version in searchMethod:
                                    if version in cpeMatch:
                                        versionStr = version
                                        versionData = cpeMatch.get(version)
                                        if version == "cpe23Uri":
                                            versionData = self.getCpeVersion(versionData)
                                        self.versionEndExcluding.append({versionStr:versionData})
                                        self.storeVerOpData(childrenOperator)
                elif nodeOperator == "OR":
                    childrenFlag = False
                    for cpeMatch in node.get("cpe_match"):
                        for version in searchMethod:
                            if version in cpeMatch:
                                versionStr = version
                                versionData = cpeMatch.get(version)
                                if version == "cpe23Uri":
                                    versionStr = "version"
                                    versionData = self.getCpeVersion(versionData)
                                self.versionEndExcluding.append({versionStr:versionData})
                                self.storeVerOpData(nodeOperator)
                if self.versionEndExcluding:
                    self.storeData(nodeOperator, childrenFlag)
                if self.versionData == {} and self.verOpDict == {} and flag == False:
                    flag = False
                    self.loopNodes(flag=True)
    
    def storeVerOpData(self, operator):
        self.verOpDict.update({'operator':operator})
        self.verOpDict.update({'version':self.versionEndExcluding})

    def storeData(self, operator, childrenFlag):
        self.versionData.update({'operator':operator})
        if childrenFlag == True:
            self.versionData.update({'childrenVersion':self.verOpDict})
        else:
            self.versionData.update({'version':self.versionEndExcluding})

    def searchMethod(self, searchFlag):
        if searchFlag == False:
            return ["versionEndExcluding", "versionEndIncluding"]
        else:
            return ["cpe23Uri"]

    def getCpeVersion(self, cpe23Uri):
        cpe23Uri = cpe23Uri.split(":")
        return cpe23Uri[5]
