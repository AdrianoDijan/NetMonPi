import React, { Component } from 'react'
import Chart from "chart.js";


Chart.defaults.global.defaultFontFamily = "'PT Sans', sans-serif"
Chart.defaults.global.legend.display = false;

class ChartComponent extends Component {

    constructor(props) {
        super(props);
        this.state = {
            chart: null,
        }
    }

    chartRef = React.createRef();

    componentDidMount() {
        const myChartRef = this.chartRef.current.getContext("2d");

        let chartjsObj = new Chart(myChartRef, 
            {
            type: "line",
            data: {
                datasets: [
                    {
                        label: "Download",
                        borderColor: "rgb(204,0,0)",
                        backgroundColor: "rgba(240, 10, 10, 0.2)",
                    },
                    {
                        label: "Upload",
                        borderColor: "rgb(0, 0, 255)",
                        backgroundColor: "rgba(10, 10, 240, 0.2)",
                    }
                ]
            },
            options: {
                scales: {
                    yAxes: [{
                        scaleLabel: {
                            display: true,
                            labelString: 'MB/s'
                        }
                    }],
                    xAxes: [{
                        type: 'time',
                        time: {
                            displayFormats: {
                                minute: 'HH:MM'
                            },
                            unit: 'minute'
                        },
                        ticks: {
                            autoSkip: true,
                            source: 'labels',
                        }
                    }],
                },
                elements: {
                    line: {
                    },
                    point: {
                        radius: 1
                    }
                },
                tooltips: {
                    mode: 'index',
                    position: 'average',
                    intersect: false,
                    callbacks: {
                        label: (item) => { return item.yLabel + ' MB/s' }
                    }
                },
                maintainAspectRatio: false,
                legend: {
                    display: false,
                    position: "right"
                }
            }
        });
        this.setState({ chart: chartjsObj });
    }

    componentWillReceiveProps(nextProps, nextContext) {
        let chart = this.state.chart
        chart.data.datasets[0].data = nextProps.txData;
        chart.data.datasets[1].data = nextProps.rxData;
        chart.data.labels = nextProps.chartLabels;
        chart.update();
    }

    render() {
        return (
            <div style={{height: 400}}>
                <canvas
                    id="myChart"
                    ref={this.chartRef}
                />
            </div>
        )
    }
}

export default ChartComponent;
