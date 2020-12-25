import React from 'react'
import { DataGrid } from '@material-ui/data-grid';
import moment from 'moment'

class DeviceTable extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            isLoaded: false,
        };
        this.columns = [
            { field: 'hostname', headerName: 'Hostname', width: 300 },
            { field: 'mac', headerName: 'MAC', width: 180 },
            { field: 'ip', headerName: 'IP' , width: 120},
            { field: 'first_seen', headerName: 'First seen', type: "dateTime", width: 220 },
            { field: 'last_seen', headerName: 'Last seen',  type: "dateTime", width: 220},
            { field: 'vendor', headerName: 'Vendor', flex: 1},
        ];
    }

    componentDidMount() {
        this.fetchData = () => {
            fetch("http://localhost:3080/api/v1/devices/online")
            .then(res => res.json())
            .then(res => {
                let d1 = [];
                for (let i = 0; i < res.length; i++) {
                    d1[i] = res[i];
                    d1[i]['id'] = i;
                    d1[i]['first_seen'] = moment(d1[i]['first_seen']).toDate()
                    d1[i]['last_seen'] = moment(d1[i]['last_seen']).toDate()
                }
                this.setState({ data: d1, isLoaded: true });
            })
            .catch(err => console.log(err.message))
        }
        this.fetchData()
        setInterval(this.fetchData, 10000)
    }

    render() {
        return (
            <div style={{ height: 600, width: '100%', padding: "1%"}}>
                <DataGrid rows={this.state.data} columns={this.columns} autoPageSize={true} disableClickEventBubbling={true} loading={!this.state.isLoaded}/>
            </div>
        );

    }
}

export default DeviceTable;