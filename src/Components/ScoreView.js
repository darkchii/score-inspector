import { Box, Button, Card, CardContent, CardMedia, Chip, Grid, Link, Table, TableBody, TableCell, tableCellClasses, TableContainer, TableHead, TableRow, Tooltip, Typography } from '@mui/material';
import { Chart as ChartJS, ArcElement, Tooltip as ChartTooltip, Legend } from 'chart.js';
import moment from 'moment';
import { useEffect } from 'react';
import { useState } from 'react';
import { Doughnut } from 'react-chartjs-2';
import { getGradeIcon } from '../Helpers/Assets';
import { sleep, toFixedNumber } from '../Helpers/Misc';
import { FilterStarratingArray, getBeatmap, getBeatmapMaxscore, getBeatmaps, getHitsFromAccuracy, getModString, mods } from '../Helpers/Osu';
import { getCalculator } from '../Helpers/Performance/Performance';
import { getBeatmapScores } from '../Helpers/OsuAlt';
import { prepareBeatmap, prepareScore } from '../Helpers/ScoresProcessor';
import { GetFormattedName } from '../Helpers/Account';
ChartJS.register(ArcElement, ChartTooltip, Legend);

function ScoreView(props) {
    const [scoreData, setScoreData] = useState(null);
    const [beatmapData, setBeatmapData] = useState(null);
    const [leaderboardData, setLeaderboardData] = useState(null);

    async function fixScore(score) {
        let _score = score.score;
        if (score.score === -1) { //if we get -1, we approximate the score of this play
            if (_score !== null && _score !== null) {
                _score = await getBeatmapMaxscore(score.beatmap_id);
                var mul = 1;
                const m = score.enabled_mods;

                if (m & mods.EZ) { mul *= 0.5; }
                if (m & mods.NF) { mul *= 0.5; }
                if (m & mods.HT) { mul *= 0.3; }
                if (m & mods.HR) { mul *= 1.12; }
                if (m & mods.DT) { mul *= 1.06; }
                if (m & mods.NC) { mul *= 1.06; }
                if (m & mods.HD) { mul *= 1.06; }

                const real_score = _score * mul;

                score.score = (real_score * (score.accuracy * 0.01)).toFixed(0);
            }
        }
        return score;
    }

    async function applyScore(pp_version, score, beatmap) {
        let _score = await fixScore(JSON.parse(JSON.stringify(score)));
        const _scoreData = {};

        _scoreData.sr = FilterStarratingArray(beatmap.modded_sr, _score.enabled_mods);
        _score.beatmap = JSON.parse(JSON.stringify(beatmap));
        _score.beatmap.modded_sr = _scoreData.sr;
        _score = prepareScore(_score, null);
        console.log(_score);
        _scoreData.score = _score;

        const accHits = [];
        accHits["100%"] = getHitsFromAccuracy(100, beatmap.objects, 0);
        accHits["99%"] = getHitsFromAccuracy(99, beatmap.objects, 0);
        accHits["98%"] = getHitsFromAccuracy(98, beatmap.objects, 0);
        accHits["95%"] = getHitsFromAccuracy(95, beatmap.objects, 0);
        accHits["90%"] = getHitsFromAccuracy(90, beatmap.objects, 0);
        accHits["80%"] = getHitsFromAccuracy(80, beatmap.objects, 0);

        const pp = [];
        pp["100%"] = getCalculator(pp_version ?? 'live', { accuracy: 1, score: score, combo: beatmap.maxcombo, count300: accHits["100%"].count300, count100: accHits["100%"].count100, count50: accHits["100%"].count50, countmiss: accHits["100%"].countmiss });
        pp["99%"] = getCalculator(pp_version ?? 'live', { accuracy: 0.99, score: score, combo: beatmap.maxcombo, count300: accHits["99%"].count300, count100: accHits["99%"].count100, count50: accHits["99%"].count50, countmiss: accHits["99%"].countmiss });
        pp["98%"] = getCalculator(pp_version ?? 'live', { accuracy: 0.98, score: score, combo: beatmap.maxcombo, count300: accHits["98%"].count300, count100: accHits["98%"].count100, count50: accHits["98%"].count50, countmiss: accHits["98%"].countmiss });
        pp["95%"] = getCalculator(pp_version ?? 'live', { accuracy: 0.95, score: score, combo: beatmap.maxcombo, count300: accHits["95%"].count300, count100: accHits["95%"].count100, count50: accHits["95%"].count50, countmiss: accHits["95%"].countmiss });
        pp["90%"] = getCalculator(pp_version ?? 'live', { accuracy: 0.90, score: score, combo: beatmap.maxcombo, count300: accHits["90%"].count300, count100: accHits["90%"].count100, count50: accHits["90%"].count50, countmiss: accHits["90%"].countmiss });
        pp["80%"] = getCalculator(pp_version ?? 'live', { accuracy: 0.80, score: score, combo: beatmap.maxcombo, count300: accHits["80%"].count300, count100: accHits["80%"].count100, count50: accHits["80%"].count50, countmiss: accHits["80%"].countmiss });
        _scoreData.pp = pp;

        setScoreData(_scoreData);
    }

    async function applyBeatmap(pp_version, beatmap) {
        const _beatmapData = {};

        _beatmapData.beatmap = beatmap;

        const _sr = props.data.pp_version ?
            (beatmap.modded_sr[props.data.pp_version] ?? beatmap.modded_sr) :
            beatmap.modded_sr;

        _beatmapData.sr = _sr;

        setBeatmapData(_beatmapData);
    }

    useEffect(() => {
        setScoreData(null);
        if (props.data !== undefined) {
            (async () => {
                let _beatmap = props.data.score?.beatmap ?? props.data.beatmap;
                _beatmap = await getBeatmap(_beatmap.beatmap_id);
                _beatmap = prepareBeatmap(_beatmap);
                if (props.data.score !== undefined) {
                    await applyScore(props.data.pp_version, props.data.score, _beatmap);
                }
                await applyBeatmap(props.data.pp_version, _beatmap);

                //get beatmap scores
                const data = await getBeatmapScores(_beatmap.beatmap_id, 500);
                setLeaderboardData(data);
            })();
        }
    }, [props.data, props.data.score, props.data.beatmap]);

    return (
        <>
            {beatmapData !== null ?
                <Card sx={{ ...props.data.style, maxHeight: '90%', overflowY: 'auto' }}>
                    <CardMedia
                        component="img"
                        height="140"
                        image={`https://assets.ppy.sh/beatmaps/${beatmapData.beatmap.set_id}/covers/cover.jpg`}
                    />
                    <CardContent sx={{ px: 0, py: 0, backgroundColor: 'background.paper2' }}>
                        <Card sx={{ borderRadius: 0, backgroundColor: '#2E293D' }}>
                            <CardContent>
                                <Typography id="modal-modal-title" variant="h6" component="h2">
                                    <Chip sx={{ mr: 1 }} size='small' label={`${scoreData !== null ? scoreData.sr.star_rating.toFixed(2) : beatmapData.modded_sr?.[0].star_rating.toFixed(2)}★`} variant="outlined" />
                                    {beatmapData.beatmap.artist} - {beatmapData.beatmap.title} [{beatmapData.beatmap.diffname}] {scoreData !== null ? `${scoreData.score.enabled_mods > 0 ? '+' : ''}${getModString(scoreData.score.enabled_mods)}` : ''}</Typography>
                            </CardContent>
                        </Card>
                        <Box>
                            {
                                scoreData !== null ?
                                    <Box sx={{ px: 4, maxWidth: '800px', ml: '25%' }}>
                                        <Grid container spacing={3} sx={{ justifyContent: 'left', my: 1 }}>
                                            <Grid item sx={{ width: '30%' }}>
                                                <Doughnut data={{
                                                    labels: ["300", "100", "50", "Miss"],
                                                    datasets: [
                                                        {
                                                            data: [scoreData.score.count300, scoreData.score.count100, scoreData.score.count50, scoreData.score.countmiss],
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
                                            <Grid item sx={{ width: '70%', minHeight: '100%' }}>
                                                <Box height="100%" direction="column" display="flex" alignItems="center">
                                                    <Grid>
                                                        <Typography variant="h3" sx={{ mt: 0 }}>{toFixedNumber(scoreData.score.score, 0).toLocaleString('en-US')}</Typography>
                                                        <Typography variant="subtitle1" display="flex" alignItems="center" sx={{ mt: 0 }} spacing="5">
                                                            <img alt={scoreData.score.rank} src={getGradeIcon(scoreData.score.rank)} />&nbsp;<b>{scoreData.score.accuracy.toFixed(2)}%</b>&nbsp;★&nbsp;<b>{scoreData.score.displayed_pp.total.toFixed(2)}pp</b>&nbsp;★&nbsp;<b>{scoreData.score.combo}x/{beatmapData.beatmap.maxcombo}x</b>
                                                        </Typography>
                                                        <Typography variant="subtitle1" display="flex" alignItems="center" sx={{ mt: 0 }} spacing="5">
                                                            Played&nbsp;<b><Tooltip title={'' + scoreData.score.date_played}><Grid>{moment(scoreData.score.date_played).fromNow()}</Grid></Tooltip></b>&nbsp;★ Ranked&nbsp;<b><Tooltip title={'' + beatmapData.beatmap.approved_date}><Grid>{moment(beatmapData.beatmap.approved_date).fromNow()}</Grid></Tooltip></b>
                                                        </Typography>
                                                        <Typography variant="subtitle1" display="flex" alignItems="center" sx={{ mt: 0 }} spacing="5">
                                                            AR&nbsp;<b>{scoreData.sr.modded_ar.toFixed(2)}</b>&nbsp;★ CS&nbsp;<b>{scoreData.sr.modded_cs.toFixed(2)}</b>&nbsp;★ HP&nbsp;<b>{scoreData.sr.modded_hp.toFixed(2)}</b>&nbsp;★ OD&nbsp;<b>{scoreData.sr.modded_od.toFixed(2)}</b>
                                                        </Typography>
                                                        <Typography variant="subtitle1" display="flex" alignItems="center" sx={{ mt: 0 }} spacing="5">
                                                            {moment.utc(moment.duration(scoreData.score.beatmap.modded_length, 'seconds').asMilliseconds()).format("mm:ss")} minutes&nbsp;★&nbsp;
                                                            <b>{(scoreData.score.mods & mods.DoubleTime ? scoreData.score.bpm * 1.5 : (scoreData.score.mods & mods.HalfTime ? beatmapData.beatmap.bpm * 0.75 : beatmapData.beatmap.bpm))}</b> bpm
                                                        </Typography>
                                                        <Typography variant="subtitle1" display="flex" alignItems="center" sx={{ mt: 0 }} spacing="5">
                                                            Played by&nbsp;<Link href={`https://osu.ppy.sh/users/${scoreData.score.user_id}`} target='_blank' rel='noreferrer'>{scoreData.score.user.username}</Link>
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
                                                            <TableCell>{(scoreData.score.displayed_pp?.aim ?? 0).toFixed(1)}pp</TableCell>
                                                            <TableCell>{(scoreData.score.displayed_pp?.speed ?? 0).toFixed(1)}pp</TableCell>
                                                            <TableCell>{(scoreData.score.displayed_pp?.acc ?? 0).toFixed(1)}pp</TableCell>
                                                            <TableCell>{(scoreData.score.displayed_pp?.flashlight ?? 0).toFixed(1)}pp</TableCell>
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
                                                                        <TableCell>{(scoreData.pp["80%"]?.total ?? 0).toFixed(0)}pp</TableCell>
                                                                        <TableCell>{(scoreData.pp["90%"]?.total ?? 0).toFixed(0)}pp</TableCell>
                                                                        <TableCell>{(scoreData.pp["95%"]?.total ?? 0).toFixed(0)}pp</TableCell>
                                                                        <TableCell>{(scoreData.pp["98%"]?.total ?? 0).toFixed(0)}pp</TableCell>
                                                                        <TableCell>{(scoreData.pp["99%"]?.total ?? 0).toFixed(0)}pp</TableCell>
                                                                        <TableCell>{(scoreData.pp["100%"]?.total ?? 0).toFixed(0)}pp</TableCell>
                                                                    </TableRow>
                                                                </TableBody>
                                                            </Table>
                                                        </TableContainer>
                                                    </Card>
                                                </>
                                                : <></>
                                        }
                                    </Box>
                                    : <></>
                            }
                            <Box sx={{ px: 4 }}>
                                {
                                    leaderboardData !== null ?
                                        <>
                                            <TableContainer>
                                                <Table size="small">
                                                    <TableHead>
                                                        <TableRow>
                                                            <TableCell>#</TableCell>
                                                            <TableCell>Grade</TableCell>
                                                            <TableCell>Player</TableCell>
                                                            <TableCell>Score</TableCell>
                                                            <TableCell>PP</TableCell>
                                                            <TableCell>300</TableCell>
                                                            <TableCell>100</TableCell>
                                                            <TableCell>50</TableCell>
                                                            <TableCell>Miss</TableCell>
                                                            <TableCell></TableCell>
                                                        </TableRow>
                                                    </TableHead>
                                                    <TableBody>
                                                        {
                                                            leaderboardData.map((score, index) => {
                                                                return (
                                                                    <TableRow key={index}>
                                                                        <TableCell>{index + 1}</TableCell>
                                                                        <TableCell><img alt={score.rank} src={getGradeIcon(score.rank)} /></TableCell>
                                                                        <TableCell><Link href={`https://osu.ppy.sh/users/${score.user_id}`} target='_blank' rel='noreferrer'>{GetFormattedName(score.user.inspector_user)}</Link></TableCell>
                                                                        <TableCell>{score.score}</TableCell>
                                                                        <TableCell>{score.pp}</TableCell>
                                                                        <TableCell>{score.count300}</TableCell>
                                                                        <TableCell>{score.count100}</TableCell>
                                                                        <TableCell>{score.count50}</TableCell>
                                                                        <TableCell>{score.countmiss}</TableCell>
                                                                        <TableCell><Button onClick={()=>applyScore(props.data.pp_version, score, beatmapData.beatmap)} size='small'>View</Button></TableCell>
                                                                    </TableRow>
                                                                )
                                                            })
                                                        }
                                                    </TableBody>
                                                </Table>
                                            </TableContainer>
                                        </>
                                        : <>Loading scores ...</>
                                }
                            </Box>
                        </Box>
                        <Box sx={{ px: 4 }}>
                            <Typography id="modal-modal-description" sx={{ mt: 0 }}>
                                Mapped by <Link href={`https://osu.ppy.sh/users/${props.data.score.beatmap.creator_id}`} target='_blank' rel='noreferrer'>{props.data.score.beatmap.creator}</Link>
                                &nbsp;- Go to <Link href={`https://osu.ppy.sh/beatmaps/${props.data.score.beatmap.beatmap_id}`} target='_blank' rel='noreferrer'>Beatmap</Link>
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