/* eslint-disable react-hooks/exhaustive-deps */
import { Button, Chip, Container, Divider, Grid2, Paper, Table, TableBody, TableCell, TableContainer, TableRow, Typography, useTheme } from "@mui/material";
import { useEffect, useState } from "react";
import { capitalize } from "../../Helpers/Misc";
import { getCompletionData } from "../../Helpers/OsuAlt";
import Loader from "../UI/Loader";
import ChartWrapper from "../../Helpers/ChartWrapper.js";
import CompletionModeNotice from "../UI/CompletionModeNotice.js";

const KEY_NAMES = {
    'stars': 'Stars',
    'length': 'Length',
    'max_combo': 'Combo',
}

function SectionCompletion(props) {
    const theme = useTheme();
    const [graphs, setGraphs] = useState([]);
    const [selectedGraph, setSelectedGraph] = useState('stars');
    const [isWorking, setIsWorking] = useState(false);

    useEffect(() => {
        if (props.user == null) return;

        if(props.user.inspector_user.is_completion_mode){
            return;
        }

        (async () => {
            if (!props.user.data.completion) {
                setIsWorking(true);
                props.user.data.completion = await getCompletionData(props.user.osu.id, true);
            }

            const _graphs = {};
            Object.keys(props.user.data.completion).forEach((key, index) => {
                const _key = KEY_NAMES[key] ? KEY_NAMES[key] : key;
                const data = props.user.data.completion[key];
                const labels = data.map((item, index) => item.range);
                const values = data.map((item, index) => (Math.round(item.completion * 100) / 100));

                _graphs[key] = {};
                _graphs[key].labels = labels;
                _graphs[key].data = values;
                _graphs[key].stylizedKey = _key.length === 2 ? _key.toUpperCase() : capitalize(_key);
            });
            setGraphs(_graphs);
            setIsWorking(false);
            // eslint-disable-next-line react-hooks/exhaustive-deps
        })();
    }, [props.user]);

    if(props.user.inspector_user.is_completion_mode){
        return (
            <Container>
                <CompletionModeNotice />
            </Container>
        )
    }

    if (props.user == null) return (<></>);
    if (isWorking) return (<>
        <Loader />
    </>);
    if (!props.user.data.completion) return (<></>);
    return (<>
        {
            graphs && graphs[selectedGraph] ? <>
                <Grid2 sx={{
                    height: 280
                }}>
                    <ChartWrapper
                        options={{
                            chart: {
                                id: "completion-chart"
                            },
                            yaxis: {
                                min: 0,
                                max: 100,
                                labels: {
                                    formatter: (value) => {
                                        if (!value) return value;
                                        return `${value.toLocaleString('en-US')}%`;
                                    }
                                },
                            },
                            xaxis: {
                                categories: graphs[selectedGraph].labels,
                                tickAmount: 'dataPoints'
                            }
                        }}
                        series={[
                            {
                                name: 'Completion',
                                data: graphs[selectedGraph].data,
                                color: theme.palette.primary.main,
                            }
                        ]}
                        type={'bar'}
                    />
                </Grid2>
                {
                    Object.keys(graphs).map((key, index) => {
                        let _key = KEY_NAMES[key] ? KEY_NAMES[key] : key;
                        const stylizedKey = _key.length === 2 ? _key.toUpperCase() : capitalize(_key);
                        return (
                            //<Typography variant='subtitle1' sx={{ cursor: 'pointer', display: 'inline-block', mr: 1 }} onClick={() => setSelectedGraph(key)}>{stylizedKey}</Typography>
                            (<Button variant={selectedGraph === key ? 'contained' : 'outlined'} sx={{ cursor: 'pointer', display: 'inline-block', mr: 1 }} onClick={() => setSelectedGraph(key)}>{stylizedKey}</Button>)
                        );
                    })
                }
                <Divider sx={{ mt: 1, mb: 1 }} />
            </> : <></>
        }
        <Grid2 container spacing={0.5}>
            {
                Object.keys(props.user.data.completion).map((key, index) => {
                    let _key = KEY_NAMES[key] ? KEY_NAMES[key] : key;
                    const stylizedKey = _key.length === 2 ? _key.toUpperCase() : capitalize(_key);
                    return (
                        <Grid2 size={3}>
                            <Paper sx={{ p: 0.5 }}>
                                <Typography variant='title' sx={{ fontSize: '0.85em' }}>{stylizedKey} completion</Typography>
                                <TableContainer>
                                    <Table size='small'>
                                        <TableBody>
                                            {
                                                props.user.data.completion[key].map((item, index) => {
                                                    //we want a chip that colors red to green based on completion, use lerp
                                                    const _completion = item.completion / 100;
                                                    const color = `rgb(${Math.round(175 - (_completion * 175))}, ${Math.round(_completion * 175)}, 0)`;
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
                        </Grid2>
                    )
                })
            }
        </Grid2>
    </>);
}

export default SectionCompletion;