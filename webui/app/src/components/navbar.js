import react from 'react'
import { Navbar,Nav, NavbarBrand, Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCoffee } from '@fortawesome/free-solid-svg-icons'


function AlatnaTraka() {
    return (
        <Navbar bg="dark" variant="dark">
        <Navbar.Collapse id="responsive-navbar-nav">
        <Navbar.Brand href="#home">
          {' '}
          NetMonPi
        </Navbar.Brand>
        </Navbar.Collapse>

        <Nav>
        
        <Button variant="outline-primary">
        Log in
        </Button>
        {' '}
        <Button variant="outline-primary">
            Register
        </Button>
        </Nav>
      </Navbar>
    )
}

export default AlatnaTraka;