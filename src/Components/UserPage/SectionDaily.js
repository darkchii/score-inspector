/* eslint-disable react-hooks/exhaustive-deps */
import { Box, Button, ButtonGroup, Card, CardContent, Grid, Paper, Stack, Table, TableBody, TableCell, TableContainer, TableRow, Typography, useTheme, Tooltip as MUITooltip } from "@mui/material";
import moment from "moment";
import { useEffect, useState } from "react";
import { getGradeColor } from "../../Helpers/Osu";
import { getSessions } from "../../Helpers/Session";
import { IMG_SVG_GRADE_A, IMG_SVG_GRADE_B, IMG_SVG_GRADE_C, IMG_SVG_GRADE_D, IMG_SVG_GRADE_S, IMG_SVG_GRADE_SH, IMG_SVG_GRADE_X, IMG_SVG_GRADE_XH } from "../../Helpers/Assets";
import { lerpColor, nestedSearch } from "../../Helpers/Misc";
import { ErrorBoundary } from "react-error-boundary";
import ChartWrapper from "../../Helpers/ChartWrapper.js";

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

const GRADE_INFO = {
    'XH': { name: 'Silver SS', color: '#fff' },
    'X': { name: 'Gold SS', color: '#fff' },
    'SH': { name: 'Silver S', color: '#fff' },
    'S': { name: 'Gold S', color: '#fff' },
    'A': { name: 'A', color: '#fff' },
    'B': { name: 'B', color: '#fff' },
    'C': { name: 'C', color: '#fff' },
    'D': { name: 'D', color: '#fff' },
}

function SectionDaily(props) {
    const theme = useTheme();
    const MIN_DATE = moment(props.user.osu.join_date);
    const [MAX_DATE] = useState(moment());
    const [selectedYear, setSelectedYear] = useState(moment(MAX_DATE).startOf('year').year());
    const [selectedDay, setSelectedDay] = useState(MAX_DATE.endOf('day').format("YYYY-MM-DD"));
    const [isWorking, setWorkingState] = useState(false);
    const [scores, setScores] = useState(null);
    const [graphData, setGraphData] = useState(null);
    const [heightDefiner, setHeightDefiner] = useState(heightDefiners[0]);
    const [yearGraphData, setYearGraphData] = useState(null);
    const [themeColor] = useState(theme.typography.title.color);
    const [dynamicRange, setDynamicRange] = useState(100);

    const [sessionCount, setSessionCount] = useState(0);
    const [totalSessionLength, setTotalSessionLength] = useState(0);
    const [sessionAnnotations, setSessionAnnotations] = useState([]);

    const [stats, setStats] = useState(null);

    useEffect(() => {
        if (scores === null) {
            return;
        }
        const updateGraph = () => {
            let annotations = [];

            if (scores !== null) {
                setSessionAnnotations([]);
                setTotalSessionLength(0);
                setSessionCount(0);
                let activities = getSessions(scores);
                if (activities.length > 0) {
                    let len = 0;
                    activities.forEach((activity, index) => {
                        annotations.push({
                            type: 'box',
                            x: activity.start * 1000,
                            x2: activity.end * 1000,
                            fillColor: 'rgba(252, 3, 148, 0.25)',
                        })

                        len += (activity.end - activity.start);
                    });
                    setTotalSessionLength(len);
                }

                setSessionAnnotations(annotations);
                setSessionCount(activities.length);
            }

            const data_by_grade = {};

            if (scores !== null) {
                scores.forEach((score) => {
                    const grade = score.rank;

                    if (!data_by_grade[grade]) {
                        data_by_grade[grade] = {
                            name: GRADE_INFO[grade].name,
                            data: [],
                            color: getGradeColor(grade),
                            shape: (grade === "XH" || grade === "X") ? 'square' : 'circle',
                            size: 6,
                        };
                    }

                    data_by_grade[grade].data.push({
                        x: moment(score.date_played).unix() * 1000,
                        y: nestedSearch(score, heightDefiner.nesting),
                        score: score,
                    });
                });
            }

            //convert data_by_grade to array
            const data = data_by_grade ? Object.keys(data_by_grade).map((key) => { return data_by_grade[key] }) : [];
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

        setDynamicRange(Math.max(0, Math.min(100, highestClears)));

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
                        <Paper elevation={1} sx={{ pt: 1 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
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
                            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
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


                    <Grid sx={{
                        minHeight: '700px',
                    }}>
                        {(selectedDay && graphData && sessionAnnotations && sessionAnnotations.length > 0) && <Grid sx={{ mt: 1 }}>
                            <ErrorBoundary fallback={<div>Something went wrong</div>}>
                                <Grid sx={{
                                    position: 'relative',
                                    height: '400px',
                                }}>
                                    <Grid sx={{
                                        position: 'absolute',
                                        height: '400px',
                                        width: '100%',
                                    }}>
                                        <ChartWrapper
                                            options={{
                                                xaxis: {
                                                    type: 'datetime',
                                                    labels: {
                                                        datetimeUTC: false,
                                                        format: 'HH:mm',
                                                    },
                                                    min: moment(selectedDay, 'YYYY-MM-DD').startOf('day').unix() * 1000,
                                                    max: moment(selectedDay, 'YYYY-MM-DD').endOf('day').unix() * 1000,
                                                },
                                                tooltip: {
                                                    custom: function ({ series, seriesIndex, dataPointIndex, w }) {
                                                        var data = w.globals.initialSeries[seriesIndex].data[dataPointIndex];

                                                        return `<ul>
                                                                <li>${heightDefiner.label}: ${data.y.toLocaleString('en-US')}</li>
                                                                <li>${moment.unix(data.x).format("HH:mm")} • ${data.score.beatmap.artist} - ${data.score.beatmap.title} [${data.score.beatmap.diffname}] • ${data.score.accuracy}% ${data.score.rank} • ${data.score.score} score • ${data.score.pp.toFixed(2)}pp</li>
                                                            </ul>
                                                            `
                                                    }
                                                },
                                                dataLabels: {
                                                    enabled: false
                                                },
                                                markers: {
                                                    size: graphData.map((data) => { return data.size }),
                                                    shape: graphData.map((data) => { return data.shape }),
                                                },
                                                annotations: {
                                                    xaxis: [
                                                        {
                                                            x: moment(selectedDay, 'YYYY-MM-DD').startOf('day').unix() * 1000,
                                                            strokeDashArray: 0,
                                                            borderColor: '#775DD0',
                                                            label: {
                                                                style: {
                                                                    color: '#fff',
                                                                    background: '#775DD0',
                                                                },
                                                                text: 'Start of day',
                                                            }
                                                        },
                                                        {
                                                            x: moment(selectedDay, 'YYYY-MM-DD').endOf('day').unix() * 1000,
                                                            strokeDashArray: 0,
                                                            borderColor: '#775DD0',
                                                            label: {
                                                                style: {
                                                                    color: '#fff',
                                                                    background: '#775DD0',
                                                                },
                                                                text: 'End of day',
                                                            }
                                                        },
                                                        ...(sessionAnnotations ?? [])
                                                    ]
                                                }
                                            }}
                                            series={graphData}
                                            type={'scatter'}
                                        />
                                    </Grid>
                                </Grid>
                            </ErrorBoundary>
                            <Typography variant='caption'>The pink area designates sessions</Typography>
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
                    </Grid>
                </CardContent>
            </Card>
        </>
    );
}

export default SectionDaily;