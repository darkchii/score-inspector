/* eslint-disable react-hooks/exhaustive-deps */
import { Box, Button, Container, Divider, TextField, Typography, Grid2, Alert, TableContainer, Table, TableHead, TableRow, TableCell, TableBody } from "@mui/material";
import { useEffect } from "react";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { showNotification } from "../Helpers/Misc";
import { getFullUser } from "../Helpers/Osu";
import { GetFormattedName } from "../Helpers/Account";
import moment from "moment";
import ChartWrapper from "../Helpers/ChartWrapper";
import _ from "lodash";
import { green, grey, red } from "@mui/material/colors";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import HorizontalRuleIcon from '@mui/icons-material/HorizontalRule';

const GRAPH_COLORS = [
    '#FF4560',
    '#775DD0',
    '#FFFFFF44',
]

const GRAPHED_DATA = [
    // 'pp',
    // 'rank',
    // 'ranked_score',
    // 'total_score',
    {
        name: 'pp',
        display_name: 'Performance',
        formatter: (value) => {
            if (!value && value !== 0) return '-pp';
            let _v = Math.round(value * 100) / 100;
            return _v.toLocaleString() + 'pp';
        }
    },
    {
        name: 'rank',
        display_name: 'Rank',
        formatter: (value) => {
            if (!value && value !== 0) return '-rank';
            return value.toLocaleString();
        }
    },
    {
        name: 'ranked_score',
        display_name: 'Ranked Score',
        formatter: (value) => {
            if (!value && value !== 0) return '-score';
            return value.toLocaleString();
        }
    },
    {
        name: 'total_score',
        display_name: 'Total Score',
        formatter: (value) => {
            if (!value && value !== 0) return '-score';
            return value.toLocaleString();
        }
    }
]

const TABLED_DATA = [
    {
        name: 'pp',
        display_name: 'Performance',
        nested_array_pointer: 'osu.statistics_rulesets.osu',
        formatter: (value) => {
            let _v = Math.round(value * 100) / 100;
            return _v.toLocaleString() + 'pp';
        },
    }, {
        name: 'total_pp',
        display_name: 'Total Performance',
        nested_array_pointer: 'alt',
        formatter: (value) => {
            let _v = Math.round(value * 100) / 100;
            return _v.toLocaleString() + 'pp';
        },
    },
    {
        name: 'global_rank',
        display_name: 'Rank',
        nested_array_pointer: 'osu.statistics_rulesets.osu',
        formatter: (value) => {
            return '#' + value.toLocaleString();
        },
        lower_better: true
    },
    {
        name: 'hit_accuracy',
        display_name: 'Accuracy',
        nested_array_pointer: 'osu.statistics_rulesets.osu',
        formatter: (value) => {
            let _v = Math.round(value * 100) / 100;
            return _v.toLocaleString() + '%';
        },
    },
    {
        name: 'ranked_score',
        display_name: 'Ranked Score',
        nested_array_pointer: 'osu.statistics_rulesets.osu',
        formatter: (value) => {
            return value.toLocaleString();
        },
    },
    {
        name: 'total_score',
        display_name: 'Total Score',
        nested_array_pointer: 'osu.statistics_rulesets.osu',
        formatter: (value) => {
            return value.toLocaleString();
        }
    },
    {
        name: 'level',
        display_name: 'Level',
        nested_array_pointer: 'alt',
        formatter: (value) => {
            return value.toLocaleString();
        }
    },
    {
        name: 'play_count',
        display_name: 'Playcount',
        nested_array_pointer: 'osu.statistics_rulesets.osu',
        formatter: (value) => {
            return value.toLocaleString();
        }
    },
    {
        name: 'play_time',
        display_name: 'Playtime',
        nested_array_pointer: 'osu.statistics_rulesets.osu',
        formatter: (value) => {
            return Math.floor(moment.duration(value, 'seconds').asHours()) + ' hours';
        }
    },
    {
        name: 'total_hits',
        display_name: 'Total Hits',
        nested_array_pointer: 'osu.statistics_rulesets.osu',
        formatter: (value) => {
            return value.toLocaleString();
        }
    },
    {
        name: 'maximum_combo',
        display_name: 'Max Combo',
        nested_array_pointer: 'osu.statistics_rulesets.osu',
        formatter: (value) => {
            return value.toLocaleString() + 'x';
        }
    },
    {
        name: 'badges',
        display_name: 'Badges',
        nested_array_pointer: 'alt',
        formatter: (value) => {
            return value.toLocaleString();
        }
    },
    {
        name: 'medals',
        display_name: 'Medals',
        nested_array_pointer: 'alt',
        formatter: (value) => {
            return value.toLocaleString();
        }
    },
    {
        name: 'ssh',
        display_name: 'Silver SS Ranks',
        nested_array_pointer: 'osu.statistics_rulesets.osu.grade_counts',
        formatter: (value) => {
            return value.toLocaleString();
        }
    },
    {
        name: 'ss',
        display_name: 'Gold SS Ranks',
        nested_array_pointer: 'osu.statistics_rulesets.osu.grade_counts',
        formatter: (value) => {
            return value.toLocaleString();
        }
    },
    {
        name: 'sh',
        display_name: 'Silver S Ranks',
        nested_array_pointer: 'osu.statistics_rulesets.osu.grade_counts',
        formatter: (value) => {
            return value.toLocaleString();
        }
    },
    {
        name: 's',
        display_name: 'Gold S Ranks',
        nested_array_pointer: 'osu.statistics_rulesets.osu.grade_counts',
        formatter: (value) => {
            return value.toLocaleString();
        }
    },
    {
        name: 'a',
        display_name: 'A Ranks',
        nested_array_pointer: 'osu.statistics_rulesets.osu.grade_counts',
        formatter: (value) => {
            return value.toLocaleString();
        }
    },
    {
        name: 'b_count',
        display_name: 'B Ranks',
        nested_array_pointer: 'alt',
        formatter: (value) => {
            return value.toLocaleString();
        }
    },
    {
        name: 'c_count',
        display_name: 'C Ranks',
        nested_array_pointer: 'alt',
        formatter: (value) => {
            return value.toLocaleString();
        }
    },
    {
        name: 'd_count',
        display_name: 'D Ranks',
        nested_array_pointer: 'alt',
        formatter: (value) => {
            return value.toLocaleString();
        }
    }
]

const processData = (user_a, user_b) => {
    const _a_daily = user_a.daily.modes[0].lines;
    const _b_daily = user_b.daily.modes[0].lines;

    const _proc_daily = (line) => {
        return {
            date: moment(line.date, 'YYYY-MM-DD'),
            date_str: line.date,
            pp: line.pp,
            rank: line.rankworld,
            ranked_score: line.rankedscore,
            total_score: line.totalscore,
            playcount: line.playcount,
            total_ss: line.SS,
            total_s: line.S,
            total_a: line.A,
        }
    }

    const _a_daily_proc = _a_daily.map((line) => { return _proc_daily(line); });
    const _b_daily_proc = _b_daily.map((line) => { return _proc_daily(line); });

    const _start_date = moment.min(_a_daily_proc[_a_daily_proc.length - 1].date, _b_daily_proc[_b_daily_proc.length - 1].date);
    const _end_date = moment.max(_a_daily_proc[0].date, _b_daily_proc[0].date);

    const paired_data = [];

    //for every day between start and end date
    //find the data for both users for that day and pair them
    //makes it easier to graph
    let _current_date = _start_date;
    while (_current_date.isBefore(_end_date)) {
        let _a = _a_daily_proc.find((line) => line.date_str === _current_date.format('YYYY-MM-DD'));
        let _b = _b_daily_proc.find((line) => line.date_str === _current_date.format('YYYY-MM-DD'));

        paired_data.push({
            date: moment(_current_date),
            a: _a ? _a : null,
            b: _b ? _b : null,
        });

        _current_date.add(1, 'days');
    }

    const _graph_data = [];

    GRAPHED_DATA.forEach((data_type) => {
        const _data = getGraphData(paired_data, data_type.name, user_a, user_b);
        _graph_data.push(_data);
    });

    return _graph_data;
}

const getGraphData = (paired_data, data_type, user_a, user_b) => {
    let series = [];

    paired_data.forEach((pair) => {
        let _a = pair.a?.[data_type] ? pair.a[data_type] : null;
        let _b = pair.b?.[data_type] ? pair.b[data_type] : null;

        if (!series[0]) {
            series[0] = {
                name: user_a.osu.username,
                data: [],
                color: GRAPH_COLORS[0],
            }
        }

        if (!series[1]) {
            series[1] = {
                name: user_b.osu.username,
                data: [],
                color: GRAPH_COLORS[1]
            }
        }

        if (!series[2]) {
            series[2] = {
                name: 'Difference',
                data: [],
                color: GRAPH_COLORS[2],
            }
        }

        series[0].data.push([pair.date.format('YYYY-MM-DD'), _a]);
        series[1].data.push([pair.date.format('YYYY-MM-DD'), _b]);

        if (_a && _b) {
            series[2].data.push([pair.date.format('YYYY-MM-DD'), Math.abs(_a - _b)]);
        } else {
            series[2].data.push([pair.date.format('YYYY-MM-DD'), null]);
        }
    });

    return series;
}

function ComparePlayers() {
    const params = useParams();
    const [user_data, setUserData] = useState(null);
    const [processedData, setProcessedData] = useState(null);
    const [user_pairs, setUserPairs] = useState((params.user_a && params.user_b) ? { user_a: params.user_a, user_b: params.user_b } : null);
    const [isWorking, setIsWorking] = useState(false);

    const onRequestCompare = (user_a, user_b) => {
        setUserPairs({ user_a: user_a, user_b: user_b });

        //update url
        window.history.pushState({}, '', `/player_compare/${user_a}/${user_b}`);
    }

    useEffect(() => {
        if (!user_pairs) return;
        executeCompare();
    }, [user_pairs]);

    const executeCompare = async () => {
        if (isWorking) {
            showNotification('Error', 'Something is already processing', 'error');
            return;
        }
        if (!user_pairs.user_a || !user_pairs.user_b) {
            showNotification('Error', 'Missing parameters', 'error');
            return;
        }

        if (user_pairs.user_a === user_pairs.user_b) {
            showNotification('Error', 'Cannot compare the same user', 'error');
            return;
        }

        if (user_pairs.user_a.length > 15 || user_pairs.user_b.length > 15) {
            showNotification('Error', 'Usernames are too long', 'error');
            return;
        }

        setIsWorking(true);
        setProcessedData(null);
        setUserData(null);
        (async () => {
            try {
                const _users = await getFullUser([user_pairs.user_a, user_pairs.user_b], undefined, undefined, undefined, true);
                if (!_users || !Array.isArray(_users) || _users.length !== 2) {
                    showNotification('Error', 'Failed to get user data', 'error');
                    setIsWorking(false);
                    return;
                }

                console.log(_users);

                if (_users[0].daily &&
                    _users[0].daily.modes[0]?.lines?.length > 0 &&
                    _users[1].daily &&
                    _users[1].daily.modes[0]?.lines?.length > 0) {
                    const data = processData(_users[0], _users[1]);
                    setProcessedData(data);
                }

                setUserData(_users);
                setIsWorking(false);
            } catch (err) {
                console.error(err);
                showNotification('Error', 'Something went wrong', 'error');
                showNotification('Error', err.message, 'error');
                setIsWorking(false);
            }
        })();
    }

    return (
        <>
            <Box>
                <Typography variant="title">Compare Players</Typography>
                <Container>
                    <ComparePlayersInput disabled={isWorking} preInput={user_pairs} onRequestCompare={onRequestCompare} />
                </Container>
                {
                    user_data && user_pairs && !isWorking ?
                        <>
                            <Divider sx={{ mt: 2, mb: 2 }} />
                            <Box sx={{
                                display: 'flex',
                                gap: 1,
                            }}>
                                {/* <p>Comparing {user_data[0].osu.username} and {user_data[1].osu.username}</p> */}
                                Comparing {GetFormattedName(user_data[0].inspector_user)} and {GetFormattedName(user_data[1].inspector_user)}
                            </Box>
                            <Divider sx={{ mt: 2, mb: 2 }} />
                            <Grid2 container>
                                <Grid2 size={{ xs: 12, md: 6 }} sx={{
                                    pr: 1
                                }}>
                                    <Alert severity="info" sx={{ mb: 2 }}>Data taken from osu!daily API</Alert>
                                    {
                                        processedData !== null ? GRAPHED_DATA.map((data_type, i) => {
                                            return (
                                                <Grid2>
                                                    <Typography variant="h6">{data_type.display_name}</Typography>
                                                    <Grid2 sx={{
                                                        height: 250,
                                                    }}>
                                                        <ChartWrapper
                                                            options={{
                                                                chart: {
                                                                    id: `chart-${data_type.name}`,
                                                                    animations: {
                                                                        enabled: false
                                                                    },
                                                                    zoom: {
                                                                        enabled: false
                                                                    },
                                                                },
                                                                markers: {
                                                                    size: 0,
                                                                    showNullDataPoints: false,
                                                                },
                                                                dataLabels: {
                                                                    enabled: false
                                                                },
                                                                xaxis: {
                                                                    type: 'datetime',
                                                                    labels: {
                                                                        datetimeUTC: false,
                                                                        format: 'yyyy-MM-dd'
                                                                    },
                                                                },
                                                                yaxis: [
                                                                    {
                                                                        //get them from processedData, first 2 names
                                                                        seriesName: [processedData[i][0].name, processedData[i][1].name],
                                                                        labels: {
                                                                            formatter: (value) => {
                                                                                return data_type.formatter ? data_type.formatter(value) : value.toLocaleString();
                                                                            }
                                                                        },
                                                                        title: {
                                                                            text: data_type.display_name
                                                                        },
                                                                    },
                                                                    {
                                                                        seriesName: 'Difference',
                                                                        opposite: true,
                                                                        labels: {
                                                                            formatter: (value) => {
                                                                                return data_type.formatter ? data_type.formatter(value) : value.toLocaleString();
                                                                            }
                                                                        },
                                                                        title: {
                                                                            text: 'Difference'
                                                                        },
                                                                    }
                                                                ],
                                                            }}
                                                            series={processedData[i]}
                                                            type={'line'}
                                                        />
                                                    </Grid2>
                                                </Grid2>
                                            )
                                        }) : <>
                                            <Typography variant="h6">Had problems fetching data from osu!daily api.</Typography>
                                        </>
                                    }
                                </Grid2>
                                <Grid2 size={{ xs: 12, md: 6 }}>
                                    <TableContainer>
                                        <Table size='small'>
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell>Statistic</TableCell>
                                                    <TableCell sx={{
                                                        //align right
                                                        textAlign: 'right'
                                                    }}>{GetFormattedName(user_data[0].inspector_user)}</TableCell>
                                                    <TableCell></TableCell>
                                                    <TableCell sx={{
                                                        //align right
                                                        textAlign: 'center'
                                                    }}>Difference</TableCell>
                                                    <TableCell></TableCell>
                                                    <TableCell>{GetFormattedName(user_data[1].inspector_user)}</TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {
                                                    TABLED_DATA.map((data_type, i) => {
                                                        // const stat_a = user_data[0].osu[data_type.nested_array_pointer][data_type.name];
                                                        // const stat_b = user_data[1].osu[data_type.nested_array_pointer][data_type.name];

                                                        const stat_a = _.get(user_data[0], data_type.nested_array_pointer + '.' + data_type.name);
                                                        const stat_b = _.get(user_data[1], data_type.nested_array_pointer + '.' + data_type.name);
                                                        const diff = stat_a - stat_b;

                                                        let is_a_better = false;
                                                        if (stat_a > stat_b) {
                                                            is_a_better = true;
                                                        }

                                                        if (data_type.lower_better) {
                                                            is_a_better = !is_a_better;
                                                        }

                                                        return (
                                                            <TableRow>
                                                                <TableCell>{data_type.display_name}</TableCell>
                                                                <TableCell sx={{
                                                                    //align right
                                                                    textAlign: 'right'
                                                                }}>{data_type.formatter(stat_a)}</TableCell>
                                                                <TableCell sx={{
                                                                    //align right
                                                                    textAlign: 'right'
                                                                }}>{
                                                                        diff === 0 ?
                                                                            <HorizontalRuleIcon style={{ color: grey[500] }} />
                                                                            : (
                                                                                is_a_better ?
                                                                                    <ExpandLessIcon style={{ color: green[500] }} />
                                                                                    :
                                                                                    <ExpandMoreIcon style={{ color: red[500] }} />
                                                                            )
                                                                    }</TableCell>
                                                                <TableCell sx={{
                                                                    //center
                                                                    textAlign: 'center'
                                                                }}>{data_type.formatter(Math.abs(diff))}</TableCell>
                                                                <TableCell>
                                                                    {
                                                                        diff === 0 ?
                                                                            <HorizontalRuleIcon style={{ color: grey[500] }} />
                                                                            : (
                                                                                !is_a_better ?
                                                                                    <ExpandLessIcon style={{ color: green[500] }} />
                                                                                    :
                                                                                    <ExpandMoreIcon style={{ color: red[500] }} />
                                                                            )
                                                                    }
                                                                </TableCell>
                                                                <TableCell>{data_type.formatter(stat_b)}</TableCell>
                                                            </TableRow>
                                                        )
                                                    })
                                                }
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                </Grid2>
                            </Grid2>
                        </>
                        :
                        <>
                            <p>Enter two usernames to compare their performance</p>
                        </>
                }
            </Box >
        </>
    )
}

function ComparePlayersInput(props) {
    const [user_a, setUserA] = useState(props.preInput ? props.preInput.user_a : '');
    const [user_b, setUserB] = useState(props.preInput ? props.preInput.user_b : '');

    const onCompare = () => {
        props.onRequestCompare(user_a, user_b);
    }

    return (
        <>
            {/* use MUI elements */}
            <Box
                component="form" sx={{
                    '& > :not(style)': { m: 1, width: '25ch' },
                }}
                onSubmit={(e) => {
                    e.preventDefault();
                    onCompare();
                }}
            >
                <TextField
                    id="user_a"
                    label="User A"
                    variant="standard"
                    size="small"
                    disabled={props.disabled}
                    inputProps={{ maxLength: 15 }}
                    value={user_a}
                    onChange={(e) => setUserA(e.target.value)}
                />
                <TextField
                    id="user_b"
                    label="User B"
                    variant="standard"
                    size="small"
                    disabled={props.disabled}
                    inputProps={{ maxLength: 15 }}
                    value={user_b}
                    onChange={(e) => setUserB(e.target.value)}
                />
                <Button
                    variant="contained"
                    disabled={props.disabled}
                    onClick={onCompare}
                    type="submit"
                >
                    Compare
                </Button>
            </Box>
        </>
    )
}

export default ComparePlayers;