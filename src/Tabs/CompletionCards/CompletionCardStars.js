import { Card, CardContent, Chip, CircularProgress, Grid, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Tooltip, Typography } from "@mui/material";
import { Box } from "@mui/system";
import React, { useEffect } from "react";
import ErrorIcon from '@mui/icons-material/Error';
import axios from "axios";
import config from '../../config.json';

function CompletionCardStars(props) {
    const [working, setWorkingState] = React.useState(true);
    const [failed, setFailedState] = React.useState(false);
    const [tableData, setData] = React.useState([]);

    useEffect(() => {
        if (props.data.processed.completion === undefined || props.data.processed.completion.stars === undefined) {
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
                    __data[0] = parseInt((await axios.get(`${(!process.env.NODE_ENV || process.env.NODE_ENV === 'development') ? config.OSU_TEST_API : config.OSU_API}beatmaps/count?stars_min=0&stars_max=1`, { headers: { "Access-Control-Allow-Origin": "*" } })).data);
                    __data[1] = parseInt((await axios.get(`${(!process.env.NODE_ENV || process.env.NODE_ENV === 'development') ? config.OSU_TEST_API : config.OSU_API}beatmaps/count?stars_min=1&stars_max=2`, { headers: { "Access-Control-Allow-Origin": "*" } })).data);
                    __data[2] = parseInt((await axios.get(`${(!process.env.NODE_ENV || process.env.NODE_ENV === 'development') ? config.OSU_TEST_API : config.OSU_API}beatmaps/count?stars_min=2&stars_max=3`, { headers: { "Access-Control-Allow-Origin": "*" } })).data);
                    __data[3] = parseInt((await axios.get(`${(!process.env.NODE_ENV || process.env.NODE_ENV === 'development') ? config.OSU_TEST_API : config.OSU_API}beatmaps/count?stars_min=3&stars_max=4`, { headers: { "Access-Control-Allow-Origin": "*" } })).data);
                    __data[4] = parseInt((await axios.get(`${(!process.env.NODE_ENV || process.env.NODE_ENV === 'development') ? config.OSU_TEST_API : config.OSU_API}beatmaps/count?stars_min=4&stars_max=5`, { headers: { "Access-Control-Allow-Origin": "*" } })).data);
                    __data[5] = parseInt((await axios.get(`${(!process.env.NODE_ENV || process.env.NODE_ENV === 'development') ? config.OSU_TEST_API : config.OSU_API}beatmaps/count?stars_min=5&stars_max=6`, { headers: { "Access-Control-Allow-Origin": "*" } })).data);
                    __data[6] = parseInt((await axios.get(`${(!process.env.NODE_ENV || process.env.NODE_ENV === 'development') ? config.OSU_TEST_API : config.OSU_API}beatmaps/count?stars_min=6&stars_max=7`, { headers: { "Access-Control-Allow-Origin": "*" } })).data);
                    __data[7] = parseInt((await axios.get(`${(!process.env.NODE_ENV || process.env.NODE_ENV === 'development') ? config.OSU_TEST_API : config.OSU_API}beatmaps/count?stars_min=7&stars_max=8`, { headers: { "Access-Control-Allow-Origin": "*" } })).data);
                    __data[8] = parseInt((await axios.get(`${(!process.env.NODE_ENV || process.env.NODE_ENV === 'development') ? config.OSU_TEST_API : config.OSU_API}beatmaps/count?stars_min=8&stars_max=9`, { headers: { "Access-Control-Allow-Origin": "*" } })).data);
                    __data[9] = parseInt((await axios.get(`${(!process.env.NODE_ENV || process.env.NODE_ENV === 'development') ? config.OSU_TEST_API : config.OSU_API}beatmaps/count?stars_min=9&stars_max=10`, { headers: { "Access-Control-Allow-Origin": "*" } })).data);
                    __data[10] = parseInt((await axios.get(`${(!process.env.NODE_ENV || process.env.NODE_ENV === 'development') ? config.OSU_TEST_API : config.OSU_API}beatmaps/count?stars_min=10`, { headers: { "Access-Control-Allow-Origin": "*" } })).data);
                } catch (err) {
                    setFailedState(true);
                    setWorkingState(false);
                    return;
                }

                const _data = [];
                Object.entries(__data).forEach(entry => {
                    const [key, value] = entry;
                    const min_sr = parseInt(key);
                    const maps = value;

                    const __scores = _scores.filter(score => score.stars >= min_sr && (min_sr < 10 ? (score.stars < min_sr + 1) : true));
                    _data.push({ sr: min_sr, clears: __scores.length, total_maps: maps });
                });

                setWorkingState(false);
                props.data.processed.completion.stars = _data;
            })();
        }else{
            setWorkingState(false);
        }
    }, [props.data]);

    return (
        <>
            <Card sx={props.sx}>
                <CardContent sx={{ height: '100%' }}>
                    <Typography variant="h5">Completion by star rating</Typography>
                    {
                        working || props.data.processed.completion === undefined || props.data.processed.completion.stars === undefined ? <>
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
                                                    <TableCell>Stars</TableCell>
                                                    <TableCell align="right">Clears</TableCell>
                                                    <TableCell>Total</TableCell>
                                                    <TableCell>%</TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {
                                                    props.data.processed.completion.stars.map(data => (
                                                        <TableRow>
                                                            <TableCell>{
                                                                data.sr < 10 ?
                                                                    <>{data.sr}* to {data.sr + 1}*</> : <>
                                                                        {data.sr}*+
                                                                    </>}
                                                            </TableCell>
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
export default CompletionCardStars;