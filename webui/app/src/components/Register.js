import React from 'react'
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import { CssBaseline, TextField, Grid, Button, Card, CardContent } from '@material-ui/core'
import Title from './Title'
import { ThemeProvider } from '@material-ui/core/styles';
import { darkTheme, lightTheme } from '../themes'

class Register extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      useDark: JSON.parse(window.localStorage.getItem('useDark')) || window.matchMedia('(prefers-color-scheme: dark)').matches,
      username: '',
      password: '',
      alertOpen: false,
      alertMessage: ''
    }
    this.handleSubmit = this.handleSubmit.bind(this);

    this.themeInterval = setInterval(() => {
      let useDark = JSON.parse(window.localStorage.getItem('useDark')) ||
        window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (useDark !== this.state.useDark) {
        this.setState({ useDark: useDark });
      }
    }, 500)
  }

  handleSubmit(e) {
    e.preventDefault();
    fetch('/register',
      {
        method: 'POST',
        body: JSON.stringify(this.state),
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
      }
    )
      .then(response => {
        if (response.status === 200) {
          this.props.history.push("/")
        }
      })
  }

  componentWillUnmount() {
    clearTimeout(this.alertTimeout)
  }

  render() {
    return (
      <ThemeProvider theme={this.state.useDark ? darkTheme() : lightTheme()}>
        <CssBaseline />
        <Grid container justify="center" alignItems="center" direction="column" style={{ minHeight: "100vh" }}>
          <Grid item xs={10} md={3}>
            <Card>
              <CardContent>
                <Grid container direction="column" justfiy="center" spacing={2}>
                  <Grid item container direction="row" justify="center" alignItems="center">
                    <Grid item xs>
                      <AccountCircleIcon fontSize="large" />
                    </Grid>
                    <Grid item>
                      <Title>
                        Register
                      </Title>
                    </Grid>
                  </Grid>
                  <form noValidate onSubmit={this.handleSubmit}>
                    <Grid container direction="column" spacing={2}>
                      <Grid item xs>
                        <TextField id="username" label="Username" variant="outlined" fullWidth autoFocus value={this.state.username} onChange={(event) =>
                          this.setState({
                            username: event.target.value,
                          })}
                        />
                      </Grid>
                      <Grid item xs>
                        <TextField id="password" label="Password" variant="outlined" type="password" fullWidth value={this.state.password} onChange={(event) =>
                          this.setState({
                            password: event.target.value,
                          })}
                        />
                      </Grid>
                      <Grid item container direction="row" justify="flex-end">
                        <Grid item>
                          <Button type="submit"> Register </Button>
                        </Grid>
                      </Grid>
                    </Grid>
                  </form>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </ThemeProvider>
    )
  }
}

export default Register;
