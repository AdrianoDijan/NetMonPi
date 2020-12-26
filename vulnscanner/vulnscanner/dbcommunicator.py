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
        self.dbConnection = None
        try:
            
            dbParams = dbConfig()
            dbConnectionLogger.info("Connecting to the PostgreSQL database")
            self.dbConnection = psycopg2.connect(**dbParams)
            self.getDataRows()

            for i in range(self.dbCursor.rowcount):
                self.fetchedRow = self.dbCursor.fetchone()
                queryDataDict = self.queryTupleToDict()
                if queryDataDict not in self.queryDataList:
                    self.queryDataList.append(queryDataDict)

            self.dbCursor.close()
        except (Exception, psycopg2.DatabaseError) as error:
            dbConnectionLogger.info("Connection error: {}".format(error))
        finally:
            if self.dbConnection is not None:
                self.dbConnection.close()
                dbConnectionLogger.info("Database connection closed.")

    def getDataRows(self):
        self.query = self.formAnQuery()
        self.dbCursor = self.dbConnection.cursor()
        self.dbCursor.execute(self.query)

    def formAnQuery(self):
        return "SELECT hostname, vendor, version, cpe, product FROM host INNER JOIN hostservice ON host.mac = hostservice.mac INNER JOIN service ON hostservice.service_id = service.service_id"

    def queryTupleToDict(self):
        queryDataDict = {}
        queryDataDict["hostname"] = self.fetchedRow[0]
        queryDataDict["vendor"] = self.fetchedRow[1]
        queryDataDict["version"] = self.fetchedRow[2]
        queryDataDict["cpe"] = self.repairCpe23Uri()
        queryDataDict["product"] = self.fetchedRow[4]
        return queryDataDict

    def repairCpe23Uri(self):
        repairedCpe23Uri = self.fetchedRow[3]
        if "/" in repairedCpe23Uri:
            slashIndex = repairedCpe23Uri.index("/")
            repairedCpe23Uri = repairedCpe23Uri[:slashIndex] + repairedCpe23Uri[slashIndex + 1:]
            doubleDotIndex = repairedCpe23Uri.index(":")
            repairedCpe23Uri = repairedCpe23Uri[:doubleDotIndex + 1] + "2.3" + repairedCpe23Uri[doubleDotIndex:]
        return repairedCpe23Uri
