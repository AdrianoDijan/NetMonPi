import React from 'react';
import moment from 'moment';
import ChartComponent from './InterfaceChartComponent';
import { Grid, Card, CardContent, ButtonGroup, Button } from '@material-ui/core';
import Title from './Title';

class ChartContainer extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            txData: [],
            rxData: [],
            chartLabels: [],
            fetchUrl: '/api/v1/bandwidth/today',
            selectedButton: 'today'
        };
    };

    componentDidMount() {
        this.fetchData = () => {
            fetch(this.state.fetchUrl)
                .then(response => response.json())
                .then(data => {
                    let txOctets = [];
                    let rxOctets = [];
                    let labels = [];

                    for (let i = 0; i < data.length; i++) {
                        txOctets.push(data[i]['txInOctets'])
                        rxOctets.push(data[i]['txOutOctets'])
                        labels.push(data[i]['time'])
                    }

                    txOctets = txOctets.map(x => { return (x / 1000000).toFixed(2) });
                    rxOctets = rxOctets.map(x => { return -1 * (x / 1000000).toFixed(2) })
                    labels = labels.map(x => { return moment(x) });

                    this.setState({ txData: txOctets, rxData: rxOctets, chartLabels: labels });
                });
        }
        this.fetchData()
        this.intervalHandler = setInterval(this.fetchData, 2000);
    }

    componentWillUnmount() {
        clearInterval(this.intervalHandler)
    }

    render() {
        const { txData, rxData, chartLabels } = this.state;
        return (
            <Card title={"WAN Bandwidth"}>
                <CardContent>
                    <Grid container direction={"row"}>
                        <Grid item xs>
                            <Title>
                                WAN Bandwidth
                            </Title>
                        </Grid>
                        <Grid item>
                            <ButtonGroup variant='outlined'>
                                <Button variant={this.state.selectedButton ==='today' ? "contained" : 'outlined'}
                                        onClick={() => {this.setState({selectedButton: 'today', fetchUrl: '/api/v1/bandwidth/today'}); this.fetchData()}}>
                                    Today
                                </Button>
                                <Button variant={this.state.selectedButton === '24h' ? "contained" : 'outlined'}
                                        onClick={() => {this.setState({selectedButton: '24h', fetchUrl: '/api/v1/bandwidth/last/24h'}); this.fetchData()}}>
                                    24h
                                </Button>
                                <Button variant={this.state.selectedButton === '1h' ? "contained" : 'outlined'}
                                        onClick={() => {this.setState({selectedButton: '1h', fetchUrl: '/api/v1/bandwidth/last/1h'}); this.fetchData()}}>
                                    1h
                                </Button>
                            </ButtonGroup>
                        </Grid>
                    </Grid>
                    <ChartComponent txData={txData} rxData={rxData} chartLabels={chartLabels} />
                </CardContent>
            </Card>
        );
    }
}

export default ChartContainer;