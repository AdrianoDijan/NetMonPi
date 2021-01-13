import React from 'react';
import moment from 'moment';
import ChartComponent from './InterfaceChartComponent';
import { Grid, Card, CardContent, ButtonGroup, Button } from '@material-ui/core';
import 'chartjs-adapter-moment';
import Title from './Title';

class ChartContainer extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            data: [],
            fetchUrl: '/api/v1/bandwidth/last/24h',
            selectedButton: '24h'
        };
    };

    componentDidMount() {
        this.fetchData = () => {
            fetch(this.state.fetchUrl)
                .then(response => response.json())
                .then(data => 
                    data.map(x => (
                        {
                            txInOctets: (x['txInOctets'] / 1000000).toFixed(2),
                            txOutOctets: (x['txOutOctets'] / -1000000).toFixed(2),
                            time: moment(x['time'])
                        }))
                )
                .then(data => {this.setState({data: data})});
        }
        this.fetchData()
        this.intervalHandler = setInterval(this.fetchData, 2000);
    }

    componentWillUnmount() {
        clearInterval(this.intervalHandler)
    }

    render() {
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
                            <ButtonGroup>
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
                    <ChartComponent data={this.state.data}/>
                </CardContent>
            </Card>
        );
    }
}

export default ChartContainer;