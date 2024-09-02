/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import Loader from "../Components/UI/Loader";
import { Box, Button, ButtonGroup, Chip, Divider, Grid, Paper, Stack, Table, TableBody, TableCell, TableContainer, TableRow, Typography, useTheme } from "@mui/material";
import config from "../config.json";
import { Helmet } from "react-helmet";
import { GetAPI } from "../Helpers/Misc.js";
import { GetFormattedName } from "../Helpers/Account.js";
import moment from "moment";

const value_types = {
    score: {
        name: 'Total Score',
        dataType: 'score',
        format: (value) => parseInt(value).toLocaleString('en-US'),
    },
    ss: {
        name: 'Total SS',
        dataType: 'ss',
        format: (value) => parseInt(value).toLocaleString('en-US'),
    },
    pp: {
        name: 'Total PP',
        dataType: 'pp',
        format: (value) => `${parseInt(value).toLocaleString('en-US')}pp`,
    },
}

function LeadersMonthly(props) {
    const theme = useTheme();

    const [isLoading, setIsLoading] = useState(true);
    const [data, setData] = useState(null);
    const [dataOvertakes, setDataOvertakes] = useState(null);
    const [dataMostAppearances, setDataMostAppearances] = useState(null);
    const [dataType, setDataType] = useState('score');

    const fetchData = async () => {
        setIsLoading(true);
        setData(null);
        setDataOvertakes(null);
        setDataMostAppearances(null);
        try {
            const res = await fetch(`${GetAPI()}scores/monthly_farmers/${dataType}`);
            const json = await res.json();
            //if array, then we have data
            if (Array.isArray(json)) {
                //change structure
                //get all YYYY only
                let _data = [];
                json.forEach((item) => {
                    if (item.period.length === 4) {
                        _data.push({
                            year: item.period,
                            top: item,
                            months: []
                        });
                    }
                });

                //get all YYYY-MM
                json.forEach((item) => {
                    if (item.period.length === 7) {
                        let year = item.period.split('-')[0];
                        let month = item.period.split('-')[1];

                        //find the year
                        let yearIndex = _data.findIndex((item) => item.year === year);
                        if (yearIndex !== -1) {
                            _data[yearIndex].months.push({
                                month: month,
                                top: item
                            });
                        }
                    }
                });

                const _dataMostAppearances = [];

                //count months for each user
                _data.forEach((item) => {
                    item.months.forEach((month) => {
                        let userIndex = _dataMostAppearances.findIndex((item) => item.user_id === month.top.user_id);
                        if (userIndex === -1) {
                            _dataMostAppearances.push({
                                user_id: month.top.user_id,
                                user: month.top.user,
                                count: 1
                            });
                        } else {
                            _dataMostAppearances[userIndex].count++;
                        }
                    });
                });

                //sort by count
                _dataMostAppearances.sort((a, b) => {
                    return b.count - a.count;
                });

                setDataMostAppearances(_dataMostAppearances);
                setData(_data);
            } else {
                console.error(json);
                setData([]);
            }

            const overtakes_res = await fetch(`${GetAPI()}scores/monthly_farmers/log/${dataType}`);
            const overtakes_json = await overtakes_res.json();

            if (Array.isArray(overtakes_json)) {
                //convert all "time" (utc) to moment objects (local time)
                overtakes_json.forEach((item) => {
                    item.time_moment = moment(item.time).local();
                    item.old_total_score = parseInt(item.old_total_score);
                    item.new_total_score = parseInt(item.new_total_score);
                });

                //sort by time (descending)
                overtakes_json.sort((a, b) => {
                    return b.time_moment - a.time_moment;
                });

                setDataOvertakes(overtakes_json);
            } else {
                console.error(overtakes_json);
                setDataOvertakes([]);
            }


        } catch (err) {
            console.error(err);
            setData([]);
        }
        setIsLoading(false);
    }

    useEffect(() => {
        setDataType('score');
    }, [])

    useEffect(() => {
        (async () => {
            await fetchData();
        })()
    }, [dataType])

    return (
        <>
            <Helmet>
                <title>Month Score Farmers - {config.APP_NAME}</title>
            </Helmet>
            {
                isLoading || data === null || dataMostAppearances === null || dataOvertakes === null ? (
                    <Loader />
                ) : (
                    <>
                        <ButtonGroup sx={{ pb: 1 }}>
                            {/* <Button disabled={dataType === 'score'} variant={dataType === 'score' ? 'contained' : 'outlined'} onClick={() => setDataType('score')}>Total Score</Button>
                            <Button disabled={dataType === 'ss'} variant={dataType === 'ss' ? 'contained' : 'outlined'} onClick={() => setDataType('ss')}>Total SS</Button>
                            <Button disabled={dataType === 'pp'} variant={dataType === 'pp' ? 'contained' : 'outlined'} onClick={() => setDataType('pp')}>Total PP</Button>
                            <Button disabled={dataType === 'clears'} variant={dataType === 'clears' ? 'contained' : 'outlined'} onClick={() => setDataType('clears')}>Clears</Button>
                            <Button disabled={dataType === 'fcclears'} variant={dataType === 'fcclears' ? 'contained' : 'outlined'} onClick={() => setDataType('fcclears')}>Full Combos</Button> */}
                            {
                                Object.keys(value_types).map((key) => {
                                    return (
                                        <Button key={key} disabled={dataType === key} variant={dataType === key ? 'contained' : 'outlined'} onClick={() => setDataType(key)}>{value_types[key].name}</Button>
                                    )
                                })
                            }
                        </ButtonGroup>
                        {
                            data.length > 0 ? (
                                <>
                                    <Grid container spacing={0.5}>
                                        {
                                            data.map((item) => (
                                                <Grid item xs={12} md={3} key={item.year}>
                                                    <Paper elevation={3} sx={{ p: 1 }}>
                                                        <Box sx={{
                                                            display: 'flex',
                                                            justifyContent: 'space-between',
                                                        }}>
                                                            <Typography variant="body" component="div" sx={{ flex: 1 }}>{GetFormattedName(item.top.user.inspector_user)}</Typography>
                                                            {/* show behind above, but all the way right */}
                                                            <Typography variant="body" component="div" sx={{ flex: 1 }}>{value_types[dataType].format(item.top.total_score)}</Typography>
                                                            <Typography variant="h6" component="div">{item.year}</Typography>
                                                        </Box>
                                                        <Divider sx={{ mt: 0.5, mb: 0.5 }} />
                                                        <Box>
                                                            <Grid container spacing={1}>
                                                                {
                                                                    item.months.map((month) => {
                                                                        let _date = moment(new Date(`${item.year}-${month.month}-01 UTC`)).utc().format('MMMM');
                                                                        return (
                                                                            <Grid item xs={3} key={month.month} sx={{
                                                                                display: 'flex',
                                                                                justifyContent: 'center',
                                                                                alignItems: 'center',
                                                                                flexDirection: 'column'
                                                                            }}>
                                                                                {/* convert to 3 letter month */}
                                                                                <Typography variant="body" component="div">{_date}</Typography>
                                                                                {GetFormattedName(month.top.user.inspector_user, {
                                                                                    icon_only: true,
                                                                                })}
                                                                                <Typography variant="subtitle2" component="div">{value_types[dataType].format(month.top.total_score)}</Typography>
                                                                            </Grid>
                                                                        )
                                                                    })
                                                                }
                                                            </Grid>
                                                        </Box>
                                                    </Paper>
                                                </Grid>
                                            ))
                                        }
                                    </Grid>
                                    <Divider sx={{ mt: 1, mb: 1 }} />
                                    <Box>
                                        <Typography variant="h6" component="div">Top Players by Months ({dataMostAppearances.length})</Typography>

                                        <Grid container spacing={1}>
                                            {
                                                dataMostAppearances.map((item, index) => {
                                                    return (
                                                        <Grid item xs={12 / 8} key={item.user_id}>
                                                            <Paper elevation={3} sx={{ p: 1 }}>
                                                                <Stack direction="column" spacing={1}
                                                                    sx={{
                                                                        justifyContent: 'center',
                                                                        alignItems: 'center',
                                                                    }}>
                                                                    {GetFormattedName(item.user.inspector_user, {
                                                                        icon_only: true,
                                                                    })}
                                                                    {/* <Typography variant="subtitle2" component="div">{item.count}</Typography> */}
                                                                    <Chip size='small' label={item.count} />
                                                                </Stack>
                                                            </Paper>
                                                        </Grid>
                                                    )
                                                })
                                            }
                                        </Grid>
                                    </Box>
                                    <Divider sx={{ mt: 1, mb: 1 }} />
                                    <Box>
                                        <Typography variant="h6" component="div">Overtakes</Typography>
                                        <Paper style={{ height: 400, width: '100%' }}>
                                            {
                                                dataOvertakes.length > 0 ? (
                                                    <TableContainer>
                                                        <Table size="small">
                                                            <TableBody>
                                                                {
                                                                    dataOvertakes.map((item, index) => {
                                                                        return (
                                                                            <TableRow key={index}>
                                                                                <TableCell width='5%'><Chip color="primary" size='small' label={value_types[dataType].name} /></TableCell>
                                                                                <TableCell width='5%'><Chip size='small' label={`${item.time_moment.fromNow()}`} /></TableCell>
                                                                                <TableCell width='12.5%'>{GetFormattedName(item.new_user.inspector_user)}</TableCell>
                                                                                <TableCell width='5%'>overtook</TableCell>
                                                                                <TableCell width='12.5%'>{GetFormattedName(item.old_user.inspector_user)}</TableCell>
                                                                                <TableCell width='10%'>on {item.period}</TableCell>
                                                                                <TableCell width='40%'> </TableCell>
                                                                            </TableRow>
                                                                        )  
                                                                    })
                                                                }
                                                            </TableBody>
                                                        </Table>
                                                    </TableContainer>
                                                ) : (
                                                    <Box sx={{ color: theme.palette.text.primary, p: 1 }}>
                                                        No overtakes recorded yet.
                                                    </Box>
                                                )
                                            }
                                        </Paper>
                                    </Box>
                                </>
                            ) : (
                                <Box sx={{ color: theme.palette.text.primary }}>
                                    No data found.
                                </Box>
                            )
                        }
                    </>
                )
            }
        </>
    );
}

export default LeadersMonthly;