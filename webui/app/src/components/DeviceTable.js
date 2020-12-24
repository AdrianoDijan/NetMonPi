import React from 'react'
import { DataGrid } from '@material-ui/data-grid';
import 'fontsource-roboto';
import moment from 'moment'

class DeviceTable extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            isLoaded: false,
        };
        this.columns = [
            { field: 'mac', headerName: 'MAC', flex: 1 },
            { field: 'ip', headerName: 'IP' , flex: 1},
            { field: 'hostname', headerName: 'Hostname', flex: 1.5 },
            { field: 'first_seen', headerName: 'First seen', type: "dateTime", flex: 1.5 },
            { field: 'last_seen', headerName: 'Last seen',  type: "dateTime", flex: 1.5 },
            { field: 'vendor', headerName: 'Vendor', flex: 2},
        ];
    }

    componentDidMount() {
        console.log(this.state.data)

        this.fetchData = () => {
            fetch("http://localhost:3080/api/v1/devices/all")
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
            <div style={{ height: 600, width: '100%'}}>
                <DataGrid rows={this.state.data} columns={this.columns} autoPageSize={true} disableClickEventBubbling={true} loading={!this.state.isLoaded}/>
            </div>
        );

    }
}

export default DeviceTable;