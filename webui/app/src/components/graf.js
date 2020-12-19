import React, { Component } from 'react'
import Chart from "chart.js";
import moment from "moment"
import classes from "./LineGraph.module.css";
import Card from '@material-ui/core/Card'

Chart.defaults.global.defaultFontFamily = "'PT Sans', sans-serif"
Chart.defaults.global.legend.display = false;

class Graf extends Component {

    constructor() {
        super()
        this.state = {
            fetchRunning: true,
            data: [],
        }
    }

    chartRef = React.createRef();

    setData(chart) {

        let txOctets = []
        let rxOctets = []
        let mylabels = []

        fetch("http://localhost:3080/api/v1/bandwidth/lastday")
            .then(response => response.json())
            .then(podaci => {
                for (let i = 0; i < podaci.length; i++) {
                    txOctets.push(podaci[i]['txInOctets'])
                    rxOctets.push(podaci[i]['txOutOctets'])
                    mylabels.push(podaci[i]['time'])
                }
            }).then(x => {
                chart.data.datasets[0].data = txOctets.map(x => {return (x/1000000).toFixed(2)});
                chart.data.datasets[1].data = rxOctets.map(x => {return -1*(x/1000000).toFixed(2)})
                chart.data.labels = mylabels.map(x => {return moment(x)});
                chart.update()
            })
    }

    componentDidMount() {

        const myChartRef = this.chartRef.current.getContext("2d");

        const { width: graphWidth } = myChartRef.canvas;

        let gradientLine = myChartRef
            .createLinearGradient(0, 0, graphWidth * 2, 0);
        gradientLine.addColorStop(0, "#FF006E");
        gradientLine.addColorStop(1, "#F46036");

        const { height: graphHeight } = myChartRef.canvas;

        let gradientLine1 = myChartRef.createLinearGradient(0, 0, 0, graphHeight);
        gradientLine1.addColorStop(0, "red");
        gradientLine1.addColorStop(0.5, "rgb(255, 0, 110, 0.35)");
        gradientLine1.addColorStop(1, "rgb(255, 0, 110, 0.7)");

        let chr = new Chart(myChartRef, {
            type: "line",
            data: {
                //Bring in data
                labels: [],
                datasets: [
                    {
                        label: "Tx",
                        data: [],
                        borderColor: "rgb(204,0,0)",
                        backgroundColor: "rgba(240, 10, 10, 0.2)",
                    },
                    {
                        label: "Rx",
                        data: [],
                        borderColor: "rgb(0, 0, 255)",
                        backgroundColor: "rgba(10, 10, 240, 0.2)",
                    }
                ]
            },
            options: {
                title: {
                    display: true,
                    text: 'WAN Bandwith',
                    fontColor: 'rgb(204, 0, 0)'
                },
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
                        label: (item) => {return item.yLabel + ' MB/s'}
                    }
                },
                maintainAspectRatio: false,
                legend: {
                    display: false,
                    position: "right"
                }
            }
        });
        this.setData(chr);

    }
    render() {
        return (
            <Card>
            <div className={classes.graphContainer}>
                <canvas
                    id="myChart"
                    ref={this.chartRef}
                />
            </div>
            </Card>
        )
    }
}

export default Graf;
