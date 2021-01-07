import React from 'react'
import './App.css';
import ChartContainer from './components/InterfaceChartContainer'
import DeviceTable from './components/DeviceTable';
import NavBar from './components/NavBar'
import Speedtest from './components/Speedtest'
import StatusCard from './components/StatusCard'
import { ThemeProvider } from '@material-ui/core/styles';
import { CssBaseline, Grid, Container } from '@material-ui/core';
import '@fontsource/poppins'
import { darkTheme, lightTheme } from './themes'

class Dashboard extends React.Component {
  constructor() {
    super()
    this.state = {
      useDark: window.matchMedia('(prefers-color-scheme: dark)').matches,
    }
  }

  componentDidMount() {
    setInterval(() => {
      if (window.matchMedia('(prefers-color-scheme: dark)').matches !== this.state.useDark) {
        this.setState({ useDark: !this.state.useDark });
      }
    }, 500);
  }

  render() {
    return (
      <ThemeProvider theme={this.state.useDark ? darkTheme() : lightTheme()}>
        <CssBaseline />
        <div>
          <NavBar />
          <Container maxWidth={false}>
            <Grid container spacing={3} justify={"center"} direction={"column"} alignItems="center">
              <Grid item container direction="row" justify="center" alignItems="stretch" spacing={3} xs={12} sm={12} md={10}>
                <Grid item xs={12} sm={6} md={5}>
                  <StatusCard />
                </Grid>
                <Grid item xs={12} sm={6} md={5}>
                  <Speedtest />
                </Grid>
              </Grid>
              <Grid item container xs={12} sm={12} md={10} justify={"center"} spacing={3} direction={"row"}>
                <Grid item xs={12} sm={12} md={10}>
                  <ChartContainer/>
                </Grid>
              </Grid>
              <Grid item container xs={12} sm={12} md={10} justify={"center"} spacing={3} direction={"row"}>
                <Grid item xs={12} sm={12} md={10}>
                  <DeviceTable />
                </Grid>
              </Grid>
            </Grid>
          </Container>
        </div>
      </ThemeProvider>
    )
  }
}
export default Dashboard;
