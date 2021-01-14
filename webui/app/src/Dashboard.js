import React from 'react'
import './App.css';
import ChartContainer from './components/InterfaceChartContainer'
import DeviceTable from './components/DeviceTable';
import NavBar from './components/NavBar'
import Speedtest from './components/Speedtest'
import StatusCard from './components/StatusCard'
import SettingsDialog from './components/Settings'
import { ThemeProvider } from '@material-ui/core/styles';
import { CssBaseline, Grid, Container, Snackbar } from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';
import '@fontsource/poppins'
import { darkTheme, lightTheme } from './themes'

class Dashboard extends React.Component {
  constructor() {
    super()
    this.state = {
      useDark: window.localStorage.getItem('useDark') ? JSON.parse(window.localStorage.getItem('useDark')) : window.matchMedia('(prefers-color-scheme: dark)').matches,
      forceTheme: window.localStorage.getItem('forceTheme') ? JSON.parse(window.localStorage.getItem('forceTheme')) : false,
      themeSnackbarMessage: '',
      showThemeSnackbar: false,
      settingsOpen: false,
    }
  }

  componentDidMount() {
    setInterval(this.autoThemeHandler, 500);
  }

  autoThemeHandler = () => {
    if (!this.state.forceTheme) {
      if (window.matchMedia('(prefers-color-scheme: dark)').matches !== this.state.useDark) {
        this.setState({ useDark: !this.state.useDark });
      }
    }
  }

  componentDidUpdate() {
    window.localStorage.setItem('forceTheme', JSON.stringify(this.state.forceTheme))
    window.localStorage.setItem('useDark', JSON.stringify(this.state.useDark))
  }

  handleThemeChange() {
    // AUTO => DARK => LIGHT
    if (!this.state.forceTheme) {
      this.setState({ forceTheme: true, useDark: true, themeSnackbarMessage: 'Switched to dark theme.', showThemeSnackbar: true })
    }
    else if (this.state.useDark) {
      this.setState({ useDark: false, themeSnackbarMessage: 'Switched to light theme.', showThemeSnackbar: true })
    }
    else {
      this.setState({ forceTheme: false, themeSnackbarMessage: 'Switched to auto theme.', showThemeSnackbar: true })
    }
    this.autoThemeHandler()
  }

  render() {
    return (
      <ThemeProvider theme={this.state.useDark ? darkTheme() : lightTheme()}>
        <CssBaseline />
        <div>
          <NavBar currentTheme={!this.state.forceTheme ? 'auto' : this.state.useDark ? 'dark' : 'light'}
            parentStateHandler={() => { this.handleThemeChange() }}
            handleSettingsButton={() => this.setState({ settingsOpen: !this.state.settingsOpen })} />
          <Container maxWidth={false}>
            <Grid container spacing={3} justify={"center"} direction={"column"} alignItems="center">
              <Grid item container direction="row" justify="center" alignItems="stretch" spacing={3} xs={12} md={12} xl={10}>
                <Grid item xs={12} md={6} xl={5}>
                  <StatusCard />
                </Grid>
                <Grid item xs={12} md={6} xl={5}>
                  <Speedtest />
                </Grid>
              </Grid>
              <Grid item container xs={12} md={12} xl={10} justify={"center"} spacing={3} direction={"row"}>
                <Grid item xs={12} md={12} xl={10}>
                  <ChartContainer />
                </Grid>
              </Grid>
              <Grid item container xs={12} xl={10} justify={"center"} spacing={3} direction={"row"}>
                <Grid item xs={12} xl={10}>
                  <DeviceTable />
                </Grid>
              </Grid>
            </Grid>
          </Container>
          <Snackbar open={this.state.showThemeSnackbar} anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }} autoHideDuration={6000} onClose={(event, reason) => {
            if (reason === 'clickaway') {
              return;
            }
            this.setState({ showThemeSnackbar: false })
          }}>
            <Alert severity="info" onClose={(event, reason) => {
              if (reason === 'clickaway') {
                return;
              }
              this.setState({ showThemeSnackbar: false, themeSnackbarMessage: '' })
            }}>
              {this.state.themeSnackbarMessage}
            </Alert>
          </Snackbar>
          <SettingsDialog open={this.state.settingsOpen} handleClose={() => { this.setState({ settingsOpen: false }) }} />
        </div>
      </ThemeProvider>
    )
  }
}
export default Dashboard;
