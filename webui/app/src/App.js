import React from 'react'
import './App.css';
import ChartContainer from './components/ChartContainer'
import Kartica2 from './components/Card2'
import Kartica1 from './components/Card1'
import DeviceTable from './components/DeviceTable';
import MyNavbar from './components/NavBar'
import Title from './components/Title'
import { ThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import { Card, CardContent, Grid, Paper} from '@material-ui/core';


class App extends React.Component {
  constructor() {
    super()
    this.state = {}
    this.theme = createMuiTheme({
      root: {
        display: 'flex',
      },
      menuButton: {
        marginRight: 36,
      },
      menuButtonHidden: {
        display: 'none',
      },
      title: {
        flexGrow: 1,
      },
      content: {
        flexGrow: 1,
        height: '100vh',
        overflow: 'auto',
      },
      paper: {
        display: 'flex',
        overflow: 'auto',
        flexDirection: 'column',
      },
      fixedHeight: {
        height: 240,
      },
      typography: {
        fontFamily: [
          'Nunito',
          'Roboto',
          '"Helvetica Neue"',
          'Arial',
          'sans-serif'
        ].join(','),
      },
    });
  }

  render() {
    return (
      <ThemeProvider theme={this.theme}>
        <div className={"App"} className="page">
          <MyNavbar />
          <Grid container xs={12} spacing={3} justify={"center"} direction={"column"}>
            <Grid item container spacing={3} justify={"center"} direction={"row"}>
              <Grid item xs={5}>
                <Paper>
                  <Kartica1 />
                </Paper>
              </Grid>
              <Grid item xs={5}>
                <Paper>
                  <Kartica2 />
                </Paper>
              </Grid>
            </Grid>

            <Grid item container xs={12} justify={"center"}>
              <Grid item xs={10}>
                <Card title={"WAN Bandwidth"}>
                  <CardContent>
                    <Title>
                      WAN Bandwidth
                    </Title>
                    <ChartContainer/>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
            <Grid item container xs={12} justify={"center"}>
              <Grid item xs={10}>
                <Paper>
                  <DeviceTable />
                </Paper>
              </Grid>
            </Grid>
          </Grid>
        </div>
      </ThemeProvider>
    )
  };
}

export default App;
