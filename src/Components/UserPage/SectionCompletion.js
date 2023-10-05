/* eslint-disable react-hooks/exhaustive-deps */
import { Button, Chip, Divider, Grid, Paper, Table, TableBody, TableCell, TableContainer, TableRow, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { capitalize } from "../../Helpers/Misc";
import { getCompletionData } from "../../Helpers/OsuAlt";
import Loader from "../UI/Loader";
import BarChart from "../../Helpers/Charts/BarChart";

function SectionCompletion(props) {
    const [graphs, setGraphs] = useState([]);
    const [selectedGraph, setSelectedGraph] = useState('stars');
    const [isWorking, setIsWorking] = useState(false);

    useEffect(() => {
        if (props.user == null) return;

        (async () => {
            if (!props.user.data.completion) {
                setIsWorking(true);
                props.user.data.completion = await getCompletionData(props.user.osu.id);
            }

            const _graphs = {};
            Object.keys(props.user.data.completion).forEach((key, index) => {
                const data = props.user.data.completion[key];
                const labels = data.map((item, index) => item.range);
                const values = data.map((item, index) => (Math.round(item.completion * 100) / 100));

                _graphs[key] = {};
                _graphs[key].labels = labels;
                _graphs[key].data = values;
                _graphs[key].stylizedKey = key.length === 2 ? key.toUpperCase() : capitalize(key);
            });
            setGraphs(_graphs);
            setIsWorking(false);
            // eslint-disable-next-line react-hooks/exhaustive-deps
        })();
    }, [props.user]);

    if (props.user == null) return (<></>);
    if (isWorking) return (<>
        <Loader />
    </>);
    if (!props.user.data.completion) return (<></>);
    return (
        <>
            {
                graphs && graphs[selectedGraph] ? <>
                    <Grid sx={{
                        height: 280
                    }}>
                        <BarChart
                            key={selectedGraph}
                            xAxis={[{ scaleType: 'band', data: graphs[selectedGraph].labels }]}
                            series={[{ data: graphs[selectedGraph].data, valueFormatter: (v) => `${v}%`, label: graphs[selectedGraph].stylizedKey + ' Completion' }]}
                        />
                    </Grid>
                    {
                        Object.keys(graphs).map((key, index) => {
                            const stylizedKey = key.length === 2 ? key.toUpperCase() : capitalize(key);
                            return (
                                <Button variant={selectedGraph === key ? 'contained' : 'outlined'} sx={{ cursor: 'pointer', display: 'inline-block', mr: 1 }} onClick={() => setSelectedGraph(key)}>{stylizedKey}</Button>
                                //<Typography variant='subtitle1' sx={{ cursor: 'pointer', display: 'inline-block', mr: 1 }} onClick={() => setSelectedGraph(key)}>{stylizedKey}</Typography>
                            )
                        })
                    }
                    <Divider sx={{ mt: 1, mb: 1 }} />
                </> : <></>
            }
            <Grid container spacing={0.5}>
                {
                    Object.keys(props.user.data.completion).map((key, index) => {
                        const stylizedKey = key.length === 2 ? key.toUpperCase() : capitalize(key);
                        return (
                            <Grid item xs={3}>
                                <Paper sx={{ p: 0.5 }}>
                                    <Typography variant='title' sx={{ fontSize: '0.85em' }}>{stylizedKey} completion</Typography>
                                    <TableContainer>
                                        <Table size='small'>
                                            <TableBody>
                                                {
                                                    props.user.data.completion[key].map((item, index) => {
                                                        //we want a chip that colors red to green based on completion, use lerp
                                                        const _completion = item.completion / 100;
                                                        const color = `rgb(${Math.round(255 - (_completion * 255))}, ${Math.round(_completion * 255)}, 0)`;
                                                        return (
                                                            <TableRow>
                                                                <TableCell sx={{ fontWeight: 'bold' }}>{item.range}</TableCell>
                                                                <TableCell>
                                                                    <Chip sx={{ backgroundColor: color, color: 'white' }} size='small' label={`${Math.round(item.completion * 10) / 10}%`} />
                                                                </TableCell>
                                                                <TableCell sx={{ p: 0 }} align="right">{item.scores}</TableCell>
                                                                <TableCell sx={{ p: 0 }} align="center">/</TableCell>
                                                                <TableCell sx={{ p: 0 }}>{item.beatmaps}</TableCell>
                                                            </TableRow>
                                                        )
                                                    })
                                                }
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                </Paper>
                            </Grid>
                        )
                    })
                }
            </Grid>
        </>
    )
}

export default SectionCompletion;