import { useEffect, useRef, useState } from "react";
import RotateLeftIcon from '@mui/icons-material/RotateLeft';
import { Button, ButtonGroup, CircularProgress, FormControlLabel, FormGroup, Grid, Switch } from "@mui/material";
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
    Filler
} from 'chart.js';
import Zoom from "chartjs-plugin-zoom";
import { getScoreActivity } from "../Helpers/OsuAlt";
import moment from "moment";
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    ChartDataLabels,
    Filler,
    Zoom
);

function ScoreSubmissions(props) {
    const [hours, setHours] = useState(72);
    const [isWorking, setIsWorking] = useState(false);

    const [data, setData] = useState({
        labels: [],
        datasets: []
    })

    const [options, setOptions] = useState({
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
                display: false
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
                borderRadius: 5,
                formatter: props.formatter ?? ((value, context) => {
                    return `${value.toLocaleString("en-US")}`;
                })
            }
        },
        maintainAspectRatio: false,
        animation: true,
        spanGaps: true,
        layout: {
            padding: {
                left: 0,
                right: 40,
                top: 40,
                bottom: 0
            }
        },
        scales: {
            y:
            {
                reverse: false,
            }
        }
    })

    useEffect(() => {
        //get the raw data from api
        (async () => {
            setIsWorking(true);
            let data = await getScoreActivity(hours);
            if (data === null) {
                setIsWorking(false);
                return;
            }

            var newData = {
                labels: [],
                datasets: []
            }

            setData(newData);

            var countData = [];

            for (let i = 0; i < data.hour_entries.length; i++) {
                // let timestamp = `${moment.duration(moment.utc().startOf('hour').diff(moment(data.hour_entries[i].timestamp).startOf('hour'))).asHours()} hours ago`;
                //use shortest datetime format
                let timestamp = moment.utc(data.hour_entries[i].timestamp).local().format("MMM Do, hA");
                let count = data.hour_entries[i].entry_count;

                newData.labels.push(timestamp);
                countData.push(count);
            }

            console.log(newData);

            const color = {
                r: 255, g: 102, b: 158
            }
            var dataObject = {
                label: "Score submissions per hour",
                data: countData,
                borderColor: `rgb(${color.r}, ${color.g}, ${color.b})`,
                fill: 'start',
                backgroundColor: (context) => {
                    const ctx = context.chart.ctx;
                    const gradient = ctx.createLinearGradient(0, 0, 0, 500);
                    gradient.addColorStop(0, `rgba(${color.r}, ${color.g}, ${color.b}, 0.7)`);
                    gradient.addColorStop(1, `rgba(${color.r}, ${color.g}, ${color.b}, 0)`);
                    return gradient;
                },
                tension: 0.3,
                pointRadius: 4,
                pointHoverRadius: 5,
                borderWidth: 1
            };
            newData.datasets.push(dataObject);

            setData(newData);

            const _options = JSON.parse(JSON.stringify(options));
            if (props.formatter !== undefined) {
                _options.plugins.datalabels.formatter = props.formatter;
            } else {
                _options.plugins.datalabels.formatter = (value, context) => {
                    return `${value.toLocaleString("en-US")}`;
                };
            }
            _options.scales.y.reverse = props.reverse;
            setOptions(_options);

            setIsWorking(false);
            // eslint-disable-next-line react-hooks/exhaustive-deps
        })();
    }, [hours]);

    var chart = useRef(null);

    return (
        <>
            <Grid>
                <ButtonGroup variant='outlined' size='small' color="primary" aria-label="contained primary button group">
                    <Button variant={hours === 24 ? 'contained' : 'outlined'} onClick={() => setHours(24)}>24 hours</Button>
                    <Button variant={hours === 48 ? 'contained' : 'outlined'} onClick={() => setHours(48)}>48 hours</Button>
                    <Button variant={hours === 72 ? 'contained' : 'outlined'} onClick={() => setHours(72)}>72 hours</Button>
                    <Button variant={hours === 168 ? 'contained' : 'outlined'} onClick={() => setHours(168)}>1 week</Button>
                    <Button variant={hours === 336 ? 'contained' : 'outlined'} onClick={() => setHours(336)}>2 weeks</Button>
                    <Button variant={hours === 720 ? 'contained' : 'outlined'} onClick={() => setHours(720)}>1 month</Button>
                </ButtonGroup>
            </Grid>
            <Grid sx={{ height: 280, position: "relative", pt: 2 }}>
                {
                    isWorking ?
                        <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", backgroundColor: "rgba(0,0,0,0.5)", display: "flex", justifyContent: "center", alignItems: "center" }}>
                            <CircularProgress />
                        </div>
                        : <Line ref={chart} options={options} data={data} />
                }
            </Grid>
        </>
    );
}
export default ScoreSubmissions;