import React from 'react'
import Card from 'react-bootstrap/Card'
import user from '../slike/user.svg'

class Kartica1 extends React.Component {
    constructor(props) {
        super(props)
        this.state = {}
    }

    render() {
        return(
            <Card style={{width: '50%'}}>
                <Card.Header className="text-center">
                Broj korisnika
                </Card.Header>

                <Card.Body className="text-center">
                
        <h2><img src={user} width="10%"></img> 10 </h2>
                </Card.Body>
            </Card>

        )
    }
}

export default Kartica1