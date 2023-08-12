/* eslint-disable react-hooks/exhaustive-deps */
import { Box, Button, ButtonGroup, Card, CardContent, Chip, chipClasses, Grid, Paper, Stack, Table, TableBody, TableCell, TableContainer, TableRow, Typography, useTheme, Tooltip as MUITooltip } from "@mui/material";
import moment from "moment";
import momentDurationFormatSetup from "moment-duration-format";
import { useEffect, useState } from "react";
import { getGradeColor, mods } from "../../Helpers/Osu";
import { getSessions } from "../../Helpers/Session";
import CircleIcon from '@mui/icons-material/Circle';
import SquareIcon from '@mui/icons-material/Square';
import { Scatter } from "react-chartjs-2";
import { IMG_SVG_GRADE_A, IMG_SVG_GRADE_B, IMG_SVG_GRADE_C, IMG_SVG_GRADE_D, IMG_SVG_GRADE_S, IMG_SVG_GRADE_SH, IMG_SVG_GRADE_X, IMG_SVG_GRADE_XH } from "../../Helpers/Assets";
import {
    Chart as ChartJS,
    LinearScale,
    PointElement,
    LineElement,
    Tooltip,
    Legend,
} from 'chart.js';
import Annotations from "chartjs-plugin-annotation";
import { lerpColor, nestedSearch } from "../../Helpers/Misc";
ChartJS.register(LinearScale, PointElement, LineElement, Tooltip, Legend, Annotations);
momentDurationFormatSetup(moment);

const heightDefiners = [
    { value: 'pp', nesting: ['pp'], label: 'Performance' },
    { value: 'score', nesting: ['score'], label: 'Score' },
    { value: 'acc', nesting: ['accuracy'], label: 'Accuracy' },
    { value: 'combo', nesting: ['combo'], label: 'Combo' },
    { value: 'length', nesting: ['beatmap', 'length'], label: 'Length' },
    { value: 'sr', nesting: ['beatmap', 'modded_sr', 'star_rating'], label: 'Stars' },
    { value: 'cs', nesting: ['beatmap', 'modded_sr', 'modded_cs'], label: 'CS' },
    { value: 'ar', nesting: ['beatmap', 'modded_sr', 'modded_ar'], label: 'AR' },
    { value: 'od', nesting: ['beatmap', 'modded_sr', 'modded_od'], label: 'OD' },
    { value: 'hp', nesting: ['beatmap', 'modded_sr', 'modded_hp'], label: 'HP' },
]

function SectionDaily(props) {
    const theme = useTheme();
    const MIN_DATE = moment(props.user.osu.join_date);
    const [MAX_DATE] = useState(moment());
    const [selectedYear, setSelectedYear] = useState(moment(MAX_DATE).startOf('year').year());
    const [selectedDay, setSelectedDay] = useState(MAX_DATE.endOf('day').format("YYYY-MM-DD"));
    const [isWorking, setWorkingState] = useState(false);
    const [scores, setScores] = useState(null);
    const [graphOptions, setGraphOptions] = useState(null);
    const [graphData, setGraphData] = useState(null);
    const [heightDefiner, setHeightDefiner] = useState(heightDefiners[0]);
    const [yearGraphData, setYearGraphData] = useState(null);
    const [themeColor] = useState(theme.typography.title.color);
    const [dynamicRange, setDynamicRange] = useState(100);

    const [sessionCount, setSessionCount] = useState(0);
    const [totalSessionLength, setTotalSessionLength] = useState(0);

    const [stats, setStats] = useState(null);

    useEffect(() => {
        if (scores === null) {
            return;
        }
        const updateGraph = () => {
            let annotations = {};

            if (scores !== null) {
                let activities = getSessions(scores);

                setTotalSessionLength(0);
                setSessionCount(0);
                if (activities.length > 0) {
                    let len = 0;
                    activities.forEach((activity, index) => {
                        annotations[`activity${index}`] = {
                            type: 'box',
                            xMin: activity.start,
                            xMax: activity.end,
                            backgroundColor: 'rgba(252, 3, 148, 0.25)',
                            z: -1000
                        }

                        len += (activity.end - activity.start);
                    });
                    setTotalSessionLength(len);
                }

                setSessionCount(activities.length);
            }

            annotations[`sectionStart`] = {
                type: 'box',
                xMin: moment(selectedDay, 'YYYY-MM-DD').startOf('day').unix(),
                xMax: moment(selectedDay, 'YYYY-MM-DD').startOf('day').unix(),
                backgroundColor: 'rgba(0, 0, 0, 0.25)',
                z: -1000
            }
            annotations[`sectionEnd`] = {
                type: 'box',
                xMin: moment(selectedDay, 'YYYY-MM-DD').endOf('day').unix(),
                xMax: moment(selectedDay, 'YYYY-MM-DD').endOf('day').unix(),
                backgroundColor: 'rgba(0, 0, 0, 0.25)',
                z: -1000
            }

            const options = {
                maintainAspectRatio: false,
                scales: {
                    x:
                    {
                        ticks: {
                            callback: function (value, index, values) {
                                return moment.unix(value).format("MMMM Do, YYYY HH:mm");
                            },
                        },
                        min: moment(selectedDay, 'YYYY-MM-DD').startOf('day').format("YYYY-MM-DD HH:mm:ss"),
                        max: moment(selectedDay, 'YYYY-MM-DD').endOf('day').format("YYYY-MM-DD HH:mm:ss")
                    }
                },
                plugins: {
                    legend: {
                        display: false,
                    },
                    tooltip: {
                        callbacks: {
                            label: function (context) {
                                return `${moment.unix(context.parsed.x).format("HH:mm")} • ${context.raw.score.beatmap.artist} - ${context.raw.score.beatmap.title} [${context.raw.score.beatmap.diffname}] • ${context.raw.score.accuracy}% ${context.raw.score.rank} • ${context.raw.score.score} score • ${context.raw.score.pp.toFixed(2)}pp`;
                            }
                        }
                    },
                    annotation: {
                        annotations: annotations
                    }
                },
            };
            setGraphOptions(options);

            const data = {
                datasets: [
                    {
                        label: "Scores",
                        data: scores !== null ? scores.map((score) => { return { x: moment(score.date_played).unix(), y: nestedSearch(score, heightDefiner.nesting), score: score } }) : [],
                        backgroundColor: scores !== null ? scores.map((score) => getGradeColor(score.rank)) : [],
                        pointRadius: 5,
                        pointStyle: scores !== null ? scores.map((score) => (((score.enabled_mods & mods.HD !== 0) || (score.enabled_mods & mods.FL) !== 0) ? 'rect' : 'circle')) : [],
                        datalabels: {
                            display: false
                        }
                    },
                    {
                        label: "hidden",
                        data: [{ x: moment(selectedDay, 'YYYY-MM-DD').startOf('day').unix(), y: 0 }, { x: moment(selectedDay, 'YYYY-MM-DD').endOf('day').unix(), y: 0 }],
                        backgroundColor: 'rgba(255, 99, 132, 1)',
                        pointRadius: 0,
                        datalabels: {
                            display: false
                        }
                    }
                ]
            };
            setGraphData(data);
        };
        updateGraph();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [scores, props.user.scores, heightDefiner]);

    useEffect(() => {
        if (isWorking) {
            return;
        }

        const handleDayChange = async (date) => {
            setWorkingState(true);
            setScores(null);
            const sorted = props.user.scores.filter(score => score.date_played_moment.isSame(date, 'day'));

            const _stats = {
                gained_score: 0,
                clears: 0,
                grade_ssh: 0,
                grade_ss: 0,
                grade_sh: 0,
                grade_s: 0,
                grade_a: 0,
                grade_b: 0,
                grade_c: 0,
                grade_d: 0,
                average_acc: 0,
                playtime: 0,
                average_sr: 0,
                average_length: 0,
                pp: 0,
                average_pp: 0
            }

            if (sorted.length > 0) {
                let acc = 0;
                let sr = 0;
                sorted.forEach(score => {
                    _stats.gained_score += score.score;
                    if (score.rank === 'XH') {
                        _stats.grade_ssh++;
                    } else if (score.rank === 'X') {
                        _stats.grade_ss++;
                    } else if (score.rank === 'SH') {
                        _stats.grade_sh++;
                    } else if (score.rank === 'S') {
                        _stats.grade_s++;
                    } else if (score.rank === 'A') {
                        _stats.grade_a++;
                    } else if (score.rank === 'B') {
                        _stats.grade_b++;
                    } else if (score.rank === 'C') {
                        _stats.grade_c++;
                    } else {
                        _stats.grade_d++;
                    }
                    _stats.clears++;
                    _stats.pp += score.pp ?? 0;
                    acc += score.accuracy;
                    sr += score.beatmap.modded_sr.star_rating;
                    _stats.playtime += score.beatmap.modded_length;
                });
                _stats.average_acc = acc / sorted.length;
                _stats.average_sr = sr / sorted.length;
                _stats.average_length = _stats.playtime / sorted.length;
                _stats.average_pp = _stats.pp / sorted.length;
            }

            setStats(_stats);

            setScores(sorted);
            setWorkingState(false);
        };
        handleDayChange(selectedDay);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedDay, MAX_DATE]);

    useEffect(() => {
        //loop from jan 1st to dec 31st
        let y = moment().year(selectedYear);
        const days = [];
        const scores_year = props.user.scores.filter(score => score.date_played_moment.isSame(y, 'year'));
        let highestClears = 0;
        for (let i = 0; i < 12; i++) {
            const m = y.month(i);
            const scores_month = scores_year.filter(score => score.date_played_moment.isSame(m, 'month'));
            let daysInMonth = y.month(i).daysInMonth();
            for (let j = 0; j < daysInMonth; j++) {
                //days.push(moment().year(year).dayOfYear(i + 1));
                let d = moment().year(selectedYear).month(i).date(j + 1);
                const scores_day = scores_month.filter(score => score.date_played_moment.isSame(d, 'day'));
                const obj = {
                    date: d.format('YYYY-MM-DD'),
                    clears: scores_day.length,
                }
                days.push(obj);
                if (scores_day.length > highestClears) {
                    highestClears = scores_day.length;
                }
            }
        }

        setDynamicRange(Math.max(0, highestClears));

        setYearGraphData(days);
    }, [selectedYear])

    const updateYear = async (y) => {
        const year = y.year();
        setSelectedYear(year);
    }

    return (
        <>
            <Card>
                <CardContent>
                    <Paper elevation={3} sx={{ p: 2 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                            <ButtonGroup size="small">
                                {
                                    //button for each year between min and max
                                    Array.from(Array(moment().year() - MIN_DATE.year() + 1).keys()).map((year) => {
                                        const y = MIN_DATE.year() + year;
                                        return <Button
                                            key={year}
                                            disabled={isWorking}
                                            variant={selectedYear === y ? "contained" : "outlined"}
                                            onClick={() => updateYear(moment().year(y))}>{y}</Button>
                                    }
                                    )
                                }
                            </ButtonGroup>
                        </Box>
                        <Box sx={{ pt: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                            <Grid className="graph">
                                <Grid className="months">
                                    <li>Jan</li>
                                    <li>Feb</li>
                                    <li>Mar</li>
                                    <li>Apr</li>
                                    <li>May</li>
                                    <li>Jun</li>
                                    <li>Jul</li>
                                    <li>Aug</li>
                                    <li>Sep</li>
                                    <li>Oct</li>
                                    <li>Nov</li>
                                    <li>Dec</li>
                                </Grid>
                                <Grid className="days">
                                    <li>Sun</li>
                                    <li>Mon</li>
                                    <li>Tue</li>
                                    <li>Wed</li>
                                    <li>Thu</li>
                                    <li>Fri</li>
                                    <li>Sat</li>
                                </Grid>
                                <Grid className="squares">
                                    {
                                        //add empty spots if first day is not sunday
                                        yearGraphData && Array.from(Array(moment(yearGraphData[0].date).day()).keys()).map((day) => {
                                            return <Box></Box>
                                        })
                                    }
                                    {
                                        yearGraphData && yearGraphData.map((day, index) => {
                                            const _clears = day.clears;
                                            //const _progress = Math.min(_clears, 100) / 100;
                                            const _progress = Math.min(1, (dynamicRange > 0 ? ((100 / dynamicRange * _clears) / 100) : 0));
                                            const _color = lerpColor('#3c3c3c', themeColor, _progress);

                                            return (
                                                <MUITooltip title={
                                                    <Typography variant="body2">
                                                        {`${day.date}: ${_clears} clears`}
                                                    </Typography>
                                                } placement='top' disableInteractive={true}>
                                                    <Box
                                                        onClick={() => { _clears > 0 && setSelectedDay(day.date); }}
                                                        sx={{
                                                            borderRadius: '3px',
                                                            height: '12px',
                                                            position: 'relative',
                                                            width: '12px',
                                                            backgroundColor: `${_color}`,
                                                            margin: '2px',
                                                            boxShadow: `0 0 5px 5px ${themeColor}${selectedDay === day.date ? '40' : '00'}`,
                                                            '&:hover': {
                                                                cursor: _clears > 0 ? 'pointer' : 'default',
                                                                opacity: 0.5
                                                            }
                                                        }}>

                                                    </Box>
                                                </MUITooltip>
                                            )
                                        })
                                    }
                                </Grid>
                            </Grid>
                        </Box>
                        <Paper elevation={1} sx={{ pt: 1}}>
                            <Box sx={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                                <Box
                                    sx={{
                                        borderRadius: '3px',
                                        height: '12px',
                                        position: 'relative',
                                        width: '12px',
                                        backgroundColor: '#3c3c3c',
                                        margin: '2px',
                                    }}></Box><Typography variant="body2">0 clears</Typography>
                                <Box sx={{ width: '30px' }}></Box>
                                <Box
                                    sx={{
                                        borderRadius: '3px',
                                        height: '12px',
                                        position: 'relative',
                                        width: '12px',
                                        backgroundColor: themeColor,
                                        margin: '2px',
                                    }}></Box><Typography variant="body2">{Math.min(dynamicRange, 100)}{dynamicRange > 100 ? '+' : ''} clear{dynamicRange > 0 ? 's' : ''}</Typography>
                            </Box>
                            <Box sx={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                                <Typography variant="body2">Currently viewing {selectedDay}</Typography>
                            </Box>
                        </Paper>
                    </Paper>

                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <Grid sx={{ my: 2 }}>
                            <ButtonGroup size='small'>
                                {heightDefiners.map((definer) => (
                                    <Button onClick={() => setHeightDefiner(definer)} variant={heightDefiner.value === definer.value ? 'contained' : 'outlined'}>
                                        {definer.label}
                                    </Button>
                                ))
                                }
                            </ButtonGroup>
                        </Grid>
                    </Box>


                    {graphOptions && <Grid sx={{ mt: 1 }}>
                        <Stack sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }} direction="row" spacing={2}>
                            <Chip icon={<SquareIcon />} sx={{ [`& .${chipClasses.icon}`]: { color: getGradeColor('X') } }} label="Silver SS" size="small" variant="outlined" />
                            <Chip icon={<CircleIcon />} sx={{ [`& .${chipClasses.icon}`]: { color: getGradeColor('X') } }} label="Gold SS" size="small" variant="outlined" />
                            <Chip icon={<SquareIcon />} sx={{ [`& .${chipClasses.icon}`]: { color: getGradeColor('S') } }} label="Silver S" size="small" variant="outlined" />
                            <Chip icon={<CircleIcon />} sx={{ [`& .${chipClasses.icon}`]: { color: getGradeColor('S') } }} label="Gold S" size="small" variant="outlined" />
                            <Chip icon={<CircleIcon />} sx={{ [`& .${chipClasses.icon}`]: { color: getGradeColor('A') } }} label="A" size="small" variant="outlined" />
                            <Chip icon={<CircleIcon />} sx={{ [`& .${chipClasses.icon}`]: { color: getGradeColor('B') } }} label="B" size="small" variant="outlined" />
                            <Chip icon={<CircleIcon />} sx={{ [`& .${chipClasses.icon}`]: { color: getGradeColor('C') } }} label="C" size="small" variant="outlined" />
                            <Chip icon={<CircleIcon />} sx={{ [`& .${chipClasses.icon}`]: { color: getGradeColor('D') } }} label="D" size="small" variant="outlined" />
                        </Stack>
                        <Grid sx={{ maxHeight: '400px' }}>
                            <Scatter height='400px' options={graphOptions} data={graphData} />
                        </Grid>
                        <Typography variant='caption'>The left and right lines indicate the start and end of the selected day (the chart plugin doesn't cap at those points)</Typography>
                        <Grid sx={{ mt: 1, pl: 2 }}>
                            <Stack direction="column" spacing={2}>
                                <Grid>
                                    {
                                        stats && <>
                                            <Stack direction="row" sx={{ justifyContent: 'center', alignItems: 'center' }}>
                                                <Grid sx={{ mr: 3, ml: 3 }}>
                                                    <img src={IMG_SVG_GRADE_XH} alt='XH' /> {stats.grade_ssh.toLocaleString('en-US')}
                                                </Grid>
                                                <Grid sx={{ mr: 3, ml: 3 }}>
                                                    <img src={IMG_SVG_GRADE_X} alt='X' /> {stats.grade_ss.toLocaleString('en-US')}
                                                </Grid>
                                                <Grid sx={{ mr: 3, ml: 3 }}>
                                                    <img src={IMG_SVG_GRADE_SH} alt='SH' /> {stats.grade_sh.toLocaleString('en-US')}
                                                </Grid>
                                                <Grid sx={{ mr: 3, ml: 3 }}>
                                                    <img src={IMG_SVG_GRADE_S} alt='S' /> {stats.grade_s.toLocaleString('en-US')}
                                                </Grid>
                                                <Grid sx={{ mr: 3, ml: 3 }}>
                                                    <img src={IMG_SVG_GRADE_A} alt='A' /> {stats.grade_a.toLocaleString('en-US')}
                                                </Grid>
                                                <Grid sx={{ mr: 3, ml: 3 }}>
                                                    <img src={IMG_SVG_GRADE_B} alt='B' /> {stats.grade_b.toLocaleString('en-US')}
                                                </Grid>
                                                <Grid sx={{ mr: 3, ml: 3 }}>
                                                    <img src={IMG_SVG_GRADE_C} alt='C' /> {stats.grade_c.toLocaleString('en-US')}
                                                </Grid>
                                                <Grid sx={{ mr: 3, ml: 3 }}>
                                                    <img src={IMG_SVG_GRADE_D} alt='D' /> {stats.grade_d.toLocaleString('en-US')}
                                                </Grid>
                                            </Stack>
                                        </>
                                    }
                                </Grid>
                                <Grid container>
                                    <Grid item xs={0} md={2}></Grid>
                                    <Grid item xs={12} md={4}>
                                        <Paper sx={{ p: 1, m: 1 }} elevation={3}>
                                            {
                                                stats && <>
                                                    <TableContainer>
                                                        <Table size="small">
                                                            <TableBody>
                                                                <TableRow>
                                                                    <TableCell sx={{ width: '50%' }}>Score gained</TableCell>
                                                                    <TableCell sx={{ width: '50%' }}>{stats.gained_score.toLocaleString('en-US')}</TableCell>
                                                                </TableRow>
                                                                <TableRow>
                                                                    <TableCell sx={{ width: '50%' }}>Clears gained</TableCell>
                                                                    <TableCell sx={{ width: '50%' }}>{stats.clears.toLocaleString('en-US')}</TableCell>
                                                                </TableRow>
                                                                <TableRow>
                                                                    <TableCell sx={{ width: '50%' }}>Total PP gained</TableCell>
                                                                    <TableCell sx={{ width: '50%' }}>{Math.round(stats.pp).toLocaleString('en-US')}pp</TableCell>
                                                                </TableRow>
                                                                <TableRow>
                                                                    <TableCell sx={{ width: '50%' }}>Playtime</TableCell>
                                                                    <TableCell sx={{ width: '50%' }}>{`${moment.duration(stats.playtime, 'seconds').format()}`}</TableCell>
                                                                </TableRow>
                                                                <TableRow>
                                                                    <TableCell sx={{ width: '50%' }}>Sessions</TableCell>
                                                                    <TableCell sx={{ width: '50%' }}>{`${sessionCount.toLocaleString('en-US')}`}</TableCell>
                                                                </TableRow>
                                                                <TableRow>
                                                                    <TableCell sx={{ width: '50%' }}>Total session</TableCell>
                                                                    <TableCell sx={{ width: '50%' }}>{`${moment.duration(totalSessionLength, 'seconds').format()}`}</TableCell>
                                                                </TableRow>
                                                            </TableBody>
                                                        </Table>
                                                    </TableContainer>
                                                </>
                                            }
                                        </Paper>
                                    </Grid>
                                    <Grid item xs={12} md={4}>
                                        <Paper sx={{ p: 1, m: 1 }} elevation={3}>
                                            {
                                                stats && <>
                                                    <TableContainer>
                                                        <Table size="small">
                                                            <TableBody>
                                                                <TableRow>
                                                                    <TableCell sx={{ width: '50%' }}>Average score</TableCell>
                                                                    <TableCell sx={{ width: '50%' }}>{Math.round(stats.clears > 0 ? (stats.gained_score / stats.clears) : 0).toLocaleString('en-US')}</TableCell>
                                                                </TableRow>
                                                                <TableRow>
                                                                    <TableCell sx={{ width: '50%' }}>Average stars</TableCell>
                                                                    <TableCell sx={{ width: '50%' }}>{stats.average_sr.toLocaleString('en-US')}*</TableCell>
                                                                </TableRow>
                                                                <TableRow>
                                                                    <TableCell sx={{ width: '50%' }}>Average PP</TableCell>
                                                                    <TableCell sx={{ width: '50%' }}>{stats.average_pp.toLocaleString('en-US')}pp</TableCell>
                                                                </TableRow>
                                                                <TableRow>
                                                                    <TableCell sx={{ width: '50%' }}>Average accuracy</TableCell>
                                                                    <TableCell sx={{ width: '50%' }}>{stats.average_acc.toLocaleString('en-US')}%</TableCell>
                                                                </TableRow>
                                                                <TableRow>
                                                                    <TableCell sx={{ width: '50%' }}>Average length</TableCell>
                                                                    <TableCell sx={{ width: '50%' }}>{`${moment.duration(stats.average_length, 'seconds').format()}`}</TableCell>
                                                                </TableRow>
                                                                <TableRow>
                                                                    <TableCell sx={{ width: '50%' }}>Average session</TableCell>
                                                                    <TableCell sx={{ width: '50%' }}>{`${moment.duration(totalSessionLength / sessionCount, 'seconds').format()}`}</TableCell>
                                                                </TableRow>
                                                            </TableBody>
                                                        </Table>
                                                    </TableContainer>
                                                </>
                                            }
                                        </Paper>
                                    </Grid>
                                    <Grid item xs={0} md={2}></Grid>
                                </Grid>
                            </Stack>
                        </Grid>
                    </Grid>}
                </CardContent>
            </Card>
        </>
    );
}

export default SectionDaily;