import React, { Component } from 'react'
import Chart from "chart.js";
import { useTheme } from '@material-ui/core';

class ChartComponentClass extends Component {

    constructor(props) {
        super(props);
        this.state = {
            chart: null,
        }
    }

    chartRef = React.createRef();

    componentDidMount() {
        const {theme} = this.props
        const myChartRef = this.chartRef.current.getContext("2d");

        Chart.defaults.global.defaultFontColor = theme.palette.text.primary;
        Chart.defaults.global.defaultFontFamily = theme.typography.fontFamily;
        Chart.defaults.global.legend.display = false;

        let chartjsObj = new Chart(myChartRef, 
            {
            type: "line",
            data: {
                datasets: [
                    {
                        label: "Download",
                        borderColor: "#a31818",
                        backgroundColor: "rgba(148, 50, 41, 0.3)",
                        
                    },
                    {
                        label: "Upload",
                        borderColor: "#1f8ef1",
                        backgroundColor: "rgba(29,140,248,0.3)",
                    }
                ]
            },
            options: {
                scales: {
                    yAxes: [{
                        scaleLabel: {
                            display: true,
                            labelString: 'MB/s'
                        },
                        gridLines: {
                            drawBorder: false,
                            color: "rgba(29,140,248,0.1)",
                            zeroLineColor: "transparent",
                          },
                    }],
                    xAxes: [{
                        type: 'time',
                        time: {
                            displayFormats: {
                                minute: 'HH:MM'
                            },
                            unit: 'minute'
                        },
                        gridLines: {
                            drawBorder: false,
                            color: "rgba(29,140,248,0.0)",
                            zeroLineColor: "transparent",
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
                    backgroundColor: theme.palette.text.primary,
                    titleFontColor: theme.palette.primary.chartTitle,
                    bodyFontColor: theme.palette.primary.chartText,
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

    componentDidUpdate(nextProps, nextContext) {
        let chart = this.state.chart
        chart.data.datasets[0].data = this.props.txData;
        chart.data.datasets[1].data = this.props.rxData;
        chart.data.labels = this.props.chartLabels;
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
};

export default function ChartComponent(props) {
    const theme = useTheme();

    return <ChartComponentClass {...props} theme={theme}/>;
}
