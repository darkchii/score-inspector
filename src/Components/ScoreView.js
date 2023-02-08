import { Box, Card, CardContent, CardMedia, Chip, Grid, Link, Table, TableBody, TableCell, tableCellClasses, TableContainer, TableHead, TableRow, Tooltip, Typography } from '@mui/material';
import { Chart as ChartJS, ArcElement, Tooltip as ChartTooltip, Legend } from 'chart.js';
import moment from 'moment';
import { useEffect } from 'react';
import { useState } from 'react';
import { Doughnut } from 'react-chartjs-2';
import { getGradeIcon } from '../Helpers/Assets';
import { toFixedNumber } from '../Helpers/Misc';
import { getBeatmapMaxscore, getHitsFromAccuracy, getModString, mods } from '../Helpers/Osu';
import { getCalculator } from '../Helpers/Performance/Performance';
import { getPerformanceLive } from '../Helpers/Performance/PerformanceLive';
ChartJS.register(ArcElement, ChartTooltip, Legend);

function ScoreView(props) {
    const [score, setScore] = useState(-1);
    const [performance, setPerformance] = useState(null);
    const [sr, setSR] = useState(null);

    useEffect(() => {
        if (props.data !== undefined && props.data.score !== undefined) {
            setSR(null);
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

            const accHits = [];
            accHits["100%"] = getHitsFromAccuracy(100, props.data.score.beatmap.objects, 0);
            accHits["99%"] = getHitsFromAccuracy(99, props.data.score.beatmap.objects, 0);
            accHits["98%"] = getHitsFromAccuracy(98, props.data.score.beatmap.objects, 0);
            accHits["95%"] = getHitsFromAccuracy(95, props.data.score.beatmap.objects, 0);
            accHits["90%"] = getHitsFromAccuracy(90, props.data.score.beatmap.objects, 0);
            accHits["80%"] = getHitsFromAccuracy(80, props.data.score.beatmap.objects, 0);

            const pp = [];
            pp["100%"] = getCalculator(props.data.pp_version ?? 'live', { accuracy: 1, score: props.data.score, combo: props.data.score.beatmap.maxcombo, count300: accHits["100%"].count300, count100: accHits["100%"].count100, count50: accHits["100%"].count50, countmiss: accHits["100%"].countmiss });
            pp["99%"] = getCalculator(props.data.pp_version ?? 'live', { accuracy: 0.99, score: props.data.score, combo: props.data.score.beatmap.maxcombo, count300: accHits["99%"].count300, count100: accHits["99%"].count100, count50: accHits["99%"].count50, countmiss: accHits["99%"].countmiss });
            pp["98%"] = getCalculator(props.data.pp_version ?? 'live', { accuracy: 0.98, score: props.data.score, combo: props.data.score.beatmap.maxcombo, count300: accHits["98%"].count300, count100: accHits["98%"].count100, count50: accHits["98%"].count50, countmiss: accHits["98%"].countmiss });
            pp["95%"] = getCalculator(props.data.pp_version ?? 'live', { accuracy: 0.95, score: props.data.score, combo: props.data.score.beatmap.maxcombo, count300: accHits["95%"].count300, count100: accHits["95%"].count100, count50: accHits["95%"].count50, countmiss: accHits["95%"].countmiss });
            pp["90%"] = getCalculator(props.data.pp_version ?? 'live', { accuracy: 0.90, score: props.data.score, combo: props.data.score.beatmap.maxcombo, count300: accHits["90%"].count300, count100: accHits["90%"].count100, count50: accHits["90%"].count50, countmiss: accHits["90%"].countmiss });
            pp["80%"] = getCalculator(props.data.pp_version ?? 'live', { accuracy: 0.80, score: props.data.score, combo: props.data.score.beatmap.maxcombo, count300: accHits["80%"].count300, count100: accHits["80%"].count100, count50: accHits["80%"].count50, countmiss: accHits["80%"].countmiss });

            setPerformance(pp);
            const _sr = props.data.pp_version ?
                (props.data.score.beatmap.modded_sr[props.data.pp_version] ?? props.data.score.beatmap.modded_sr) :
                props.data.score.beatmap.modded_sr;
            setSR(_sr);
        }
    }, [props.data, props.data.score.score]);

    return (
        <>
            {props.data !== undefined && props.data.score !== undefined && sr !== null ?
                <Card sx={props.data.style}>
                    <CardMedia
                        component="img"
                        height="140"
                        image={`https://assets.ppy.sh/beatmaps/${props.data.score.beatmap.set_id}/covers/cover.jpg`}
                    />
                    <CardContent sx={{ px: 0, py: 0, backgroundColor: 'background.paper2' }}>
                        <Card sx={{ borderRadius: 0, backgroundColor: '#2E293D' }}>
                            <CardContent>
                                <Typography id="modal-modal-title" variant="h6" component="h2"><Chip sx={{ mr: 1 }} size='small' label={`${sr.star_rating.toFixed(2)}★`} variant="outlined" /> {props.data.score.beatmap.artist} - {props.data.score.beatmap.title} [{props.data.score.beatmap.diffname}] {`${props.data.score.enabled_mods > 0 ? '+' : ''}${getModString(props.data.score.enabled_mods)}`}</Typography>
                            </CardContent>
                        </Card>
                        <Box sx={{ px: 4 }}>
                            <Grid container spacing={3} sx={{ justifyContent: 'left', my: 1 }}>
                                <Grid item sx={{ width: '25%' }}>
                                    <Doughnut data={{
                                        labels: ["300", "100", "50", "Miss"],
                                        datasets: [
                                            {
                                                data: [props.data.score.count300, props.data.score.count100, props.data.score.count50, props.data.score.countmiss],
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
                                            <Typography variant="h3" sx={{ mt: 0 }}>{toFixedNumber(score, 0).toLocaleString('en-US')}</Typography>
                                            <Typography variant="subtitle1" display="flex" alignItems="center" sx={{ mt: 0 }} spacing="5">
                                                <img alt={props.data.score.rank} src={getGradeIcon(props.data.score.rank)} />&nbsp;<b>{props.data.score.accuracy.toFixed(2)}%</b>&nbsp;★&nbsp;<b>{props.data.score.displayed_pp.total.toFixed(2)}pp</b>&nbsp;★&nbsp;<b>{props.data.score.combo}x/{props.data.score.beatmap.maxcombo}x</b>
                                            </Typography>
                                            <Typography variant="subtitle1" display="flex" alignItems="center" sx={{ mt: 0 }} spacing="5">
                                                Played&nbsp;<b><Tooltip title={'' + props.data.score.date_played}><Grid>{moment(props.data.score.date_played).fromNow()}</Grid></Tooltip></b>&nbsp;★ Ranked&nbsp;<b><Tooltip title={'' + props.data.score.beatmap.approved_date}><Grid>{moment(props.data.score.beatmap.approved_date).fromNow()}</Grid></Tooltip></b>
                                            </Typography>
                                            <Typography variant="subtitle1" display="flex" alignItems="center" sx={{ mt: 0 }} spacing="5">
                                                AR&nbsp;<b>{sr.modded_ar.toFixed(2)}</b>&nbsp;★ CS&nbsp;<b>{sr.modded_cs.toFixed(2)}</b>&nbsp;★ HP&nbsp;<b>{sr.modded_hp.toFixed(2)}</b>&nbsp;★ OD&nbsp;<b>{sr.modded_od.toFixed(2)}</b>
                                            </Typography>
                                            <Typography variant="subtitle1" display="flex" alignItems="center" sx={{ mt: 0 }} spacing="5">
                                                {moment.utc(moment.duration(props.data.score.beatmap.modded_length, 'seconds').asMilliseconds()).format("mm:ss")} minutes&nbsp;★&nbsp;
                                                <b>{(props.data.score.mods & mods.DoubleTime ? props.data.score.bpm * 1.5 : (props.data.score.mods & mods.HalfTime ? props.data.score.beatmap.bpm * 0.75 : props.data.score.beatmap.bpm))}</b> bpm
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
                                                <TableCell>{(props.data.score.displayed_pp?.aim ?? 0).toFixed(1)}pp</TableCell>
                                                <TableCell>{(props.data.score.displayed_pp?.speed ?? 0).toFixed(1)}pp</TableCell>
                                                <TableCell>{(props.data.score.displayed_pp?.acc ?? 0).toFixed(1)}pp</TableCell>
                                                <TableCell>{(props.data.score.displayed_pp?.flashlight ?? 0).toFixed(1)}pp</TableCell>
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
                                                            <TableCell>{(performance["80%"]?.total ?? 0).toFixed(0)}pp</TableCell>
                                                            <TableCell>{(performance["90%"]?.total ?? 0).toFixed(0)}pp</TableCell>
                                                            <TableCell>{(performance["95%"]?.total ?? 0).toFixed(0)}pp</TableCell>
                                                            <TableCell>{(performance["98%"]?.total ?? 0).toFixed(0)}pp</TableCell>
                                                            <TableCell>{(performance["99%"]?.total ?? 0).toFixed(0)}pp</TableCell>
                                                            <TableCell>{(performance["100%"]?.total ?? 0).toFixed(0)}pp</TableCell>
                                                        </TableRow>
                                                    </TableBody>
                                                </Table>
                                            </TableContainer>
                                        </Card>
                                    </>
                                    : <></>
                            }
                            <Typography id="modal-modal-description" sx={{ mt: 0 }}>
                                Mapped by <Link href={`https://osu.ppy.sh/users/${props.data.score.beatmap.creator_id}`} target='_blank' rel='noreferrer'>{props.data.score.beatmap.creator}</Link>
                                &nbsp;- Go to <Link href={`https://osu.ppy.sh/beatmaps/${props.data.score.beatmap.beatmap_id}`} target='_blank' rel='noreferrer'>Beatmap</Link>
                                &nbsp;- Played by <Link href={`https://osu.ppy.sh/users/${props.data.score.user_id}`} target='_blank' rel='noreferrer'>{props.data.score.user.username}</Link>
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