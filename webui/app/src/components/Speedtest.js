import React from 'react'
import { CardContent, Grid, Typography, Card, CardActions, Button, Dialog } from '@material-ui/core';
import moment from 'moment'
import SpeedIcon from '@material-ui/icons/Speed';
import LaunchIcon from '@material-ui/icons/Launch';
import SettingsEthernetIcon from '@material-ui/icons/SettingsEthernet';
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward';
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward';
import AccessTimeIcon from '@material-ui/icons/AccessTime';
import Title from './Title';

class Speedtest extends React.Component {
    constructor(props) {
        super(props)
        this.state = { data: {}, isLoaded: false, dialogOpen: false }
    }

    componentDidMount() {
        this.fetchData = () => {
            fetch('/api/v1/speedtest/last')
                .then(res => res.json())
                .then(res => {
                    moment.locale('hr')
                    let data = { download: 0, upload: 0, ping: 0, url: "" }
                    data["ping"] = res[0]['ping'].toFixed(2) + ' ms';
                    data["download"] = (res[0]['download'] / (1000000)).toFixed(2) + ' Mbps';
                    data["upload"] = (res[0]['upload'] / (1000000)).toFixed(2) + ' Mbps';
                    data["url"] = res[0]["url"].replace(".png", "");
                    data["time"] = moment(res[0]["time"]).format('DD.MM.YYYY. HH:mm')
                    this.setState({ data: data, isLoaded: true });
                })
                .catch(err => console.log(err.message))
        }
        this.fetchData()
        this.interval = setInterval(this.fetchData, 10000)
    }

    componentWillUnmount() {
        clearInterval(this.interval);
    }

    render() {
        return (
            <Card style={{ height: '100%' }}>
                <CardContent>
                    <Grid container direction='column' justify="center">
                        <Grid item container direction={'row'} justify="space-between">
                            <Grid item xs>
                                <Title> Speedtest </Title>
                            </Grid>
                            <Grid item>
                                <SpeedIcon fontSize='large' />
                            </Grid>
                        </Grid>
                        <Grid container direction="column" justify="center">
                            <Grid item container direction={'row'} justify="space-between" >
                                <Grid item>
                                    <ArrowDownwardIcon fontSize='large' />
                                </Grid>
                                <Grid item>
                                    <Typography display='inline' variant='h6'>
                                        {this.state.data["download"]}
                                    </Typography>
                                </Grid>
                            </Grid>
                            <Grid item container direction={'row'} justify="space-between">
                                <Grid item>
                                    <ArrowUpwardIcon fontSize='large' />
                                </Grid>
                                <Grid item>
                                    <Typography display='inline' variant='h6'>
                                        {this.state.data["upload"]}
                                    </Typography>
                                </Grid>
                            </Grid>
                            <Grid item container direction={'row'} justify="space-between">
                                <Grid item>
                                    <SettingsEthernetIcon fontSize='large' />
                                </Grid>
                                <Grid item>
                                    <Typography display='inline' variant='h6'>
                                        {this.state.data["ping"]}
                                    </Typography>
                                </Grid>
                            </Grid>
                            <Grid item container direction={'row'} justify="space-between">
                                <Grid item>
                                    <AccessTimeIcon fontSize='large' />
                                </Grid>
                                <Grid item>
                                    <Typography display='inline' variant='h6'>
                                        {this.state.data["time"]}
                                    </Typography>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                </CardContent>
                <CardActions>
                    <Button color='inherit' size='small' endIcon={<LaunchIcon/>} onClick={() => { this.setState({dialogOpen: true}) }}>
                        Prikaži rezultate
                    </Button>
                    <TableDialog open={this.state.dialogOpen} url={this.state.data["url"]} maxWidth={'sm'} handleClose={() => {this.setState({dialogOpen: false})}}/>
                </CardActions>
            </Card >
        )
    }
}

class TableDialog extends React.Component {
    render() {
        return (
            <Dialog
                fullWidth={this.props.fullWidth}
                maxWidth={this.props.maxWidth}
                open={this.props.open}
                onClose={this.props.handleClose}
                aria-labelledby="max-width-dialog-title"
                scroll="body"
            >
                        <a href={this.props.url} target="_blank" rel="noreferrer">
                        <img alt="Results" width="100%" src={this.props.url + ".png"}/>
                        </a>
            </Dialog>
        )
    }
}

export default Speedtest