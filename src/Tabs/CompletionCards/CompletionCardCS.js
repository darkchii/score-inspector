import { Card, CardContent, Chip, CircularProgress, Grid, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Tooltip, Typography } from "@mui/material";
import { Box } from "@mui/system";
import React, { useEffect } from "react";
import ErrorIcon from '@mui/icons-material/Error';
import axios from "axios";
import config from '../../config.json';
import { getAPIURL } from "../../helper";

function CompletionCardCS(props) {
    const [working, setWorkingState] = React.useState(true);
    const [failed, setFailedState] = React.useState(false);

    const rowSize = 9;

    useEffect(() => {
        if (props.data.processed.completion === undefined || props.data.processed.completion.cs === undefined) {
            (async () => {
                setFailedState(false);
                setWorkingState(true);

                await new Promise(r => setTimeout(r, 1000));

                if (props.data.processed.completion === undefined) {
                    props.data.processed.completion = [];
                }

                var _scores = JSON.parse(JSON.stringify(props.data.scores));

                var __data = (await axios.get(`${getAPIURL()}beatmaps/ranges/cs?include_loved=${props.data.processed.allowLoved ? 'true' : 'false'}`)).data;
                __data.forEach(rangeData=>{
                    rangeData.invisibleMax = rangeData.max;
                });
                let visible = __data.slice(0, rowSize + 1);
                let remainder = __data.slice(rowSize + 1, __data.length);

                remainder.forEach((rangeData, index) => {
                    visible[rowSize].amount += rangeData.amount;
                    if (rangeData.max > visible[rowSize].max && (visible[rowSize].invisibleMax === undefined || rangeData.max > visible[rowSize].invisibleMax)) {
                        visible[rowSize].invisibleMax = rangeData.max;
                    }
                });

                let processed = [];
                visible.forEach((rangeData, index) => {
                    const scoreSlice = _scores.filter(score => score.cs >= rangeData.min && (index === rowSize ? score.cs <= rangeData.invisibleMax : score.cs < rangeData.invisibleMax));
                    processed.push({
                        min: rangeData.min,
                        max: rangeData.max,
                        clears: scoreSlice.length,
                        total: rangeData.amount
                    });
                });

                setWorkingState(false);
                props.data.processed.completion.cs = processed;
            })();
        } else {
            setWorkingState(false);
        }
    }, [props.data]);

    return (
        <>
            <Card sx={props.sx}>
                <CardContent sx={{ height: '100%' }}>
                    <Typography variant="h5">Completion by circle size</Typography>
                    {
                        working || props.data.processed.completion === undefined || props.data.processed.completion.cs === undefined ? <>
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
                                                    <TableCell>CS</TableCell>
                                                    <TableCell align="right">Clears</TableCell>
                                                    <TableCell>Total</TableCell>
                                                    <TableCell>%</TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {
                                                    props.data.processed.completion.cs.map(data => (
                                                        <TableRow>
                                                            <TableCell>CS {data.min} to {data.max}</TableCell>
                                                            <TableCell align="right">{data.clears.toLocaleString('en-US')}</TableCell>
                                                            <TableCell>{data.total.toLocaleString('en-US')}</TableCell>
                                                            <TableCell>{(100 / data.total * data.clears).toFixed(1)}%</TableCell>
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
export default CompletionCardCS;