from configparser import ConfigParser
import os

def config(filename="C:\\Users\\Duxx\\Desktop\\VulnScannerGitRepoV2\\NetMonPi\\vulnscanner\\vulnscanner\\database.ini", section='postgresql'):
    parser = ConfigParser()
    parser.read(filename)

    dbParams = {}

    if parser.has_section(section):
        params = parser.items(section)
        for param in params:
            dbParams[param[0]] = param[1]

    else:
        raise Exception('Section {0} not found in the {1} file'.format(section, filename))
 
    return dbParams