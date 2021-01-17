import React from 'react';
import { Tab, Dialog, DialogContent, DialogActions, Grid, Button, TextField, Typography, Collapse } from '@material-ui/core'
import { TabContext, TabList, TabPanel, Alert } from '@material-ui/lab';
import { AccountCircle as AccountCircleIcon } from '@material-ui/icons';
import Title from './Title'

class SettingsDialog extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      tabValue: 'userSettings',
      currentUser: {
        username: '',
        date_created: '',
        oldPassword: '********',
        newPassword: '',
      },
      passwordChange: false,
      interface: '',
      scanInterval: '',
      showPasswordChangeAlert: false,
      showPasswordError: false,
      showPasswordSuccess: false,
    }
  }

  componentDidMount() {
    fetch('/currentUser')
      .then(response => response.json())
      .then(response => {
        this.setState({
          currentUser: {
            username: response.username,
            date_created: new Date(response.date_created).toLocaleString(),
            oldPassword: this.state.currentUser.oldPassword,
            newPassword: this.state.currentUser.newPassword,
          },
        })
      })
  }

  componentWillUnmount() {
    if (this.alertTimeout) {
      clearTimeout(this.alertTimeout)
    }
  }

  handlePasswordChange = (event) => {
    event.preventDefault()
    console.log(this.state)
    fetch('/changePassword', {
      method: 'POST',
      body: JSON.stringify(
        {
          username: this.state.currentUser.username,
          password: this.state.currentUser.oldPassword,
          newPassword: this.state.currentUser.newPassword
        }
      ),
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
    })
      .then(response => {
        if (response.status === 200) {
          this.setState({ showPasswordChangeAlert: true, showPasswordSuccess: true })
          this.alertTimeout = setTimeout(() => { this.setState({ showPasswordChangeAlert: false }) }, 5000)
        }
        else if (response.status === 401) {
          this.setState({ showPasswordChangeAlert: true, showPasswordError: true })
          this.alertTimeout = setTimeout(() => { this.setState({ showPasswordChangeAlert: false }) }, 5000)
        }
      })
      .catch(error => { console.log(error) })
  }

  render() {
    return (
      <Dialog
        maxWidth={'md'}
        fullWidth={true}
        open={this.props.open}
        onClose={this.props.handleClose}
        scroll="body"
        style={{ zIndex: '150 !important', marginTop: '50px' }}
      >
        <DialogContent style={{ paddingLeft: '0px' }}>
          <TabContext value={this.state.tabValue}>
            <Grid container direction="row">
              <Grid item>
                <TabList style={{ flexContainerVertical: { display: 'flex', alignItems: 'center' } }} orientation="vertical" onChange={(event, newValue) => { this.setState({ tabValue: newValue }) }}>
                  <Tab id={1} label={<AccountCircleIcon />} value="userSettings" />
                </TabList>
              </Grid>
              <Grid item xs>
                <TabPanel value="userSettings">
                  <Grid container direction="column" spacing={3}>
                    <Grid item>
                      <Typography variant="h4">User Settings</Typography>
                    </Grid>
                    <Grid item container direction="row" spacing={4}>
                      <Grid item>
                        <TextField disabled id="Username" value={this.state.currentUser.username} onChange={(event) => {
                          this.setState({ scanInterval: event.target.value });
                        }} label="Username" variant="outlined" style={{ marginLeft: '20px' }}></TextField>
                      </Grid>
                    </Grid>
                    <Grid item container direction="row">
                      <Grid item>
                        <TextField id="date_created" disabled value={this.state.currentUser.date_created} label='Date created' variant='outlined' style={{ marginLeft: '20px' }} onChange={(event) => {
                          this.setState({ scanInterval: event.target.value });
                        }} />
                      </Grid>
                    </Grid>
                    <Grid item container direction="row">
                      <Grid item>
                        <Title>
                          Change password
                                        </Title>
                      </Grid>
                    </Grid>
                    <form noValidate onSubmit={this.handlePasswordChange}>
                      <Grid item container direction="column" spacing={1}>
                        <Grid item>
                          <Collapse in={this.state.showPasswordChangeAlert}>
                            <Alert severity={this.state.showPasswordError ? "error" : "success"}>
                              {this.state.showPasswordError ? "Wrong password!" : "Password changed successfully!"}
                            </Alert>
                          </Collapse>
                        </Grid>
                        <Grid item container direction="row" spacing={3} alignItems="center" style={{ marginLeft: '20px' }} xs={12} md={12}>
                          <Grid item md={6} xs={11}>
                            <TextField id="oldPassword"
                              value={this.state.currentUser.oldPassword} type='password'
                              variant='outlined' label={!this.state.passwordChange ? "Password" : "Old password"}
                              onChange={(event) => {
                                this.setState({
                                  currentUser: {
                                    username: this.state.currentUser.username,
                                    date_created: this.state.currentUser.date_created,
                                    oldPassword: event.target.value,
                                    newPassword: this.state.currentUser.newPassword,
                                  },
                                  passwordChange: true,
                                }
                                )
                              }} onFocus={() => {
                                this.setState({ passwordChange: true });
                                if (this.state.currentUser.oldPassword === '********') {
                                  this.setState({
                                    currentUser: {
                                      username: this.state.currentUser.username,
                                      date_created: this.state.currentUser.date_created,
                                      oldPassword: '',
                                      newPassword: this.state.currentUser.newPassword,
                                    },
                                  })
                                }
                              }} />
                          </Grid>
                          <Grid item md={6} xs={11}>
                            {this.state.passwordChange ?
                              <TextField id="newPassword"
                                value={this.state.currentUser.newPassword} type='password'
                                variant='outlined' label="New password" hidden={!this.state.passwordChange}
                                onChange={(event) => {
                                  this.setState({
                                    currentUser: {
                                      username: this.state.currentUser.username,
                                      date_created: this.state.currentUser.date_created,
                                      oldPassword: this.state.currentUser.oldPassword,
                                      newPassword: event.target.value,
                                    },
                                  }
                                  )
                                }} />
                              : null}
                          </Grid>
                        </Grid>
                        <Grid item container direction="row" alignItems="flex-end" justify="flex-end">
                          {this.state.passwordChange ? <Grid item>
                            <Button type="submit">
                              Change password
                            </Button>
                          </Grid> : null}
                        </Grid>
                      </Grid>
                    </form>
                  </Grid>
                </TabPanel>
              </Grid>
            </Grid>
          </TabContext>
        </DialogContent>
        <DialogActions>
          <Button onClick={this.props.handleClose}>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    )
  }

}

export default SettingsDialog;