import { useEffect, useRef, useState } from "react";
import RotateLeftIcon from '@mui/icons-material/RotateLeft';
import { Button, FormControlLabel, FormGroup, Grid, Switch, Typography, rgbToHex } from "@mui/material";
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
import { LineChart } from "@mui/x-charts";
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

function TimeGraph(props) {
    var labels = props.labels;

    const [error, setError] = useState(null);
    const [data, setData] = useState({
        labels,
        datasets: []
    })

    // const [options, setOptions] = useState({
    //     responsive: true,
    //     plugins: {
    //         legend: {
    //             position: 'top',
    //             // display: false
    //         },
    //         title: {
    //             display: false,
    //             text: 'Chart.js Line Chart',
    //         },
    //         datalabels: {
    //             display: 'auto',
    //             color: 'white',
    //             font: {
    //                 family: "Roboto"
    //             },
    //             margin: {
    //                 top: 15
    //             },
    //             anchor: 'end',
    //             align: 'end',
    //             backgroundColor: '#00000088',
    //             borderRadius: 5,
    //             formatter: props.formatter ?? ((value, context) => {
    //                 return `${value.toLocaleString("en-US")}`;
    //             })
    //         },
    //         zoom: {
    //             zoom: {
    //                 drag: {
    //                     enabled: true,
    //                 },
    //                 pinch: {
    //                     enabled: false
    //                 },
    //                 mode: 'x',
    //             }
    //         },
    //         transitions: {
    //             zoom: {
    //                 animation: {
    //                     duration: 1000,
    //                     easing: 'easeOutCubic'
    //                 }
    //             }
    //         }
    //     },
    //     maintainAspectRatio: false,
    //     animation: true,
    //     spanGaps: true,
    //     layout: {
    //         padding: {
    //             left: 0,
    //             right: 40,
    //             top: 0,
    //             bottom: 0
    //         }
    //     },
    //     scales: {
    //         y:
    //         {
    //             reverse: false,
    //         }
    //     }
    // })

    useEffect(() => {
        // var cloneData = JSON.parse(JSON.stringify(data));
        console.time('[TimeGraph] Updated data');
        setError(null);
        var newData = {
            labels,
            datasets: []
        }
        props.data.forEach(_data => {
            var dataObject = {
                label: _data.name,
                data: _data.set,
                borderColor: `rgb(${_data.color.r}, ${_data.color.g}, ${_data.color.b})`,
                fill: 'start',
                backgroundColor: (context) => {
                    const ctx = context.chart.ctx;
                    const gradient = ctx.createLinearGradient(0, 0, 0, 500);
                    gradient.addColorStop(0, `rgba(${_data.color.r}, ${_data.color.g}, ${_data.color.b}, 0.7)`);
                    gradient.addColorStop(1, `rgba(${_data.color.r}, ${_data.color.g}, ${_data.color.b}, 0)`);
                    return gradient;
                },
                tension: 0.3,
                pointRadius: 4,
                pointHoverRadius: 5,
                borderWidth: 1
            };
            newData.datasets.push(dataObject);
        });

        //check if any dataset.data length does NOT match labels length
        newData.datasets.forEach(_data => {
            if (_data.data.length !== labels.length) {
                setError(`One of the dataset is missing points`);
                return;
            }
        });

        setData(newData);

        console.timeEnd('[TimeGraph] Updated data');
        console.log(`[TimeGraph] Label count: ${props.labels.length}`);
        console.log(`[TimeGraph] Dataset(1) count: ${newData.datasets[0].data.length}`);
    }, [props, labels]);

    var chart = useRef(null);

    const handleDataToggleChange = (event) => {

        var clone = JSON.parse(JSON.stringify(data));
        clone.datasets.forEach(_data => {
            if (_data.label === event.target.name) {
                _data.hidden = !event.target.checked
            }
        });

        setData(clone);
    };

    if(error) {
        return (
            <Grid sx={{ height: 500, position: "relative", pt: 5 }}>
                <Typography variant='h6' color='error'>{error}</Typography>
            </Grid>
        )
    }

    return (
        <>
            <Grid sx={{ height: 500, position: "relative", pt: 5 }}>
                {/* <Grid>
                    <FormGroup row={true} sx={{ position: "absolute", left: 5, top: 5 }}>
                        <Button startIcon={<RotateLeftIcon />} size='small' variant="contained" onClick={resetZoom}>Reset Zoom</Button>&nbsp;
                        {
                            data.datasets.length > 1 ?
                                <>
                                    {
                                        data.datasets.map(_data => (
                                            <>
                                                <FormControlLabel
                                                    control={
                                                        <Switch size='small' checked={!_data.hidden} onChange={handleDataToggleChange} name={_data.label} />
                                                    }
                                                    label={_data.label}
                                                />
                                            </>
                                        ))
                                    }
                                </>
                                :
                                <></>
                        }
                    </FormGroup>
                </Grid> */}
                <LineChart
                    margin={{
                        top: 20,
                    }}
                    series={[
                        ...data.datasets.map((_data, index) => {
                            return {
                                type: 'line',
                                data: _data.data,
                                label: _data.label,
                                // color: `rgb(${_data.borderColor.r}, ${_data.borderColor.g}, ${_data.borderColor.b})`,
                                color: _data.borderColor,
                                valueFormatter: props.formatter ?? ((value, context) => {
                                    return `${value.toLocaleString("en-US")}`;
                                })
                            }
                        }
                        )
                    ]}
                    xAxis={
                        [
                            {
                                data: props.labels,
                                scaleType: 'time',
                                tickNumber: 10,
                                valueFormatter: (value) => {
                                    return moment(value).format("MMMM YYYY");
                                }
                            }
                        ]
                    }
                />
            </Grid>
        </>
    );
}
export default TimeGraph;