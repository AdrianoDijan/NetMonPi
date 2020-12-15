import requests as rq
import json

class Api():
    def __init__(self, product = None, version = None, port = None, protocol = None, cpe = None):
        self.product = product
        self.version = version
        self.port = port
        self.protocol = protocol
        self.cpe = cpe
        self.apiResponseJson = None
        self.getApiResponse()

    def getApiResponse(self):
        if self.cpe != "UNKNOWN":
            requestUrl = "https://services.nvd.nist.gov/rest/json/cves/1.0?cpeMatchString=" + self.cpe
        elif self.product != "UNKNOWN":
            keyword = self.product
            if self.version != "UNKNOWN":
                keyword = keyword + " " + self.version
            requestUrl = "https://services.nvd.nist.gov/rest/json/cves/1.0?keyword=" + keyword
        self.apiResponseJson = rq.get(requestUrl).json()
    #     self.write()

    # def write(self):
    #     with open('test.txt','w') as apiOutput:
    #         json.dump(self.apiResponseJson, apiOutput)
    # def mapCveAndIndex(self):
