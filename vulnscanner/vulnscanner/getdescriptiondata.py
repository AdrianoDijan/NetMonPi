import json
import logging

getDescriptionDataLogger = logging.getLogger(__name__)

class GetDescriptionData():
    def __init__(self, cveItem = None):
        getDescriptionDataLogger.info("Initializing GetDescriptionData __init__")
        self.cveItem = cveItem
        self.descriptionValue = ""
        self.getDescription()

    def getDescription(self):
        for descriptionData in self.cveItem.get("cve").get("description").get("description_data"):
            self.descriptionValue = descriptionData.get("value")
        getDescriptionDataLogger.info("Description value retrieval successfull")