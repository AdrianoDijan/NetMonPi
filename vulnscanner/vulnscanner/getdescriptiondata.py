import json

class GetDescriptionData():
    def __init__(self, cveItem = None):
        self.cveItem = cveItem
        self.descriptionValue = ""
        self.getDescription()

    def getDescription(self):
        for descriptionData in self.cveItem.get("cve").get("description").get("description_data"):
            self.descriptionValue = descriptionData.get("value")