import React from 'react'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import { Typography} from '@material-ui/core'
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
            <Typography component="span" variant="h5">
            10
            </Typography>
            </CardContent>
        </Card>

        )
    }
}

export default Kartica1