import { Box, Card, CardContent, Chip, CircularProgress, Typography, Table, TableContainer, TableHead, TableRow, TableCell, TableBody } from "@mui/material";
import React, { useEffect } from "react";
import ErrorIcon from '@mui/icons-material/Error';
import axios from "axios";
import moment from "moment";
import { getAPIURL } from "../../helper";

function CompletionCardYear(props) {
    const [working, setWorkingState] = React.useState(true);
    const [failed, setFailedState] = React.useState(false);

    useEffect(() => {
        if (props.data.processed.completion === undefined || props.data.processed.completion.years === undefined) {
            (async () => {
                setFailedState(false);
                setWorkingState(true);
                if (props.data.processed.completion === undefined) {
                    props.data.processed.completion = [];
                }

                await new Promise(r => setTimeout(r, 1000));

                const res = await axios.get(`${getAPIURL()}beatmaps/yearly`, { headers: { "Access-Control-Allow-Origin": "*" } });
                if (res.data.length > 0) {
                    const __data = [];
                    res.data.forEach(yearData => {
                        const y = moment(`${yearData.year}-01-01`);
                        const maps = yearData.amount;
                        var count = 0;

                        props.data.scores.forEach(score => {
                            const approval = moment(score.approved_date);
                            if (approval.isSame(y, 'year')) {
                                count++;
                            }
                        });
                        __data.push({ year: yearData.year, clears: count, total_maps: maps });
                    });
                    props.data.processed.completion.years = __data;
                } else {
                    setFailedState(true);
                }
                setWorkingState(false);
            })();
        }else{
            setWorkingState(false);
        }
    }, [props.data]);

    return (
        <>
            <Card sx={props.sx}>
                <CardContent sx={{ height: '100%' }}>
                    <Typography variant="h5">Completion by year</Typography>
                    {
                        working || props.data.processed.completion === undefined || props.data.processed.completion.years === undefined ? <>
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
                                                    <TableCell>Year</TableCell>
                                                    <TableCell align="right">Clears</TableCell>
                                                    <TableCell>Total</TableCell>
                                                    <TableCell>%</TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {
                                                    props.data.processed.completion.years.map(data => (
                                                        <TableRow>
                                                            <TableCell>{data.year}</TableCell>
                                                            <TableCell align="right">{data.clears.toLocaleString('en-US')}</TableCell>
                                                            <TableCell>{data.total_maps.toLocaleString('en-US')}</TableCell>
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
export default CompletionCardYear;