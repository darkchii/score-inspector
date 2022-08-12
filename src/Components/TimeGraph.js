import { useEffect, useRef, useState } from "react";
import { Avatar, Box, Button, Card, CardContent, FormControlLabel, FormGroup, Grid, Switch, Typography } from "@mui/material";
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
    Filler,
    ScriptableContext
} from 'chart.js';
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    ChartDataLabels,
    Filler
);

function TimeGraph(props) {
    var scoreData = props.data;
    var name = props.name;
    var labels = props.labels;
    var _data = props.data;

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
                formatter: (value, context) => {
                    return `${value.toLocaleString("en-US")}`;
                }
            }
        },
        maintainAspectRatio: false,
        animation: false,
        spanGaps: true
    })

    useEffect(() => {
        // var cloneData = JSON.parse(JSON.stringify(data));
        var newData = {
            labels,
            datasets: []
        }
        var index = 0;
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
            };
            newData.datasets.push(dataObject);
            index++;
        });

        setData(newData);

        if(props.formatter!==undefined){
            options.plugins.datalabels.formatter = props.formatter;
            setOptions(options);
        }
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

    return (
        <>
            <Grid sx={{ height: 600, position: "relative" }}>
                <FormGroup sx={{ position: "absolute", left: "5rem" }}>

                    {
                        data.datasets.length > 1 ?
                            data.datasets.map(_data => (
                                <FormControlLabel
                                    control={
                                        <Switch checked={!_data.hidden} onChange={handleDataToggleChange} name={_data.label} />
                                    }
                                    label={_data.label}
                                />
                            )) : <></>
                    }
                </FormGroup>
                <Line ref={chart} options={options} data={data} />
            </Grid>
        </>
    );
}
export default TimeGraph;