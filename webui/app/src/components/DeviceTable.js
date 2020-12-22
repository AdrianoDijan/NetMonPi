import React from 'react'
import { DataGrid } from '@material-ui/data-grid';

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
                for (let i = 0; i<res.length; i++) {
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
            { field: 'mac', headerName: 'MAC' },
            { field: 'ip', headerName: 'IP' },
            { field: 'hostname', headerName: 'Hostname' },
            { field: 'first_seen', headerName: 'First seen' },
            { field: 'last_seen', headerName: 'Last seen' },
            { field: 'vendor', headerName: 'Vendor' },
        ];

        let ret;

        if (this.state.isLoaded) {
            ret = <div style={{ height: 400, width: '100%' }}>
                <DataGrid rows={this.state.data} columns={columns} pageSize={5} />
            </div>
        }
        else {
            ret = <div style={{ height: 400, width: '100%' }}>
                <h1>Loading...</h1>
            </div>
        }

        return (
            ret
        )
    }
}

export default DeviceTable;