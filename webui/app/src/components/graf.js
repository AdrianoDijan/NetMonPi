import React, { Component } from 'react'
import Chart from "chart.js";
import classes from "./LineGraph.module.css";

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

        let myelements = []
        let mylabels = []

        fetch("http://localhost:3080/api/v1/usage")
            .then(response => response.json())
            .then(podaci => {
                for (let i = 0; i < podaci.length; i++) {
                    myelements.push(podaci[i]['mean_txInOctets'])
                    mylabels.push(podaci[i]['time'])
                }
            }).then(x => {
                chart.data.datasets[0].data = myelements;
                chart.data.labels = mylabels;
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

        let gradientLine1 = myChartRef
            .createLinearGradient(0, 0, 0, graphHeight);
        gradientLine1.addColorStop(0, "red");
        gradientLine1.addColorStop(0.5, "rgb(255, 0, 110, 0.35)");
        gradientLine1.addColorStop(1, "rgb(255, 0, 110, 0.7)");

        let chr = new Chart(myChartRef, {
            type: "line",
            data: {
                //Bring in data
                labels: ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11"],
                datasets: [
                    {
                        label: "Tx",
                        data: [0,0,0,0,0,0,0,0,0,0,0,0],
                        borderColor: "rgb(255,0,0)",
                    },
                    // {
                    //     label: "Rx",
                    //     data: [76, 87, 54, 93, 63, 58, 47, 75, 56, 87, 96, 45],
                    //     borderColor: "rgb(0, 0, 255)"
                    // }
                ]
            },
            options: {
                maintainAspectRatio: false,
                legend: {
                    display: true,
                    position: "right"
                }
            }
        });
        this.setData(chr);

    }
    render() {
        return (
            <div className={classes.graphContainer}>
                <canvas
                    id="myChart"
                    ref={this.chartRef}
                />
            </div>
        )
    }
}

export default Graf;