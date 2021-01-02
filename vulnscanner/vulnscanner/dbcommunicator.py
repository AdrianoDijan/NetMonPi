import psycopg2
import logging
from vulnscanner.config import config as dbConfig
from vulnscanner.makequery import MakeQuery
import os

dbConnectionLogger = logging.getLogger(__name__)

class DbCommunication():
    def __init__(self, relationName = None):
        self.relationName = relationName
        self.fetchedRow = ()
        self.queryDataList = []
        self.dbConnection = None
        self.dbCursor = None
        self.query = None
        self.connectToDatabase()

    def connectToDatabase(self):
        try:
            dbParams = dbConfig()
            dbConnectionLogger.info("Connecting to the PostgreSQL database")
            self.dbConnection = psycopg2.connect(**dbParams)
            self.getDataRows()
            for i in range(self.dbCursor.rowcount):
                self.fetchedRow = self.dbCursor.fetchone()
                queryDataDict = self.queryTupleToDict()
                if (queryDataDict not in self.queryDataList) and self.checkUnknownRow() and self.checkSameRow():
                    self.queryDataList.append(queryDataDict)
            self.dbCursor.close()
        except (Exception, psycopg2.DatabaseError) as error:
            dbConnectionLogger.info("Connection error: {}".format(error))
        finally:
            if self.dbConnection is not None:
                self.dbConnection.close()
                dbConnectionLogger.info("Database connection closed.")

    def checkUnknownRow(self):
        if self.fetchedRow[0] == "" and self.fetchedRow[1] == "" and self.fetchedRow[2] == "":
            return False
        return True

    def checkSameRow(self):
        if self.queryDataList:
            for exploitDict in self.queryDataList:
                if self.fetchedRow[0] ==  exploitDict["version"] and self.repairCpe23Uri() == exploitDict["cpe"] and self.fetchedRow[2] == exploitDict["product"]:
                    return False
        return True

    def getDataRows(self):
        self.query = self.formAnQuery()
        self.dbCursor = self.dbConnection.cursor()
        self.dbCursor.execute(self.query)

    def formAnQuery(self):
        return "SELECT version, cpe, product, service_id FROM service"

    def queryTupleToDict(self):
        queryDataDict = {}
        queryDataDict["version"] = self.fetchedRow[0][:20]
        queryDataDict["cpe"] = self.repairCpe23Uri()
        queryDataDict["product"] = self.fetchedRow[2]
        queryDataDict["serviceId"] = self.fetchedRow[3]
        return queryDataDict

    def repairCpe23Uri(self):
        repairedCpe23Uri = self.fetchedRow[1]
        if "/" in repairedCpe23Uri:
            slashIndex = repairedCpe23Uri.index("/")
            repairedCpe23Uri = repairedCpe23Uri[:slashIndex] + repairedCpe23Uri[slashIndex + 1:]
            doubleDotIndex = repairedCpe23Uri.index(":")
            repairedCpe23Uri = repairedCpe23Uri[:doubleDotIndex + 1] + "2.3" + repairedCpe23Uri[doubleDotIndex:]
        return repairedCpe23Uri
