class CheckVersion():
    def __init__(self, versionData=None, product=None, version=None):
        self.versionData = versionData
        self.product = product
        self.version = version
        self.replaceXInVersion()
        self.flag = self.checkVersion()

    def checkVersion(self):
        if "version" in self.versionData:
            for cpeVersion in self.versionData["version"]:
                if "version" in cpeVersion:
                    if self.version.lower() in cpeVersion["version"].lower():
                        return True
                if "versionEndIncluding" in cpeVersion:
                    if self.version.lower() in cpeVersion["versionEndIncluding"]:
                        return True
                if "versionEndExcluding" in cpeVersion:
                    if self.version.lower() in cpeVersion["versionEndExcluding"]:
                        return False
        return False

    def replaceXInVersion(self):
        self.version = self.version.lower()
        self.version = self.version.replace("x", "")