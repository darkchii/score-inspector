import { Card, CardContent, Chip, CircularProgress, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import { Box } from "@mui/system";
import React, { useEffect } from "react";
import ErrorIcon from '@mui/icons-material/Error';
import axios from "axios";
import { getAPIURL } from "../../helper";

function CompletionCardLength(props) {
    const [working, setWorkingState] = React.useState(true);
    const [failed, setFailedState] = React.useState(false);
    const [tableData, setData] = React.useState([]);

    const rowSize = 10;

    useEffect(() => {
        if (props.data.processed.completion === undefined || props.data.processed.completion._length === undefined) {
            (async () => {
                setFailedState(false);
                setWorkingState(true);
                if (props.data.processed.completion === undefined) {
                    props.data.processed.completion = [];
                }

                await new Promise(r => setTimeout(r, 1000));

                var _scores = JSON.parse(JSON.stringify(props.data.scores));

                var __data = (await axios.get(`${getAPIURL()}beatmaps/ranges/total_length?size=60&include_loved=${props.data.processed.allowLoved ? 'true' : 'false'}`)).data;
                let visible = __data.slice(0, rowSize + 1);
                let remainder = __data.slice(rowSize + 1, __data.length);

                remainder.forEach((rangeData, index) => {
                    visible[rowSize].amount += rangeData.amount;
                    if (rangeData.max > visible[rowSize].max) {
                        visible[rowSize].max = rangeData.max;
                    }
                });

                let processed = [];
                visible.forEach((rangeData, index) => {
                    const scoreSlice = _scores.filter(score => score.length >= rangeData.min && score.length < rangeData.max);
                    processed.push({
                        min: rangeData.min,
                        max: rangeData.max,
                        clears: scoreSlice.length,
                        total: rangeData.amount
                    });
                });

                setWorkingState(false);
                props.data.processed.completion._length = processed;
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
                                                    props.data.processed.completion._length.map((data, index) => (
                                                        <TableRow>
                                                            <TableCell>
                                                                {
                                                                    index === rowSize ? <>{data.min}+</> : <>
                                                                        {data.min} to {data.max}
                                                                    </>
                                                                }
                                                            </TableCell>
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
export default CompletionCardLength;