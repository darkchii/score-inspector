import { Card, CardContent, Chip, CircularProgress, Grid, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Tooltip, Typography } from "@mui/material";
import { Box } from "@mui/system";
import React, { useEffect } from "react";
import ErrorIcon from '@mui/icons-material/Error';
import axios from "axios";
import config from '../../config.json';

function CompletionCardOD(props) {
    const [working, setWorkingState] = React.useState(true);
    const [failed, setFailedState] = React.useState(false);

    useEffect(() => {
        if (props.data.processed.completion === undefined || props.data.processed.completion.ar === undefined) {
            (async () => {
                setFailedState(false);
                setWorkingState(true);
                if (props.data.processed.completion === undefined) {
                    props.data.processed.completion = [];
                }

                await new Promise(r => setTimeout(r, 1000));

                var _scores = JSON.parse(JSON.stringify(props.data.scores));

                var __data = [];
                try {
                    __data[0] = parseFloat((await axios.get(`${(!process.env.NODE_ENV || process.env.NODE_ENV === 'development') ? config.OSU_TEST_API : config.OSU_API}beatmaps/count?ar_min=0&ar_max=1`, { headers: { "Access-Control-Allow-Origin": "*" } })).data);
                    __data[1] = parseFloat((await axios.get(`${(!process.env.NODE_ENV || process.env.NODE_ENV === 'development') ? config.OSU_TEST_API : config.OSU_API}beatmaps/count?ar_min=1&ar_max=2`, { headers: { "Access-Control-Allow-Origin": "*" } })).data);
                    __data[2] = parseFloat((await axios.get(`${(!process.env.NODE_ENV || process.env.NODE_ENV === 'development') ? config.OSU_TEST_API : config.OSU_API}beatmaps/count?ar_min=2&ar_max=3`, { headers: { "Access-Control-Allow-Origin": "*" } })).data);
                    __data[3] = parseFloat((await axios.get(`${(!process.env.NODE_ENV || process.env.NODE_ENV === 'development') ? config.OSU_TEST_API : config.OSU_API}beatmaps/count?ar_min=3&ar_max=4`, { headers: { "Access-Control-Allow-Origin": "*" } })).data);
                    __data[4] = parseFloat((await axios.get(`${(!process.env.NODE_ENV || process.env.NODE_ENV === 'development') ? config.OSU_TEST_API : config.OSU_API}beatmaps/count?ar_min=4&ar_max=5`, { headers: { "Access-Control-Allow-Origin": "*" } })).data);
                    __data[5] = parseFloat((await axios.get(`${(!process.env.NODE_ENV || process.env.NODE_ENV === 'development') ? config.OSU_TEST_API : config.OSU_API}beatmaps/count?ar_min=5&ar_max=6`, { headers: { "Access-Control-Allow-Origin": "*" } })).data);
                    __data[6] = parseFloat((await axios.get(`${(!process.env.NODE_ENV || process.env.NODE_ENV === 'development') ? config.OSU_TEST_API : config.OSU_API}beatmaps/count?ar_min=6&ar_max=7`, { headers: { "Access-Control-Allow-Origin": "*" } })).data);
                    __data[7] = parseFloat((await axios.get(`${(!process.env.NODE_ENV || process.env.NODE_ENV === 'development') ? config.OSU_TEST_API : config.OSU_API}beatmaps/count?ar_min=7&ar_max=8`, { headers: { "Access-Control-Allow-Origin": "*" } })).data);
                    __data[8] = parseFloat((await axios.get(`${(!process.env.NODE_ENV || process.env.NODE_ENV === 'development') ? config.OSU_TEST_API : config.OSU_API}beatmaps/count?ar_min=8&ar_max=9`, { headers: { "Access-Control-Allow-Origin": "*" } })).data);
                    __data[9] = parseFloat((await axios.get(`${(!process.env.NODE_ENV || process.env.NODE_ENV === 'development') ? config.OSU_TEST_API : config.OSU_API}beatmaps/count?ar_min=9&ar_max=10`, { headers: { "Access-Control-Allow-Origin": "*" } })).data);
                } catch (err) {
                    setFailedState(true);
                    setWorkingState(false);
                    return;
                }

                const _data = [];
                Object.entries(__data).forEach(entry => {
                    const [key, value] = entry;
                    const _min = parseFloat(key);
                    const maps = value;

                    const __scores = _scores.filter(score => score.ar >= _min && score.ar < _min + 1);
                    _data.push({ ar: _min, clears: __scores.length, total_maps: maps });
                });

                setWorkingState(false);
                props.data.processed.completion.ar = _data;
            })();
        }else{
            setWorkingState(false);
        }
    }, [props.data]);

    return (
        <>
            <Card sx={props.sx}>
                <CardContent sx={{ height: '100%' }}>
                    <Typography variant="h5">Completion by approach rate</Typography>
                    {
                        working || props.data.processed.completion === undefined || props.data.processed.completion.ar === undefined ? <>
                            <Box sx={{ height: '100%', direction: 'column', alignItems: 'center', display: 'flex', justifyContent: 'center' }}>
                                <CircularProgress />
                            </Box>
                        </> : <>
                            {
                                failed ? <>
                                    <Box sx={{ height: '100%', direction: 'column', alignItems: 'center', display: 'flex', justifyContent: 'center' }}>
                                        <ErrorIcon fontSize="large" color="primary" /><br />
                                        <Chip label="Unable to get beatmap data" />
                                    </Box>
                                </> : <>
                                    <TableContainer>
                                        <Table size="small">
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell>AR</TableCell>
                                                    <TableCell align="right">Clears</TableCell>
                                                    <TableCell>Total</TableCell>
                                                    <TableCell>%</TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {
                                                    props.data.processed.completion.ar.map(data => (
                                                        <TableRow>
                                                            <TableCell>AR {data.ar} to {data.ar + 1}</TableCell>
                                                            <TableCell align="right">{data.clears}</TableCell>
                                                            <TableCell>{data.total_maps}</TableCell>
                                                            <TableCell>{(100 / data.total_maps * data.clears).toFixed(1)}%</TableCell>
                                                        </TableRow>
                                                    ))
                                                }
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                </>
                            }
                        </>
                    }
                </CardContent>
            </Card>
        </>
    );
}
export default CompletionCardOD;