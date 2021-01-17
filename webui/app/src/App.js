import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";
import Dashboard from './Dashboard'
import Login from './components/Login'
import Register from './components/Register'
import './App.css';
import withAuth from './components/withAuth'



class App extends React.Component {
  constructor() {
    super()
    this.state = {}
  }

  render() {
    return (
      <Router>
        <Switch>
          <Route exact path="/dashboard" component={withAuth(Dashboard)} />
          <Route exact path="/" component={Login} />
          <Route exact path="/register" component={Register} />
        </Switch>
      </Router>
    )
  }
}

export default App;