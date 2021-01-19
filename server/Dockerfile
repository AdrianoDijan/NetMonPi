FROM python:3-alpine

WORKDIR /usr/src/app

COPY requirements.txt ./

RUN apk add --no-cache postgresql-libs
RUN apk add --no-cache --virtual .build-deps gcc musl-dev postgresql-dev nmap nmap-scripts linux-headers zeromq-dev net-snmp-dev net-snmp
RUN pip install -r requirements.txt --no-cache-dir

COPY . .

CMD ["python", "./main.py"]
