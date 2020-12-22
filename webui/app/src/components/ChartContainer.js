import React from 'react';
import moment from 'moment';
import ChartComponent from './ChartComponent';

class ChartContainer extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            txData: [],
            rxData: [],
            chartLabels: [],
        };
    };

    componentDidMount() {
        fetch("http://localhost:3080/api/v1/bandwidth/lastday")
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

    render() {
        const { txData, rxData, chartLabels } = this.state;
        return (
            <ChartComponent txData={txData} rxData={rxData} chartLabels={chartLabels} />
        );
    }
}

export default ChartContainer;