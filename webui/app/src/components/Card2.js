import React from 'react'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import device from '../slike/device.png'
import Title from './Title'
import { Typography } from '@material-ui/core'

class Kartica2 extends React.Component {
    constructor(props) {
        super(props)
        this.state = {}
    }

    render() {
        return (
            <Card>
                <CardContent>
                    <Title>
                        Broj uređaja
                    </Title>
                    <Typography component="span" variant="h5">
                        <img src={device} alt="" width="10%"></img> 8
                    </Typography>
                </CardContent>
            </Card >

        )
    }
}

export default Kartica2