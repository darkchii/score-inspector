/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { Button, ButtonGroup, Grid, useTheme } from "@mui/material";
import { getScoreActivity } from "../Helpers/OsuAlt";
import moment from "moment";
import Loader from "./UI/Loader";
import LineChart from "../Helpers/Charts/LineChart";

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

                let _data = {
                    data: count,
                    timestamp: timestamp.toDate(),
                    label: timestamp.format("MMM Do, hA")
                };

                newData.push(_data);
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
            <Grid sx={{ height: 280, position: "relative"}}>
                {
                    isWorking || !data || !Array.isArray(data) || data.length <= 0 ?
                        <Loader /> :
                        <LineChart
                            series={[{ type: 'line', data: data.map((d) => d.data) }]}
                            xAxis={[{ scaleType: 'time', data: data.map((d) => d.timestamp)}]}
                        />
                }
            </Grid>
        </>
    );
}
export default ScoreSubmissions;