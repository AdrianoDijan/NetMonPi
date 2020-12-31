import json
import logging

getDescriptionDataLogger = logging.getLogger(__name__)

class GetDescriptionData():
    def __init__(self, cveItem = None, product=None, version=None):
        getDescriptionDataLogger.info("Initializing GetDescriptionData __init__")
        self.cveItem = cveItem
        self.product = product
        self.version = version
        self.descriptionValue = ""
        self.possibleDescriptionValue = ""
        self.getDescription()

    def getDescription(self):
        for descriptionData in self.cveItem.get("cve").get("description").get("description_data"):
            self.possibleDescriptionValue = descriptionData.get("value")
            if self.checkDescRelevance():
                self.descriptionValue = self.possibleDescriptionValue
                getDescriptionDataLogger.info("Description value retrieval successfull")

    def checkDescRelevance(self):
        if self.possibleDescriptionValue != "":
            searchPhrase = self.product + " " + self.version
            searchPhrase = searchPhrase.split(" ")
            matchedWordsCounter = 0
            for string in searchPhrase:
                if string.lower() in self.possibleDescriptionValue.lower():
                    matchedWordsCounter += 1

            if matchedWordsCounter % len(searchPhrase) >= len(searchPhrase) / 2:
                return True
            return False              