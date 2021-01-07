import React from 'react';
import { Dialog, DialogTitle, DialogContent, Grid, DialogActions, Button, Typography, Chip, Collapse, IconButton } from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';
import { DataGrid } from '@material-ui/data-grid';
import DevicesIcon from '@material-ui/icons/Devices';
import Title from './Title';
import ErrorOutlineIcon from '@material-ui/icons/ErrorOutline';
import HighlightOffIcon from '@material-ui/icons/HighlightOff';
import CloseIcon from '@material-ui/icons/Close';
import OpenInNewIcon from '@material-ui/icons/OpenInNew';

class DeviceInfo extends React.Component {
  constructor(props) {
    super(props)
    this.state = { services: [], servicesLoaded: false, selectedExploit: null }
    this.columns = [
      { field: 'product', headerName: 'Naziv', width: 250 },
      { field: 'version', headerName: 'Verzija', width: 250 },
      { field: 'port', headerName: 'Port', width: 100 },
      { field: 'protocol', headerName: 'Protokol', width: 100 },
      {
        field: 'exploits', headerName: 'Ranjivosti', width: 400,
        renderCell: (params) => {
          return (
            <Grid container direction="row" spacing={1}>
              {
                params.row.exploits ? params.row.exploits.map((exploit) => {
                  return (
                    <Grid item key={exploit.cve_number}>
                      <Chip
                        onClick={() => {
                          this.setState({ selectedExploit: this.state.selectedExploit === exploit ? null : exploit });
                        }}
                        label={exploit.cve_number}
                        color={exploit.base_score < 5 ? 'primary' : 'primary'}
                        style={exploit.base_score < 5 ? { backgroundColor: 'orange' } : { backgroundColor: 'red' }}
                        icon={exploit.base_score < 5 ? <ErrorOutlineIcon fontSize="small" /> : <HighlightOffIcon fontSize="small" />}
                      />

                    </Grid>
                  )
                }
                ) : null
              }
            </Grid>
          )
        }
      }
    ];
  }

  componentDidMount() {
    this.fetchData = () => {
      fetch(`/api/v1/services/${this.props.rowData.row.mac}`)
        .then(response => response.json())
        .then(response => {
          if (response.length !== this.state.services.length) {
            for (let i = 0; i < response.length; i++) {
              response[i]['id'] = i;
            }
            return response;
          }
          else if (!response.length) {
            return response;
          }
          else {
            return null;
          }
        })
        .then((services) => {
          if (services) {
            for (let service of services) {
              fetch(`/api/v1/exploits/${service.service_id}`)
                .then((response) => response.json())
                .then((response) => { service.exploits = response })
                .then(() => { this.setState({ services: services, servicesLoaded: true }) })
            }
            this.setState({servicesLoaded: true})
          }
        })
    }
    this.fetchData()
    this.intervalHandle = setInterval(this.fetchData, 2000);
  }

  componentWillUnmount() {
    clearInterval(this.intervalHandle)
  }

  render() {
    return (
      <Dialog
        maxWidth={'lg'}
        fullWidth={true}
        open={this.props.open}
        onClose={this.props.handleClose}
        aria-labelledby="device-info"
        scroll="body"
        style={{zIndex: '150 !important'}}
      >
        <DialogTitle id="max-width-dialog-title">
          <Grid item container direction={'row'} justify="space-between">
            <Grid item xs>
              <Title> Informacije o uređaju </Title>
            </Grid>
            <Grid item>
              <DevicesIcon fontSize='large' />
            </Grid>
          </Grid>
        </DialogTitle>
        <DialogContent>
          <Grid container direction='column' justify="center">
            <Grid container direction="column" justify="center">
              <Grid item container direction={'row'} justify="space-between" >
                <Grid item>
                  <Typography display='inline' variant='h6'>
                    Hostname
                  </Typography>
                </Grid>
                <Grid item>
                  <Typography display='inline' variant='h6'>
                    {this.props.rowData.row.hostname}
                  </Typography>
                </Grid>
              </Grid>
              <Grid item container direction={'row'} justify="space-between" >
                <Grid item>
                  <Typography display='inline' variant='h6'>
                    IP adresa
                  </Typography>
                </Grid>
                <Grid item>
                  <Typography display='inline' variant='h6'>
                    {this.props.rowData.row.ip}
                  </Typography>
                </Grid>
              </Grid>
              <Grid item container direction={'row'} justify="space-between" >
                <Grid item>
                  <Typography display='inline' variant='h6'>
                    MAC adresa
                  </Typography>
                </Grid>
                <Grid item>
                  <Typography display='inline' variant='h6'>
                    {this.props.rowData.row.mac}
                  </Typography>
                </Grid>
              </Grid>
              <Grid item container direction={'row'} justify="space-between" >
                <Grid item>
                  <Typography display='inline' variant='h6'>
                    Vendor
                  </Typography>
                </Grid>
                <Grid item>
                  <Typography display='inline' variant='h6'>
                    {this.props.rowData.row.vendor}
                  </Typography>
                </Grid>
              </Grid>
              <Typography variant="h6">
                &nbsp;
              </Typography>
              <Typography variant="h5">
                Otvoreni portovi
              </Typography>

              <div style={{ height: 200 + this.state.services.length * 20, width: '100%', padding: "1%" }}>
                <DataGrid rows={this.state.services}
                  columns={this.columns}
                  autoPageSize={true}
                  disableClickEventBubbling={true}
                  disableSelectionOnClick={true}
                  loading={!this.state.servicesLoaded}
                />
              </div>
              <Collapse in={Boolean(this.state.selectedExploit)}>
                <Alert
                  action={
                    <IconButton
                      aria-label="close"
                      color="inherit"
                      size="small"
                      onClick={() => {
                        this.setState({ selectedExploit: null });
                      }}
                    >
                      <CloseIcon fontSize="inherit" />
                    </IconButton>
                  }
                  severity={this.state.selectedExploit ? (this.state.selectedExploit.base_score < 5 ? "warning" : "error") : "info"}
                >
                  <Grid container direction="column" spacing={1}>
                    <Grid item container direction="row">
                      <Grid item xs>
                        <Typography>CVE Broj</Typography>
                      </Grid>
                      <Grid item>
                        {this.state.selectedExploit ? this.state.selectedExploit.cve_number : null}
                      </Grid>
                    </Grid>
                    <Grid item container direction="row">
                      <Grid item xs>
                        <Typography>Razina opasnosti</Typography>
                      </Grid>
                      <Grid item>
                        {this.state.selectedExploit ? this.state.selectedExploit.base_score : null}
                      </Grid>
                    </Grid>
                    <Grid item container direction="row">
                      <Grid item xs>
                        <Typography>Opis</Typography>
                      </Grid>
                      <Grid item>
                        {this.state.selectedExploit ? this.state.selectedExploit.description : null}
                      </Grid>
                    </Grid>
                    <Grid item>
                      <Button endIcon={<OpenInNewIcon />} color="inherit" target="_blank" href={this.state.selectedExploit ? this.state.selectedExploit.reference_source : ""}>
                        Više informacija
                      </Button>
                    </Grid>
                  </Grid>
                </Alert>
              </Collapse>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={this.props.handleClose} color="primary">
            Zatvori
          </Button>
        </DialogActions>
      </Dialog>
    )
  }
}

export default DeviceInfo;