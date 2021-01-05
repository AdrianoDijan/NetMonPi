import React from 'react'
import { CardActions, CardContent, Grid, Button, Typography, Card } from '@material-ui/core'
import ComputerIcon from '@material-ui/icons/Computer';
import LaunchIcon from '@material-ui/icons/Launch';
import Title from "./Title"
import TableDialog from './TableDialog'

class DeviceCount extends React.Component {
    constructor(props) {
        super(props)
        this.state = { count: 0, isLoaded: false, dialogOpen: false, maxWidth: 'lg', fullWidth: true }
    }

    componentDidMount() {
        this.fetchData = () => {
            fetch("http://localhost:3080/api/v1/devices/online")
                .then(res => res.json())
                .then(res => {
                    this.setState({ count: res.length, isLoaded: true });
                })
                .catch(err => console.log(err.message))
        }
        this.fetchData()
        setInterval(this.fetchData, 10000)
    }

    render() {
        return (
            <Card>
                <CardContent>
                    <Grid container direction="column" spacing={1}>
                        <Grid item container direction={"row"} justify="space-between">
                            <Grid item xs>
                                <Title> Povezano uređaja </Title>
                            </Grid>
                            <Grid item>
                                <ComputerIcon fontSize="large" />
                            </Grid>
                        </Grid>
                        <Grid item container direction={"row"} justify="space-between">
                            <Grid item xs>
                                <Typography display="inline" variant="h5">
                                    {this.state.count}
                                </Typography>
                            </Grid>
                        </Grid>
                    </Grid>
                </CardContent>
                <CardActions>
                    <Button color='inherit' size='small' onClick={() => {
                        this.setState({dialogOpen: true})
                        // document.querySelector("#deviceTable").scrollIntoView({ behavior: 'smooth' });
                    }}>
                        <LaunchIcon fontSize="small" /> Detalji
                    </Button>
                </CardActions>
                <TableDialog
                    open={this.state.dialogOpen}
                    fullWidth={this.state.fullWidth}
                    maxWidth={this.state.maxWidth}
                    handleClose={() => this.setState({dialogOpen: false})}
                />
            </Card>
        )
    }
}

export default DeviceCount