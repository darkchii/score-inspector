import { Avatar, BottomNavigation, BottomNavigationAction, Box, Card, CardContent, Grid, Paper, Skeleton, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import NumberFormat from "react-number-format";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import TimeGraph from "../Components/TimeGraph";
import moment from "moment";
ChartJS.register(ArcElement, Tooltip, Legend);

function useForceUpdate() {
    const [value, setValue] = useState(0); // integer state
    return () => setValue(value => value + 1); // update state to force render
    // An function that increment 👆🏻 the previous state like here 
    // is better than directly setting `value + 1`
}

function PagePerDate(props) {
    const [timeGraphValue, setTimeGraphValue] = React.useState(0);
    const [loadState, setLoadState] = React.useState(false);
    const [processedData, setProcessedScoreData] = React.useState(null);
    const [, updateState] = React.useState();
    const forceUpdate = React.useCallback(() => updateState({}), []);

    var scores = props.data.scores;
    var user = props.data.user;
    var dateFormat = props.data.format ?? "day";

    const processData = async (scores) => {
        var scoresPerDay = [];
        var index = 0;
        var addDateFormat;
        switch (dateFormat) {
            default:
            case "day":
                addDateFormat = "day";
                break;
            case "month":
                addDateFormat = "month";
                break;
        }
        for await (const score of scores) {
            var date = new Date(score.date_played);

            var dateValue = date.toLocaleDateString("en-US");
            switch (dateFormat) {
                default:
                case "day":
                    dateValue = date.toLocaleDateString("en-US");
                    break;
                case "month":
                    dateValue = moment(dateValue).format('MMMM YYYY');
                    break;
            }

            if (scoresPerDay[dateValue] !== undefined) {
                scoresPerDay[dateValue].count_scores++;
                scoresPerDay[dateValue].total_score += score.score;
                scoresPerDay[dateValue].total_pp += score.pp;
                scoresPerDay[dateValue].total_sr += score.stars;
            } else {
                scoresPerDay[dateValue] = {};
                scoresPerDay[dateValue].count_scores = 1;
                scoresPerDay[dateValue].total_score = score.score;
                scoresPerDay[dateValue].total_pp = score.pp;
                scoresPerDay[dateValue].total_sr = score.stars;
            }
            scoresPerDay[dateValue].actual_date = moment(score.date_played);

            index++;
        };

        //convert it to a sortable array
        var realScoresPerDay = [];
        //(async function () { setLoadTitle("Sorting statistics"); })();
        Object.keys(scoresPerDay).forEach(key => {
            realScoresPerDay.push({
                date: key,
                actual_date: scoresPerDay[key].actual_date,
                count_scores: scoresPerDay[key].count_scores,
                total_score: scoresPerDay[key].total_score,
                average_pp: parseInt("" + (scoresPerDay[key].total_pp / scoresPerDay[key].count_scores)),
                average_sr: (scoresPerDay[key].total_sr / scoresPerDay[key].count_scores).toFixed(2)
            })
        });

        //sort array
        var sorted = realScoresPerDay.sort((a, b) => {
            return a.actual_date.valueOf() - b.actual_date.valueOf();
        });

        //fill empty gaps
        let dates = [];
        var _start = moment(sorted[0].actual_date);
        var _end = moment(sorted[sorted.length - 1].actual_date).add(1, `${addDateFormat}s`);
        for (var m = moment(_start); m.isBefore(_end); m.add(1, `${addDateFormat}s`)) {
            dates.push(m.toString());
        }

        var r = dates.map(date => {
            var o = sorted.find(x => moment(x.actual_date).isSame(date, addDateFormat));
            var dateValue;
            switch (dateFormat) {
                default:
                case "day":
                    dateValue = moment(date).toDate().toLocaleDateString("en-US");
                    break;
                case "month":
                    dateValue = moment(date).format('MMMM YYYY');
                    break;
            }
            return o ?? { date: dateValue, actual_date: date, count_scores: 0, total_score: 0, average_pp: 0, average_sr: 0 }
        })

        sorted = r;

        //calculate cumulative data
        for (var i = 0; i < sorted.length; i++) {
            var prev = i > 0 ? sorted[i - 1].cumulative_score : 0;
            if (prev) {
                sorted[i].cumulative_score = sorted[i].total_score + prev;
            } else {
                sorted[i].cumulative_score = sorted[i].total_score;
            }

            prev = i > 0 ? sorted[i - 1].cumulative_plays : 0;
            if (prev) {
                sorted[i].cumulative_plays = sorted[i].count_scores + prev;
            } else {
                sorted[i].cumulative_plays = sorted[i].count_scores;
            }
        }

        if (props.data.processed.scorePerDate === undefined) {
            props.data.processed.scorePerDate = [];
        }
        if (props.data.processed.scorePerDateLabels === undefined) {
            props.data.processed.scorePerDateLabels = [];
        }

        if (props.data.processed.scorePerDate === undefined || props.data.processed.scorePerDate[dateFormat] === undefined) {
            props.data.processed.scorePerDate[dateFormat] = sorted;
            props.data.processed.scorePerDateLabels[dateFormat] = props.data.processed.scorePerDate[dateFormat].map(x => x.date);
        }

        forceUpdate();
    }


    useEffect(() => {
        if (props.data.processed.scorePerDate === undefined || props.data.processed.scorePerDate[dateFormat] === undefined) {
            (async function () {
                await new Promise(r => setTimeout(r, 1000));
                processData(scores);
            })();
        }
    }, []);


    return (
        (props.data.processed.scorePerDate !== undefined && props.data.processed.scorePerDate[dateFormat] !== undefined) ?
            <>
                <Grid container spacing={3}>
                    <Grid item xs={12} md={12} lg={12}>
                        <Paper elevation={5}>
                            <Grid>
                                {
                                    {
                                        0: <TimeGraph name={`Scores set per ${dateFormat}`} labels={props.data.processed.scorePerDateLabels[dateFormat]} data={props.data.processed.scorePerDate[dateFormat].map(x => x.count_scores)} />,
                                        1: <TimeGraph name={`Total score per ${dateFormat}`} labels={props.data.processed.scorePerDateLabels[dateFormat]} data={props.data.processed.scorePerDate[dateFormat].map(x => x.total_score)} />,
                                        2: <TimeGraph name="Average PP per play" labels={props.data.processed.scorePerDateLabels[dateFormat]} data={props.data.processed.scorePerDate[dateFormat].map(x => x.average_pp)} />,
                                        3: <TimeGraph name="Average SR per play" labels={props.data.processed.scorePerDateLabels[dateFormat]} data={props.data.processed.scorePerDate[dateFormat].map(x => x.average_sr)} />,
                                        4: <TimeGraph name="Cumulative ranked score" labels={props.data.processed.scorePerDateLabels[dateFormat]} data={props.data.processed.scorePerDate[dateFormat].map(x => x.cumulative_score)} />,
                                        5: <TimeGraph name="Cumulative plays" labels={props.data.processed.scorePerDateLabels[dateFormat]} data={props.data.processed.scorePerDate[dateFormat].map(x => x.cumulative_plays)} />,
                                    }[timeGraphValue]
                                }
                            </Grid>
                            <BottomNavigation showLabels value={timeGraphValue} onChange={(event, newValue) => { setTimeGraphValue(newValue); }}>
                                <BottomNavigationAction label={`Plays per ${dateFormat}`} />
                                <BottomNavigationAction label={`Score per ${dateFormat}`} />
                                <BottomNavigationAction label="PP per play" />
                                <BottomNavigationAction label="Average starrating" />
                                <BottomNavigationAction label="Cumulative ranked score" />
                                <BottomNavigationAction label="Cumulative plays set" />
                            </BottomNavigation>
                        </Paper>
                    </Grid>
                </Grid>
            </> : <>
                <Skeleton
                    sx={{ bgcolor: 'grey.900' }}
                    variant="rectangular"
                    animation="wave"
                    height={600}
                />
            </>
    );
}
export default PagePerDate;