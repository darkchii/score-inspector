/* eslint-disable react-hooks/exhaustive-deps */
import { Box, Button, ButtonGroup, Card, CardContent, Grid2, Paper, Stack, Table, TableBody, TableCell, TableContainer, TableRow, Typography, useTheme, Tooltip as MUITooltip, Alert } from "@mui/material";
import moment from "moment";
import { useEffect, useState } from "react";
import { GRADE_ORDER, getGradeColor } from "../../Helpers/Osu";
import { getSessions } from "../../Helpers/Session";
import { IMG_SVG_GRADE_A, IMG_SVG_GRADE_B, IMG_SVG_GRADE_C, IMG_SVG_GRADE_D, IMG_SVG_GRADE_S, IMG_SVG_GRADE_SH, IMG_SVG_GRADE_X, IMG_SVG_GRADE_XH } from "../../Helpers/Assets";
import { lerpColor, nestedSearch, showNotification } from "../../Helpers/Misc";
import { ErrorBoundary } from "react-error-boundary";
import ChartWrapper from "../../Helpers/ChartWrapper.js";
import useLongPress from "../../Helpers/useLongPress.js";

const MAX_DAYS_RANGE = 31;

const heightDefiners = [
    { value: 'pp', nesting: ['pp'], label: 'Performance', yFormat: (y) => y.toFixed(2) + 'pp' },
    { value: 'score', nesting: ['score'], label: 'Score', yFormat: (y) => y.toLocaleString('en-US') },
    { value: 'acc', nesting: ['accuracy'], label: 'Accuracy', yFormat: (y) => y.toFixed(2) + '%' },
    { value: 'combo', nesting: ['combo'], label: 'Combo', yFormat: (y) => y.toLocaleString('en-US') + 'x' },
    { value: 'length', nesting: ['beatmap', 'length'], label: 'Length', yFormat: (y) => moment.utc(y * 1000).format('mm:ss') },
    { value: 'sr', nesting: ['beatmap', 'modded_sr', 'star_rating'], label: 'Stars', yFormat: (y) => y.toFixed(2) + '★' },
    { value: 'cs', nesting: ['beatmap', 'modded_sr', 'modded_cs'], label: 'CS', yFormat: (y) => y.toFixed(2) },
    { value: 'ar', nesting: ['beatmap', 'modded_sr', 'modded_ar'], label: 'AR', yFormat: (y) => y.toFixed(2) },
    { value: 'od', nesting: ['beatmap', 'modded_sr', 'modded_od'], label: 'OD', yFormat: (y) => y.toFixed(2) },
    { value: 'hp', nesting: ['beatmap', 'modded_sr', 'modded_hp'], label: 'HP', yFormat: (y) => y.toFixed(2) },
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
    const MIN_DATE = moment.utc(moment(props.user.osu.join_date));
    const [MAX_DATE] = useState(moment());
    const [selectedYear, setSelectedYear] = useState(moment.utc(MAX_DATE).startOf('year').year());
    const [selectedDayRange, setSelectedDayRange] = useState([MAX_DATE.endOf('day').format("YYYY-MM-DD"), null]);
    const [isWorking, setWorkingState] = useState(false);
    const [scores, setScores] = useState(null);
    const [graphData, setGraphData] = useState(null);
    const [heightDefiner, setHeightDefiner] = useState(heightDefiners[2]);
    const [yearGraphData, setYearGraphData] = useState(null);
    const [themeColor] = useState(theme.typography.title.color);
    const [dynamicRange, setDynamicRange] = useState(100);
    const [sessionCount, setSessionCount] = useState(0);
    const [totalSessionLength, setTotalSessionLength] = useState(0);
    const [sessionAnnotations, setSessionAnnotations] = useState([]);
    const [stats, setStats] = useState(null);

    const dateRangePressHoldEvent = useLongPress((e) => {
        if (selectedDayRange[1]) {
            showNotification('Warning', 'Please click the tick to reset it before setting a new range', 'warning');
            return;
        }

        if (e.target.dataset.clears === '0') {
            showNotification('Warning', 'No clears on this day.', 'warning');
            return;
        }

        //if range becomes greater than 7 days, show a warning and do nothing
        const daysDiff = Math.abs(moment.utc(e.target.dataset.date).diff(moment.utc(selectedDayRange[0]), 'days'));
        if (selectedDayRange[1] && daysDiff > MAX_DAYS_RANGE) {
            showNotification('Warning', `Cannot set a range greater than ${MAX_DAYS_RANGE} days.`, 'warning');
            return;
        }

        if (moment.utc(e.target.dataset.date).isBefore(moment.utc(selectedDayRange[0]))) {
            setSelectedDayRange([e.target.dataset.date, selectedDayRange[0]]);
        } else if (moment.utc(e.target.dataset.date).isAfter(moment.utc(selectedDayRange[0]))) {
            setSelectedDayRange([selectedDayRange[0], e.target.dataset.date]);
        } else if (moment.utc(e.target.dataset.date).isSame(moment.utc(selectedDayRange[0]))) {
            showNotification('Warning', 'Cannot set a range on the same day.', 'warning');
            return;
        }
    }, (e) => {
        if (e.target.dataset.clears === '0') {
            showNotification('Warning', 'No clears on this day.', 'warning');
            return;
        }

        setSelectedDayRange([e.target.dataset.date, null]);
    }, { delay: 1000 });


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
                let activities = getSessions(scores, true);
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

                        //breaks
                        if (activity.breaks.length > 0) {
                            activity.breaks.forEach((brk) => {
                                annotations.push({
                                    type: 'box',
                                    x: brk.start * 1000,
                                    x2: brk.end * 1000,
                                    fillColor: 'rgba(255, 255, 255, 0.25)',
                                })
                            })
                        }
                    });

                    setTotalSessionLength(len);
                }

                setSessionAnnotations(annotations);
                setSessionCount(activities.length);
            }

            const data_by_grade = {};

            if (scores !== null) {
                scores.sort((a, b) => GRADE_ORDER.indexOf(a.rank) - GRADE_ORDER.indexOf(b.rank));

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
                        x: moment.utc(score.date_played_moment).valueOf(),
                        //return seconds since start, but in local time
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

        const handleDayChange = async () => {
            setWorkingState(true);
            setScores(null);
            // const sorted = props.user.scores.filter(score => moment.utc(score.date_played_moment).isSame(moment.utc(date), 'day'));
            const sorted = props.user.scores.filter(score =>
                moment.utc(score.date_played_moment).isSame(moment.utc(selectedDayRange[0]), 'day') ||
                (selectedDayRange[1] && moment.utc(score.date_played_moment).isBetween(moment.utc(selectedDayRange[0]), moment.utc(selectedDayRange[1]), 'day', '[]'))
            );

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
                    sr += score.beatmap.modded_sr?.star_rating ?? 0;
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
        handleDayChange();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedDayRange, MAX_DATE]);

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

    return (<>
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
                                        onClick={() => updateYear(moment.utc(y, 'YYYY'))}>{y}</Button>
                                }
                                )
                            }
                        </ButtonGroup>
                    </Box>
                    <Box sx={{ pt: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <Grid2 className="graph">
                            <Grid2 className="months">
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
                            </Grid2>
                            <Grid2 className="days">
                                <li>Sun</li>
                                <li>Mon</li>
                                <li>Tue</li>
                                <li>Wed</li>
                                <li>Thu</li>
                                <li>Fri</li>
                                <li>Sat</li>
                            </Grid2>
                            <Grid2 className="squares">
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
                                        //either selectedDayRange[0] or selectedDayRange[1], or between them
                                        const isSelected = selectedDayRange[0] === day.date || (selectedDayRange[1] && selectedDayRange[1] === day.date) || (selectedDayRange[0] < day.date && selectedDayRange[1] > day.date);
                                        //if the day is MAX_DAYS_RANGE days away from the first selected day, it can be selected

                                        let boxShadow = `0 0 7px 7px ${themeColor}00`;
                                        if (isSelected) {
                                            boxShadow = `0 0 7px 7px ${themeColor}36`;
                                        }
                                        //lets just do a border instead, but bit darker than the color
                                        return (
                                            <MUITooltip title={
                                                <Typography variant="body2">
                                                    {`${day.date}: ${_clears} clears`}
                                                </Typography>
                                            } placement='top' disableInteractive={true}>
                                                <Box
                                                    //store data in the element
                                                    data-clears={_clears}
                                                    data-date={day.date}
                                                    // onClick={() => { _clears > 0 && setSelectedDay(day.date); }}
                                                    // {...dateRangePressHoldEvent}
                                                    {...dateRangePressHoldEvent}
                                                    sx={{
                                                        borderRadius: '3px',
                                                        height: '12px',
                                                        position: 'relative',
                                                        width: '12px',
                                                        backgroundColor: `${_color}`,
                                                        margin: '2px',
                                                        boxShadow: boxShadow,
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
                            </Grid2>
                        </Grid2>
                    </Box>
                    <Paper elevation={1} sx={{ pt: 1, pb: 1 }}>
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
                                }}></Box><Typography variant="body2">{Math.min(dynamicRange, 100)}+ clears</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                            <Typography variant="body2">Currently viewing {selectedDayRange[0]}
                                {selectedDayRange[1] ? ` to ${selectedDayRange[1]}` : ''}
                            </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                            <Typography variant="body2">
                                Click a date to select only that one, hold a date tick to apply a range with the active one (max {MAX_DAYS_RANGE} days)
                            </Typography>
                        </Box>
                    </Paper>
                </Paper>

                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <Grid2 sx={{ my: 2 }}>
                        <ButtonGroup size='small'>
                            {heightDefiners.map((definer) => (
                                <Button onClick={() => setHeightDefiner(definer)} variant={heightDefiner.value === definer.value ? 'contained' : 'outlined'}>
                                    {definer.label}
                                </Button>
                            ))
                            }
                        </ButtonGroup>
                    </Grid2>
                </Box>


                <Grid2 sx={{
                    minHeight: '700px',
                }}>
                    {(selectedDayRange[0] && graphData && sessionAnnotations && sessionAnnotations.length > 0) && <Grid2 sx={{ mt: 1 }}>
                        <ErrorBoundary fallback={<div>Something went wrong</div>}>
                            <Grid2 sx={{
                                position: 'relative',
                                height: '400px',
                            }}>
                                <Grid2 sx={{
                                    position: 'absolute',
                                    height: '400px',
                                    width: '100%',
                                }}>
                                    <ChartWrapper
                                        options={{
                                            xaxis: {
                                                type: 'datetime',
                                                labels: {
                                                    datetimeUTC: true,
                                                    format: selectedDayRange[1] ? 'dd/MM HH:mm' : 'HH:mm',
                                                    formatter: (value) => {
                                                        return selectedDayRange[1] ? moment.utc(value).local().format('DD/MM HH:mm') : moment.utc(value).local().format('HH:mm');
                                                    },
                                                },
                                                min: moment.utc(selectedDayRange[0]).startOf('day').valueOf(),
                                                max: selectedDayRange[1] ? moment.utc(selectedDayRange[1]).endOf('day').valueOf() : moment.utc(selectedDayRange[0]).endOf('day').valueOf(),
                                            },
                                            yaxis: {
                                                min: 0,
                                                labels: {
                                                    formatter: (value) => {
                                                        return heightDefiner.yFormat?.(value) ?? value;
                                                    }
                                                }
                                            },
                                            tooltip: {
                                                custom: function ({ series, seriesIndex, dataPointIndex, w }) {
                                                    var data = w.globals.initialSeries[seriesIndex].data[dataPointIndex];

                                                    return `<ul style='padding-right:10px'>
                                                            <li>${heightDefiner.label}: ${heightDefiner.yFormat(data.y)}</li>
                                                            <li>${data.score.beatmap.artist} - ${data.score.beatmap.title} [${data.score.beatmap.diffname}] • ${data.score.accuracy}% ${data.score.rank} • ${data.score.score} score • ${data.score.pp.toFixed(2)}pp</li>
                                                            <li>${moment.unix(data.x / 1000).format('YYYY-MM-DD HH:mm:ss')}</li>
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
                                                        x: moment.utc(selectedDayRange[0]).startOf('day').valueOf(),
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
                                                        // x: moment.utc(selectedDay).endOf('day').valueOf(),
                                                        x: selectedDayRange[1] ? moment.utc(selectedDayRange[1]).endOf('day').valueOf() : moment.utc(selectedDayRange[0]).endOf('day').valueOf(),
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
                                                    ...(
                                                        //show an annotation for every day between selectedDayRange[0] and selectedDayRange[1]
                                                        (selectedDayRange[1] ? Array.from(Array(moment.utc(selectedDayRange[1]).diff(moment.utc(selectedDayRange[0]), 'days')).keys()).map((day) => {
                                                            return {
                                                                x: moment.utc(selectedDayRange[0]).add(day + 1, 'days').startOf('day').valueOf(),
                                                                strokeDashArray: 0,
                                                                borderColor: '#775DD0',
                                                                label: {
                                                                    style: {
                                                                        color: '#fff',
                                                                        background: '#775DD0',
                                                                    },
                                                                    //show the date
                                                                    text: moment.utc(selectedDayRange[0]).add(day + 1, 'days').format('YYYY-MM-DD'),
                                                                }
                                                            }
                                                        }) : [])
                                                    ),
                                                    ...(sessionAnnotations ?? [])
                                                ]
                                            }
                                        }}
                                        series={graphData}
                                        type={'scatter'}
                                    />
                                </Grid2>
                            </Grid2>
                        </ErrorBoundary>
                        <Typography variant='caption'>The pink area designates sessions</Typography>
                        <Grid2 sx={{ mt: 1, pl: 2 }}>
                            <Stack direction="column" spacing={2}>
                                <Grid2>
                                    {
                                        stats && <>
                                            <Stack direction="row" sx={{ justifyContent: 'center', alignItems: 'center' }}>
                                                <Grid2 sx={{ mr: 3, ml: 3 }}>
                                                    <img src={IMG_SVG_GRADE_XH} alt='XH' /> {stats.grade_ssh.toLocaleString('en-US')}
                                                </Grid2>
                                                <Grid2 sx={{ mr: 3, ml: 3 }}>
                                                    <img src={IMG_SVG_GRADE_X} alt='X' /> {stats.grade_ss.toLocaleString('en-US')}
                                                </Grid2>
                                                <Grid2 sx={{ mr: 3, ml: 3 }}>
                                                    <img src={IMG_SVG_GRADE_SH} alt='SH' /> {stats.grade_sh.toLocaleString('en-US')}
                                                </Grid2>
                                                <Grid2 sx={{ mr: 3, ml: 3 }}>
                                                    <img src={IMG_SVG_GRADE_S} alt='S' /> {stats.grade_s.toLocaleString('en-US')}
                                                </Grid2>
                                                <Grid2 sx={{ mr: 3, ml: 3 }}>
                                                    <img src={IMG_SVG_GRADE_A} alt='A' /> {stats.grade_a.toLocaleString('en-US')}
                                                </Grid2>
                                                <Grid2 sx={{ mr: 3, ml: 3 }}>
                                                    <img src={IMG_SVG_GRADE_B} alt='B' /> {stats.grade_b.toLocaleString('en-US')}
                                                </Grid2>
                                                <Grid2 sx={{ mr: 3, ml: 3 }}>
                                                    <img src={IMG_SVG_GRADE_C} alt='C' /> {stats.grade_c.toLocaleString('en-US')}
                                                </Grid2>
                                                <Grid2 sx={{ mr: 3, ml: 3 }}>
                                                    <img src={IMG_SVG_GRADE_D} alt='D' /> {stats.grade_d.toLocaleString('en-US')}
                                                </Grid2>
                                            </Stack>
                                        </>
                                    }
                                </Grid2>
                                <Grid2 container>
                                    <Grid2 size={{ xs: 0, md: 2 }}></Grid2>
                                    <Grid2 size={{ xs: 12, md: 4 }}>
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
                                                                    <TableCell sx={{ width: '50%' }}>{`${moment.duration(stats.playtime, 'seconds').format('h [hours] m [minutes]')}`}</TableCell>
                                                                </TableRow>
                                                                <TableRow>
                                                                    <TableCell sx={{ width: '50%' }}>Sessions</TableCell>
                                                                    <TableCell sx={{ width: '50%' }}>{`${sessionCount.toLocaleString('en-US')}`}</TableCell>
                                                                </TableRow>
                                                                <TableRow>
                                                                    <TableCell sx={{ width: '50%' }}>Total session</TableCell>
                                                                    {/* show up to hours, not days */}
                                                                    <TableCell sx={{ width: '50%' }}>{`${moment.duration(totalSessionLength, 'seconds').format('h [hours] m [minutes]')}`}</TableCell>
                                                                </TableRow>
                                                            </TableBody>
                                                        </Table>
                                                    </TableContainer>
                                                </>
                                            }
                                        </Paper>
                                    </Grid2>
                                    <Grid2 size={{ xs: 12, md: 4 }}>
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
                                    </Grid2>
                                    <Grid2 size={{ xs: 0, md: 2 }}></Grid2>
                                </Grid2>
                                <Alert severity="info">Start and end times are UTC midnight.</Alert>
                            </Stack>
                        </Grid2>
                    </Grid2>}
                </Grid2>
            </CardContent>
        </Card >
    </>);
}

export default SectionDaily;