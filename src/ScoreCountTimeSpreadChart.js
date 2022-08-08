import { Avatar, Box, Button, Card, CardContent, Grid, Typography } from "@mui/material";
import { Line } from "react-chartjs-2";
import zoomPlugin from 'chartjs-plugin-zoom';
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
import { useRef } from "react";
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    zoomPlugin
);

function ScoreCountTimeSpreadChart(props) {
    var scoreData = props.data;

    const labels = scoreData.map(x => x.date);

    const data = {
        labels,
        datasets: [
            {
                label: "Scores per day",
                data: scoreData.map(x => x.count_scores),
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
            }
        },
        maintainAspectRatio: false,
        animation: false
    };

    var chart = useRef(null);

    return (
        <>
            <Grid sx={{ height: 300 }}>
                <Line ref={chart} options={options} data={data} />
            </Grid>
            {chart != null ? <>
                {/* <Button onClick={chart.zoom(1.0)}>Reset zoom</Button> */}
            </> : <></>}
        </>
    );
}
export default ScoreCountTimeSpreadChart;