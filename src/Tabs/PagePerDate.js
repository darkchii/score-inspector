/* eslint-disable no-loop-func */
import { Button, ButtonGroup, Grid, Paper, Skeleton, Table, TableBody, TableCell, TableRow, Typography } from "@mui/material";
import React, { useEffect } from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import TimeGraph from "../Components/TimeGraph";
import moment from "moment";
import Zoom from "chartjs-plugin-zoom";

ChartJS.register(ArcElement, Tooltip, Legend, Zoom);
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
            return output + (score.pp !== null && score.pp !== undefined ? score.pp : 0);
        }
    },
    {
        outputValue: "highest_pp",
        exec: function (output, score) {
            return Math.max(output, (score.pp !== null && score.pp !== undefined ? score.pp : 0));
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
        outputValue: "total_length",
        exec: function (output, score) {
            return output + score.length;
        }
    }
];

function PagePerDate(props) {
    const [timeGraphValue, setTimeGraphValue] = React.useState("clearsPerSection");
    const [graphs, setGraphs] = React.useState(null);
    const [, updateState] = React.useState();
    const forceUpdate = React.useCallback(() => updateState({}), []);

    var scores = props.data.scores;
    var dateFormat = props.data.format ?? "day";

    const processData = async (scores) => {
        var scoresPerDay = [];
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
            obj.average_score = scoresPerDay[key].count_scores > 0 ? parseFloat((scoresPerDay[key].total_score / scoresPerDay[key].count_scores).toFixed(0)) : 0;
            obj.average_length = scoresPerDay[key].count_scores > 0 ? parseFloat((scoresPerDay[key].total_length / scoresPerDay[key].count_scores).toFixed(0)) : 0;
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
        for (var m = moment(_start); (m.isBefore(_end) || m.isSame(_end, addDateFormat)); m.add(1, `${addDateFormat}s`)) {
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
                sorted[i].cumulative_length = sorted[i].total_length + prev;
            } else {
                sorted[i].cumulative_length = sorted[i].total_length;
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

            prev = i > 0 ? sorted[i - 1].cumulative_total_pp : 0;
            if (prev) {
                sorted[i].cumulative_total_pp = sorted[i].total_pp + prev;
            } else {
                sorted[i].cumulative_total_pp = sorted[i].total_pp;
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

        createGraphs();
    }

    const createGraphs = () => {
        setGraphs({
            "clearsPerSection": <TimeGraph name={`Scores set per ${dateFormat}`} labels={props.data.processed.scorePerDateLabels[dateFormat]} data={[{ name: "Scores set", set: props.data.processed.scorePerDate[dateFormat].map(x => x.count_scores), color: { r: 255, g: 102, b: 158 } }]} />,
            "ppPerSection": <TimeGraph name={`Total PP per ${dateFormat}`} labels={props.data.processed.scorePerDateLabels[dateFormat]} data={[{ name: "Total PP set", set: props.data.processed.scorePerDate[dateFormat].map(x => x.total_pp), color: { r: 255, g: 102, b: 158 } }]} />,
            "lengthPerSection": <TimeGraph name={`Total length per ${dateFormat}`} labels={props.data.processed.scorePerDateLabels[dateFormat]} data={[{ name: "Total length played", set: props.data.processed.scorePerDate[dateFormat].map(x => x.total_length), color: { r: 255, g: 102, b: 158 } }]} />,
            "totalscorePerSection": <TimeGraph name={`Total score per ${dateFormat}`} labels={props.data.processed.scorePerDateLabels[dateFormat]} data={[{ name: "Total score gained", set: props.data.processed.scorePerDate[dateFormat].map(x => x.total_score), color: { r: 255, g: 102, b: 158 } }]} />,
            "completion": <TimeGraph name='Completion' labels={props.data.processed.scorePerDateLabels[dateFormat]} data={[
                { name: "% Clear Completion", set: props.data.processed.scorePerDate[dateFormat].map(x => x.completion), color: { r: 255, g: 102, b: 158 } },
                { name: "% Score Completion", set: props.data.processed.scorePerDate[dateFormat].map(x => x.completion_score), color: { r: 244, g: 67, b: 54 } },
                { name: "% Length Completion", set: props.data.processed.scorePerDate[dateFormat].map(x => x.completion_length), color: { r: 63, g: 81, b: 181 } },
            ]}
                formatter={(value, context) => { return `${value.toFixed(2)}%`; }} />,
            "cumulativePP": <TimeGraph name="Total PP" labels={props.data.processed.scorePerDateLabels[dateFormat]} data={[{ name: "Total PP", set: props.data.processed.scorePerDate[dateFormat].map(x => Math.floor(x.cumulative_total_pp)), color: { r: 255, g: 102, b: 158 } }]} />,
            "cumulativeScore": <TimeGraph name="Cumulative ranked score" labels={props.data.processed.scorePerDateLabels[dateFormat]} data={[{ name: "Cumulative ranked score", set: props.data.processed.scorePerDate[dateFormat].map(x => x.cumulative_score), color: { r: 255, g: 102, b: 158 } }]} />,
            "cumulativeClears": <TimeGraph name="Cumulative plays" labels={props.data.processed.scorePerDateLabels[dateFormat]} data={[{ name: "Cumulative plays", set: props.data.processed.scorePerDate[dateFormat].map(x => x.cumulative_plays), color: { r: 255, g: 102, b: 158 } }]} />,
            "cumulativeLength": <TimeGraph name={`Cumulative length played`} labels={props.data.processed.scorePerDateLabels[dateFormat]} data={[{ name: "Cumulative total length played", set: props.data.processed.scorePerDate[dateFormat].map(x => x.cumulative_length), color: { r: 255, g: 102, b: 158 } }]} />,
            "gradesPerSection": <TimeGraph name="Grades" labels={props.data.processed.scorePerDateLabels[dateFormat]} data={[
                { name: "Total SS", set: props.data.processed.scorePerDate[dateFormat].map(x => x.total_ss), color: { r: 197, g: 197, b: 197 } },
                { name: "Total S", set: props.data.processed.scorePerDate[dateFormat].map(x => x.total_s), color: { r: 255, g: 186, b: 14 } },
                { name: "Total A", set: props.data.processed.scorePerDate[dateFormat].map(x => x.total_a), color: { r: 163, g: 163, b: 163 } },
                { name: "Total B", set: props.data.processed.scorePerDate[dateFormat].map(x => x.total_b), color: { r: 255, g: 148, b: 11 } },
                { name: "Total C", set: props.data.processed.scorePerDate[dateFormat].map(x => x.total_c), color: { r: 133, g: 214, b: 28 } },
                { name: "Total D", set: props.data.processed.scorePerDate[dateFormat].map(x => x.total_d), color: { r: 243, g: 87, b: 90 } },
            ]} />,
            "cumulativeGrades": <TimeGraph name="Cumulative Grades" labels={props.data.processed.scorePerDateLabels[dateFormat]} data={[
                { name: "Total SS", set: props.data.processed.scorePerDate[dateFormat].map(x => x.cumulative_rank_ss), color: { r: 197, g: 197, b: 197 } },
                { name: "Total S", set: props.data.processed.scorePerDate[dateFormat].map(x => x.cumulative_rank_s), color: { r: 255, g: 186, b: 14 } },
                { name: "Total A", set: props.data.processed.scorePerDate[dateFormat].map(x => x.cumulative_rank_a), color: { r: 163, g: 163, b: 163 } },
                { name: "Total B", set: props.data.processed.scorePerDate[dateFormat].map(x => x.cumulative_rank_b), color: { r: 255, g: 148, b: 11 } },
                { name: "Total C", set: props.data.processed.scorePerDate[dateFormat].map(x => x.cumulative_rank_c), color: { r: 133, g: 214, b: 28 } },
                { name: "Total D", set: props.data.processed.scorePerDate[dateFormat].map(x => x.cumulative_rank_d), color: { r: 243, g: 87, b: 90 } },
            ]} />,
            "ppPerPlay": <TimeGraph name="Average PP per play" labels={props.data.processed.scorePerDateLabels[dateFormat]} data={[{ name: "Average PP", set: props.data.processed.scorePerDate[dateFormat].map(x => x.average_pp), color: { r: 255, g: 102, b: 158 } }]} />,
            "highestPPPlay": <TimeGraph name="Highest PP play" labels={props.data.processed.scorePerDateLabels[dateFormat]} data={[{ name: "Highest PP", set: props.data.processed.scorePerDate[dateFormat].map(x => x.highest_pp), color: { r: 255, g: 102, b: 158 } }]} />,
            "srPerPlay": <TimeGraph name="Average SR per play" labels={props.data.processed.scorePerDateLabels[dateFormat]} data={[{ name: "Average SR", set: props.data.processed.scorePerDate[dateFormat].map(x => x.average_sr), color: { r: 255, g: 102, b: 158 } }]} />,
            "scorePerPlay": <TimeGraph name="Average score per play" labels={props.data.processed.scorePerDateLabels[dateFormat]} data={[{ name: "Average score", set: props.data.processed.scorePerDate[dateFormat].map(x => x.average_score), color: { r: 255, g: 102, b: 158 } }]} />,
            "lengthPerPlay": <TimeGraph name="Average length per play" labels={props.data.processed.scorePerDateLabels[dateFormat]} data={[{ name: "Average score", set: props.data.processed.scorePerDate[dateFormat].map(x => x.average_length), color: { r: 255, g: 102, b: 158 } }]} />,
        });
    };

    const graphButtons = [
        {
            title: `Per ${dateFormat}`, buttons: [
                { id: "clearsPerSection", title: "Clears" },
                { id: "totalscorePerSection", title: "Score" },
                { id: "gradesPerSection", title: "Grades" },
                { id: "ppPerSection", title: "PP" },
                { id: "lengthPerSection", title: "Length" },
            ]
        },
        {
            title: "Cumulative", buttons: [
                { id: "cumulativeClears", title: "Clears" },
                { id: "cumulativeScore", title: "Score" },
                { id: "cumulativeGrades", title: "Grades" },
                { id: "cumulativePP", title: "PP" },
                { id: "cumulativeLength", title: "Length" },
            ]
        },
        {
            title: "Other", buttons: [
                { id: "srPerPlay", title: "Average SR" },
                { id: "scorePerPlay", title: "Average Score" },
                { id: "lengthPerPlay", title: "Average Length" },
                { id: "ppPerPlay", title: "Average PP" },
                { id: "highestPPPlay", title: "Highest PP" },
                { id: "completion", title: "Completion" },
            ]
        }
    ]

    useEffect(() => {
        if (props.data.processed.scorePerDate === undefined || props.data.processed.scorePerDate[dateFormat] === undefined) {
            (async function () {
                await new Promise(r => setTimeout(r, 1000));
                Promise.resolve(processData(scores)).then(() => { forceUpdate(); });
            })();
        } else {
            createGraphs();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        (props.data.processed.scorePerDate !== undefined && props.data.processed.scorePerDate[dateFormat] !== undefined) ?
            <>
                <Grid container spacing={3}>
                    <Grid item xs={12} md={12} lg={12}>
                        <Paper elevation={5}>
                            <Grid>
                                {
                                    graphs !== null ?
                                        (graphs[timeGraphValue]) : <></>
                                }
                            </Grid>

                            <Table size='small'>
                                <TableBody>
                                    {
                                        graphButtons.map((group, i) => (
                                            <TableRow key={i}>
                                                <TableCell>
                                                    <Typography variant="h6">{group.title}</Typography>
                                                </TableCell>
                                                <TableCell>
                                                    <ButtonGroup>
                                                        {
                                                            group.buttons.map((button, j) => (
                                                                <Button variant={timeGraphValue === button.id ? 'contained' : 'outlined'} key={j} onClick={() => { setTimeGraphValue(button.id); }}>{button.title}</Button>
                                                            )
                                                            )
                                                        }
                                                    </ButtonGroup>
                                                </TableCell>
                                            </TableRow>
                                        )
                                        )
                                    }
                                </TableBody>
                            </Table>
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