import { useEffect, useRef, useState } from "react";
import RotateLeftIcon from '@mui/icons-material/RotateLeft';
import { Button, FormControlLabel, FormGroup, Grid, Switch, Typography, rgbToHex } from "@mui/material";
import moment from "moment";
import LineChart from "../Helpers/Charts/LineChart";

function TimeGraph(props) {
    var labels = props.labels;

    const [error, setError] = useState(null);
    const [data, setData] = useState({
        labels,
        datasets: []
    })

    useEffect(() => {
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

        newData.datasets.forEach(_data => {
            if (_data.data.length !== labels.length) {
                setError(`One of the dataset is missing points`);
                return;
            }
        });

        setData(newData);
    }, [props, labels]);

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