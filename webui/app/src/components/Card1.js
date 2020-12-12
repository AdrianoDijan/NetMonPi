import React from 'react'
import Card from 'react-bootstrap/Card'
import user from '../slike/user.svg'

class Kartica extends React.Component {
    constructor() {
        super()
        this.state = {}
    }

    render() {
        return(
            <Card style={{width: '25%'}}>
                <Card.Header>
                Broj aktivnih korisnika
                </Card.Header>

                <Card.Body>
                
        <h2><img src={user} width="10%"></img> 10 </h2>
                </Card.Body>
            </Card>

        )
    }
}

export default Kartica