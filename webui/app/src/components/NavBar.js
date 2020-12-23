import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import logo from '../slike/net_head.png'
import Login from './login'
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import { lightBlue, red } from '@material-ui/core/colors';



const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    marginRight: theme.spacing(2)
  },
  title: {
    flexGrow: 1,
    margin: theme.spacing(3)
  },
}));

export default function ButtonAppBar() {
  const classes = useStyles();

  return (
    <Router>
    <div className={classes.root}>
      <AppBar position="fixed">
        <Toolbar>
          <img src={logo} alt="" width="30px"></img>
          <Typography variant="h5" className={classes.title}>
            NetMonPi
          </Typography>
          <Button color="inherit" onClick={() => {<Link to="./login"/>}}>Login</Button>
          <Button color="inherit">Register</Button>
        </Toolbar>
      </AppBar>
      <Toolbar/>
      <Toolbar/>
    </div>
    <Route path="./login" component={Login}/>
    </Router>
  );
}