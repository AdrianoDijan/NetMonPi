import React from 'react'
import './App.css';
import AlatnaTraka from './components/navbar'
import Graf from './components/graf'
import BasicTable from './components/tablica'
import Kartica from './components/Card1'
import Kartica2 from './components/Card2'
import Kartica1 from './components/Card1'
import Grid from '@material-ui/core/Grid'
import Paper from '@material-ui/core/Paper'
import { makeStyles } from '@material-ui/core/styles'
import Divider from '@material-ui/core/Divider'

class App extends React.Component {
  constructor() {
    super()
    this.state = {}
  }

  render() {
  return (

    <div>
      <Grid container spacing={3} direction="column">

        <Grid item container>
        <Grid item xs={12}>
          <Paper><AlatnaTraka/></Paper>
        </Grid>
        </Grid>
        <Grid item container>
        <Grid item xs={1}></Grid>
        <Grid item xs={4}>
          <Paper><Kartica1/></Paper>
        </Grid>
        <Grid item xs={2}></Grid>
        <Grid item xs={4}>
          <Paper><Kartica2/></Paper>
        </Grid>
        <Grid item xs={1}></Grid>
        </Grid>
        
        <Grid item container>
          <Grid item xs={1}></Grid>
          <Grid item xs={10}>
          <Paper variant="outlined"><Graf/></Paper>
          </Grid>
          <Grid item xs={1}></Grid>
        </Grid>

        <Grid item container>
        <Grid item xs={1}></Grid>
        <Grid item xs={10}>
          <Paper><BasicTable/></Paper>
        </Grid>
        <Grid item xs={1}></Grid>
      </Grid>
      </Grid>
    </div>

  )};
}

export default App;
