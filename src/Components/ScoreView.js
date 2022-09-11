import { Tooltip, Box, Card, CardContent, CardMedia, Chip, Modal, Typography, Grid, Paper, Table, TableContainer, TableHead, TableRow, TableCell, TableBody, tableCellClasses, CardHeader, Link } from "@mui/material";
import React, { useEffect } from "react";
import NumberFormat from "react-number-format";
import TimeGraph from "./TimeGraph";
import { Doughnut, Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip as ChartTooltip, Legend } from 'chart.js';
import { getGradeIcon, getModIcon } from "../Assets";
import { getModString, mods, mod_strings_long } from "../helper";
import { getBeatmapMaxscore } from "../osu";
import moment from "moment";
import { getPerformanceLive } from "../Performance/PerformanceLive";
ChartJS.register(ArcElement, ChartTooltip, Legend);

function ScoreView(props) {
    const [score, setScore] = React.useState(-1);
    const [performance, setPerformance] = React.useState(null);

    useEffect(() => {
        if (props.data !== undefined && props.data.score !== undefined) {

            setScore(props.data.score.score);
            async function fixScore() {
                if (props.data.score.score === -1) { //if we get -1, we approximate the score of this play
                    const _score = await getBeatmapMaxscore(props.data.score.beatmap_id);
                    if (_score !== null && _score !== null) {
                        var mul = 1;
                        const m = props.data.score.enabled_mods;

                        if (m & mods.EZ) { mul *= 0.5; }
                        if (m & mods.NF) { mul *= 0.5; }
                        if (m & mods.HT) { mul *= 0.3; }
                        if (m & mods.HR) { mul *= 1.12; }
                        if (m & mods.DT) { mul *= 1.06; }
                        if (m & mods.NC) { mul *= 1.06; }
                        if (m & mods.HD) { mul *= 1.06; }

                        const real_score = _score * mul;

                        props.data.score.score = (real_score * (props.data.score.accuracy * 0.01)).toFixed(0);
                        setScore(_score);
                    }
                }
            }
            fixScore();

            setPerformance(null);

            const pp = [];
            pp["100%"] = getPerformanceLive({ accuracy: 1, score: props.data.score, combo: props.data.maxcombo, count300: props.data.score.count300 + props.data.score.count100 + props.data.score.count50 + props.data.score.countmiss, count100: 0, count50: 0, countmiss: 0 });
            pp["99%"] = getPerformanceLive({ accuracy: 0.99, score: props.data.score, combo: props.data.score.maxcombo, count300: props.data.score.count300 + props.data.score.count100 + props.data.score.count50 + props.data.score.countmiss, count100: 0, count50: 0, countmiss: 0 });
            pp["98%"] = getPerformanceLive({ accuracy: 0.98, score: props.data.score, combo: props.data.score.maxcombo, count300: props.data.score.count300 + props.data.score.count100 + props.data.score.count50 + props.data.score.countmiss, count100: 0, count50: 0, countmiss: 0 });
            pp["95%"] = getPerformanceLive({ accuracy: 0.95, score: props.data.score, combo: props.data.score.maxcombo, count300: props.data.score.count300 + props.data.score.count100 + props.data.score.count50 + props.data.score.countmiss, count100: 0, count50: 0, countmiss: 0 });
            pp["90%"] = getPerformanceLive({ accuracy: 0.90, score: props.data.score, combo: props.data.score.maxcombo, count300: props.data.score.count300 + props.data.score.count100 + props.data.score.count50 + props.data.score.countmiss, count100: 0, count50: 0, countmiss: 0 });
            pp["80%"] = getPerformanceLive({ accuracy: 0.80, score: props.data.score, combo: props.data.score.maxcombo, count300: props.data.score.count300 + props.data.score.count100 + props.data.score.count50 + props.data.score.countmiss, count100: 0, count50: 0, countmiss: 0 });

            setPerformance(pp);
        }
    }, [props.data, props.data.score.score]);

    return (
        <>
            {props.data !== undefined && props.data.score !== undefined ?
                <Card sx={props.data.style}>
                    <CardMedia
                        component="img"
                        height="140"
                        image={`https://assets.ppy.sh/beatmaps/${props.data.score.set_id}/covers/cover.jpg`}
                    />
                    <CardContent sx={{ px: 0, py: 0 }}>
                        <Card sx={{ borderRadius: 0, backgroundColor: '#2E293D' }}>
                            <CardContent>
                                <Typography id="modal-modal-title" variant="h6" component="h2"><Chip sx={{ mr: 1 }} size='small' label={`${props.data.score.star_rating.toFixed(2)}★`} variant="outlined" /> {props.data.score.artist} - {props.data.score.title} [{props.data.score.diffname}] {`${props.data.score.enabled_mods > 0 ? '+' : ''}${getModString(props.data.score.enabled_mods)}`}</Typography>
                            </CardContent>
                        </Card>
                        <Box sx={{ px: 4 }}>
                            <Grid container spacing={3} sx={{ justifyContent: 'left', my: 1 }}>
                                <Grid item sx={{ width: '25%' }}>
                                    <Doughnut data={{
                                        labels: ["300", "100", "50", "Miss"],
                                        datasets: [
                                            {
                                                data: [props.data.score.count300, props.data.score.count100, props.data.score.count100, props.data.score.countmiss],
                                                backgroundColor: [
                                                    '#8BC34A',
                                                    '#FDD835',
                                                    '#FB8C00',
                                                    '#D32F2F',
                                                ],
                                                borderWidth: 5,
                                                borderColor: '#ffffff00',
                                                hoverOffset: 5
                                            }
                                        ]
                                    }}
                                        options={{
                                            plugins: {
                                                legend: {
                                                    display: false
                                                },
                                                datalabels: {
                                                    display: 'auto',
                                                    color: 'white',
                                                    font: {
                                                        family: "Roboto",
                                                        weight: 700
                                                    },
                                                    backgroundColor: '#000000aa',
                                                    borderRadius: 4
                                                }
                                            }
                                        }}
                                    ></Doughnut>
                                </Grid>
                                <Grid item sx={{ width: '75%', minHeight: '100%' }}>
                                    <Box height="100%" direction="column" display="flex" alignItems="center">
                                        <Grid>
                                            <Typography variant="h3" sx={{ mt: 0 }}><NumberFormat displayType={'text'} thousandSeparator={true} value={score} /></Typography>
                                            <Typography variant="subtitle1" display="flex" alignItems="center" sx={{ mt: 0 }} spacing="5">{getGradeIcon(props.data.score.rank)}&nbsp;<b>{props.data.score.accuracy.toFixed(2)}%</b>&nbsp;★&nbsp;<b>{props.data.score.pp.toFixed(2)}pp</b>&nbsp;★&nbsp;<b>{props.data.score.combo}x/{props.data.score.maxcombo}x</b>
                                            </Typography>
                                            <Typography variant="subtitle1" display="flex" alignItems="center" sx={{ mt: 0 }} spacing="5">
                                                Played&nbsp;<b><Tooltip title={'' + props.data.score.date_played}><Grid>{moment(props.data.score.date_played).fromNow()}</Grid></Tooltip></b>&nbsp;★ Ranked&nbsp;<b><Tooltip title={'' + props.data.score.approved_date}><Grid>{moment(props.data.score.approved_date).fromNow()}</Grid></Tooltip></b>
                                            </Typography>
                                            <Typography variant="subtitle1" display="flex" alignItems="center" sx={{ mt: 0 }} spacing="5">
                                                AR&nbsp;<b>{props.data.score.modded_ar.toFixed(2)}</b>&nbsp;★ CS&nbsp;<b>{props.data.score.modded_cs.toFixed(2)}</b>&nbsp;★ HP&nbsp;<b>{props.data.score.modded_hp.toFixed(2)}</b>&nbsp;★ OD&nbsp;<b>{props.data.score.modded_od.toFixed(2)}</b>
                                            </Typography>
                                            <Typography variant="subtitle1" display="flex" alignItems="center" sx={{ mt: 0 }} spacing="5">
                                                {moment.utc(moment.duration((props.data.score.mods & mods.DoubleTime ? props.data.score.length * 1.5 : (props.data.score.mods & mods.HalfTime ? props.data.score.length * 0.75 : props.data.score.length)), 'seconds').asMilliseconds()).format("mm:ss")} minutes&nbsp;★&nbsp;
                                                <b>{(props.data.score.mods & mods.DoubleTime ? props.data.score.bpm * 1.5 : (props.data.score.mods & mods.HalfTime ? props.data.score.bpm * 0.75 : props.data.score.bpm))}</b> bpm
                                            </Typography>
                                        </Grid>
                                    </Box>
                                </Grid>
                            </Grid>
                            <Typography>Performance breakdown</Typography>
                            <Card variant="outlined" sx={{ mb: 3 }}>
                                <TableContainer>
                                    <Table size="small" sx={{
                                        [`& .${tableCellClasses.root}`]: {
                                            borderBottom: "none"
                                        }
                                    }}>
                                        <TableHead>
                                            <TableRow>
                                                <TableCell>Aim PP</TableCell>
                                                <TableCell>Speed PP</TableCell>
                                                <TableCell>Accuracy PP</TableCell>
                                                <TableCell>Flashlight PP</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            <TableRow>
                                                <TableCell>{(props.data.score.pp_cur.aim ?? 0).toFixed(1)}pp</TableCell>
                                                <TableCell>{(props.data.score.pp_cur.speed ?? 0).toFixed(1)}pp</TableCell>
                                                <TableCell>{(props.data.score.pp_cur.acc ?? 0).toFixed(1)}pp</TableCell>
                                                <TableCell>{(props.data.score.pp_cur.flashlight ?? 0).toFixed(1)}pp</TableCell>
                                            </TableRow>
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </Card>
                            {
                                performance !== null ?
                                    <>
                                        <Typography>Accuracy to performance</Typography>
                                        <Card variant="outlined" sx={{ mb: 3 }}>
                                            <TableContainer>
                                                <Table size="small" sx={{
                                                    [`& .${tableCellClasses.root}`]: {
                                                        borderBottom: "none"
                                                    }
                                                }}>
                                                    <TableHead>
                                                        <TableRow>
                                                            <TableCell>80% FC</TableCell>
                                                            <TableCell>90% FC</TableCell>
                                                            <TableCell>95% FC</TableCell>
                                                            <TableCell>98% FC</TableCell>
                                                            <TableCell>99% FC</TableCell>
                                                            <TableCell>100% FC</TableCell>
                                                        </TableRow>
                                                    </TableHead>
                                                    <TableBody>
                                                        <TableRow>
                                                            <TableCell>{performance["80%"].total.toFixed(0)}pp</TableCell>
                                                            <TableCell>{performance["90%"].total.toFixed(0)}pp</TableCell>
                                                            <TableCell>{performance["95%"].total.toFixed(0)}pp</TableCell>
                                                            <TableCell>{performance["98%"].total.toFixed(0)}pp</TableCell>
                                                            <TableCell>{performance["99%"].total.toFixed(0)}pp</TableCell>
                                                            <TableCell>{performance["100%"].total.toFixed(0)}pp</TableCell>
                                                        </TableRow>
                                                    </TableBody>
                                                </Table>
                                            </TableContainer>
                                        </Card>
                                    </>
                                    : <></>
                            }
                            <Typography id="modal-modal-description" sx={{ mt: 0 }}>
                                Mapped by <Link href={`https://osu.ppy.sh/users/${props.data.score.creator_id}`} target='_blank' rel='noreferrer'>{props.data.score.creator}</Link> - Go to <Link href={`https://osu.ppy.sh/beatmaps/${props.data.score.beatmap_id}`} target='_blank' rel='noreferrer'>Beatmap</Link>
                            </Typography>
                        </Box>
                    </CardContent>
                </Card>
                : <></>
            }
        </>
    );
}
export default ScoreView;