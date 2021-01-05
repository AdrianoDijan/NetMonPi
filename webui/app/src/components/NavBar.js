import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import NetworkCheckIcon from '@material-ui/icons/NetworkCheck';

export default class NavBar extends React.Component {

  render() {
    return (
      <div>
        <AppBar position="fixed">
          <Toolbar>
            <NetworkCheckIcon style={{ paddingRight: "5px", fontSize: "32" }} />
            <Typography variant="h6" style={{ flexGrow: 1 }}>
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
}
