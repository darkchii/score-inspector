/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { Alert, Button, ButtonGroup, Grid, useTheme } from "@mui/material";
import { getScoreActivity } from "../Helpers/OsuAlt";
import moment from "moment";
import Loader from "./UI/Loader";
import ChartWrapper from "../Helpers/ChartWrapper.js";
import { amber, blue, green, grey, purple, red } from "@mui/material/colors";
import Error from "./UI/Error.js";

const chart_period_data = {
    'h': {
        format: 'MMM dd, HH:mm',
        intervals: [
            24, 48, 72, 168, 336, 720
        ]
    },
    'd': {
        format: 'MMM dd',
        intervals: [
            7, 14, 30, 60, 90, 180
        ]
    },
    'm': {
        format: 'MMM yyyy',
        intervals: [
            6, 12, 24, 36, 48, 60, -1
        ]
    },
    'y': {
        format: 'yyyy',
        intervals: [
            5, 10, -1
        ]
    }
}

function ScoreSubmissions(props) {
    const theme = useTheme();
    const [interval, setInterval] = useState(72);
    const [period, setPeriod] = useState('h'); //h for hours, d for days
    const [display, setDisplay] = useState('grades'); //count, count_ss, count_s, count_a, count_b, count_c, count_d
    const [isWorking, setIsWorking] = useState(false);

    const [data, setData] = useState(null);
    const [error, setError] = useState(false);

    useEffect(() => {
        setInterval(chart_period_data[period].intervals[0]);
    }, [period]);

    useEffect(() => {
        //get the raw data from api
        (async () => {
            try {
                setIsWorking(true);
                let data = await getScoreActivity(interval, period);
                console.log(data);
                if (data === null) {
                    setIsWorking(false);
                    setError(true);
                    return;
                }

                var newData = {};

                for (let i = 0; i < data.time_entries.length; i++) {
                    let timestamp = moment.utc(data.time_entries[i].timestamp).local();
                    let count = data.time_entries[i].entry_count;
                    let count_ss = data.time_entries[i].entry_count_SS;
                    let count_s = data.time_entries[i].entry_count_S;
                    let count_a = data.time_entries[i].entry_count_A;
                    let count_b = data.time_entries[i].entry_count_B;
                    let count_c = data.time_entries[i].entry_count_C;
                    let count_d = data.time_entries[i].entry_count_D;
                    let sum_score = data.time_entries[i].entry_count_score;
                    const _time = timestamp.toDate().getTime();
                    // newData.push([timestamp.toDate().getTime(), count]);
                    if (newData.count === undefined) { newData.count = []; }
                    if (newData.count_ss === undefined) { newData.count_ss = []; }
                    if (newData.count_s === undefined) { newData.count_s = []; }
                    if (newData.count_a === undefined) { newData.count_a = []; }
                    if (newData.count_b === undefined) { newData.count_b = []; }
                    if (newData.count_c === undefined) { newData.count_c = []; }
                    if (newData.count_d === undefined) { newData.count_d = []; }
                    if (newData.entry_count_score === undefined) { newData.entry_count_score = []; }
                    newData.count.push([_time, count]);
                    newData.count_ss.push([_time, count_ss]);
                    newData.count_s.push([_time, count_s]);
                    newData.count_a.push([_time, count_a]);
                    newData.count_b.push([_time, count_b]);
                    newData.count_c.push([_time, count_c]);
                    newData.count_d.push([_time, count_d]);
                    newData.entry_count_score.push([_time, sum_score]);
                }

                setData(newData);
                setIsWorking(false);
            } catch (err) {
                setError(true);
                setIsWorking(false);
            }
        })();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [interval]);

    return (
        <>
            <Grid>
                <ButtonGroup variant='outlined' size='small' color="primary">
                    {
                        chart_period_data[period].intervals.map((int, i) => {
                            return <Button
                                variant={interval === int ? 'contained' : 'outlined'}
                                onClick={() => setInterval(int)} key={i}>
                                {
                                    int === -1 ? 'All' : `
                                    ${int}
                                    ${{
                                            'h': 'Hours',
                                            'd': 'Days',
                                            'm': 'Months',
                                            'y': 'Years'
                                        }[period]}
                                    `
                                }
                            </Button>
                        })
                    }
                </ButtonGroup>
                <ButtonGroup variant='outlined' size='small' color="primary">
                    <Button variant={period === 'h' ? 'contained' : 'outlined'} onClick={() => setPeriod('h')}>Hours</Button>
                    <Button variant={period === 'd' ? 'contained' : 'outlined'} onClick={() => setPeriod('d')}>Days</Button>
                    <Button variant={period === 'm' ? 'contained' : 'outlined'} onClick={() => setPeriod('m')}>Months</Button>
                    <Button variant={period === 'y' ? 'contained' : 'outlined'} onClick={() => setPeriod('y')}>Years</Button>
                </ButtonGroup>
                <ButtonGroup variant='outlined' size='small' color="primary">
                    <Button variant={display === 'score' ? 'contained' : 'outlined'} onClick={() => setDisplay('score')}>Score</Button>
                    <Button variant={display === 'grades' ? 'contained' : 'outlined'} onClick={() => setDisplay('grades')}>Grades</Button>
                    <Button variant={display === 'clears' ? 'contained' : 'outlined'} onClick={() => setDisplay('clears')}>Clears</Button>
                </ButtonGroup>
            </Grid>
            <Grid sx={{ height: 280, position: "relative" }}>
                {
                    isWorking || !data ?
                        (error ? <Error /> : <Loader />) : <>
                            <ChartWrapper
                                options={{
                                    chart: {
                                        id: "score-submissions",
                                        // stacked: true
                                    },
                                    xaxis: {
                                        type: 'datetime',
                                        labels: {
                                            datetimeUTC: false,
                                            format: chart_period_data[period].format,
                                        },
                                    },
                                    yaxis: {
                                        labels: {
                                            formatter: (value) => {
                                                return value.toLocaleString();
                                            }
                                        }
                                    },
                                    tooltip: {
                                        x: {
                                            format: chart_period_data[period].format,
                                        },
                                    },
                                    stroke: {
                                        width: [6, 3, 3, 3, 3, 3, 3]
                                    },
                                    fill: {
                                        type: 'gradient',
                                        gradient: {
                                            opacityFrom: 0.3,
                                            opacityTo: 0.5,
                                        }
                                    },
                                    dataLabels: {
                                        enabled: false
                                    }
                                }}
                                series={[
                                    // { name: 'Score Submissions', data: data.count, color: theme.palette.primary.main },
                                    // { name: 'D', data: data.count_d, color: red[500] },
                                    // { name: 'C', data: data.count_c, color: purple[300] },
                                    // { name: 'B', data: data.count_b, color: blue[500] },
                                    // { name: 'A', data: data.count_a, color: green[500] },
                                    // { name: 'S', data: data.count_s, color: amber[500] },
                                    // { name: 'SS', data: data.count_ss, color: grey[100] },
                                    ...(display === 'grades' ? [
                                        { name: 'D', data: data.count_d, color: red[500] },
                                        { name: 'C', data: data.count_c, color: purple[300] },
                                        { name: 'B', data: data.count_b, color: blue[500] },
                                        { name: 'A', data: data.count_a, color: green[500] },
                                        { name: 'S', data: data.count_s, color: amber[500] },
                                        { name: 'SS', data: data.count_ss, color: grey[100] },
                                    ] : []),
                                    ...(display === 'score' ? [
                                        { name: 'Score', data: data.entry_count_score, color: theme.palette.primary.main },
                                    ] : []),
                                    ...(display === 'clears' ? [
                                        { name: 'Clears', data: data.count, color: theme.palette.primary.main },
                                    ] : []),
                                ]}
                                type={'area'}
                            />
                        </>
                }
            </Grid>
            <Alert severity='info' sx={{ mt: 1 }}>
                Only shows data osu!alternative has gathered, but trend should be accurate. <br />
                Longer periods may take a while to load.
            </Alert>
        </>
    );
}
export default ScoreSubmissions;