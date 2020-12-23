import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import logo from '../slike/net_head.png'



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
    <div className={classes.root}>
      <AppBar position="fixed">
        <Toolbar>
          <img src={logo} alt="" width="30px"></img>
          <Typography variant="h5" className={classes.title}>
            NetMonPi
          </Typography>
          <Button color="inherit">Login</Button>
          <Button color="inherit">Register</Button>
        </Toolbar>
      </AppBar>
      <Toolbar/>
      <Toolbar/>
    </div>
  );
}