/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import Loader from "../Components/UI/Loader";
import { Avatar, Box, Divider, Grid, Paper, Typography, useTheme } from "@mui/material";
import config from "../config.json";
import { Helmet } from "react-helmet";
import { GetAPI } from "../Helpers/Misc.js";
import { GetFormattedName } from "../Helpers/Account.js";
import moment from "moment";

function LeadersMonthly(props) {
    const theme = useTheme();

    const [isLoading, setIsLoading] = useState(true);
    const [data, setData] = useState(null);
    const [dataMostAppearances, setDataMostAppearances] = useState(null);

    useEffect(() => {
        setIsLoading(true);
        (async () => {
            try {
                const res = await fetch(`${GetAPI()}scores/monthly_score_farmers`);
                const json = await res.json();
                // console.log(json);
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
            } catch (err) {
                console.error(err);
                setData([]);
            }
            setIsLoading(false);
        })();
    }, [])

    return (
        <>
            <Helmet>
                <title>Month Score Farmers - {config.APP_NAME}</title>
            </Helmet>
            {
                isLoading || data === null || dataMostAppearances === null ? (
                    <Loader />
                ) : (
                    <>
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
                                                            <Typography variant="body" component="div" sx={{ flex: 1 }}>{parseInt(item.top.total_score).toLocaleString('en-US')}</Typography>
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
                                                                                <Typography variant="subtitle2" component="div">{parseInt(month.top.total_score).toLocaleString('en-US')}</Typography>
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
                                        <Typography variant="h6" component="div">Top Players</Typography>

                                        <Grid container spacing={1}>
                                            {
                                                dataMostAppearances.map((item) => (
                                                    <Grid item xs={1} key={item.user_id} sx={{
                                                        display: 'flex',
                                                        justifyContent: 'center',
                                                        alignItems: 'center',
                                                        flexDirection: 'column'
                                                    }}>
                                                        {GetFormattedName(item.user.inspector_user, {
                                                            icon_only: true,
                                                        })}
                                                        <Typography variant="subtitle2" component="div">{item.count}</Typography>
                                                    </Grid>
                                                ))
                                            }
                                        </Grid>
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