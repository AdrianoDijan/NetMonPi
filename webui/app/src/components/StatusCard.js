import React from 'react';
import { CardContent, Grid, Typography, Card } from '@material-ui/core'
import Title from './Title'
import InfoIcon from '@material-ui/icons/Info';
import PublicIcon from '@material-ui/icons/Public';
import RouterIcon from '@material-ui/icons/Router';
import BusinessIcon from '@material-ui/icons/Business';
import ExploreIcon from '@material-ui/icons/Explore';
import DevicesIcon from '@material-ui/icons/Devices';

class StatusCard extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            data: {},
            connected: 0,
        }
    }

    componentDidMount() {
        fetch("/api/v1/info")
        .then(response => response.json())
        .then((response) => this.setState({data: response}))

        fetch("/api/v1/devices/online")
                .then(res => res.json())
                .then(res => this.setState({connected: res.length}))
    }

    render() {
        return (
            <Card style={{ height: '100%' }}>
                <CardContent>
                    <Grid container direction="column" spacing={1}>
                        <Grid item container direction={"row"} justify="space-between">
                            <Grid item xs>
                                <Title> Network information </Title>
                            </Grid>
                            <Grid item>
                                <InfoIcon fontSize="large" />
                            </Grid>
                        </Grid>
                        <Grid item container direction={"row"} justify="space-between">
                            <Grid item xs>
                                <Typography display="inline" variant="h6">
                                    <PublicIcon/>
                                </Typography>
                            </Grid>
                            <Grid item>
                                <Typography display="inline" variant="h6">
                                    {this.state.data["public_ip"]}
                                </Typography>
                            </Grid>
                        </Grid>
                        <Grid item container direction={"row"} justify="space-between">
                            <Grid item xs>
                                <Typography display="inline" variant="h6">
                                    <RouterIcon/>
                                </Typography>
                            </Grid>
                            <Grid item>
                                <Typography display="inline" variant="h6">
                                    {this.state.data["network"]}
                                </Typography>
                            </Grid>
                        </Grid>
                        <Grid item container direction={"row"} justify="space-between">
                            <Grid item xs>
                                <Typography display="inline" variant="h6">
                                    <BusinessIcon/>
                                </Typography>
                            </Grid>
                            <Grid item>
                                <Typography display="inline" variant="h6">
                                    {this.state.data["isp"]}
                                </Typography>
                            </Grid>
                        </Grid>
                        <Grid item container direction={"row"} justify="space-between">
                            <Grid item xs>
                                <Typography display="inline" variant="h6">
                                    <ExploreIcon/>
                                </Typography>
                            </Grid>
                            <Grid item>
                                <Typography display="inline" variant="h6">
                                    {this.state.data["country"]}
                                </Typography>
                            </Grid>
                        </Grid>
                        <Grid item container direction={"row"} justify="space-between">
                            <Grid item xs>
                                <Typography display="inline" variant="h6">
                                    <DevicesIcon/>
                                </Typography>
                            </Grid>
                            <Grid item>
                                <Typography display="inline" variant="h6">
                                    {this.state.connected}
                                </Typography>
                            </Grid>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>
        )
    }
}

export default StatusCard;