import React from 'react'
import { Grid } from '@material-ui/core'
import { Typography, Paper } from '@material-ui/core'
import ComputerIcon from '@material-ui/icons/Computer';

class Kartica2 extends React.Component {
    constructor(props) {
        super(props)
        this.state = { count: 0, isLoaded: false }
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
            <Paper variant="square" margin="20%">
                <Grid container direction={"row"} justify={"center"} spacing={2}>
                    <Grid item>
                        <ComputerIcon fontSize="large" />
                    </Grid>
                    <Grid item>
                        <Typography variant="h5">
                            Online uređaji
                        </Typography>
                    </Grid>
                </Grid>
                <Typography variant="h5">
                    {this.state.count}
                </Typography>
            </Paper >

        )
    }
}

export default Kartica2