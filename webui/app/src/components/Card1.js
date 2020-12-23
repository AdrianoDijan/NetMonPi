import React from 'react'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import user from '../slike/user.svg'
import { Typography } from '@material-ui/core'
import Title from './Title'

class Kartica1 extends React.Component {
    constructor(props) {
        super(props)
        this.state = {}
    }

    render() {
        return(
        <Card>
            <CardContent>
            <Title>
                Broj korisnika
            </Title>
            <Typography component="body1" variant="h5">
            <img src={user} alt="" width="10%"></img> 10
            </Typography>
            </CardContent>
        </Card>

        )
    }
}

export default Kartica1