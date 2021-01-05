class MakeQuery():
    def __init__(self, version=None, cpe=None, product=None, hostname=None, vendor=None):
        self.version = version
        self.cpe = cpe
        self.product = product
        self.hostname = hostname
        self.vendor = vendor
        self.query = None
        self.formAnQuery()

    def formAnQuery(self):
        self.query = "SELECT hostname, vendor, version, cpe, product FROM host INNER JOIN hostservice ON host.mac = hostservice.mac INNER JOIN service ON hostservice.service_id = service.service_id"
