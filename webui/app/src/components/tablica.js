import React from 'react'
import Table from 'react-bootstrap/Table'

class Tablica extends React.Component {
    constructor() {
        super()
        this.state = {}
    }

    render() {

        return(
            <Table variant="dark">
            <thead>
              <tr>
                <th>#</th>
                <th>Uređaj</th>
                <th>Operacijski sustav</th>
                <th>Sigurnost</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>1</td>
                <td>Samsung</td>
                <td>Android</td>
                <td>Sigurno</td>
              </tr>
              <tr>
                <td>2</td>
                <td>Huawei</td>
                <td>Android</td>
                <td>Sigurno</td>
              </tr>
              <tr>
                <td>3</td>
                <td>iPhone</td>
                <td>iOS</td>
                <td>Sigurno</td>
              </tr>
            </tbody>
          </Table>
        )
    }
}

export default Tablica;