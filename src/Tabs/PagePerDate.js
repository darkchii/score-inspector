/* eslint-disable no-loop-func */
import { Avatar, BottomNavigation, BottomNavigationAction, Box, Card, CardContent, Grid, Paper, Skeleton, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import NumberFormat from "react-number-format";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import TimeGraph from "../Components/TimeGraph";
import moment from "moment";
ChartJS.register(ArcElement, Tooltip, Legend);

const dataToList = [
    {
        outputValue: "count_scores",
        exec: function (output, score) {
            return output + 1;
        }
    },
    {
        outputValue: "total_score",
        exec: function (output, score) {
            return output + score.score;
        }
    },
    {
        outputValue: "total_pp",
        exec: function (output, score) {
            return output + score.pp;
        }
    },
    {
        outputValue: "total_sr",
        exec: function (output, score) {
            return output + score.stars;
        }
    },
    {
        outputValue: "total_ss",
        exec: function (output, score) {
            if (score.rank === "X" || score.rank === "XH") {
                return output + 1;
            }
            return output;
        }
    },
    {
        outputValue: "total_s",
        exec: function (output, score) {
            if (score.rank === "S" || score.rank === "SH") {
                return output + 1;
            }
            return output;
        }
    },
    {
        outputValue: "total_a",
        exec: function (output, score) {
            if (score.rank === "A") {
                return output + 1;
            }
            return output;
        }
    },
    {
        outputValue: "total_b",
        exec: function (output, score) {
            if (score.rank === "B") {
                return output + 1;
            }
            return output;
        }
    },
    {
        outputValue: "total_c",
        exec: function (output, score) {
            if (score.rank === "C") {
                return output + 1;
            }
            return output;
        }
    },
    {
        outputValue: "total_d",
        exec: function (output, score) {
            if (score.rank === "D") {
                return output + 1;
            }
            return output;
        }
    },
    {
        outputValue: "length",
        exec: function (output, score) {
            return output+score.length;
        }
    }
];

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

        console.log(moment(scores[0].date_played));

        console.time("per section stats");
        for (const score of scores) {
            // var date = new Date(score.date_played);
            var _moment = moment(score.date_played);

            var dateValue;
            switch (dateFormat) {
                default:
                case "day":
                    dateValue = _moment.format('YYYY-MM-DD');
                    break;
                case "month":
                    dateValue = _moment.format('MMMM YYYY');
                    break;
            }

            if (scoresPerDay[dateValue] === undefined) {
                scoresPerDay[dateValue] = {};
            }
            dataToList.forEach(val => {
                if (scoresPerDay[dateValue][val.outputValue] === undefined || scoresPerDay[dateValue][val.outputValue] === null) {
                    scoresPerDay[dateValue][val.outputValue] = 0;
                }
                scoresPerDay[dateValue][val.outputValue] = val.exec(scoresPerDay[dateValue][val.outputValue], score);
            });
            scoresPerDay[dateValue].actual_date = _moment;

            index++;
        };
        console.timeEnd("per section stats");

        console.time("sorting");
        //convert it to a sortable array
        var realScoresPerDay = [];
        //(async function () { setLoadTitle("Sorting statistics"); })();
        Object.keys(scoresPerDay).forEach(key => {
            var obj = {};
            dataToList.forEach(val => {
                obj[val.outputValue] = scoresPerDay[key][val.outputValue];
            });
            obj.date = key;
            obj.actual_date = scoresPerDay[key].actual_date;
            obj.average_pp = parseInt("" + (scoresPerDay[key].total_pp / scoresPerDay[key].count_scores));
            obj.average_sr = scoresPerDay[key].count_scores > 0 ? parseFloat((scoresPerDay[key].total_sr / scoresPerDay[key].count_scores).toFixed(2)) : 0;
            realScoresPerDay.push(obj);
        });

        //sort array
        var sorted = realScoresPerDay.sort((a, b) => {
            return a.actual_date.valueOf() - b.actual_date.valueOf();
        });

        console.timeEnd("sorting");

        console.time("generating dates");
        //fill empty gaps
        let dates = [];
        var _start = moment(sorted[0].actual_date);
        // var _end = moment(sorted[sorted.length - 1].actual_date).add(1, `${addDateFormat}s`);
        var _end = moment();
        for (var m = moment(_start); m.isBefore(_end); m.add(1, `${addDateFormat}s`)) {
            dates.push(moment(m));
        }
        console.timeEnd("generating dates");

        console.time("filling empty spots");
        const referenceObject = JSON.parse(JSON.stringify(sorted[0]));
        for (var p in referenceObject) {
            referenceObject[p] = 0;
        }
        var r = dates.map(date => {
            var o = sorted.findIndex(x => x.actual_date.isSame(date, addDateFormat));
            if (o === -1) {
                var dateValue;
                switch (dateFormat) {
                    default:
                    case "day":
                        dateValue = date.format('YYYY-MM-DD');
                        break;
                    case "month":
                        dateValue = date.format('MMMM YYYY');
                        break;
                }
                var clone = JSON.parse(JSON.stringify(referenceObject));
                clone.date = dateValue;
                clone.actual_date = date;
                return clone;
            }
            const data = sorted[o];
            sorted.splice(o, 1);
            return data;
        });

        sorted = r;
        console.timeEnd("filling empty spots");

        console.time("generating cumulative stuff");
        //calculate cumulative data
        for (var i = 0; i < sorted.length; i++) {
            var prev = i > 0 ? sorted[i - 1].cumulative_score : 0;
            if (prev) {
                sorted[i].cumulative_score = sorted[i].total_score + prev;
            } else {
                sorted[i].cumulative_score = sorted[i].total_score;
            }

            prev = i > 0 ? sorted[i - 1].cumulative_length : 0;
            if (prev) {
                sorted[i].cumulative_length = sorted[i].length + prev;
            } else {
                sorted[i].cumulative_length = sorted[i].length;
            }

            prev = i > 0 ? sorted[i - 1].cumulative_plays : 0;
            if (prev) {
                sorted[i].cumulative_plays = sorted[i].count_scores + prev;
            } else {
                sorted[i].cumulative_plays = sorted[i].count_scores;
            }

            prev = i > 0 ? sorted[i - 1].cumulative_rank_ss : 0;
            if (prev) {
                sorted[i].cumulative_rank_ss = sorted[i].total_ss + prev;
            } else {
                sorted[i].cumulative_rank_ss = sorted[i].total_ss;
            }

            prev = i > 0 ? sorted[i - 1].cumulative_rank_s : 0;
            if (prev) {
                sorted[i].cumulative_rank_s = sorted[i].total_s + prev;
            } else {
                sorted[i].cumulative_rank_s = sorted[i].total_s;
            }

            prev = i > 0 ? sorted[i - 1].cumulative_rank_a : 0;
            if (prev) {
                sorted[i].cumulative_rank_a = sorted[i].total_a + prev;
            } else {
                sorted[i].cumulative_rank_a = sorted[i].total_a;
            }

            prev = i > 0 ? sorted[i - 1].cumulative_rank_b : 0;
            if (prev) {
                sorted[i].cumulative_rank_b = sorted[i].total_b + prev;
            } else {
                sorted[i].cumulative_rank_b = sorted[i].total_b;
            }

            prev = i > 0 ? sorted[i - 1].cumulative_rank_c : 0;
            if (prev) {
                sorted[i].cumulative_rank_c = sorted[i].total_c + prev;
            } else {
                sorted[i].cumulative_rank_c = sorted[i].total_c;
            }

            prev = i > 0 ? sorted[i - 1].cumulative_rank_d : 0;
            if (prev) {
                sorted[i].cumulative_rank_d = sorted[i].total_d + prev;
            } else {
                sorted[i].cumulative_rank_d = sorted[i].total_d;
            }

            console.log(`${sorted[i].actual_date.format("YYYY-M")}-01`);
            const beatmaps = props.data.processed.beatmapInfo.monthlyCumulative[`${sorted[i].actual_date.format("YYYY-M")}-01`];
            sorted[i].completion = 100 / beatmaps.amount * sorted[i].cumulative_plays;
            sorted[i].completion_score = 100 / beatmaps.score * sorted[i].cumulative_score;
            sorted[i].completion_length = 100 / beatmaps.length * sorted[i].cumulative_length;
        }

        console.log(sorted);

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
        console.timeEnd("generating cumulative stuff");
    }


    useEffect(() => {
        if (props.data.processed.scorePerDate === undefined || props.data.processed.scorePerDate[dateFormat] === undefined) {
            (async function () {
                await new Promise(r => setTimeout(r, 1000));
                Promise.resolve(processData(scores)).then(() => { forceUpdate(); });
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
                                        0: <TimeGraph name={`Scores set per ${dateFormat}`} labels={props.data.processed.scorePerDateLabels[dateFormat]} data={[{ name: "Scores set", set: props.data.processed.scorePerDate[dateFormat].map(x => x.count_scores), color: { r: 255, g: 102, b: 158 } }]} />,
                                        1: <TimeGraph name={`Total score per ${dateFormat}`} labels={props.data.processed.scorePerDateLabels[dateFormat]} data={[{ name: "Total score gained", set: props.data.processed.scorePerDate[dateFormat].map(x => x.total_score), color: { r: 255, g: 102, b: 158 } }]} />,
                                        2: <TimeGraph name='Completion' labels={props.data.processed.scorePerDateLabels[dateFormat]} data={[
                                            { name: "% Clear Completion", set: props.data.processed.scorePerDate[dateFormat].map(x => x.completion), color: { r: 255, g: 102, b: 158 } },
                                            { name: "% Score Completion", set: props.data.processed.scorePerDate[dateFormat].map(x => x.completion_score), color: { r: 244, g: 67, b: 54 } },
                                            { name: "% Length Completion", set: props.data.processed.scorePerDate[dateFormat].map(x => x.completion_length), color: { r: 63, g: 81, b: 181 } },
                                        ]} 
                                            formatter={(value, context) => {return `${value.toFixed(2)}%`;}}/>,
                                        3: <TimeGraph name="Average PP per play" labels={props.data.processed.scorePerDateLabels[dateFormat]} data={[{ name: "Average PP", set: props.data.processed.scorePerDate[dateFormat].map(x => x.average_pp), color: { r: 255, g: 102, b: 158 } }]} />,
                                        4: <TimeGraph name="Average SR per play" labels={props.data.processed.scorePerDateLabels[dateFormat]} data={[{ name: "Average SR", set: props.data.processed.scorePerDate[dateFormat].map(x => x.average_sr), color: { r: 255, g: 102, b: 158 } }]} />,
                                        5: <TimeGraph name="Cumulative ranked score" labels={props.data.processed.scorePerDateLabels[dateFormat]} data={[{ name: "Cumulative ranked score", set: props.data.processed.scorePerDate[dateFormat].map(x => x.cumulative_score), color: { r: 255, g: 102, b: 158 } }]} />,
                                        6: <TimeGraph name="Cumulative plays" labels={props.data.processed.scorePerDateLabels[dateFormat]} data={[{ name: "Cumulative plays", set: props.data.processed.scorePerDate[dateFormat].map(x => x.cumulative_plays), color: { r: 255, g: 102, b: 158 } }]} />,
                                        7: <TimeGraph name="Grades" labels={props.data.processed.scorePerDateLabels[dateFormat]} data={[
                                            { name: "Total SS", set: props.data.processed.scorePerDate[dateFormat].map(x => x.total_ss), color: { r: 197, g: 197, b: 197 } },
                                            { name: "Total S", set: props.data.processed.scorePerDate[dateFormat].map(x => x.total_s), color: { r: 255, g: 186, b: 14 } },
                                            { name: "Total A", set: props.data.processed.scorePerDate[dateFormat].map(x => x.total_a), color: { r: 163, g: 163, b: 163 } },
                                            { name: "Total B", set: props.data.processed.scorePerDate[dateFormat].map(x => x.total_b), color: { r: 255, g: 148, b: 11 } },
                                            { name: "Total C", set: props.data.processed.scorePerDate[dateFormat].map(x => x.total_c), color: { r: 133, g: 214, b: 28 } },
                                            { name: "Total D", set: props.data.processed.scorePerDate[dateFormat].map(x => x.total_d), color: { r: 243, g: 87, b: 90 } },
                                        ]} />,
                                        8: <TimeGraph name="Cumulative Grades" labels={props.data.processed.scorePerDateLabels[dateFormat]} data={[
                                            { name: "Total SS", set: props.data.processed.scorePerDate[dateFormat].map(x => x.cumulative_rank_ss), color: { r: 197, g: 197, b: 197 } },
                                            { name: "Total S", set: props.data.processed.scorePerDate[dateFormat].map(x => x.cumulative_rank_s), color: { r: 255, g: 186, b: 14 } },
                                            { name: "Total A", set: props.data.processed.scorePerDate[dateFormat].map(x => x.cumulative_rank_a), color: { r: 163, g: 163, b: 163 } },
                                            { name: "Total B", set: props.data.processed.scorePerDate[dateFormat].map(x => x.cumulative_rank_b), color: { r: 255, g: 148, b: 11 } },
                                            { name: "Total C", set: props.data.processed.scorePerDate[dateFormat].map(x => x.cumulative_rank_c), color: { r: 133, g: 214, b: 28 } },
                                            { name: "Total D", set: props.data.processed.scorePerDate[dateFormat].map(x => x.cumulative_rank_d), color: { r: 243, g: 87, b: 90 } },
                                        ]} />,
                                    }[timeGraphValue]
                                }
                            </Grid>
                            <BottomNavigation showLabels value={timeGraphValue} onChange={(event, newValue) => { setTimeGraphValue(newValue); }}>
                                <BottomNavigationAction label={`Plays per ${dateFormat}`} />
                                <BottomNavigationAction label={`Score per ${dateFormat}`} />
                                <BottomNavigationAction label='Completion' />
                                <BottomNavigationAction label="PP per play" />
                                <BottomNavigationAction label="Average starrating" />
                                <BottomNavigationAction label="Cumulative ranked score" />
                                <BottomNavigationAction label="Cumulative plays set" />
                                <BottomNavigationAction label="Grades" />
                                <BottomNavigationAction label="Cumulative grades" />
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