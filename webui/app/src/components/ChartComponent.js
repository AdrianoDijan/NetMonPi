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

        let gradientStrokeBlue = myChartRef.createLinearGradient(0, 200, 0, 0);

        gradientStrokeBlue.addColorStop(1, "rgba(29,140,248,0.6)");
        gradientStrokeBlue.addColorStop(0, "rgba(29,140,248,0)");

        let gradientStrokeRed = myChartRef.createLinearGradient(0, 280, 0, 0);

        gradientStrokeRed.addColorStop(1, "rgba(148, 50, 41,0.8)");
        gradientStrokeRed.addColorStop(0, "rgba(148, 50, 41,0.0)");


        let chartjsObj = new Chart(myChartRef, 
            {
            type: "line",
            data: {
                datasets: [
                    {
                        fill: 1,
                        label: "Download",
                        borderColor: "#a31818",
                        backgroundColor: gradientStrokeRed,
                        
                    },
                    {
                        label: "Upload",
                        borderColor: "#1f8ef1",
                        negativeBackgroundColor: gradientStrokeBlue,
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
};

export default function ChartComponent(props) {
    const theme = useTheme();

    return <ChartComponentClass {...props} theme={theme}/>;
}
