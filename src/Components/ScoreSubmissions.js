/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { Button, ButtonGroup, Grid, useTheme } from "@mui/material";
import { getScoreActivity } from "../Helpers/OsuAlt";
import moment from "moment";
import Loader from "./UI/Loader";
import Chart from "react-apexcharts";

function ScoreSubmissions(props) {
    const theme = useTheme();
    const [hours, setHours] = useState(72);
    const [isWorking, setIsWorking] = useState(false);

    const [data, setData] = useState({
        labels: [],
        datasets: []
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

            var newData = [];

            for (let i = 0; i < data.hour_entries.length; i++) {
                let timestamp = moment.utc(data.hour_entries[i].timestamp).local();
                let count = data.hour_entries[i].entry_count;
                newData.push([timestamp.toDate().getTime(), count]);
            }

            setData(newData);
            setIsWorking(false);
            // eslint-disable-next-line react-hooks/exhaustive-deps
        })();
    }, [hours]);

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
            <Grid sx={{ height: 280, position: "relative" }}>
                {
                    isWorking || !data || !Array.isArray(data) || data.length <= 0 ?
                        <Loader /> : <>
                            <Chart
                                options={{
                                    chart: {
                                        id: "score-submissions",
                                    },
                                    grid: {
                                        show: false
                                    },
                                    yaxis: {
                                        labels: {
                                            style: {
                                                colors: theme.palette.text.secondary,
                                            },
                                        },
                                    },
                                    xaxis: {
                                        type: 'datetime',
                                        labels: {
                                            datetimeUTC: false,
                                            format: 'MMM dd, HH:mm',
                                            style: {
                                                colors: theme.palette.text.secondary,
                                            },
                                        },
                                    },
                                    tooltip: {
                                        theme: 'dark',
                                        x: {
                                            format: 'MMM dd, HH:mm'
                                        },
                                    },
                                    markers: {
                                        size: 4,
                                    },
                                }}
                                series={[{ name: 'Score Submissions', data: data, color: theme.palette.primary.main}]}
                                type={'line'}
                                width={'100%'}
                                height={'100%'}
                            />
                        </>
                }
            </Grid>
        </>
    );
}
export default ScoreSubmissions;