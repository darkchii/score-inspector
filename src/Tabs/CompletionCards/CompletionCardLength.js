import { Card, CardContent, Chip, CircularProgress, Grid, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Tooltip, Typography } from "@mui/material";
import { Box } from "@mui/system";
import React, { useEffect } from "react";
import ErrorIcon from '@mui/icons-material/Error';
import axios from "axios";
import config from '../../config.json';

function CompletionCardLength(props) {
    const [working, setWorkingState] = React.useState(true);
    const [failed, setFailedState] = React.useState(false);

    useEffect(() => {
        if (props.data.processed.completion === undefined || props.data.processed.completion._length === undefined) {
            (async () => {
                setFailedState(false);
                setWorkingState(true);
                if (props.data.processed.completion === undefined) {
                    props.data.processed.completion = [];
                }

                await new Promise(r => setTimeout(r, 1000));

                //test

                var _scores = JSON.parse(JSON.stringify(props.data.scores));

                var __data = [];
                try {
                    __data[0] = parseInt((await axios.get(`${(!process.env.NODE_ENV || process.env.NODE_ENV === 'development') ? config.OSU_TEST_API : config.OSU_API}beatmaps/count?length_min=0&length_max=60`, { headers: { "Access-Control-Allow-Origin": "*" } })).data);
                    __data[1] = parseInt((await axios.get(`${(!process.env.NODE_ENV || process.env.NODE_ENV === 'development') ? config.OSU_TEST_API : config.OSU_API}beatmaps/count?length_min=60&length_max=120`, { headers: { "Access-Control-Allow-Origin": "*" } })).data);
                    __data[2] = parseInt((await axios.get(`${(!process.env.NODE_ENV || process.env.NODE_ENV === 'development') ? config.OSU_TEST_API : config.OSU_API}beatmaps/count?length_min=120&length_max=180`, { headers: { "Access-Control-Allow-Origin": "*" } })).data);
                    __data[3] = parseInt((await axios.get(`${(!process.env.NODE_ENV || process.env.NODE_ENV === 'development') ? config.OSU_TEST_API : config.OSU_API}beatmaps/count?length_min=180&length_max=240`, { headers: { "Access-Control-Allow-Origin": "*" } })).data);
                    __data[4] = parseInt((await axios.get(`${(!process.env.NODE_ENV || process.env.NODE_ENV === 'development') ? config.OSU_TEST_API : config.OSU_API}beatmaps/count?length_min=240&length_max=300`, { headers: { "Access-Control-Allow-Origin": "*" } })).data);
                    __data[5] = parseInt((await axios.get(`${(!process.env.NODE_ENV || process.env.NODE_ENV === 'development') ? config.OSU_TEST_API : config.OSU_API}beatmaps/count?length_min=300&length_max=360`, { headers: { "Access-Control-Allow-Origin": "*" } })).data);
                    __data[6] = parseInt((await axios.get(`${(!process.env.NODE_ENV || process.env.NODE_ENV === 'development') ? config.OSU_TEST_API : config.OSU_API}beatmaps/count?length_min=360&length_max=420`, { headers: { "Access-Control-Allow-Origin": "*" } })).data);
                    __data[7] = parseInt((await axios.get(`${(!process.env.NODE_ENV || process.env.NODE_ENV === 'development') ? config.OSU_TEST_API : config.OSU_API}beatmaps/count?length_min=420&length_max=480`, { headers: { "Access-Control-Allow-Origin": "*" } })).data);
                    __data[8] = parseInt((await axios.get(`${(!process.env.NODE_ENV || process.env.NODE_ENV === 'development') ? config.OSU_TEST_API : config.OSU_API}beatmaps/count?length_min=480&length_max=540`, { headers: { "Access-Control-Allow-Origin": "*" } })).data);
                    __data[9] = parseInt((await axios.get(`${(!process.env.NODE_ENV || process.env.NODE_ENV === 'development') ? config.OSU_TEST_API : config.OSU_API}beatmaps/count?length_min=540&length_max=600`, { headers: { "Access-Control-Allow-Origin": "*" } })).data);
                    __data[10] = parseInt((await axios.get(`${(!process.env.NODE_ENV || process.env.NODE_ENV === 'development') ? config.OSU_TEST_API : config.OSU_API}beatmaps/count?length_min=600`, { headers: { "Access-Control-Allow-Origin": "*" } })).data);
                } catch (err) {
                    setFailedState(true);
                    setWorkingState(false);
                    return;
                }

                const _data = [];
                Object.entries(__data).forEach(entry => {
                    const [key, value] = entry;
                    const _min = parseInt(key) * 60;
                    const maps = value;

                    const __scores = _scores.filter(score => score.length >= _min && score.length < _min + 60);
                    _data.push({ length: _min, clears: __scores.length, total_maps: maps });
                });

                setWorkingState(false);
                props.data.processed.completion._length = _data;
            })();
        } else {
            setWorkingState(false);
        }
    }, [props.data]);

    return (
        <>
            <Card sx={props.sx}>
                <CardContent sx={{ height: '100%' }}>
                    <Typography variant="h5">Completion by length</Typography>
                    {
                        working || props.data.processed.completion === undefined || props.data.processed.completion._length === undefined ? <>
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
                                                    <TableCell>Length</TableCell>
                                                    <TableCell align="right">Clears</TableCell>
                                                    <TableCell>Total</TableCell>
                                                    <TableCell>%</TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {
                                                    props.data.processed.completion._length.map(data => (
                                                        <TableRow>
                                                            {/* <TableCell>{data.length} to {data.length + 60}</TableCell> */}
                                                            <TableCell>{`${data.length}${data.length === 600 ? '+' : ` to ${data.length + 60}`}`}</TableCell>
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
export default CompletionCardLength;