import React from 'react'
import Card from '@material-ui/core/Card'
import CardHeader from '@material-ui/core/CardHeader'
import CardContent from '@material-ui/core/CardContent'
import user from '../slike/user.svg'

class Kartica1 extends React.Component {
    constructor(props) {
        super(props)
        this.state = {}
    }

    render() {
        return(
        //     <Card style={{width: '100%'}}>
        //         <Card.Header className="text-center">
        //         Broj korisnika
        //         </Card.Header>

        //         <Card.Body className="text-center">
                
        // <h2><img src={user} width="10%"></img> 10 </h2>
        //         </Card.Body>
        //     </Card>

        <Card variant="outlined">
            <CardHeader title="Broj korisnika">
                
            </CardHeader>
            <CardContent>
            <h2><img src={user} width="10%"></img> 10 </h2>
            </CardContent>
        </Card>

        )
    }
}

export default Kartica1