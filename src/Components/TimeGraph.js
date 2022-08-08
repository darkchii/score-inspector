import { useRef } from "react";
import { Avatar, Box, Button, Card, CardContent, Grid, Typography } from "@mui/material";
import { Line } from "react-chartjs-2";
import ChartDataLabels from 'chartjs-plugin-datalabels';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    ChartDataLabels
);

function TimeGraph(props) {
    var scoreData = props.data;
    var name = props.name;
    var labels = props.labels;
    var _data = props.data;

    //const labels = scoreData.map(x => x.date);

    const data = {
        labels,
        datasets: [
            {
                label: name,
                data: _data, //scoreData.map(x => x.count_scores),
                fill: 'start',
                borderColor: 'rgb(255, 102, 158)',
                backgroundColor: 'rgba(255, 102, 158, 0.5)',
                tension: 0.1
            },
            // {
            //     label: "Week average",
            //     data: scoreData.map(x => x.average),
            //     borderColor: 'rgb(255, 99, 132)',
            //     backgroundColor: 'rgba(255, 99, 132, 0.5)',
            //     tension: 0.1
            // }
        ]
    }

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: false,
                text: 'Chart.js Line Chart',
            },
            datalabels: {
                display: 'auto',
                color: 'white',
                font: {
                    family: "Roboto"
                },
                margin: {
                    top: 15
                },
                anchor: 'end',
                align: 'end',
                backgroundColor: '#00000088',
                formatter: function (value, context) {
                    return `${value.toLocaleString("en-US")}`;
                }
            }
        },
        maintainAspectRatio: false,
        animation: false
    };

    var chart = useRef(null);

    return (
        <>
            <Grid sx={{ height: 600 }}>
                <Line ref={chart} options={options} data={data} />
            </Grid>
        </>
    );
}
export default TimeGraph;