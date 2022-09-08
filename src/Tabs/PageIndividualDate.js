import { DesktopDatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import moment from "moment/moment";
import { useState } from "react";
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { Button, ButtonGroup, Card, CardContent, Grid, TextField } from "@mui/material";
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
import { getGradeColor } from "../helper";
ChartJS.register(LinearScale, PointElement, LineElement, Tooltip, Legend);

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
    const MAX_DATE = moment();
    const [selectedDay, setSelectedDay] = useState(MAX_DATE.startOf('day'));
    const [isWorking, setWorkingState] = useState(false);
    const [scores, setScores] = useState(null);
    const [graphOptions, setGraphOptions] = useState(null);
    const [graphData, setGraphData] = useState(null);
    const [heightDefiner, setHeightDefiner] = useState('pp');

    useEffect(() => {
        const updateGraph = () => {
            const options = {
                maintainAspectRatio: false,
                scales: {
                    x:
                    {
                        ticks: {
                            callback: function (value, index, values) {
                                return moment.unix(value).format("HH:mm");
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
                                return `${moment.unix(context.parsed.x).format("HH:mm")} • ${context.raw.score.artist} - ${context.raw.score.title} [${context.raw.score.diffname}] • ${context.raw.score.accuracy}% ${context.raw.score.rank} • ${context.raw.score.score} score • ${context.raw.score.pp.toFixed(2)}pp`;
                            }
                        }
                    }
                },
            };
            setGraphOptions(options);

            const data = {
                datasets: [
                    {
                        label: "Scores",
                        data: scores !== null ? scores.map((score) => { return { x: moment(score.date_played).unix(), y: score[heightDefiner], score: score } }) : [],
                        backgroundColor: scores !== null ? scores.map((score) => getGradeColor(score)) : [],
                        pointRadius: 10,
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
    }, [scores, props.data.scores, heightDefiner]);

    useEffect(() => {
        const handleDayChange = (date) => {
            setWorkingState(true);
            setScores(null);
            const scoresSubset = props.data.scores.filter(score => moment(score.date_played).isSame(date, 'day'));
            setScores(scoresSubset);
            setWorkingState(false);
        };
        handleDayChange(selectedDay.startOf('day'));
    }, [selectedDay, props.data.scores]);

    return (
        <>
            <Card>
                <CardContent>
                    <LocalizationProvider dateAdapter={AdapterMoment}>
                        <DesktopDatePicker disabled={isWorking} minDate={MIN_DATE} maxDate={MAX_DATE} label="Select day to view" inputFormat="MM/DD/YYYY" value={selectedDay} onChange={setSelectedDay} renderInput={(params) => <TextField variant="standard" size="small" {...params} />} />
                    </LocalizationProvider>

                    <Grid sx={{ my: 2 }}>
                        <ButtonGroup>
                            {heightDefiners.map((definer) => (
                                <Button onClick={()=>setHeightDefiner(definer.value)} variant={heightDefiner === definer.value ? 'contained' : 'outlined'}>
                                    {definer.label}
                                </Button>
                            ))
                            }
                        </ButtonGroup>
                    </Grid>

                    {graphOptions && <Grid sx={{ my: 5, maxHeight: '400px' }}>
                        <Scatter height='400px' options={graphOptions} data={graphData} />
                    </Grid>}
                </CardContent>
            </Card>
        </>
    );
}
export default PageIndividualDate;