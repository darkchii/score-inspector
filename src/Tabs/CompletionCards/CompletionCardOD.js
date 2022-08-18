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
        if (props.data.processed.completion === undefined || props.data.processed.completion.od === undefined) {
            (async () => {
                setFailedState(false);
                setWorkingState(true);

                await new Promise(r => setTimeout(r, 1000));

                if (props.data.processed.completion === undefined) {
                    props.data.processed.completion = [];
                }

                var _scores = JSON.parse(JSON.stringify(props.data.scores));

                var __data = [];
                try {
                    __data[0] = parseFloat((await axios.get(`${(!process.env.NODE_ENV || process.env.NODE_ENV === 'development') ? config.OSU_TEST_API : config.OSU_API}beatmaps/count?od_min=0&od_max=1`, { headers: { "Access-Control-Allow-Origin": "*" } })).data);
                    __data[1] = parseFloat((await axios.get(`${(!process.env.NODE_ENV || process.env.NODE_ENV === 'development') ? config.OSU_TEST_API : config.OSU_API}beatmaps/count?od_min=1&od_max=2`, { headers: { "Access-Control-Allow-Origin": "*" } })).data);
                    __data[2] = parseFloat((await axios.get(`${(!process.env.NODE_ENV || process.env.NODE_ENV === 'development') ? config.OSU_TEST_API : config.OSU_API}beatmaps/count?od_min=2&od_max=3`, { headers: { "Access-Control-Allow-Origin": "*" } })).data);
                    __data[3] = parseFloat((await axios.get(`${(!process.env.NODE_ENV || process.env.NODE_ENV === 'development') ? config.OSU_TEST_API : config.OSU_API}beatmaps/count?od_min=3&od_max=4`, { headers: { "Access-Control-Allow-Origin": "*" } })).data);
                    __data[4] = parseFloat((await axios.get(`${(!process.env.NODE_ENV || process.env.NODE_ENV === 'development') ? config.OSU_TEST_API : config.OSU_API}beatmaps/count?od_min=4&od_max=5`, { headers: { "Access-Control-Allow-Origin": "*" } })).data);
                    __data[5] = parseFloat((await axios.get(`${(!process.env.NODE_ENV || process.env.NODE_ENV === 'development') ? config.OSU_TEST_API : config.OSU_API}beatmaps/count?od_min=5&od_max=6`, { headers: { "Access-Control-Allow-Origin": "*" } })).data);
                    __data[6] = parseFloat((await axios.get(`${(!process.env.NODE_ENV || process.env.NODE_ENV === 'development') ? config.OSU_TEST_API : config.OSU_API}beatmaps/count?od_min=6&od_max=7`, { headers: { "Access-Control-Allow-Origin": "*" } })).data);
                    __data[7] = parseFloat((await axios.get(`${(!process.env.NODE_ENV || process.env.NODE_ENV === 'development') ? config.OSU_TEST_API : config.OSU_API}beatmaps/count?od_min=7&od_max=8`, { headers: { "Access-Control-Allow-Origin": "*" } })).data);
                    __data[8] = parseFloat((await axios.get(`${(!process.env.NODE_ENV || process.env.NODE_ENV === 'development') ? config.OSU_TEST_API : config.OSU_API}beatmaps/count?od_min=8&od_max=9`, { headers: { "Access-Control-Allow-Origin": "*" } })).data);
                    __data[9] = parseFloat((await axios.get(`${(!process.env.NODE_ENV || process.env.NODE_ENV === 'development') ? config.OSU_TEST_API : config.OSU_API}beatmaps/count?od_min=9&od_max=10`, { headers: { "Access-Control-Allow-Origin": "*" } })).data);
                } catch (err) {
                    setFailedState(true);
                    setWorkingState(false);
                    return;
                }

                const _data = [];
                Object.entries(__data).forEach(entry => {
                    const [key, value] = entry;
                    const min_od = parseFloat(key);
                    const maps = value;

                    const __scores = _scores.filter(score => score.od >= min_od && score.od < min_od + 1);
                    _data.push({ od: min_od, clears: __scores.length, total_maps: maps });
                });

                setWorkingState(false);
                props.data.processed.completion.od = _data;
            })();
        }else{
            setWorkingState(false);
        }
    }, [props.data]);

    return (
        <>
            <Card sx={props.sx}>
                <CardContent sx={{ height: '100%' }}>
                    <Typography variant="h5">Completion by overall difficulty</Typography>
                    {
                        working || props.data.processed.completion === undefined || props.data.processed.completion.od === undefined ? <>
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
                                                    <TableCell>OD</TableCell>
                                                    <TableCell align="right">Clears</TableCell>
                                                    <TableCell>Total</TableCell>
                                                    <TableCell>%</TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {
                                                    props.data.processed.completion.od.map(data => (
                                                        <TableRow>
                                                            <TableCell>OD {data.od} to {data.od + 1}</TableCell>
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