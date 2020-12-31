import requests as rq
import json
import logging

getApiResponseLogger = logging.getLogger(__name__)

class GetApiResponse():
    def __init__(self, product = None, version = None, cpe = None):
        getApiResponseLogger.info("GetApiResponse __init__, args: {}".format([product, version, cpe]))
        self.product = product
        self.version = version
        self.cpe = cpe
        self.apiResponseJson = None
        self.formedCpe = None
        self.requestUrl = ""
        self.cpeFlag = None
        self.getApiResponse()

    def getApiResponse(self):
        if self.searchProductVersion() == None:
            self.apiResponseJson = None
            return
        self.cpeFlag = self.checkNumberOfResult()
        while self.cpeFlag == False and self.version:
            self.cpeFlag = self.checkNumberOfResult()
            self.alterRequestUrl()
            self.searchProductVersion()

        if not self.version and self.cpeFlag == False:
            if self.searchCpe23Uri():
                if self.checkNumberOfResult():
                    self.retrieveApiResponse()
                else:
                    self.apiResponseJson = None
            else:
                self.apiResponseJson = None
        else:
            self.retrieveApiResponse()

    def formCpe23Uri(self):
        dbCpe = self.cpe.split(":")
        print(dbCpe)
        self.formedCpe = "cpe:2.3:" + dbCpe[2] + ":"
        if dbCpe[4] != self.product:
            self.formedCpe = self.formedCpe + self.product
        if len(dbCpe) >= 6 and dbCpe[5] != self.version:
            self.formedCpe = self.formedCpe + self.version

    def searchCpe23Uri(self):
        if self.cpe != "":
            getApiResponseLogger.info("Searching by cpe23uri: {}".format(self.cpe))
            self.requestUrl = "https://services.nvd.nist.gov/rest/json/cves/1.0?cpeMatchString=" + self.cpe
            return True
        else:
            return False

    def searchProductVersion(self):
        if self.product != "" and self.version != "":
            getApiResponseLogger.info("Searching by product name: {}".format(self.product))
            keyword = self.product
            getApiResponseLogger.info("Adding product version to search: {}".format(self.version))
            keyword = keyword + " " + self.version
            self.requestUrl = "https://services.nvd.nist.gov/rest/json/cves/1.0?keyword=" + keyword
            return True
        else:
            return None

    def checkNumberOfResult(self):
        self.apiResponseJson = rq.get(self.requestUrl)
        if self.apiResponseJson.status_code == 200:
            if self.requestUrl != "" and self.apiResponseJson.json()["totalResults"] == 0:
                return False
            else:
                return True

    def alterRequestUrl(self):
        if self.version:
            self.version = self.version.split(" ")
            self.version = self.version[:-1]
            self.version = " ".join(self.version)

    def retrieveApiResponse(self):
        if self.requestUrl != "":
            getApiResponseLogger.info("Request URL: {}".format(self.requestUrl))
            getApiResponseLogger.info("Getting API response")
            print(self.apiResponseJson.status_code)
            print(self.requestUrl)
            if self.apiResponseJson.status_code == 200:
                getApiResponseLogger.info("API retrieved successfully. Status code: {}".format(self.apiResponseJson.status_code))
                self.apiResponseJson = self.apiResponseJson.json()
            else:
                getApiResponseLogger.info("API retrieval error. Status code: {}".format(self.apiResponseJson.status_code))
                self.apiResponseJson = None
        