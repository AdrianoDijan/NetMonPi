import react from 'react'
import { Navbar, Nav, NavbarBrand, Button } from 'react-bootstrap';
import logo from "../slike/net_head.png"


function AlatnaTraka() {
  return (
    <Navbar bg="primary" variant="dark">
      <Navbar.Collapse id="responsive-navbar-nav">
        <Navbar.Brand href="#home">
          <img src={logo} width="50px"></img>
          {' '}
          NetMonPi
        </Navbar.Brand>
      </Navbar.Collapse>

      <Nav>

        <Button variant="outline-light">
          Log in
        </Button>
        {' '}
        <Button variant="outline-light">
          Register
        </Button>
      </Nav>
    </Navbar>
  )
}

export default AlatnaTraka;