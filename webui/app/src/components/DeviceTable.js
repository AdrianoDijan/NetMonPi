import React from 'react'
import { DataGrid } from '@material-ui/data-grid';
import 'fontsource-roboto';

class DeviceTable extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [{}],
            isLoaded: false,
        };
    }

    componentDidMount() {
        fetch("http://localhost:3080/api/v1/devices/all")
            .then(res => res.json())
            .then(res => {
                let d1 = [];
                for (let i = 0; i < res.length; i++) {
                    d1[i] = res[i];
                    d1[i]['id'] = i;
                }
                this.setState({ data: d1, isLoaded: true });
            })
            .catch(err => console.log(err.message))
    }

    render() {
        const columns = [
            { field: 'id', headerName: 'ID' },
            { field: 'mac', headerName: 'MAC', width: 150 },
            { field: 'ip', headerName: 'IP' , width:120},
            { field: 'hostname', headerName: 'Hostname', width: 200 },
            { field: 'first_seen', headerName: 'First seen' , type:'dateTime', width:100},
            { field: 'last_seen', headerName: 'Last seen' },
            { field: 'vendor', headerName: 'Vendor', width: 220 },
        ];

        if (this.state.isLoaded) {
            return (
                <div style={{ height: 400, width: '100%' }}>
                    <DataGrid rows={this.state.data} columns={columns} pageSize={5} />
                </div>
            );
        }
        else {
            return (
                <div style={{ height: 400, width: '100%' }}>
                    <h1>Loading...</h1>
                </div>
            );
        }
    }
}

export default DeviceTable;