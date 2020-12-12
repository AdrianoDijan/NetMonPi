import React from 'react'
import Card from 'react-bootstrap/Card'
import logo from './logo.svg';
import './App.css';
import AlatnaTraka from './components/navbar'
import Graf from './components/graf'
import Tablica from './components/tablica'
import Kartica from './components/Card1'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'

class App extends React.Component {
  constructor() {
    super()
    this.state = {}
  }

  render() {
  return (
    <div>
      {/* <AlatnaTraka/>
    <Container>
      
    <Row>
    <Col><Kartica/></Col>
    </Row>

    <Row>
    <Col sm><Graf/></Col>
    </Row>
    

    <Row>
    <Tablica/>
    </Row>
    </Container> */}

  <AlatnaTraka/>
  <Kartica/>
  <Graf/>
  <Tablica/>
    </div>
  )};
}

export default App;
