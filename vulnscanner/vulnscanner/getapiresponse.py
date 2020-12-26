import requests as rq
import json
import logging

getApiResponseLogger = logging.getLogger(__name__)

class GetApiResponse():
    def __init__(self, product = None, version = None, cpe = None, vendor = None):
        getApiResponseLogger.info("GetApiResponse __init__, args: {}".format([product, version, cpe, vendor]))
        self.product = product
        self.version = version
        self.cpe = cpe
        self.vendor = vendor
        self.apiResponseJson = None
        self.getApiResponse()

    def getApiResponse(self):
        requestUrl = ""
        if self.cpe != "UNKNOWN":
            getApiResponseLogger.info("Searching by cpe23uri: {}".format(self.cpe))
            requestUrl = "https://services.nvd.nist.gov/rest/json/cves/1.0?cpeMatchString=" + self.cpe
        elif self.product != "UNKNOWN":
            getApiResponseLogger.info("Searching by product name: {}".format(self.product))
            keyword = self.product
            if self.version != "UNKNOWN":
                getApiResponseLogger.info("Adding product version to search: {}".format(self.version))
                keyword = keyword + " " + self.version
            requestUrl = "https://services.nvd.nist.gov/rest/json/cves/1.0?keyword=" + keyword
        elif self.vendor != "UNKNOWN":
            getApiResponseLogger.info("Searching by product name: {}".format(self.vendor))
            keyword = self.vendor
            if self.version != "UNKNOWN":
                getApiResponseLogger.info("Adding product version to search: {}".format(self.version))
                keyword = keyword + " " + self.version
            requestUrl = "https://services.nvd.nist.gov/rest/json/cves/1.0?keyword=" + keyword
        if requestUrl != "":
            getApiResponseLogger.info("Request URL: {}".format(requestUrl))
            getApiResponseLogger.info("Getting API response")
            self.apiResponseJson = rq.get(requestUrl)
            if self.apiResponseJson.status_code == 200:
                getApiResponseLogger.info("API retrieved successfully. Status code: {}".format(self.apiResponseJson.status_code))
                self.apiResponseJson = self.apiResponseJson.json()
            else:
                getApiResponseLogger.info("API retrieval error. Status code: {}".format(self.apiResponseJson.status_code))
                self.apiResponseJson = None