from pysnmp import hlapi
import netscanner
import nmap3
import logging


def get(target, oids, credentials, port=161, engine=hlapi.SnmpEngine(), context=hlapi.ContextData()):
    handler = hlapi.getCmd(
        engine,
        credentials,
        hlapi.UdpTransportTarget((target, port)),
        context,
        *construct_object_types(oids),
        lookupMib=True,
    )
    return fetch(handler, 1)[0]


def construct_object_types(list_of_oids):
    object_types = []
    for oid in list_of_oids:
        object_types.append(hlapi.ObjectType(hlapi.ObjectIdentity(oid)))
    return object_types


def fetch(handler, count):
    result = []
    for i in range(count):
        try:
            error_indication, error_status, error_index, var_binds = next(handler)
            if not error_indication and not error_status:
                items = {}
                for var_bind in var_binds:
                    items[str(var_bind[0])] = cast(var_bind[1])
                result.append(items)
            else:
                logging.error(RuntimeError(
                    'Got SNMP error: {0}'.format(error_indication)))
        except StopIteration:
            break
    return result


def cast(value):
    try:
        return int(value)
    except (ValueError, TypeError):
        try:
            return float(value)
        except (ValueError, TypeError):
            try:
                return str(value)
            except (ValueError, TypeError):
                pass
    return value


def get_bulk(target, oids, credentials, count, start_from=0, port=161,
             engine=hlapi.SnmpEngine(), context=hlapi.ContextData()):
    handler = hlapi.bulkCmd(
        engine,
        credentials,
        hlapi.UdpTransportTarget((target, port)),
        context,
        start_from, count,
        *construct_object_types(oids)
    )
    return fetch(handler, count)


def get_bulk_auto(target, oids, credentials, count_oid, start_from=0, port=161,
                  engine=hlapi.SnmpEngine(), context=hlapi.ContextData()):
    count = get(target, [count_oid], credentials,
                port, engine, context)[count_oid]
    return get_bulk(target, oids, credentials, count, start_from, port, engine, context)


def getInterfaceData(ip, community):
    answer = (get_bulk_auto(ip, ['1.3.6.1.2.1.31.1.1.1.1', '1.3.6.1.2.1.2.2.1.10',
                                 "1.3.6.1.2.1.2.2.1.16"], hlapi.CommunityData(community), "1.3.6.1.2.1.2.1.0"))
    retlist = []
    for interface in answer:
        d1 = {}
        for key in interface.keys():
            if "1.3.6.1.2.1.31.1.1.1.1" in key:
                d1["name"] = interface[key]
            elif '1.3.6.1.2.1.2.2.1.10' in key:
                d1["txInOctets"] = interface[key]
            elif "1.3.6.1.2.1.2.2.1.16" in key:
                d1["txOutOctets"] = interface[key]
        retlist.append(d1)
    return retlist