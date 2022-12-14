import { DesktopDatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import moment from "moment/moment";
import { useState } from "react";
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { Box, Button, ButtonGroup, Card, CardContent, Chip, chipClasses, Grid, Paper, Stack, Table, TableBody, TableCell, TableContainer, TableRow, TextField, Typography } from "@mui/material";
import { useEffect } from "react";
import {
    Chart as ChartJS,
    LinearScale,
    PointElement,
    LineElement,
    Tooltip,
    Legend,
} from 'chart.js';
import { Scatter } from 'react-chartjs-2';
import { getGradeColor, mods } from "../helper";
import Annotations from "chartjs-plugin-annotation";
import CircleIcon from '@mui/icons-material/Circle';
import SquareIcon from '@mui/icons-material/Square';
import { SVG_GRADE_A, SVG_GRADE_S, SVG_GRADE_X } from "../Assets";
import { getSessions } from "../osu";
ChartJS.register(LinearScale, PointElement, LineElement, Tooltip, Legend, Annotations);

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
    const [selectedDay, setSelectedDay] = useState(MAX_DATE.endOf('day'));
    const [isWorking, setWorkingState] = useState(false);
    const [scores, setScores] = useState(null);
    const [graphOptions, setGraphOptions] = useState(null);
    const [graphData, setGraphData] = useState(null);
    const [heightDefiner, setHeightDefiner] = useState('pp');

    const [sessionCount, setSessionCount] = useState(0);
    const [totalSessionLength, setTotalSessionLength] = useState(0);

    const [stats, setStats] = useState(null);

    useEffect(() => {
        const updateGraph = () => {
            let annotations = {};

            if (scores !== null) {
                let activities = getSessions(scores);

                setTotalSessionLength(0);
                setSessionCount(0);
                if (activities.length > 0) {
                    console.log(activities);

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
                xMin: moment(selectedDay).startOf('day').unix(),
                xMax: moment(selectedDay).startOf('day').unix(),
                backgroundColor: 'rgba(0, 0, 0, 0.25)',
                z: -1000
            }
            annotations[`sectionEnd`] = {
                type: 'box',
                xMin: moment(selectedDay).endOf('day').unix(),
                xMax: moment(selectedDay).endOf('day').unix(),
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
                            min: selectedDay.startOf('day'),
                            max: selectedDay.endOf('day')
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
                                return `${moment.unix(context.parsed.x).format("HH:mm")} ??? ${context.raw.score.artist} - ${context.raw.score.title} [${context.raw.score.diffname}] ??? ${context.raw.score.accuracy}% ${context.raw.score.rank} ??? ${context.raw.score.score} score ??? ${context.raw.score.pp.toFixed(2)}pp`;
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
                        data: [{ x: selectedDay.startOf('day').unix(), y: 0 }, { x: selectedDay.endOf('day').unix(), y: 0 }],
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
    }, [scores, props.data.scores, heightDefiner]);

    useEffect(() => {
        const handleDayChange = (date) => {
            setWorkingState(true);
            setScores(null);
            const scoresSubset = props.data.scores.filter(score => moment(score.date_played).isSame(date, 'day'));
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
        handleDayChange(selectedDay);
    }, [selectedDay, props.data.scores]);

    return (
        <>
            <Card>
                <CardContent>
                    <LocalizationProvider dateAdapter={AdapterMoment}>
                        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                            <Paper>
                                <Grid sx={{ px: 1, m: 1 }}>
                                    <DesktopDatePicker format="dd-MMM-yyyy" disabled={isWorking} minDate={MIN_DATE} maxDate={MAX_DATE} label="Select day" inputFormat="MM/DD/YYYY" value={selectedDay} onChange={setSelectedDay} renderInput={(params) => <TextField variant="standard" size="small" {...params} />} shouldDisableDate={(date) => (props.data.processed.activeDays !== null && props.data.processed.activeDays.size > 0) ? !props.data.processed.activeDays.has(date.format("YYYY-MM-DD")) : false} />
                                </Grid>
                            </Paper>
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
                                                            <TableRow>
                                                                <TableCell sx={{ width: '50%' }}>Total session length</TableCell>
                                                                <TableCell sx={{ width: '50%' }}>{`${moment.duration(totalSessionLength, 'seconds').humanize()}`}</TableCell>
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