/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { Alert, Box, Grid2, Tab, Tabs, useTheme } from "@mui/material";
import { getScoreActivity } from "../Helpers/OsuAlt";
import moment from "moment";
import Loader from "./UI/Loader";
import ChartWrapper from "../Helpers/ChartWrapper";
import { amber, blue, green, grey, purple, red } from "@mui/material/colors";
import Error from "./UI/Error";

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

const chart_types = [
    'grades', 'score', 'clears'
]

function ScoreSubmissions(props) {
    const theme = useTheme();

    //period are INDICES,
    //period is the index of chart_period_data
    const [period, setPeriod] = useState(0); //h for hours, d for days
    //interval is the index of the intervals array in the selected chart_period_data index
    const [interval, setInterval] = useState(0);
    const [random, setRandom] = useState(0);

    const [activePeriodObject, setActivePeriodObject] = useState(chart_period_data[Object.keys(chart_period_data)[period]]);

    const [display, setDisplay] = useState(0); //count, count_ss, count_s, count_a, count_b, count_c, count_d
    const [isWorking, setIsWorking] = useState(false);

    const [data, setData] = useState(null);
    const [error, setError] = useState(false);

    useEffect(() => {
        setInterval(0);
        //reset the random number to trigger useEffect
        setRandom(Math.random());
    }, [period]);

    useEffect(() => {
        //get the raw data from api
        (async () => {
            try {
                setIsWorking(true);

                //get the key based on period index
                const _period = Object.keys(chart_period_data)[period];
                const _interval = chart_period_data[_period].intervals[interval];
                setActivePeriodObject(chart_period_data[_period]);
                let data = await getScoreActivity(_interval, _period);
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
    }, [interval, random]);

    return (
        <>
            <Grid2>
                <Box sx={{
                    borderBottom: 1,
                    borderColor: 'divider',
                    display: 'flex',
                }}>
                    <Tabs value={interval} onChange={(e, v) => setInterval(v)} variant='scrollable' sx={{
                        borderRight: 1,
                        borderColor: 'divider',
                    }}>
                        {
                            activePeriodObject.intervals.map((int, i) => {
                                return <Tab disabled={isWorking} label={int === -1 ? 'All' : `${int} ${{
                                    'h': 'Hours',
                                    'd': 'Days',
                                    'm': 'Months',
                                    'y': 'Years'
                                }[Object.keys(chart_period_data)[period]]}`} key={i} />
                            })
                        }
                    </Tabs>
                    <Tabs value={period} onChange={(e, v) => setPeriod(v)} variant='scrollable' sx={{
                        borderRight: 1,
                        borderColor: 'divider',
                    }}>
                        <Tab disabled={isWorking} label='Hours' key={0} />
                        <Tab disabled={isWorking} label='Days' key={1} />
                        <Tab disabled={isWorking} label='Months' key={2} />
                        <Tab disabled={isWorking} label='Years' key={3} />
                    </Tabs>
                    <Tabs disabled={isWorking} value={display} onChange={(e, v) => setDisplay(v)} variant='scrollable'>
                        {
                            chart_types.map((type, i) => {
                                return <Tab label={type} key={i} />
                            })
                        }
                    </Tabs>
                </Box>
            </Grid2>
            <Grid2 sx={{ height: 280, position: "relative" }}>
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
                                            format: activePeriodObject.format,
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
                                            format: activePeriodObject.format,
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
                                    ...(chart_types[display] === 'grades' ? [
                                        { name: 'D', data: data.count_d, color: red[500] },
                                        { name: 'C', data: data.count_c, color: purple[300] },
                                        { name: 'B', data: data.count_b, color: blue[500] },
                                        { name: 'A', data: data.count_a, color: green[500] },
                                        { name: 'S', data: data.count_s, color: amber[500] },
                                        { name: 'SS', data: data.count_ss, color: grey[100] },
                                    ] : []),
                                    ...(chart_types[display] === 'score' ? [
                                        { name: 'Score', data: data.entry_count_score, color: theme.palette.primary.main },
                                    ] : []),
                                    ...(chart_types[display] === 'clears' ? [
                                        { name: 'Clears', data: data.count, color: theme.palette.primary.main },
                                    ] : []),
                                ]}
                                type={'area'}
                            />
                        </>
                }
            </Grid2>
            <Alert severity='info' sx={{ mt: 1 }}>
                Only shows data osu!alternative has gathered, but trend should be accurate. <br />
                Longer periods may take a while to load.
            </Alert>
        </>
    );
}
export default ScoreSubmissions;