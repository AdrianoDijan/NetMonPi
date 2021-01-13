import React from 'react'
import { DataGrid } from '@material-ui/data-grid';
import moment from 'moment'
import DeviceInfo from './DeviceInfo'
import Title from './Title'
import { Card, CardContent } from '@material-ui/core'

class DeviceTable extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            isLoaded: false,
            dialogOpen: false,
            selectedDevice: null,
        };
        this.columns = [
            { field: 'hostname', headerName: 'Hostname', width: 300 },
            { field: 'mac', headerName: 'MAC', width: 160 },
            {
                field: 'ip', headerName: 'IP', width: 100,
                sortComparator: (v1, v2, param1, param2) => {
                    const num1 = Number(param1.row.ip.split(".").map((num) => (`000${num}`).slice(-3)).join(""));
                    const num2 = Number(param2.row.ip.split(".").map((num) => (`000${num}`).slice(-3)).join(""));
                    return num1 - num2;
                }
            },
            { field: 'first_seen', headerName: 'First seen', type: "dateTime", width: 180 },
            { field: 'last_seen', headerName: 'Last seen', type: "dateTime", width: 180 },
            { field: 'vendor', headerName: 'Vendor', width: 250 },
        ];
    }

    componentDidMount() {
        this.fetchData = () => {
            fetch("/api/v1/devices/online")
                .then(response => response.json())
                .then(response => response.map(x => {
                    x['first_seen'] = moment(x['first_seen']).toDate()
                    x['last_seen'] = moment(x['last_seen']).toDate()
                    x['id'] = x['mac']
                    return x;
                })
                )
                .then(response => { this.setState({ data: response, isLoaded: true }) })
                .catch(error => console.log(error.message))
        }
        this.fetchData()
        this.interval = setInterval(this.fetchData, 10000)
    }

    componentWillUnmount() {
        clearInterval(this.interval)
    }

    render() {
        if (this.state.dialogOpen) {
            return (
                <Card>
                    <CardContent>
                        <Title>
                            Online uređaji
                        </Title>
                        <div style={{ height: 600, width: '100%' }}>
                            <DataGrid sortModel={[{ field: 'ip', sort: 'asc' }]} onRowClick={(RowParams => { this.setState({ selectedDevice: RowParams, dialogOpen: true }) })} rows={this.state.data} columns={this.columns} autoPageSize={true} disableSelectionOnClick={true} loading={!this.state.isLoaded} />
                            <DeviceInfo open={this.state.dialogOpen} rowData={this.state.selectedDevice} handleClose={() => this.setState({ dialogOpen: false })} />
                        </div>
                    </CardContent>
                </Card>
            );
        }
        else {
            return (
                <Card>
                    <CardContent>
                        <Title>
                            Online uređaji
                        </Title>
                        <div style={{ height: 600, width: '100%' }}>
                            <DataGrid sortModel={[{ field: 'ip', sort: 'asc' }]} onRowClick={(RowParams => { this.setState({ selectedDevice: RowParams, dialogOpen: true }) })} rows={this.state.data} columns={this.columns} autoPageSize={true} disableSelectionOnClick={true} loading={!this.state.isLoaded} />
                        </div>
                    </CardContent>
                </Card>
            );
        }

    }
}

export default DeviceTable;