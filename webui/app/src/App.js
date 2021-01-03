import React, { Component } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import Home from './home'
import Login from './components/login'



class App extends React.Component {
  constructor() {
    super()
    this.state = {}
  }

  render() {

    return(
      <Router>
        <Switch>
        <Route exact path="/home" component = {Home}/>
        <Route exact path="/" component ={Login}/>
        </Switch>
      </Router>
    )
  }
}

export default App;