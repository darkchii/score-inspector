import { DesktopDatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import moment from "moment/moment";
import { useState } from "react";
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { Box, Button, ButtonGroup, Card, CardContent, Chip, chipClasses, Grid, Paper, Stack, Table, TableBody, TableCell, TableContainer, TableRow, TextField } from "@mui/material";
import { useEffect } from "react";
import {
    Chart as ChartJS,
    LinearScale,
    PointElement,
    LineElement,
    Tooltip,
    Legend,
} from 'chart.js';
import { Scatter, Line } from 'react-chartjs-2';
import { getGradeColor, mods } from "../helper";
import Annotations from "chartjs-plugin-annotation";
import CircleIcon from '@mui/icons-material/Circle';
import SquareIcon from '@mui/icons-material/Square';
import { getGradeIcon, SVG_GRADE_A, SVG_GRADE_S, SVG_GRADE_SH, SVG_GRADE_X, SVG_GRADE_XH } from "../Assets";
ChartJS.register(LinearScale, PointElement, LineElement, Tooltip, Legend, Annotations);

const ACTIVITY_THRESHOLD = 60 * 60 * 1.5; //this value dictates a new activity region

const heightDefiners = [
    { value: 'pp', label: 'Performance' },
    { value: 'score', label: 'Score' },
    { value: 'accuracy', label: 'Accuracy' },
    { value: 'combo', label: 'Combo' },
    { value: 'length', label: 'Length' },
    { value: 'star_rating', label: 'Stars' },
    { value: 'modded_cs', label: 'CS' },
    { value: 'modded_ar', label: 'AR' },
    { value: 'modded_od', label: 'OD' },
    { value: 'modded_hp', label: 'HP' },
]
function PageIndividualDate(props) {
    const MIN_DATE = moment(props.data.user.join_date);
    const MAX_DATE = moment.unix((props.data.scores !== null && props.data.scores.length > 0) ? Math.max(...props.data.scores.map(score => moment(score.date_played).unix())) : moment().unix());
    const [selectedStartDay, setSelectedStartDay] = useState(MAX_DATE.startOf('day'));
    const [selectedEndDay, setSelectedEndDay] = useState(MAX_DATE.endOf('day'));
    const [isWorking, setWorkingState] = useState(false);
    const [scores, setScores] = useState(null);
    const [graphOptions, setGraphOptions] = useState(null);
    const [graphData, setGraphData] = useState(null);
    const [heightDefiner, setHeightDefiner] = useState('pp');

    const [sessionCount, setSessionCount] = useState(0);

    const [stats, setStats] = useState(null);

    useEffect(() => {
        const updateGraph = () => {
            let annotations = {};

            if (scores !== null) {
                let activities = [];
                let currentActivity = {
                    start: null,
                    end: null,
                    done: false
                }
                scores.forEach((score, index) => {
                    if (currentActivity.start === null) {
                        currentActivity.start = moment(score.date_played).unix() - score.modded_length;
                    }

                    currentActivity.end = moment(score.date_played).unix();

                    if (index > 0 || index === scores.length - 1) {
                        if (index === scores.length - 1) {
                            currentActivity.done = true;
                        } else {
                            if (moment(score.date_played).unix() - moment(scores[index - 1].date_played).unix() > ACTIVITY_THRESHOLD) {
                                currentActivity.end = moment(scores[index - 1].date_played).unix();
                                currentActivity.done = true;
                            }
                        }
                    }

                    if (currentActivity.done) {
                        activities.push(currentActivity);
                        currentActivity = {
                            start: moment(score.date_played).unix() - score.modded_length,
                            end: null,
                            done: false
                        }
                    }
                });

                if (activities.length > 0) {
                    console.log(activities);
                    activities.forEach((activity, index) => {
                        annotations[`activity${index}`] = {
                            type: 'box',
                            xMin: activity.start,
                            xMax: activity.end,
                            backgroundColor: 'rgba(252, 3, 148, 0.25)',
                            z: -1000
                        }
                    });
                }

                setSessionCount(activities.length);
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
                            min: selectedStartDay.startOf('day'),
                            max: selectedEndDay !== null ? selectedEndDay.endOf('day') : selectedStartDay.endOf('day')
                        }
                    }
                },
                plugins: {
                    legend: {
                        display: false,
                    },
                    tooltip: {
                        callbacks: {
                            label: function (context) {
                                return `${moment.unix(context.parsed.x).format("HH:mm")} • ${context.raw.score.artist} - ${context.raw.score.title} [${context.raw.score.diffname}] • ${context.raw.score.accuracy}% ${context.raw.score.rank} • ${context.raw.score.score} score • ${context.raw.score.pp.toFixed(2)}pp`;
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
                        data: scores !== null ? scores.map((score) => { return { x: moment(score.date_played).unix(), y: score[heightDefiner], score: score } }) : [],
                        backgroundColor: scores !== null ? scores.map((score) => getGradeColor(score.rank)) : [],
                        pointRadius: 5,
                        pointStyle: scores !== null ? scores.map((score) => (((score.enabled_mods & mods.HD !== 0) || (score.enabled_mods & mods.FL) !== 0) ? 'rect' : 'circle')) : [],
                        datalabels: {
                            display: false
                        }
                    },
                    {
                        label: "hidden",
                        data: [{ x: selectedStartDay.startOf('day').unix(), y: 0 }, { x: selectedEndDay.endOf('day').unix(), y: 0 }],
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
    }, [scores, props.data.scores, heightDefiner]);

    useEffect(() => {
        const handleDayChange = (start, end) => {
            setWorkingState(true);
            setScores(null);
            const scoresSubset = props.data.scores.filter(score => moment(score.date_played).isBetween(start, end, '[]'));
            const sorted = scoresSubset.sort((a, b) => moment(a.date_played).valueOf() - moment(b.date_played).valueOf());

            const _stats = {
                gained_score: 0,
                clears: 0,
                grade_ss: 0,
                grade_s: 0,
                grade_a: 0,
                average_acc: 0,
                playtime: 0
            }

            if (sorted.length > 0) {
                let acc = 0;
                sorted.forEach(score => {
                    _stats.gained_score += score.score;
                    if (score.rank === 'XH' || score.rank === 'X') {
                        _stats.grade_ss++;
                    } else if (score.rank === 'SH' || score.rank === 'S') {
                        _stats.grade_s++;
                    } else if (score.rank === 'A') {
                        _stats.grade_a++;
                    }
                    _stats.clears++;
                    acc += score.accuracy;
                    _stats.playtime += score.modded_length;
                });
                _stats.average_acc = acc / sorted.length;
            }

            setStats(_stats);

            setScores(sorted);
            setWorkingState(false);
        };
        handleDayChange(selectedStartDay.startOf('day'), selectedEndDay.endOf('day'));
    }, [selectedStartDay, selectedEndDay, props.data.scores]);

    return (
        <>
            <Card>
                <CardContent>
                    <LocalizationProvider dateAdapter={AdapterMoment}>
                        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                            <Grid sx={{ px: 1 }}>
                                <DesktopDatePicker disabled={isWorking} minDate={MIN_DATE} maxDate={MAX_DATE} label="Select start day" inputFormat="MM/DD/YYYY" value={selectedStartDay} onChange={setSelectedStartDay} renderInput={(params) => <TextField variant="standard" size="small" {...params} />} shouldDisableDate={(date) => (props.data.processed.activeDays !== null && props.data.processed.activeDays.size > 0) ? !props.data.processed.activeDays.has(date.format("YYYY-MM-DD")) : false} />
                            </Grid>
                            <Grid sx={{ px: 1 }}>
                                <DesktopDatePicker disabled={isWorking} minDate={MIN_DATE} maxDate={MAX_DATE} label="Select end day" inputFormat="MM/DD/YYYY" value={selectedEndDay} onChange={setSelectedEndDay} renderInput={(params) => <TextField variant="standard" size="small" {...params} />} shouldDisableDate={(date) => (props.data.processed.activeDays !== null && props.data.processed.activeDays.size > 0) ? !props.data.processed.activeDays.has(date.format("YYYY-MM-DD")) : false} />
                            </Grid>
                        </Box>
                    </LocalizationProvider>

                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <Grid sx={{ my: 2 }}>
                            <ButtonGroup>
                                {heightDefiners.map((definer) => (
                                    <Button onClick={() => setHeightDefiner(definer.value)} variant={heightDefiner === definer.value ? 'contained' : 'outlined'}>
                                        {definer.label}
                                    </Button>
                                ))
                                }
                            </ButtonGroup>
                        </Grid>
                    </Box>


                    {graphOptions && <Grid sx={{ mt: 5 }}>
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
                        <Grid sx={{ mt: 1, pl: 2 }}>
                            <Grid container>
                                <Grid item xs={0} md={2}></Grid>
                                <Grid item xs={12} md={4}>
                                    <Grid>
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
                                                                <TableCell sx={{ width: '50%' }}>Score per clear</TableCell>
                                                                <TableCell sx={{ width: '50%' }}>{Math.round(stats.clears > 0 ? (stats.gained_score / stats.clears) : 0).toLocaleString('en-US')}</TableCell>
                                                            </TableRow>
                                                            <TableRow>
                                                                <TableCell sx={{ width: '50%' }}>Average accuracy</TableCell>
                                                                <TableCell sx={{ width: '50%' }}>{stats.average_acc.toLocaleString('en-US')}%</TableCell>
                                                            </TableRow>
                                                            <TableRow>
                                                                <TableCell sx={{ width: '50%' }}>Playtime</TableCell>
                                                                <TableCell sx={{ width: '50%' }}>{`${moment.duration(stats.playtime, 'seconds').humanize()}`}</TableCell>
                                                            </TableRow>
                                                            <TableRow>
                                                                <TableCell sx={{ width: '50%' }}>Sessions</TableCell>
                                                                <TableCell sx={{ width: '50%' }}>{`${sessionCount.toLocaleString('en-US')}`}</TableCell>
                                                            </TableRow>
                                                        </TableBody>
                                                    </Table>
                                                </TableContainer>
                                            </>
                                        }
                                    </Grid>
                                </Grid>
                                <Grid item xs={12} md={4}>
                                    <Grid sx={{ ml: 1 }}>
                                        {
                                            stats && <>
                                                <TableContainer>
                                                    <Table size="small">
                                                        <TableBody>
                                                            <TableRow>
                                                                <TableCell sx={{ width: '50%' }}><SVG_GRADE_X /></TableCell>
                                                                <TableCell sx={{ width: '50%' }}>{stats.grade_ss.toLocaleString('en-US')}</TableCell>
                                                            </TableRow>
                                                            <TableRow>
                                                                <TableCell sx={{ width: '50%' }}><SVG_GRADE_S /></TableCell>
                                                                <TableCell sx={{ width: '50%' }}>{stats.grade_s.toLocaleString('en-US')}</TableCell>
                                                            </TableRow>
                                                            <TableRow>
                                                                <TableCell sx={{ width: '50%' }}><SVG_GRADE_A /></TableCell>
                                                                <TableCell sx={{ width: '50%' }}>{stats.grade_a.toLocaleString('en-US')}</TableCell>
                                                            </TableRow>
                                                        </TableBody>
                                                    </Table>
                                                </TableContainer>
                                            </>
                                        }
                                    </Grid>
                                </Grid>
                                <Grid item xs={0} md={2}></Grid>
                            </Grid>
                        </Grid>
                    </Grid>}
                </CardContent>
            </Card>
        </>
    );
}
export default PageIndividualDate;