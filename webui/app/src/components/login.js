import React from 'react'
import Grid from '@material-ui/core/Grid';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import Paper from '@material-ui/core/Paper'
import { blue } from '@material-ui/core/colors';
import Divider from '@material-ui/core/Divider'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'

class Login extends React.Component {
    render() {
        return (
            <Grid container
                spacing={0}
                direction="column"
                alignItems="center"
                justify="center"
                style={{ minHeight: '100vh' }}>
                <Grid item xs={3}>
                    <Paper>
                        <AccountCircleIcon fontSize="large" style={{ color: blue }} />
                        <Divider />
                        <form noValidate autoComplete="off">
                            <TextField label="name" />
                            <TextField label="password" />
                        </form>
                        <Divider />
                        <Button>
                            <a href="../dashboard">Login</a>
                        </Button>
                    </Paper>
                </Grid>
            </Grid>
        )
    }
}

export default Login;