/* eslint-disable react-hooks/exhaustive-deps */
import { Box, Card, CardContent, CardMedia, Chip, Grid2, Link, ListItem, Stack, Table, TableBody, TableCell, tableCellClasses, TableContainer, TableHead, TableRow, Tooltip, Typography } from '@mui/material';
import { Chart as ChartJS, ArcElement, Tooltip as ChartTooltip, Legend } from 'chart.js';
import moment from 'moment';
import { useEffect } from 'react';
import { useState } from 'react';
import { Doughnut } from 'react-chartjs-2';
import { getGradeIcon } from '../Helpers/Assets';
import { toFixedNumber } from '../Helpers/Misc';
import { getBeatmapMaxscore, getHitsFromAccuracy, getModString, mods } from '../Helpers/Osu';
import { getCalculator } from '../Helpers/Performance/Performance';
import { getBeatmapScores } from '../Helpers/OsuAlt';
import { prepareBeatmap, prepareScore } from '../Helpers/ScoresProcessor';
import { GetFormattedName } from '../Helpers/Account';
import { Grid, List } from "react-virtualized";
import { blue, green, orange, red, yellow } from '@mui/material/colors';
import WarningIcon from '@mui/icons-material/Warning';
import Mods from '../Helpers/Mods';
import ScoreDial from './ScoreDial';
ChartJS.register(ArcElement, ChartTooltip, Legend);

function ScoreViewStat(props) {
    return (
        <div className='score-stats__stat'>
            <div className='score-stats__stat-row score-stats__stat-row--label'>
                {props.label}
            </div>
            <div className={`score-stats__stat-row ${props.small ? 'score-stats__stat-small' : ''}`}>
                {props.value}
            </div>
        </div>
    );
}

function ScoreView(props) {
    const [scoreData, setScoreData] = useState(null);
    const [beatmapData, setBeatmapData] = useState(null);

    async function fixScore(score) {
        let _score = score.score;
        if (score.score === -1) { //if we get -1, we approximate the score of this play
            if (_score !== null && _score !== null) {
                _score = await getBeatmapMaxscore(score.beatmap_id);
                var mul = 1;

                if (Mods.hasMod(_score.mods, "EZ")) { mul *= 0.5; }
                if (Mods.hasMod(_score.mods, "NF")) { mul *= 0.5; }
                if (Mods.hasMod(_score.mods, "HT")) { mul *= 0.3; }
                if (Mods.hasMod(_score.mods, "HR")) { mul *= 1.12; }
                if (Mods.hasMod(_score.mods, "DT")) { mul *= 1.06; }
                if (Mods.hasMod(_score.mods, "NC")) { mul *= 1.06; }
                if (Mods.hasMod(_score.mods, "HD")) { mul *= 1.06; }

                const real_score = _score * mul;

                score.score = (real_score * (score.accuracy * 0.01)).toFixed(0);
            }
        }
        return score;
    }

    async function applyScore(pp_version, score, beatmap) {
        let _score = await fixScore(JSON.parse(JSON.stringify(score)));
        const _scoreData = {};

        _score.beatmap = JSON.parse(JSON.stringify(beatmap));

        _scoreData.difficulty_data = _score.beatmap.difficulty_data;
        console.log(_score);
        // _score = prepareScore(_score, null);
        _scoreData.score = _score;

        const accHits = [];
        accHits["100%"] = getHitsFromAccuracy(100, beatmap.objects, 0);
        accHits["99%"] = getHitsFromAccuracy(99, beatmap.objects, 0);
        accHits["98%"] = getHitsFromAccuracy(98, beatmap.objects, 0);
        accHits["95%"] = getHitsFromAccuracy(95, beatmap.objects, 0);
        accHits["90%"] = getHitsFromAccuracy(90, beatmap.objects, 0);
        accHits["80%"] = getHitsFromAccuracy(80, beatmap.objects, 0);

        const pp = [];
        pp["100%"] = getCalculator(pp_version ?? 'live', { accuracy: 1, score: _score, combo: beatmap.maxcombo, count300: accHits["100%"].count300, count100: accHits["100%"].count100, count50: accHits["100%"].count50, countmiss: accHits["100%"].countmiss });
        pp["99%"] = getCalculator(pp_version ?? 'live', { accuracy: 0.99, score: _score, combo: beatmap.maxcombo, count300: accHits["99%"].count300, count100: accHits["99%"].count100, count50: accHits["99%"].count50, countmiss: accHits["99%"].countmiss });
        pp["98%"] = getCalculator(pp_version ?? 'live', { accuracy: 0.98, score: _score, combo: beatmap.maxcombo, count300: accHits["98%"].count300, count100: accHits["98%"].count100, count50: accHits["98%"].count50, countmiss: accHits["98%"].countmiss });
        pp["95%"] = getCalculator(pp_version ?? 'live', { accuracy: 0.95, score: _score, combo: beatmap.maxcombo, count300: accHits["95%"].count300, count100: accHits["95%"].count100, count50: accHits["95%"].count50, countmiss: accHits["95%"].countmiss });
        pp["90%"] = getCalculator(pp_version ?? 'live', { accuracy: 0.90, score: _score, combo: beatmap.maxcombo, count300: accHits["90%"].count300, count100: accHits["90%"].count100, count50: accHits["90%"].count50, countmiss: accHits["90%"].countmiss });
        pp["80%"] = getCalculator(pp_version ?? 'live', { accuracy: 0.80, score: _score, combo: beatmap.maxcombo, count300: accHits["80%"].count300, count100: accHits["80%"].count100, count50: accHits["80%"].count50, countmiss: accHits["80%"].countmiss });
        _scoreData.pp = pp;

        console.log(_scoreData);

        setScoreData(_scoreData);
    }

    async function applyBeatmap(pp_version, beatmap) {
        const _beatmapData = {};
        _beatmapData.beatmap = beatmap;
        _beatmapData.difficulty_data = beatmap.difficulty_data;
        setBeatmapData(_beatmapData);
    }

    useEffect(() => {
        setScoreData(null);
        if (props.data !== undefined) {
            (async () => {
                let _beatmap = JSON.parse(JSON.stringify(props.data.score?.beatmap || props.data.beatmap));
                // _beatmap = await getBeatmap(_beatmap.beatmap_id, props.data.score.mods_enum);
                _beatmap = prepareBeatmap(_beatmap);
                if (props.data.score !== undefined) {
                    await applyScore(props.data.pp_version, props.data.score, _beatmap);
                }
                await applyBeatmap(props.data.pp_version, _beatmap);
            })();
        }
    }, [props.data, props.data.score, props.data.beatmap]);

    if (!scoreData)
        return <></>;

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
                                    <Chip sx={{ mr: 1 }} size='small' label={`${scoreData !== null ? scoreData.difficulty_data?.star_rating.toFixed(2) : beatmapData.difficulty_data?.[0].star_rating.toFixed(2)}★`} variant="outlined" />
                                    {beatmapData.beatmap.artist} - {beatmapData.beatmap.title} [{beatmapData.beatmap.diffname}] {beatmapData.difficulty_data?.is_legacy ?
                                        <Tooltip title="This score uses old star ratings and may cause incorrect mod and/or pp values">
                                            <WarningIcon sx={{ color: orange[500] }} />
                                        </Tooltip>
                                        : null}</Typography>
                            </CardContent>
                        </Card>
                        <Grid2 sx={{
                            m: 2
                        }}>
                            <Stack direction="column" spacing={1} sx={{
                                justifyContent: 'center',
                                alignItems: 'center',
                            }}>
                                <ScoreDial score={scoreData.score} />
                                <Typography variant="h3">{toFixedNumber(scoreData.score.score, 0).toLocaleString('en-US')}</Typography>
                                <Box sx={{
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                }}>
                                    {Mods.getModElements(scoreData.score.mods)}
                                </Box>
                                <div className='score-stats__group score-stats__group--stats'>
                                    <div className='score-stats__group-row'>
                                        <ScoreViewStat label='Accuracy' value={`${scoreData.score.accuracy.toFixed(2)}%`} />
                                        <ScoreViewStat label='Max Combo' value={`${scoreData.score.combo}/${beatmapData.beatmap.maxcombo}`} />
                                        <ScoreViewStat label='PP' value={`${(scoreData.score.recalc[props.data.pp_version]?.total ?? 0).toFixed(0)}`} />
                                    </div>
                                    <div className='score-stats__group-row'>
                                        <ScoreViewStat label='Great' value={`${scoreData.score.count300}`} />
                                        <ScoreViewStat label='Ok' value={`${scoreData.score.count100}`} />
                                        <ScoreViewStat label='Meh' value={`${scoreData.score.count50}`} />
                                        <ScoreViewStat label='Miss' value={`${scoreData.score.countmiss}`} />
                                    </div>
                                    <div className='score-stats__group-row'>
                                        <ScoreViewStat label='AR' value={`${scoreData.difficulty_data?.approach_rate.toFixed(2)}`} />
                                        <ScoreViewStat label='CS' value={`${scoreData.difficulty_data?.circle_size.toFixed(2)}`} />
                                        <ScoreViewStat label='HP' value={`${scoreData.difficulty_data?.drain_rate.toFixed(2)}`} />
                                        <ScoreViewStat label='OD' value={`${scoreData.difficulty_data?.overall_difficulty.toFixed(2)}`} />
                                    </div>
                                    <div className='score-stats__group-row'>
                                        <ScoreViewStat label='Aim PP' value={`${(scoreData.score.recalc[props.data.pp_version]?.aim ?? 0).toFixed(1)}`} />
                                        <ScoreViewStat label='Speed PP' value={`${(scoreData.score.recalc[props.data.pp_version]?.speed ?? 0).toFixed(1)}`} />
                                        <ScoreViewStat label='Flashlight PP' value={`${(scoreData.score.recalc[props.data.pp_version]?.flashlight ?? 0).toFixed(1)}`} />
                                    </div>
                                </div>
                                <Typography variant="subtitle2" display="flex" alignItems="center" sx={{ mt: 0 }} spacing="5">
                                    {/* pretty print like 23 November 2024 3:52 PM */}
                                    Played on {moment(scoreData.score.date_played).format('LLL')}
                                </Typography>
                                <div className='score-stats__group score-stats__group--stats'>
                                    <div className='score-stats__group-row'><ScoreViewStat label='Aim Rating' value={`${(scoreData.difficulty_data?.aim_difficulty ?? 0).toFixed(8)}★`} small={true} /></div>
                                    <div className='score-stats__group-row'><ScoreViewStat label='Speed Rating' value={`${(scoreData.difficulty_data?.speed_difficulty ?? 0).toFixed(8)}★`} small={true} /></div>
                                    <div className='score-stats__group-row'><ScoreViewStat label='Flashlight Rating' value={`${(scoreData.difficulty_data?.flashlight_difficulty ?? 0).toFixed(8)}★`} small={true} /></div>
                                    <div className='score-stats__group-row'><ScoreViewStat label='Speed note count' value={`${(scoreData.difficulty_data?.speed_note_count ?? 0).toFixed(8)}`} small={true} /></div>
                                    <div className='score-stats__group-row'><ScoreViewStat label='Aim Difficult Strain Count' value={`${(scoreData.difficulty_data?.aim_difficult_strain_count ?? 0).toFixed(8)}`} small={true} /></div>
                                    <div className='score-stats__group-row'><ScoreViewStat label='Speed Difficult Strain Count' value={`${(scoreData.difficulty_data?.speed_difficult_strain_count ?? 0).toFixed(8)}`} small={true} /></div>
                                    <div className='score-stats__group-row'><ScoreViewStat label='Slider Factor' value={`${(scoreData.difficulty_data?.slider_factor ?? 0).toFixed(8)}`} small={true} /></div>

                                </div>
                            </Stack>
                        </Grid2>
                        {/* <Box sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}>
                            <Box sx={{ px: 4, width: '1400px' }}>

                                {
                                    scoreData !== null ?
                                        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                                            <Box sx={{ px: 4, width: '60%' }}>
                                                <Grid2 container spacing={3} sx={{ justifyContent: 'left', my: 1 }}>
                                                    <Grid2 size={{ width: '30%' }}>
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
                                                    </Grid2>
                                                    <Grid2 size={{ width: '70%', minHeight: '100%' }}>
                                                        <Box height="100%" direction="column" display="flex" alignItems="center">
                                                            <Grid2>
                                                                <Typography variant="h3" sx={{ mt: 0 }}>{toFixedNumber(scoreData.score.score, 0).toLocaleString('en-US')}</Typography>
                                                                <Typography variant="subtitle1" display="flex" alignItems="center" sx={{ mt: 0 }} spacing="5">
                                                                    <img alt={scoreData.score.rank} src={getGradeIcon(scoreData.score.rank)} />&nbsp;<b>{scoreData.score.accuracy.toFixed(2)}%</b>&nbsp;★&nbsp;<b>{scoreData.score.recalc[props.data.pp_version].total.toFixed(2)}pp</b>&nbsp;★&nbsp;<b>{scoreData.score.combo}x/{beatmapData.beatmap.maxcombo}x</b>
                                                                </Typography>
                                                                <Typography variant="subtitle1" display="flex" alignItems="center" sx={{ mt: 0 }} spacing="5">
                                                                    Played&nbsp;<b><Tooltip title={'' + scoreData.score.date_played}><Grid2>{moment(scoreData.score.date_played).fromNow()}</Grid2></Tooltip></b>&nbsp;★ Ranked&nbsp;<b><Tooltip title={'' + beatmapData.beatmap.approved_date}><Grid2>{moment(beatmapData.beatmap.approved_date).fromNow()}</Grid2></Tooltip></b>
                                                                </Typography>
                                                                <Typography variant="subtitle1" display="flex" alignItems="center" sx={{ mt: 0 }} spacing="5">
                                                                    AR&nbsp;<b>{scoreData.difficulty_data?.approach_rate.toFixed(2)}</b>&nbsp;★ CS&nbsp;<b>{scoreData.difficulty_data?.circle_size.toFixed(2)}</b>&nbsp;★ HP&nbsp;<b>{scoreData.difficulty_data?.drain_rate.toFixed(2)}</b>&nbsp;★ OD&nbsp;<b>{scoreData.difficulty_data?.overall_difficulty.toFixed(2)}</b>
                                                                </Typography>
                                                                <Typography variant="subtitle1" display="flex" alignItems="center" sx={{ mt: 0 }} spacing="5">
                                                                    {moment.utc(moment.duration(scoreData.score.beatmap.modded_length, 'seconds').asMilliseconds()).format("mm:ss")} minutes&nbsp;★&nbsp;
                                                                    <b>{(scoreData.score.mods & mods.DoubleTime ? scoreData.score.bpm * 1.5 : (scoreData.score.mods & mods.HalfTime ? beatmapData.beatmap.bpm * 0.75 : beatmapData.beatmap.bpm))}</b> bpm
                                                                </Typography>
                                                                <Typography variant="subtitle1" display="flex" alignItems="center" sx={{ mt: 0 }} spacing="5">
                                                                    Played by&nbsp;<Link href={`https://osu.ppy.sh/users/${scoreData.score.user_id}`} target='_blank' rel='noreferrer'>{scoreData.score.user.username}</Link>
                                                                </Typography>
                                                            </Grid2>
                                                        </Box>
                                                    </Grid2>
                                                </Grid2>
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
                                                                    <TableCell>{(scoreData.score.recalc[props.data.pp_version]?.aim ?? 0).toFixed(1)}pp</TableCell>
                                                                    <TableCell>{(scoreData.score.recalc[props.data.pp_version]?.speed ?? 0).toFixed(1)}pp</TableCell>
                                                                    <TableCell>{(scoreData.score.recalc[props.data.pp_version]?.acc ?? 0).toFixed(1)}pp</TableCell>
                                                                    <TableCell>{(scoreData.score.recalc[props.data.pp_version]?.flashlight ?? 0).toFixed(1)}pp</TableCell>
                                                                </TableRow>
                                                            </TableBody>
                                                        </Table>
                                                    </TableContainer>
                                                </Card>
                                                <Typography>Skill breakdown</Typography>
                                                <Card variant="outlined" sx={{ mb: 3 }}>
                                                    <TableContainer>
                                                        <Table size="small" sx={{
                                                            [`& .${tableCellClasses.root}`]: {
                                                                borderBottom: "none"
                                                            }
                                                        }}>
                                                            <TableHead>
                                                                <TableRow>
                                                                    <TableCell>Aim</TableCell>
                                                                    <TableCell>Speed</TableCell>
                                                                    <TableCell>Strain</TableCell>
                                                                    <TableCell>Flashlight</TableCell>
                                                                </TableRow>
                                                            </TableHead>
                                                            <TableBody>
                                                                <TableRow>
                                                                    <TableCell>{(scoreData.difficulty_data?.aim_difficulty ?? 0).toFixed(2)}★</TableCell>
                                                                    <TableCell>{(scoreData.difficulty_data?.speed_difficulty ?? 0).toFixed(2)}★</TableCell>
                                                                    <TableCell>{(scoreData.difficulty_data?.flashlight_difficulty ?? 0).toFixed(2)}★</TableCell>
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
                                        </Box>
                                        : <></>
                                }
                            </Box>
                        </Box>
                        <Box sx={{ px: 4 }}>
                            <Typography id="modal-modal-description" sx={{ mt: 0 }}>
                                Mapped by <Link href={`https://osu.ppy.sh/users/${props.data.score.beatmap.creator_id}`} target='_blank' rel='noreferrer'>{props.data.score.beatmap.creator}</Link>
                                &nbsp;- Go to <Link href={`https://osu.ppy.sh/beatmaps/${props.data.score.beatmap.beatmap_id}`} target='_blank' rel='noreferrer'>Beatmap</Link>
                            </Typography>
                        </Box> */}
                    </CardContent>
                </Card>
                : <></>
            }
        </>
    );
}
export default ScoreView;