import React from 'react'
import logo from './logo.svg';
import './App.css';
import AlatnaTraka from './components/navbar'
import Graf from './components/graf'
import Tablica from './components/tablica'

class App extends React.Component {
  constructor() {
    super()
    this.state = {}
  }

  render() {
  return (
    <div>
    <AlatnaTraka/>
    <Graf/>
    <Tablica/>
    </div>
  )};
}

export default App;
