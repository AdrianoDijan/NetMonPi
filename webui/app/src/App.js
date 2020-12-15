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
import Kartica2 from './components/Card2'
import Kartica1 from './components/Card1'

class App extends React.Component {
  constructor() {
    super()
    this.state = {}
  }

  render() {
  return (
    <div className="flexbox-container">
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
  <div className="flexbox-item flexbox-item2">
  <Kartica1/>
  <Kartica2/>
  </div>
  <div className="flexbox-item flexbox-item3">
  <Graf/>
  </div>
  <div className="flexbox-item flexbox-item3">
  <Tablica/>
  </div>
    </div>
  )};
}

export default App;
