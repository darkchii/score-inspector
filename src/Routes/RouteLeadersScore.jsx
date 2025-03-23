/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from "react";
import { useState } from "react";
import { useNavigate, useParams } from "react-router";
import Loader from "../Components/UI/Loader";
import axios from "axios";
import { GetAPI, formatNumber, formatNumberAsSize } from "../Helpers/Misc";
import { Alert, Box, Button, ButtonGroup, Pagination, Stack, Typography, useTheme } from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import moment from "moment";
import PlayerLeaderboardItem from "../Components/Leaderboards/PlayerLeaderboardItem";
import { green, grey } from "@mui/material/colors";
import ChartWrapper from "../Helpers/ChartWrapper";

const USERS_PER_PAGE = 50;
const MAX_TOTAL_USERS = 10000;
const PAGES = Math.ceil(MAX_TOTAL_USERS / USERS_PER_PAGE);

const VALID_SORTING = ['rank', 'rank_gain', 'score_gain'];

function RouteLeadersScore() {
    const theme = useTheme();
    const params = useParams();
    const navigate = useNavigate();

    const [mode, setMode] = useState(params.mode ? parseInt(params.mode) : 0);
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
                const data = await axios.get(`${GetAPI()}scores/ranking/stats?mode=${mode}`);

                // const _data = {
                //     labels: [],
                //     values: []
                // };
                const _data = [];
                data?.data?.daily_total_ranked_score?.forEach((item) => {
                    // _data.labels.push(moment(item.date, "YYYY-MM-DD"));
                    // _data.values.push(item.total_ranked_score);
                    if (!_data[0]) {
                        _data[0] = [];
                    }
                    _data[0].push([moment(item.date, "YYYY-MM-DD").toDate().getTime(), item.total_ranked_score]);
                });

                //also get difference between each data point
                for (let i = 1; i < _data[0].length; i++) {
                    if (!_data[1]) {
                        _data[1] = [];
                    }
                    const diff = _data[0][i][1] - _data[0][i - 1][1];
                    _data[1].push([_data[0][i][0], diff]);
                }
                setScoreGraphData(_data);
            } catch (err) {
                console.error(err);
            }
        })()
    }, [mode]);

    useEffect(() => {
        if (allDates.length === 0) {
            (async () => {
                setIsLoadingDates(true);
                let _allDates = [];
                try {
                    const data = await axios.get(`${GetAPI()}scores/ranking/dates?mode=${mode}`);
                    //order by date
                    data?.data.sort((a, b) => {
                        return moment(a).isBefore(moment(b)) ? -1 : 1;
                    });
                    _allDates = data?.data;
                    setAllDates(data?.data);
                } catch (err) {
                    console.error(err);
                } finally {
                    setIsLoadingDates(false);
                }

                if (date === null && _allDates.length > 0 && !params.date) {
                    setDate(_allDates[_allDates.length - 1]);
                }
            })();
        }
    }, [mode]);

    useEffect(() => {
        if (!date || !page) return;
        (async () => {
            setIsLoadingLeaderboard(true);
            try {
                const data = await axios.get(`${GetAPI()}scores/ranking?date=${date}&limit=${USERS_PER_PAGE}&page=${page}&sort=${sorting}&mode=${mode}`);
                //check if previous day is recorded (if any old_rank is NOT null, then it is recorded)
                let _isPreviousDayRecorded = data?.data?.filter((item) => { return item.old_rank !== null; }).length > 0;
                setIsPreviousDayRecorded(_isPreviousDayRecorded);
                setLeaderboard(data?.data);
            } catch (err) {
                console.error(err);
            } finally {
                setIsLoadingLeaderboard(false);
            }
        })();
    }, [mode, page, date, sorting]);

    useEffect(()=>{
        window.onTitleChange('Score Rank History');
    }, []);

    const disableDate = (date) => {
        const dateStr = moment(date).format("YYYY-MM-DD");
        return !allDates.includes(dateStr);
    };

    return (
        <>
            {
                isLoadingDates || isLoadingLeaderboard ? (
                    <Loader />
                ) : (
                    <>
                        <Box>
                            <Alert variant='outlined' severity="info">Tracking started on August 14 2023. Data before that does not exist. The difference indication is compared to the day before. (Non-standard modes started on June 17 2024)</Alert>
                            <Box sx={{ py: 2, justifyContent: 'center', display: 'flex' }}>
                                {/* mode buttons */}
                                <ButtonGroup size='small'>
                                    <Button onClick={() => { setMode(0); navigate(`/score/page/${page}/date/${date}/sort/${sorting}/mode/0`) }} variant={mode === 0 ? 'contained' : 'outlined'}>osu!</Button>
                                    <Button onClick={() => { setMode(1); navigate(`/score/page/${page}/date/${date}/sort/${sorting}/mode/1`) }} variant={mode === 1 ? 'contained' : 'outlined'}>Taiko</Button>
                                    <Button onClick={() => { setMode(2); navigate(`/score/page/${page}/date/${date}/sort/${sorting}/mode/2`) }} variant={mode === 2 ? 'contained' : 'outlined'}>Catch</Button>
                                    <Button onClick={() => { setMode(3); navigate(`/score/page/${page}/date/${date}/sort/${sorting}/mode/3`) }} variant={mode === 3 ? 'contained' : 'outlined'}>Mania</Button>
                                </ButtonGroup>
                            </Box>
                            <Box sx={{ py: 2, justifyContent: 'center', display: 'flex' }}>
                                <LocalizationProvider dateAdapter={AdapterMoment}>
                                    <DatePicker defaultValue={moment(date, "YYYY-MM-DD")} shouldDisableDate={
                                        (date) => disableDate(date)
                                    } onChange={
                                        (newDate) => {
                                            setDate(newDate.format("YYYY-MM-DD"));
                                            navigate(`/score/page/${page}/date/${newDate.format("YYYY-MM-DD")}/sort/${sorting}/mode/${mode}`);
                                        }
                                    }></DatePicker>
                                </LocalizationProvider>
                            </Box>
                            <Box sx={{ pb: 2, justifyContent: 'center', display: 'flex' }}>
                                <ButtonGroup size='small'>
                                    <Button onClick={() => { setSorting('rank'); navigate(`/score/page/${page}/date/${date}/sort/rank/mode/${mode}`) }} variant={sorting === 'rank' ? 'contained' : 'outlined'}>Rank</Button>
                                    <Button onClick={() => { setSorting('rank_gain'); navigate(`/score/page/${page}/date/${date}/sort/rank_gain/mode/${mode}`) }} variant={sorting === 'rank_gain' ? 'contained' : 'outlined'}>Gained ranks</Button>
                                    <Button onClick={() => { setSorting('score_gain'); navigate(`/score/page/${page}/date/${date}/sort/score_gain/mode/${mode}`) }} variant={sorting === 'score_gain' ? 'contained' : 'outlined'}>Gained score</Button>
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
                                                    key={index}
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
                                                                        {formatNumber(Number(item.ranked_score), 0)}
                                                                        <span>
                                                                            <Typography color={
                                                                                (ranked_score_diff ?? 0) > 0 ? green[400] : grey[400]
                                                                            } sx={{ fontSize: '0.8rem', lineHeight: '0.6rem' }} display="block">
                                                                                +{(ranked_score_diff ?? 0).toLocaleString('en-US')}
                                                                            </Typography>
                                                                        </span>
                                                                    </span>
                                                                ),
                                                                alignment: 'left'
                                                            }
                                                        ]
                                                    }
                                                    mode={mode}
                                                    user={item} />
                                            )
                                        })
                                    }
                                </Stack>
                            </Box>
                            {
                                scoreGraphData !== null ? (
                                    <>
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
                                                        title: 'Total ranked score in top 10k',
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
                                                    dataLabels: {
                                                        enabled: false
                                                    },
                                                    markers: {
                                                        size: 2
                                                    },
                                                }}
                                                series={[
                                                    { name: 'Total ranked score in top 10k', type: 'line', data: scoreGraphData[0], color: theme.palette.primary.main },
                                                ]}
                                            />
                                        </Box>
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
                                                        title: 'Gained ranked score',
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
                                                    dataLabels: {
                                                        enabled: false
                                                    },
                                                    markers: {
                                                        size: 2
                                                    },
                                                }}
                                                series={[
                                                    { name: 'Gained ranked score', type: 'column', data: scoreGraphData[1], color: theme.palette.primary.secondary },
                                                ]}
                                            />
                                        </Box>
                                    </>
                                ) : null
                            }
                        </Box>
                    </>
                )
            }
        </>
    );
}

export default RouteLeadersScore;