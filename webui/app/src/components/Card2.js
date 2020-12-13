import React from 'react'
import Card from 'react-bootstrap/Card'
import device from '../slike/device.png'

class Kartica2 extends React.Component {
    constructor(props) {
        super(props)
        this.state = {}
    }

    render() {
        return(
            <Card style={{width: '50%'}}>
                <Card.Header className="text-center">
                Broj uređaja
                </Card.Header>

                <Card.Body className="text-center">
                
        <h2><img src={device} width="20%"></img> 8 </h2>
                </Card.Body>
            </Card>

        )
    }
}

export default Kartica2