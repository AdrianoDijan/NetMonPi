import React from 'react';
import {Tab, Dialog, DialogContent, DialogActions, Grid, Button } from '@material-ui/core'
import TabContext from '@material-ui/lab/TabContext';
import TabList from '@material-ui/lab/TabList';
import TabPanel from '@material-ui/lab/TabPanel';
import StatusCard from './StatusCard';
import { SettingsEthernet as SettingsEthernetIcon, AccountCircle as AccountCircleIcon } from '@material-ui/icons';

class SettingsDialog extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            currentTab: '',
            tabValue: '0',
        }
    }

    render() {
        return (
            <Dialog
                maxWidth={'lg'}
                fullWidth={true}
                open={this.props.open}
                onClose={this.props.handleClose}
                scroll="body"
                style={{ zIndex: '150 !important', marginTop: '50px' }}
            >
                <DialogContent>
                    <TabContext value={this.state.tabValue}>
                        <Grid container direction="row" spacing={1}>
                            <Grid item>
                                <TabList orientation="vertical" onChange={(event, newValue) => { this.setState({ tabValue: newValue }) }}>
                                    <Tab id={0} label={<SettingsEthernetIcon />} value="networkSettings" />
                                    <Tab id={1} label={<AccountCircleIcon />} value="userSettings" />
                                </TabList>
                            </Grid>
                            <Grid item xs>
                                <TabPanel value="networkSettings">
                                    <StatusCard />
                                </TabPanel>
                                <TabPanel value="userSettings">
                                    Tab2
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