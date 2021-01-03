import React, { Component } from 'react'
import Card from '@material-ui/core/Card'
import Grid from '@material-ui/core/Grid';
import CardHeader from '@material-ui/core/CardHeader'
import CardContent from '@material-ui/core/CardContent'
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import Paper from '@material-ui/core/Paper'
import { blue } from '@material-ui/core/colors';
import Divider from '@material-ui/core/Divider'
import TextField from '@material-ui/core/TextField'
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link
  } from "react-router-dom";
  import Home from '../home'
  import Button from '@material-ui/core/Button'

class Login extends React.Component {
    constructor() {
        super()
        this.state = {}
    }

    render() {
        return(
            <Grid container container
            spacing={0}
            direction="column"
            alignItems="center"
            justify="center"
            style={{ minHeight: '100vh' }}>
            <Grid item xs={3}>

            {/* <Card variant="outlined">
                <CardHeader>
                <AccountCircleIcon fontSize="large"/>
                </CardHeader>

                <CardContent>
                <h2>Sadrzaj</h2>
                </CardContent>
            </Card> */}

            <Paper>
                <AccountCircleIcon fontSize="large" style={{color: blue}}/>
                <Divider/>
                <form noValidate autoComplete="off">
                <TextField label="name"/>
                <TextField label="password"/>
                </form>
                <Divider/>
                <Button>
                <a href="../home">Login</a>
                </Button>
            </Paper>

            </Grid>
            </Grid>
        )
    }
}

export default Login;