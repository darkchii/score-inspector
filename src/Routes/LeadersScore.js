/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from "react";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Loader from "../Components/UI/Loader";
import axios from "axios";
import { GetAPI, formatNumberAsSize } from "../Helpers/Misc";
import { Alert, Box, Button, ButtonGroup, Pagination, Stack, Typography, useTheme } from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import moment from "moment";
import PlayerLeaderboardItem from "../Components/Leaderboards/PlayerLeaderboardItem";
import { green, grey } from "@mui/material/colors";
import config from "../config.json";
import { Helmet } from "react-helmet";
import ChartWrapper from "../Helpers/ChartWrapper.js";

const USERS_PER_PAGE = 50;
const MAX_TOTAL_USERS = 10000;
const PAGES = Math.ceil(MAX_TOTAL_USERS / USERS_PER_PAGE);

const VALID_SORTING = ['rank', 'rank_gain', 'score_gain'];

function LeadersScore(props) {
    const theme = useTheme();
    const params = useParams();
    const navigate = useNavigate();

    const [page, setPage] = useState(params.page ? parseInt(params.page) : 1);
    // 2023-08-15
    const [date, setDate] = useState(params.date ? params.date : null);
    const [leaderboard, setLeaderboard] = useState([]);
    const [allDates, setAllDates] = useState([]);
    const [isLoadingDates, setIsLoadingDates] = useState(false);
    const [isLoadingLeaderboard, setIsLoadingLeaderboard] = useState(false);
    const [isPreviousDayRecorded, setIsPreviousDayRecorded] = useState(false);
    //also check if sorting is valid
    const [sorting, setSorting] = useState(params.sort && VALID_SORTING.includes(params.sort) ? params.sort : 'rank');
    const [scoreGraphData, setScoreGraphData] = useState(null);

    useEffect(() => {
        (async () => {
            try {
                const data = await axios.get(`${GetAPI()}scores/ranking/stats`);

                // const _data = {
                //     labels: [],
                //     values: []
                // };
                const _data = [];
                data?.data?.daily_total_ranked_score?.forEach((item) => {
                    // _data.labels.push(moment(item.date, "YYYY-MM-DD"));
                    // _data.values.push(item.total_ranked_score);
                    _data.push([moment(item.date, "YYYY-MM-DD").toDate().getTime(), item.total_ranked_score]);
                });

                console.log(_data);

                setScoreGraphData(_data);
            } catch (err) {
                console.log(err);
            }
        })()
    }, []);

    useEffect(() => {
        if (allDates.length === 0) {
            (async () => {
                setIsLoadingDates(true);
                let _allDates = [];
                try {
                    const data = await axios.get(`${GetAPI()}scores/ranking/dates`);
                    //order by date
                    data?.data.sort((a, b) => {
                        return moment(a).isBefore(moment(b)) ? -1 : 1;
                    });
                    _allDates = data?.data;
                    setAllDates(data?.data);
                } catch (err) {
                    console.log(err);
                } finally {
                    setIsLoadingDates(false);
                }

                if (date === null && _allDates.length > 0 && !params.date) {
                    console.log(`setting date to ${_allDates[_allDates.length - 1]}`);

                    setDate(_allDates[_allDates.length - 1]);
                }
            })();
        }
    }, []);

    useEffect(() => {
        console.log(`page: ${page}, date: ${date}`);
        if (!date || !page) return;
        (async () => {
            setIsLoadingLeaderboard(true);
            try {
                const data = await axios.get(`${GetAPI()}scores/ranking?date=${date}&limit=${USERS_PER_PAGE}&page=${page}&sort=${sorting}`);
                //check if previous day is recorded (if any old_rank is NOT null, then it is recorded)
                let _isPreviousDayRecorded = data?.data?.filter((item) => { return item.old_rank !== null; }).length > 0;
                setIsPreviousDayRecorded(_isPreviousDayRecorded);
                setLeaderboard(data?.data);
            } catch (err) {
                console.log(err);
            } finally {
                setIsLoadingLeaderboard(false);
            }
        })();
    }, [page, date, sorting]);

    const disableDate = (date) => {
        const dateStr = moment(date).format("YYYY-MM-DD");
        return !allDates.includes(dateStr);
    };

    return (
        <>
            <Helmet>
                <title>Score Rank History - {config.APP_NAME}</title>
            </Helmet>
            {
                isLoadingDates || isLoadingLeaderboard ? (
                    <Loader />
                ) : (
                    <>
                        <Box>
                            <Alert variant='outlined' severity="info">Tracking started on August 14 2023. Data before that does not exist. The difference indication is compared to the day before</Alert>
                            <Box sx={{ py: 2, justifyContent: 'center', display: 'flex' }}>
                                <LocalizationProvider dateAdapter={AdapterMoment}>
                                    <DatePicker defaultValue={moment(date, "YYYY-MM-DD")} shouldDisableDate={
                                        (date) => disableDate(date)
                                    } onChange={
                                        (newDate) => {
                                            setDate(newDate.format("YYYY-MM-DD"));
                                            navigate(`/score/page/${page}/date/${newDate.format("YYYY-MM-DD")}/sort/${sorting}`);
                                        }
                                    }></DatePicker>
                                </LocalizationProvider>
                            </Box>
                            <Box sx={{ pb: 2, justifyContent: 'center', display: 'flex' }}>
                                <ButtonGroup size='small'>
                                    <Button onClick={() => { setSorting('rank'); navigate(`/score/page/${page}/date/${date}/sort/rank`) }} variant={sorting === 'rank' ? 'contained' : 'outlined'}>Rank</Button>
                                    <Button onClick={() => { setSorting('rank_gain'); navigate(`/score/page/${page}/date/${date}/sort/rank_gain`) }} variant={sorting === 'rank_gain' ? 'contained' : 'outlined'}>Gained ranks</Button>
                                    <Button onClick={() => { setSorting('score_gain'); navigate(`/score/page/${page}/date/${date}/sort/score_gain`) }} variant={sorting === 'score_gain' ? 'contained' : 'outlined'}>Gained score</Button>
                                </ButtonGroup>
                            </Box>
                            <Box>
                                <Box sx={{ pb: 2, justifyContent: 'center', display: 'flex' }}>
                                    <Pagination
                                        color="primary"
                                        boundaryCount={1}
                                        siblingCount={4}
                                        width='100%'
                                        disabled={isLoadingDates || isLoadingLeaderboard}
                                        page={page}
                                        onChange={(e, v) => {
                                            navigate(`/score/page/${v}/date/${date}/sort/${sorting}`);
                                            setPage(v);
                                        }
                                        } count={PAGES} />
                                </Box>
                            </Box>
                            <Box>
                                <Stack direction='column' spacing={1}>
                                    {
                                        leaderboard.map((item, index) => {
                                            const rank_diff = item.old_rank === null ? null : (item.rank - item.old_rank);
                                            const ranked_score_diff = item.old_ranked_score !== null ? (item.ranked_score - item.old_ranked_score) : 0;
                                            return (
                                                <PlayerLeaderboardItem
                                                    rankGain={rank_diff}
                                                    canBeNewEntry={isPreviousDayRecorded}
                                                    values={
                                                        [
                                                            {
                                                                value: '',
                                                                alignment: 'left'
                                                            },
                                                            {
                                                                value: (
                                                                    <span>
                                                                        {item.ranked_score.toLocaleString('en-US')}
                                                                        <span>
                                                                            <Typography color={
                                                                                (ranked_score_diff ?? 0) > 0 ? green[400] : grey[400]
                                                                            } variant="caption" display="block">
                                                                                +{(ranked_score_diff ?? 0).toLocaleString('en-US')}
                                                                            </Typography>
                                                                        </span>
                                                                    </span>
                                                                ),
                                                                alignment: 'left'
                                                            }
                                                        ]
                                                    }
                                                    user={item} />
                                            )
                                        })
                                    }
                                </Stack>
                            </Box>
                            {
                                scoreGraphData !== null ? (
                                    <Box sx={{
                                        height: 300,
                                        mr: 2
                                    }}>
                                        <ChartWrapper
                                            options={{
                                                chart: {
                                                    id: "score-lb-rankedscore",
                                                },
                                                yaxis: {
                                                    labels: {
                                                        formatter: (value) => {
                                                            return formatNumberAsSize(value);
                                                        }
                                                    }
                                                },
                                                xaxis: {
                                                    type: 'datetime',
                                                    labels: {
                                                        datetimeUTC: false,
                                                        format: 'MMM dd yyyy',
                                                    },
                                                },
                                                tooltip: {
                                                    x: {
                                                        format: 'MMM dd yyyy',
                                                    },
                                                    y: {
                                                        formatter: (value) => {
                                                            return value.toLocaleString('en-US');
                                                        }
                                                    }
                                                },
                                                dataLabels:{
                                                    enabled: false
                                                },
                                                markers: {
                                                    size: 2
                                                }
                                            }}
                                            series={[{ name: 'Total ranked score in top 10k', data: scoreGraphData, color: theme.palette.primary.main }]}
                                            type={'line'}
                                        />
                                    </Box>
                                ) : null
                            }
                        </Box>
                    </>
                )
            }
        </>
    );
}

export default LeadersScore;