import React from 'react';
import { Tab, Dialog, DialogContent, DialogActions, Grid, Button, TextField, Typography } from '@material-ui/core'
import TabContext from '@material-ui/lab/TabContext';
import TabList from '@material-ui/lab/TabList';
import TabPanel from '@material-ui/lab/TabPanel';
import StatusCard from './StatusCard';
import { SettingsEthernet as SettingsEthernetIcon, AccountCircle as AccountCircleIcon } from '@material-ui/icons';
import Title from './Title'
import SettingsIcon from '@material-ui/icons/Settings';

class SettingsDialog extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      tabValue: 'networkSettings',
      currentUser: {
        username: '',
        date_created: '',
        oldPassword: '',
        newPassword: '',
      },
      passwordChange: false,
      interface: '',
      scanInterval: '',
    }
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
                  <Tab id={0} label={<SettingsEthernetIcon />} value="networkSettings" />
                  <Tab id={1} label={<AccountCircleIcon />} value="userSettings" />
                  <Tab id={2} label={<SettingsIcon />} value="settings" />
                </TabList>
              </Grid>
              <Grid item xs>
                <TabPanel value="networkSettings">
                  <Grid container direction="column" spacing={3}>
                    <Grid item>
                      <Typography variant='h4'>Network settings</Typography>
                    </Grid>
                    <Grid item container direction="row" style={{ marginLeft: '20px' }}>
                      <Grid item>
                        <TextField id="Interface" value={this.state.interface}
                          onChange={(event) => {
                            this.setState({ interface: event.target.value });
                          }} label="Interface" variant="outlined" />
                      </Grid>
                    </Grid>
                    <Grid item container direction="row" style={{ marginLeft: '20px' }}>
                      <Grid item>
                        <TextField id="Interval" value={this.state.scanInterval}
                          onChange={(event) => {
                            this.setState({ scanInterval: event.target.value });
                          }} variant="outlined" label="Scan interval" />
                      </Grid>
                    </Grid>
                  </Grid>
                </TabPanel>
                <TabPanel value="userSettings">
                  <Grid container direction="column" spacing={3}>
                    <Grid item>
                      <Typography variant="h4">User Settings</Typography>
                    </Grid>
                    <Grid item container direction="row" spacing={4}>
                      <Grid item>
                        <TextField id="Username" value={this.state.username} onChange={(event) => {
                          this.setState({ scanInterval: event.target.value });
                        }} label="Username" variant="outlined" style={{ marginLeft: '20px' }}></TextField>
                      </Grid>
                    </Grid>
                    <Grid item container direction="row">
                      <Grid item>
                        <TextField id="date_created" value={this.state.date_created} label='Date created' variant='outlined' style={{ marginLeft: '20px' }} onChange={(event) => {
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
                    <form noValidate onSubmit={() => { }}>
                      <Grid item container direction="column" spacing={1}>
                        <Grid item container direction="row" spacing={3} alignItems="center" style={{ marginLeft: '20px' }} xs={10} md={12}>
                          <Grid item md={6}>
                            <TextField id="oldPassword"
                              value={this.state.currentUser.oldPassword} type='password'
                              variant='outlined' label={!this.state.passwordChange ? "Password" : "Old password"}
                              onChange={(event) => {
                                this.setState({
                                  currentUser: {
                                    oldPassword: event.target.value
                                  },
                                  passwordChange: true,
                                }
                                )
                              }} onFocus={() => { this.setState({ passwordChange: true }) }} />
                          </Grid>
                          <Grid item md={6}>
                            {this.state.passwordChange ?
                              <TextField id="newPassword"
                                value={this.state.currentUser.newPassword} type='password'
                                variant='outlined' label="New password" hidden={!this.state.passwordChange}
                                onChange={(event) => {
                                  this.setState({
                                    currentUser: {
                                      newPassword: event.target.value
                                    }
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