import React, { Component } from 'react'
import { Chart, LineController, LineElement, PointElement, LinearScale, Title, CategoryScale, TimeScale, Tooltip, Filler } from 'chart.js'
import { useTheme } from '@material-ui/core';

class ChartComponentClass extends Component {

    constructor(props) {
        super(props);
        this.state = {
            chart: null,
            theme: this.props.theme,
        }
    }

    chartRef = React.createRef();

    componentDidMount() {
        const myChartRef = this.chartRef.current.getContext("2d");

        Chart.register(LineController, LineElement, PointElement, LinearScale, Title, CategoryScale, TimeScale, Tooltip, Filler);
        Chart.defaults.font.family = this.props.theme.typography.fontFamily;

        this.setState({
            chart: new Chart(myChartRef,
                {
                    type: "line",
                    data: {
                        labels: this.props.data.map(x => x['time']),
                        datasets: [
                            {
                                data: this.props.data,
                                normalized: true,
                                label: "Download",
                                borderColor: "#a31818",
                                backgroundColor: 'rgb(148, 50, 41, 0.3)',
                                parsing: {
                                    xAxisKey: 'time',
                                    yAxisKey: 'txInOctets',
                                },
                                fill: true,
                            },
                            {
                                data: this.props.data,
                                normalized: true,
                                label: "Upload",
                                borderColor: "#1f8ef1",
                                backgroundColor: "rgba(29,140,248,0.3)",
                                parsing: {
                                    xAxisKey: 'time',
                                    yAxisKey: 'txOutOctets',
                                },
                                fill: true,
                            }
                        ]
                    },
                    options: {
                        scales: {
                            y: {
                                scaleLabel: {
                                    display: true,
                                    labelString: 'MB/s',
                                    color: this.props.theme.palette.text.primary,
                                },
                                gridLines: {
                                    drawBorder: false,
                                    color: "rgba(29,140,248,0.1)",
                                    zeroLineColor: "transparent",
                                },
                                ticks: {
                                    color: this.props.theme.palette.text.primary,
                                }
                            },
                            x: {
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
                                    autoSkipPadding: 3,
                                    source: 'labels',
                                    color: this.props.theme.palette.text.primary,
                                }
                            },
                        },
                        elements: {
                            line: {
                                borderWidth: 2,
                                tension: 0.3,
                                borderCapStyle: 'round',
                            },
                            point: {
                                radius: 0,
                                hoverRadius: 5,
                            },
                        },
                        hover: {
                            mode: 'index',
                            intersect: false
                        },
                        maintainAspectRatio: false,
                        plugins: {
                            legend: {
                                display: false,
                            },
                            tooltip: {
                                mode: 'index',
                                position: 'nearest',
                                intersect: false,
                                backgroundColor: this.props.theme.palette.text.primary,
                                titleColor: this.props.theme.palette.primary.chartTitle,
                                bodyColor: this.props.theme.palette.primary.chartText,
                                callbacks: {
                                    label: (item) => { return item.dataPoint.y + ' MB/s' }
                                }
                            },
                        },
                    },
                })
        });
    }

    componentDidUpdate(prevProps, prevContext) {
        let chart = this.state.chart

        if (this.props.theme.palette.type !== prevProps.theme.palette.type) {
            chart.options.plugins.tooltip.backgroundColor = this.props.theme.palette.text.primary;
            chart.options.plugins.tooltip.titleColor = this.props.theme.palette.primary.chartTitle;
            chart.options.plugins.tooltip.bodyColor = this.props.theme.palette.primary.chartText;
            chart.options.scales.y.scaleLabel.color = this.props.theme.palette.text.primary;
            chart.options.scales.y.ticks.color = this.props.theme.palette.text.primary;
            chart.options.scales.x.ticks.color = this.props.theme.palette.text.primary;
            chart.color = this.props.theme.palette.text.primary;
            chart.update()
        }

        if (this.props.data !== prevProps.data && this.props.data.length) {
            chart.options.scales.x.min = this.props.data[0]['time'].toDate()
            chart.options.scales.x.max = this.props.data[this.props.data.length - 1]['time'].toDate()
            chart.data.datasets.map(x => { x.data = this.props.data; return x })
            chart.data.labels = this.props.data.map(x => x['time']);
            chart.update()
        }
    }

    render() {
        return (
            <div style={{ height: 400 }}>
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

    return <ChartComponentClass {...props} theme={theme} />;
}
