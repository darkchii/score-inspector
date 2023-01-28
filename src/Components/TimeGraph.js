import { useEffect, useRef, useState } from "react";
import RotateLeftIcon from '@mui/icons-material/RotateLeft';
import { Button, FormControlLabel, FormGroup, Grid, Switch } from "@mui/material";
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

    const [data, setData] = useState({
        labels,
        datasets: []
    })

    const [options, setOptions] = useState({
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
                // display: false
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
            },
            zoom: {
                zoom: {
                    drag: {
                        enabled: true,
                    },
                    pinch: {
                        enabled: false
                    },
                    mode: 'x',
                }
            },
            transitions: {
                zoom: {
                    animation: {
                        duration: 1000,
                        easing: 'easeOutCubic'
                    }
                }
            }
        },
        maintainAspectRatio: false,
        animation: true,
        spanGaps: true,
        layout: {
            padding: {
                left: 0,
                right: 40,
                top: 0,
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
        // var cloneData = JSON.parse(JSON.stringify(data));
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
        // eslint-disable-next-line react-hooks/exhaustive-deps
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

        // setState({
        //   ...state,
        //   [event.target.name]: event.target.checked,
        // });
    };

    const resetZoom = function () {
        if (chart !== undefined && chart.current !== undefined) {
            chart.current.resetZoom();
        }
    }

    return (
        <>
            <Grid sx={{ height: 500, position: "relative", pt: 5 }}>
                <Grid>
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
                </Grid>
                <Line ref={chart} options={options} data={data} />
            </Grid>
        </>
    );
}
export default TimeGraph;