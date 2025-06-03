import { Box, Divider, Grid2, Paper, Stack, Typography } from "@mui/material";
import { GetFormattedName } from "../Helpers/Account";
import { Link as RouterLink } from 'react-router';
import Loader from "./UI/Loader";
import Error from "./UI/Error";
import { useEffect, useState } from "react";
import ChartWrapper from "../Helpers/ChartWrapper";

function TodayActivePlayers(props) {
    //for each hour in the past 24 hours, get the number of active players
    const [graphData, setGraphData] = useState(null);

    useEffect(() => {
        if (props.data && !props.data.error) {
            let graphData = [];
            for (let i = 0; i < 24; i++) {
                let hour;
                let count = 0;
                if (props.data[i] && props.data[i].hour) {
                    hour = props.data[i].hour; //in unix timestamp
                    count = props.data[i].count;
                }else{
                    hour = new Date();
                    hour.setHours(hour.getHours() - (24 - i)); //set to the past hour
                    hour.setMinutes(0, 0, 0); //set minutes, seconds and milliseconds to 0
                }
                let time = new Date(hour);
                graphData.push([time, count]);
            }
            setGraphData(graphData);
        }
    }, [props.data]);

    if (!props.data || !graphData) return <>
        <Loader />
    </>;

    if (props.data.error) return <>
        <Error />
    </>

    return <>
        <Paper sx={{
            height: '100%'
        }}>
            <ChartWrapper
                options={{
                    chart: {
                        id: "score-submissionsa",
                        // stacked: true
                        sparkline: {
                            enabled: false,
                        },
                        type: "line",
                        width: '100%',
                    },
                    xaxis: {
                        type: 'datetime',
                        show: false,
                        labels: {
                            show: false,
                            datetimeUTC: false,
                            format: 'HH:mm',
                        },
                        axisBorder: {
                            show: false
                        },
                        axisTicks: {
                            show: false
                        }
                    },
                    yaxis: {
                        labels: {
                            formatter: (value) => {
                                return value.toLocaleString();
                            },
                            offsetX: -15
                        },
                        show: false,
                        axisBorder: {
                            show: false
                        },
                        axisTicks: {
                            show: false
                        }
                    },
                    tooltip: {
                        x: {
                            format: 'HH:mm'
                        },
                    },
                    stroke: {
                        width: [1]
                    },
                    fill: {
                        type: 'gradient',
                        gradient: {
                            opacityFrom: 0.5,
                            opacityTo: 0,
                        }
                    },
                    dataLabels: {
                        enabled: false
                    },
                    legend: {
                        show: false
                    },
                    grid: {
                        show: false,
                        padding: {
                            left: -5,
                            right: -5,
                        }
                    },
                }}

                series={[
                    {
                        name: "Active Players",
                        data: graphData
                    }
                ]}

                type="area"
                height="100%"

                style={{ margin: 0 }}
            />
        </Paper>
    </>
}

export default TodayActivePlayers;