import React from 'react';
import { AppBar, Toolbar, Typography, IconButton } from '@material-ui/core';
import NetworkCheckIcon from '@material-ui/icons/NetworkCheck';
import BrightnessAutoIcon from '@material-ui/icons/BrightnessAuto';
import Brightness4Icon from '@material-ui/icons/Brightness4';
import BrightnessHighIcon from '@material-ui/icons/BrightnessHigh';
import SettingsIcon from '@material-ui/icons/Settings';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';

export default class NavBar extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      currentTheme: this.props.currentTheme,
      brightnessIcon: this.props.currentTheme === 'auto' ? <BrightnessAutoIcon /> : this.props.currentTheme === 'dark' ? <Brightness4Icon /> : <BrightnessHighIcon />,
    }
  }

  componentDidUpdate(prevProps, prevContext) {
    if (this.state.currentTheme !== this.props.currentTheme) {
      this.setState({currentTheme: this.props.currentTheme})
    } 
  }

  render() {
    return (
      <div>
        <AppBar position="fixed">
          <Toolbar>
            <NetworkCheckIcon style={{ paddingRight: "5px", fontSize: "32" }} />
            <Typography variant="h6" style={{ flexGrow: 1 }}>
              NetMonPi
              </Typography>
            <IconButton color="inherit" onClick={() => {this.props.parentStateHandler()}}>
              {this.state.currentTheme === 'auto' ? <BrightnessAutoIcon /> : this.state.currentTheme === 'dark' ? <Brightness4Icon /> : <BrightnessHighIcon />}
            </IconButton>
            <IconButton color="inherit" onClick={() => {this.props.handleSettingsButton()}}>
              <SettingsIcon />
            </IconButton>
            <IconButton color="inherit" onClick={() => {
              fetch('/logout')
              .then((response) => {
                if (response.status === 200) {
                  window.location.href = '/';
                }
              })
            }}>
              <ExitToAppIcon/>
            </IconButton>
          </Toolbar>
        </AppBar>
        <Toolbar/>
        <Toolbar/>
      </div>
    );
  }
}
