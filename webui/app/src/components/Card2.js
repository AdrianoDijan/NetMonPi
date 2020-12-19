import React from 'react'
import Card from '@material-ui/core/Card'
import CardHeader from '@material-ui/core/CardHeader'
import CardContent from '@material-ui/core/CardContent'
import device from '../slike/device.png'

class Kartica2 extends React.Component {
    constructor(props) {
        super(props)
        this.state = {}
    }

    render() {
        return(
        //     <Card style={{width: '100%'}}>
        //         <Card.Header className="text-center">
        //         Broj uređaja
        //         </Card.Header>

        //         <Card.Body className="text-center">
                
        // <h2><img src={device} width="10%"></img> 8 </h2>
        //         </Card.Body>
        //     </Card>

        <Card variant="outlined">
            <CardHeader title="Broj uređaja">
                
            </CardHeader>
            <CardContent>
            <h2><img src={device} width="10%"></img> 8 </h2>
            </CardContent>
        </Card>

        )
    }
}

export default Kartica2