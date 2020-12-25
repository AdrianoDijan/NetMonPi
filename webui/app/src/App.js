import React from 'react'
import './App.css';
import ChartContainer from './components/ChartContainer'
import Kartica2 from './components/Card2'
import DeviceTable from './components/DeviceTable';
import MyNavbar from './components/NavBar'
import Title from './components/Title'
import { ThemeProvider, createMuiTheme, responsiveFontSizes } from '@material-ui/core/styles';
import { Card, CardContent, CssBaseline, Grid, Paper} from '@material-ui/core';
import '@fontsource/poppins'

class App extends React.Component {
  constructor() {
    super()
    this.state = {dark: window.matchMedia('(prefers-color-scheme: dark)').matches}
    this.themeDark = createMuiTheme({
      palette: {
        primary: {
          main: '#2a8bf4',
          chartTitle: '#43464a',
          chartText: '#5a5b5c'
        },
        text: {
          primary: "#d3d7db"
        },
        background: {
          default: "#1f1e2e",
          paper: "#28293d"
        },
        secondary: {
          main: '#f57f17',
        },
      },
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
          'Poppins',
          'Roboto',
          '"Helvetica Neue"',
          'Arial',
          'sans-serif'
        ].join(','),
      },
      card: {
        background: "rgb(70, 0, 0)",
      },
      page: {
        backgroundColor: "rgb(70,80,90)"
      },
      table: {
        border: "none",
      },
      overrides: {
        MuiDataGrid: {
          root: {
            border: "none",
            },
            columnSeparator: {
              color: "rgba(0,0,0,0)",
            }
      }
    }
    });
    this.themeDark = responsiveFontSizes(this.themeDark)

    this.themeLight = createMuiTheme({
      palette: {
        primary: {
          main: '#2a8bf4',
          chartTitle: '#fafafa',
          chartText: '#f2f2f2'
        },
        text: {
          primary: "#1f1e2e"
        },
        background: {
          default: "#fafafa",
          paper: "#f2f2f2"
        },
        secondary: {
          main: '#f57f17',
        },
      },
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
          'Poppins',
          'Roboto',
          '"Helvetica Neue"',
          'Arial',
          'sans-serif'
        ].join(','),
      },
      card: {
        background: "rgb(70, 0, 0)",
      },
      page: {
        backgroundColor: "rgb(70,80,90)"
      },
      table: {
        border: "none",
      },
      overrides: {
        MuiDataGrid: {
          root: {
            border: "none",
            },
            columnSeparator: {
              color: "rgba(0,0,0,0)",
            }
      }
    }
    });
    this.themeLight = responsiveFontSizes(this.themeLight)
  }

  render() {
    return (
      <ThemeProvider theme={this.state.dark ? this.themeDark : this.themeLight}>
        <CssBaseline />
        <div>
          <MyNavbar />
          <Grid container spacing={3} justify={"center"} direction={"column"} style={{width: "100%"}}>
            <Grid item container justify={"center"} spacing={3} direction={"row"}>
              <Grid item xs={10}>
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
              <Card title={"Online uređaji"}>
                  <CardContent>
                    <Title>
                      Online uređaji
                    </Title>
                    <DeviceTable/>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Grid>
        </div>
      </ThemeProvider>
    )
  };
}

export default App;
