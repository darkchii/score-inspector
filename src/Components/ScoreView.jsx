/* eslint-disable react-hooks/exhaustive-deps */
import { Avatar, Box, Card, Divider, FormControlLabel, Grid2, Link, Stack, Switch, Typography } from '@mui/material';
import { Chart as ChartJS, ArcElement, Tooltip as ChartTooltip, Legend } from 'chart.js';
import moment from 'moment';
import { useEffect, useRef } from 'react';
import { useState } from 'react';
import { formatNumber } from '../Helpers/Misc';
import { getBeatmapMaxscore, getHitsFromAccuracy } from '../Helpers/Osu';
import { getCalculator } from '../Helpers/Performance/Performance';
import { prepareBeatmap } from '../Helpers/ScoresProcessor';
import { green, red } from '@mui/material/colors';
import Mods from '../Helpers/Mods';
import ScoreDial from './ScoreDial';
import StarsLabel from './StarsLabel';
import StarIcon from '@mui/icons-material/Star';
import ScoreViewStat from './UI/ScoreViewStat';
import { Link as RLink } from "react-router";
import OsuTooltip from './OsuTooltip';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
ChartJS.register(ArcElement, ChartTooltip, Legend);

function ScoreView(props) {
    const [scoreData, setScoreData] = useState(null);
    const [beatmapData, setBeatmapData] = useState(null);
    const [useCSR, setUseCSR] = useState(true);
    const screenshotArea = useRef(null);

    async function fixScore(score) {
        let _score = score.score;
        if (score.score === -1) { //if we get -1, we approximate the score of this play
            if (_score !== null && _score !== null) {
                _score = await getBeatmapMaxscore(score.beatmap_id);
                var mul = _score.mods.scoreMultiplier;
                const real_score = _score * mul;
                score.score = (real_score * (score.accuracy * 0.01)).toFixed(0);
            }
        }

        console.log(score);
        return score;
    }

    async function applyScore(pp_version, score, beatmap) {
        let _score = await fixScore(JSON.parse(JSON.stringify(score)));
        const _scoreData = {};

        _score.beatmap = JSON.parse(JSON.stringify(beatmap));

        _scoreData.difficulty_data = _score.beatmap.difficulty_data;
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
        pp["100%"] = getCalculator(pp_version ?? 'live', { statistics: _score.maximum_statistics, accuracy: 1, score: _score, combo: beatmap.maxcombo, count300: accHits["100%"].count300, count100: accHits["100%"].count100, count50: accHits["100%"].count50, countmiss: accHits["100%"].countmiss });
        pp["99%"] = getCalculator(pp_version ?? 'live', { statistics: _score.maximum_statistics, accuracy: 0.99, score: _score, combo: beatmap.maxcombo, count300: accHits["99%"].count300, count100: accHits["99%"].count100, count50: accHits["99%"].count50, countmiss: accHits["99%"].countmiss });
        pp["98%"] = getCalculator(pp_version ?? 'live', { statistics: _score.maximum_statistics, accuracy: 0.98, score: _score, combo: beatmap.maxcombo, count300: accHits["98%"].count300, count100: accHits["98%"].count100, count50: accHits["98%"].count50, countmiss: accHits["98%"].countmiss });
        pp["95%"] = getCalculator(pp_version ?? 'live', { statistics: _score.maximum_statistics, accuracy: 0.95, score: _score, combo: beatmap.maxcombo, count300: accHits["95%"].count300, count100: accHits["95%"].count100, count50: accHits["95%"].count50, countmiss: accHits["95%"].countmiss });
        pp["90%"] = getCalculator(pp_version ?? 'live', { statistics: _score.maximum_statistics, accuracy: 0.90, score: _score, combo: beatmap.maxcombo, count300: accHits["90%"].count300, count100: accHits["90%"].count100, count50: accHits["90%"].count50, countmiss: accHits["90%"].countmiss });
        pp["80%"] = getCalculator(pp_version ?? 'live', { statistics: _score.maximum_statistics, accuracy: 0.80, score: _score, combo: beatmap.maxcombo, count300: accHits["80%"].count300, count100: accHits["80%"].count100, count50: accHits["80%"].count50, countmiss: accHits["80%"].countmiss });
        _scoreData.pp = pp;

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
                <>
                    <Card
                        sx={{
                            ...props.data.style,
                            maxHeight: '90vh',
                            height: '90vh',
                            // minWidth: Mods.containsSettings(scoreData.score.mods) ? '70%' : '40%',
                        }}>
                        <div style={{
                            width: '100%',
                            height: '100%',
                        }}>
                            <Box
                                crossOrigin='anonymous'
                                sx={{
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    width: '100%',
                                    height: '100%',
                                    zIndex: -2,
                                    backgroundImage: `url(https://assets.ppy.sh/beatmaps/${beatmapData.beatmap.set_id}/covers/raw.jpg)`,
                                    backgroundSize: 'cover',
                                    backgroundPosition: 'center',
                                    filter: 'blur(10px)',
                                    transform: 'scale(1.1)',
                                }}></Box>
                            <Box sx={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                width: '100%',
                                height: '100%',
                                zIndex: -1,
                                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                            }}></Box>
                            <Box sx={{
                                position: 'relative',
                                width: '100%',
                                height: '100%',
                            }}>
                                <Grid2 sx={{
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    width: '100%',
                                    height: '100%',
                                    display: 'flex',
                                    overflow: 'hidden',
                                    padding: 2,
                                    //set all children to flex: 0 0 auto;		
                                    '& > *': {
                                        height: '100%',
                                        overflowY: 'scroll',
                                    }
                                }}>
                                    <Grid2 sx={{
                                        //if with mods, 1/3rd otherwise 1/2
                                        // width: Mods.containsSettings(scoreData.score.mods) ? '20%' : '30%',
                                        width: '20%',
                                        padding: 1,
                                    }}>
                                        <div className='score-stats__group score-stats__group--stats'>
                                            <Typography variant='subtitle2'>Difficulty</Typography>
                                            <div className='score-stats__group score-stats__group--stats'>
                                                <div className='score-stats__group-row'>
                                                    <ScoreViewStat valueIcon={Mods.hasMod(scoreData.score.mods, "AP") ? undefined : <StarIcon sx={{ fontSize: '1em' }} />} label='Aim Rating' irrelevant={Mods.hasMod(scoreData.score.mods, "AP")} value={`${Mods.hasMod(scoreData.score.mods, "AP") ? '-' : formatNumber(scoreData.difficulty_data?.aim_difficulty ?? 0, 2)}`} small={true} />
                                                    <ScoreViewStat valueIcon={Mods.hasMod(scoreData.score.mods, "RX") ? undefined : <StarIcon sx={{ fontSize: '1em' }} />} label='Speed Rating' irrelevant={Mods.hasMod(scoreData.score.mods, "RX")} value={`${Mods.hasMod(scoreData.score.mods, "RX") ? '-' : formatNumber(scoreData.difficulty_data?.speed_difficulty ?? 0, 2)}`} small={true} />
                                                    <ScoreViewStat valueIcon={!Mods.hasMod(scoreData.score.mods, "FL") ? undefined : <StarIcon sx={{ fontSize: '1em' }} />} label='Flashlight Rating' irrelevant={!Mods.hasMod(scoreData.score.mods, "FL")} value={`${!Mods.hasMod(scoreData.score.mods, "FL") ? '-' : formatNumber(scoreData.difficulty_data?.flashlight_difficulty ?? 0, 2)}`} small={true} />
                                                </div>
                                            </div>
                                            <div className='score-stats__group-row'><ScoreViewStat label='Speed note count' value={`${formatNumber(scoreData.difficulty_data?.speed_note_count ?? 0, 2)}`} small={true} /></div>
                                            <div className='score-stats__group-row'><ScoreViewStat label='Aim Difficult Slider Count' value={`${formatNumber(scoreData.difficulty_data?.aim_difficult_slider_count ?? 0, 2)}`} small={true} /></div>
                                            <div className='score-stats__group score-stats__group--stats'>
                                                <div className='score-stats__group-row'>
                                                    <ScoreViewStat label='Aim Difficult Strain Count' value={`${formatNumber(scoreData.difficulty_data?.aim_difficult_strain_count ?? 0, 2)}`} small={true} />
                                                    <ScoreViewStat label='Speed Difficult Strain Count' value={`${formatNumber(scoreData.difficulty_data?.speed_difficult_strain_count ?? 0, 2)}`} small={true} />
                                                </div>
                                            </div>
                                            <div className='score-stats__group-row'><ScoreViewStat label='Slider Factor' value={`${formatNumber(scoreData.difficulty_data?.slider_factor ?? 0, 3)}`} small={true} /></div>
                                            <div className='score-stats__group score-stats__group--stats'>
                                                <div className='score-stats__group-row'>
                                                    <ScoreViewStat label='Window Great' value={`${formatNumber(scoreData.score.recalc.live.greatHitWindow ?? 0, 1)}`} small={true} />
                                                    <ScoreViewStat label='Window Ok' value={`${formatNumber(scoreData.score.recalc.live.okHitWindow ?? 0, 1)}`} small={true} />
                                                    <ScoreViewStat label='Window Meh' value={`${formatNumber(scoreData.score.recalc.live.mehHitWindow ?? 0, 1)}`} small={true} />
                                                </div>
                                            </div>
                                            {
                                                (scoreData.difficulty_data?.is_legacy) ?
                                                    <>
                                                        <div className='score-stats__group-row'><ScoreViewStat backgroundColor={'#f57c00'} irrelevant={true} label='Warning' value={`Score data incomplete, please refetch.`} small={true} /></div>
                                                    </> : null
                                            }
                                            {
                                                (scoreData.difficulty_data?.recalc) ?
                                                    <>
                                                        <div className='score-stats__group-row'><ScoreViewStat backgroundColor={'#f57c00'} irrelevant={true} label='Warning' value={`Score is marked for recalculation. SR and PP may be wrong.`} small={true} /></div>
                                                    </> : null
                                            }
                                            <div className='score-stats__group-row' style={{
                                                marginLeft: '2px',
                                            }}>
                                                <OsuTooltip title="The performance values with or without combo scaling. This is NOT the old PP system, rather the current one, but toggling between combo and miss-based calculations." placement="top">
                                                    <FormControlLabel
                                                        control={
                                                            <Switch
                                                                checked={useCSR}
                                                                onChange={(e) => setUseCSR(e.target.checked)}
                                                                name="state_csr"
                                                            />
                                                        }
                                                        label="Combo Scaling Removal"
                                                    />
                                                </OsuTooltip>
                                            </div>
                                        </div>
                                    </Grid2>
                                    <Grid2 ref={screenshotArea} sx={{
                                        // width: Mods.containsSettings(scoreData.score.mods) ? '60%' : '70%',
                                        width: '60%',
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                    }}>
                                        <Box sx={{
                                            maxWidth: '800px',
                                            width: '620px'
                                        }}>
                                            <Stack direction="column" spacing={1} sx={{
                                                justifyContent: 'center',
                                                alignItems: 'center',
                                                width: '100%'
                                            }}>
                                                <Box sx={{
                                                    display: 'flex',
                                                    justifyContent: 'center',
                                                    alignItems: 'center',
                                                    width: '100%',
                                                    fontFamily: 'Torus !important',

                                                    //they should stack on top of each other
                                                    flexDirection: 'column',
                                                }}>
                                                    <Typography variant="h5" sx={{ fontWeight: 'bold' }}>{beatmapData.beatmap.title}</Typography>
                                                    <Typography variant="body2" sx={{ fontWeight: 'bold' }}>{beatmapData.beatmap.artist}</Typography>
                                                </Box>
                                                <div className='score-info__item score-info__item--dial'>
                                                    <ScoreDial accuracy={scoreData.score.accuracy * 0.01} rank={scoreData.score.rank} score={scoreData.score} />
                                                </div>
                                                <Box sx={{
                                                    display: 'flex',
                                                    justifyContent: 'center',
                                                    alignItems: 'center',
                                                    width: '100%',
                                                    //they are rows
                                                    flexDirection: 'column',
                                                }}>
                                                    <span className='lazer-text-gradient' style={{
                                                        fontFamily: 'Torus',
                                                        fontSize: '2.8em',
                                                    }}>
                                                        {formatNumber(scoreData.score.score, 0)}
                                                    </span>
                                                    <OsuTooltip title="Standardised score is approximated and is likely off from the real value." placement="top">
                                                        <span className='lazer-text-gradient' style={{
                                                            fontFamily: 'Torus',
                                                            fontSize: '0.8em',
                                                        }}>
                                                            {formatNumber(scoreData.score.scoreLazerStandardised, 0)} ({formatNumber(scoreData.score.mods.scoreMultiplier, 4)}x)
                                                        </span>
                                                    </OsuTooltip>
                                                </Box>
                                                <Box sx={{
                                                    display: 'flex',
                                                    justifyContent: 'center',
                                                    alignItems: 'center',
                                                    flexWrap: 'wrap',
                                                }}>
                                                    <Box sx={{ pr: 1 }}>
                                                        <StarsLabel stars={beatmapData.difficulty_data?.star_rating} />
                                                    </Box>
                                                    {Mods.getModElements(scoreData.score.mods, 22, undefined, true)}
                                                </Box>
                                                <Box sx={{
                                                    display: 'flex',
                                                    justifyContent: 'center',
                                                    alignItems: 'center',
                                                    width: '100%',
                                                    fontFamily: 'Torus !important',

                                                    //they should stack on top of each other
                                                    flexDirection: 'column',
                                                }}>
                                                    <Link href={`https://osu.ppy.sh/beatmaps/${beatmapData.beatmap.beatmap_id}`} target="_blank" rel="noreferrer" underline="hover" sx={{ color: 'inherit' }}>
                                                        <span style={{
                                                            display: 'flex',
                                                            justifyContent: 'center',
                                                            alignItems: 'center',
                                                            gap: 1,
                                                        }}>
                                                            <Typography variant="body2" sx={{ fontWeight: 'bold' }}>{beatmapData.beatmap.diffname}</Typography>
                                                            <OpenInNewIcon fontSize='10px' />
                                                            {/* small OpenInNewIcon next to it, to show its a clickable link */}
                                                        </span>
                                                    </Link>
                                                    <Typography variant="subtitles1" sx={{ fontWeight: 100 }}>mapped by <span style={{ fontWeight: 'bold' }}>{beatmapData.beatmap.creator}</span></Typography>
                                                </Box>
                                                <div className='score-stats__group score-stats__group--stats'>
                                                    <div className='score-stats__group-row'>
                                                        <ScoreViewStat
                                                            progress={scoreData.score.accuracy * 0.01}
                                                            label='Accuracy'
                                                            value={`${scoreData.score.accuracy.toFixed(2)}%`}
                                                            valueColor={scoreData.score.accuracy === 100 ? green[500] : undefined} />
                                                        <ScoreViewStat
                                                            progress={scoreData.score.combo / beatmapData.beatmap.maxcombo}
                                                            label='Max Combo'
                                                            value={`${scoreData.score.combo}/${beatmapData.beatmap.maxcombo}`}
                                                            valueColor={scoreData.score.combo === beatmapData.beatmap.maxcombo ? green[500] : undefined} />
                                                        <ScoreViewStat
                                                            tooltip={
                                                                (scoreData.score.recalc['fc']?.total ?? 0) !== (scoreData.score.recalc[`live${useCSR ? '' : '_no_csr'}`]?.total ?? 0) ?
                                                                    'PP if your score were an FC' : undefined
                                                            }
                                                            originalValue={
                                                                (scoreData.score.recalc['fc']?.total ?? 0) !== (scoreData.score.recalc[`live${useCSR ? '' : '_no_csr'}`]?.total ?? 0) ?
                                                                    formatNumber(scoreData.score.recalc['fc']?.total ?? 0, 0) : undefined
                                                            }
                                                            label='Performance'
                                                            value={`${formatNumber(scoreData.score.recalc[`live${useCSR ? '' : '_no_csr'}`]?.total ?? 0, 0)}`}
                                                        />
                                                    </div>
                                                    <div className='score-stats__group-row'>
                                                        <ScoreViewStat lineDecorator={true} label='Great' value={`${formatNumber(scoreData.score.count300)}`} labelColor='#66FFCC' />
                                                        <ScoreViewStat lineDecorator={true} label='Ok' value={`${formatNumber(scoreData.score.count100)}`} labelColor='#FAFF00' />
                                                        <ScoreViewStat lineDecorator={true} label='Meh' value={`${formatNumber(scoreData.score.count50)}`} labelColor='#FFB800' />
                                                        <ScoreViewStat lineDecorator={true} label='Miss' value={`${formatNumber(scoreData.score.countmiss)}`} labelColor={red[400]} />
                                                    </div>
                                                    <div className='score-stats__group-row'>
                                                        <ScoreViewStat
                                                            label='AR'
                                                            valueColor={(Math.ceil(scoreData.difficulty_data?.approach_rate * 100) / 100) !== (Math.ceil(beatmapData.beatmap.ar * 100) / 100) ? (Math.ceil(scoreData.difficulty_data?.approach_rate * 100) / 100) > (Math.ceil(beatmapData.beatmap.ar * 100) / 100) ? red[500] : green[500] : undefined}
                                                            originalValue={(Math.ceil(scoreData.difficulty_data?.approach_rate * 100) / 100) !== (Math.ceil(beatmapData.beatmap.ar * 100) / 100) ? formatNumber(beatmapData.beatmap.ar, 2) : undefined}
                                                            value={`${formatNumber(scoreData.difficulty_data?.approach_rate, 2)}`}
                                                        />
                                                        <ScoreViewStat
                                                            label='CS'
                                                            valueColor={(Math.ceil(scoreData.difficulty_data?.circle_size * 100) / 100) !== (Math.ceil(beatmapData.beatmap.cs * 100) / 100) ? (Math.ceil(scoreData.difficulty_data?.circle_size * 100) / 100) > (Math.ceil(beatmapData.beatmap.cs * 100) / 100) ? red[500] : green[500] : undefined}
                                                            originalValue={(Math.ceil(scoreData.difficulty_data?.circle_size * 100) / 100) !== (Math.ceil(beatmapData.beatmap.cs * 100) / 100) ? formatNumber(beatmapData.beatmap.cs, 2) : undefined}
                                                            value={`${formatNumber(scoreData.difficulty_data?.circle_size, 2)}`}
                                                        />
                                                        <ScoreViewStat
                                                            label='HP'
                                                            valueColor={(Math.ceil(scoreData.difficulty_data?.drain_rate * 100) / 100) !== (Math.ceil(beatmapData.beatmap.hp * 100) / 100) ? (Math.ceil(scoreData.difficulty_data?.drain_rate * 100) / 100) > (Math.ceil(beatmapData.beatmap.hp * 100) / 100) ? red[500] : green[500] : undefined}
                                                            originalValue={(Math.ceil(scoreData.difficulty_data?.drain_rate * 100) / 100) !== (Math.ceil(beatmapData.beatmap.hp * 100) / 100) ? formatNumber(beatmapData.beatmap.hp, 2) : undefined}
                                                            value={`${formatNumber(scoreData.difficulty_data?.drain_rate, 2)}`}
                                                        />
                                                        <ScoreViewStat
                                                            label='OD'
                                                            valueColor={(Math.ceil(scoreData.difficulty_data?.overall_difficulty * 100) / 100) !== (Math.ceil(beatmapData.beatmap.od * 100) / 100) ? (Math.ceil(scoreData.difficulty_data?.overall_difficulty * 100) / 100) > (Math.ceil(beatmapData.beatmap.od * 100) / 100) ? red[500] : green[500] : undefined}
                                                            originalValue={(Math.ceil(scoreData.difficulty_data?.overall_difficulty * 100) / 100) !== (Math.ceil(beatmapData.beatmap.od * 100) / 100) ? formatNumber(beatmapData.beatmap.od, 2) : undefined}
                                                            value={`${formatNumber(scoreData.difficulty_data?.overall_difficulty, 2)}`}
                                                        />
                                                    </div>
                                                    <div className='score-stats__group-row'>
                                                        <ScoreViewStat
                                                            originalValue={(Mods.hasMod(scoreData.score.mods, "AP") || scoreData.score.recalc['fc'].aim === scoreData.score.recalc[`live${useCSR ? '' : '_no_csr'}`].aim) ? undefined : formatNumber(scoreData.score.recalc['fc'].aim ?? 0, 1)}
                                                            label='Aim PP'
                                                            irrelevant={Mods.hasMod(scoreData.score.mods, "AP")}
                                                            value={`${Mods.hasMod(scoreData.score.mods, "AP") ? '-' : (formatNumber(scoreData.score.recalc[`live${useCSR ? '' : '_no_csr'}`]?.aim ?? 0, 1))}`}
                                                        />
                                                        <ScoreViewStat
                                                            originalValue={(Mods.hasMod(scoreData.score.mods, "RX") || scoreData.score.recalc['fc'].speed === scoreData.score.recalc[`live${useCSR ? '' : '_no_csr'}`].speed) ? undefined : formatNumber(scoreData.score.recalc['fc'].speed ?? 0, 1)}
                                                            label='Speed PP'
                                                            irrelevant={Mods.hasMod(scoreData.score.mods, "RX")}
                                                            value={`${Mods.hasMod(scoreData.score.mods, "RX") ? '-' : (formatNumber(scoreData.score.recalc[`live${useCSR ? '' : '_no_csr'}`]?.speed ?? 0, 1))}`}
                                                        />
                                                        <ScoreViewStat
                                                            originalValue={(scoreData.score.recalc['fc'].acc === scoreData.score.recalc[`live${useCSR ? '' : '_no_csr'}`].acc) ? undefined : formatNumber(scoreData.score.recalc['fc'].acc ?? 0, 1)}
                                                            label='Accuracy PP'
                                                            value={`${formatNumber(scoreData.score.recalc[`live${useCSR ? '' : '_no_csr'}`]?.acc ?? 0, 1)}`}
                                                        />
                                                        <ScoreViewStat
                                                            originalValue={(!Mods.hasMod(scoreData.score.mods, "FL") || scoreData.score.recalc['fc'].flashlight === scoreData.score.recalc[`live${useCSR ? '' : '_no_csr'}`].flashlight) ? undefined : formatNumber(scoreData.score.recalc['fc'].flashlight ?? 0, 1)}
                                                            label='Flashlight PP'
                                                            irrelevant={!Mods.hasMod(scoreData.score.mods, "FL")}
                                                            value={`${Mods.hasMod(scoreData.score.mods, "FL") ? (formatNumber(scoreData.score.recalc[`live${useCSR ? '' : '_no_csr'}`]?.flashlight ?? 0, 1)) : '-'}`}
                                                        />
                                                    </div>
                                                    {
                                                        scoreData.score.statistics != null && scoreData.score.maximum_statistics != null ?
                                                            <>
                                                                <div className='score-stats__group-row'>
                                                                    <ScoreViewStat
                                                                        label='Slider Tick'
                                                                        irrelevant={Mods.getSetting(scoreData.score.mods, "no_slider_head_accuracy") === true || Mods.hasMod(scoreData.score.mods, "CL")}
                                                                        originalValue={Mods.getSetting(scoreData.score.mods, "no_slider_head_accuracy") === true || Mods.hasMod(scoreData.score.mods, "CL") ? undefined : (scoreData.score.maximum_statistics.large_tick_hit ?? 'N/A')}
                                                                        value={`${Mods.getSetting(scoreData.score.mods, "no_slider_head_accuracy") === true || Mods.hasMod(scoreData.score.mods, "CL") ? '-' : (scoreData.score.statistics.large_tick_hit ?? scoreData.score.maximum_statistics.large_tick_hit ?? 'N/A')}`} />
                                                                    <ScoreViewStat
                                                                        label='Slider End'
                                                                        irrelevant={Mods.getSetting(scoreData.score.mods, "no_slider_head_accuracy") === true || Mods.hasMod(scoreData.score.mods, "CL")}
                                                                        originalValue={Mods.getSetting(scoreData.score.mods, "no_slider_head_accuracy") === true || Mods.hasMod(scoreData.score.mods, "CL") ? undefined : (scoreData.score.maximum_statistics.slider_tail_hit ?? 'N/A')}
                                                                        value={`${Mods.getSetting(scoreData.score.mods, "no_slider_head_accuracy") === true || Mods.hasMod(scoreData.score.mods, "CL") ? '-' : (scoreData.score.statistics.slider_tail_hit ?? scoreData.score.maximum_statistics.slider_tail_hit ?? 'N/A')}`} />
                                                                    <ScoreViewStat
                                                                        label='Spinner Bonus'
                                                                        irrelevant={beatmapData.beatmap.spinners === 0 || (Mods.getSetting(scoreData.score.mods, "no_slider_head_accuracy") === true || Mods.hasMod(scoreData.score.mods, "CL"))}
                                                                        originalValue={(Mods.getSetting(scoreData.score.mods, "no_slider_head_accuracy") === true || Mods.hasMod(scoreData.score.mods, "CL") || beatmapData.beatmap.spinners === 0) ? undefined : (scoreData.score.maximum_statistics.small_bonus ?? '0')}
                                                                        value={`${((Mods.getSetting(scoreData.score.mods, "no_slider_head_accuracy") === true || Mods.hasMod(scoreData.score.mods, "CL")) || beatmapData.beatmap.spinners === 0) ? '-' : (scoreData.score.statistics.small_bonus ?? scoreData.score.maximum_statistics.small_bonus ?? '0')}`} />
                                                                    <ScoreViewStat
                                                                        label='Spinner Spin'
                                                                        irrelevant={beatmapData.beatmap.spinners === 0 || (Mods.getSetting(scoreData.score.mods, "no_slider_head_accuracy") === true || Mods.hasMod(scoreData.score.mods, "CL"))}
                                                                        originalValue={(Mods.getSetting(scoreData.score.mods, "no_slider_head_accuracy") === true || Mods.hasMod(scoreData.score.mods, "CL") || beatmapData.beatmap.spinners === 0) ? undefined : (scoreData.score.maximum_statistics.large_bonus ?? '0')}
                                                                        value={`${((Mods.getSetting(scoreData.score.mods, "no_slider_head_accuracy") === true || Mods.hasMod(scoreData.score.mods, "CL")) || beatmapData.beatmap.spinners === 0) ? '-' : (scoreData.score.statistics.large_bonus ?? scoreData.score.maximum_statistics.large_bonus ?? '0')}`} />
                                                                </div>
                                                            </> : null
                                                    }
                                                </div>
                                                <Box sx={{
                                                    //we want 2 children, one on the left and one on the right
                                                    display: 'flex',
                                                    justifyContent: 'space-between',
                                                    alignItems: 'center',
                                                    width: '100%',
                                                    mt: 1,
                                                }}>
                                                    <RLink to={`/user/${scoreData.score.user_id}`} style={{
                                                        textDecoration: 'none',
                                                        color: 'inherit'
                                                    }}>
                                                        <Box sx={{
                                                            display: 'flex',
                                                            justifyContent: 'left',
                                                            alignItems: 'center',
                                                            gap: 1,
                                                        }}>
                                                            <Avatar variant="rounded" src={`https://a.ppy.sh/${scoreData.score.user_id}`} />
                                                            <Typography variant='subtitle1'>{scoreData.score.user.username}</Typography>
                                                        </Box>
                                                    </RLink>
                                                    <Box>
                                                        <Typography variant='caption'>Achieved on</Typography>
                                                        <Typography variant='subtitle2'>{moment(scoreData.score.date_played).format('LLL')}</Typography>
                                                    </Box>
                                                </Box>
                                                {/* <Typography variant="subtitle2" display="flex" alignItems="center" sx={{ mt: 0 }} spacing="5">
                                                Played on {moment(scoreData.score.date_played).format('LLL')}<br />
                                                by {scoreData.score.user.username}
                                            </Typography> */}
                                            </Stack>
                                        </Box>
                                    </Grid2>
                                    <Grid2 sx={{
                                        width: '20%',
                                        padding: 1,
                                    }}>
                                        <Box sx={{ width: '100%' }}>
                                            {
                                                Mods.getMods(scoreData.score.mods).map((mod, i) => {
                                                    return (
                                                        <Box key={i}>
                                                            <div key={mod.acronym} className='score-stats__group score-stats__group--stats'>
                                                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                                    <Box sx={{ display: 'flex', justifyContent: 'left', alignItems: 'center' }}>
                                                                        <Box sx={{ mr: 1 }}>
                                                                            {Mods.getModElement(mod, 16)}
                                                                        </Box>
                                                                        <Typography variant='body2'>{mod.data.Name}</Typography>
                                                                    </Box>
                                                                    <Typography variant='caption'>{formatNumber(mod.scoreMultiplier, 2)}x</Typography>
                                                                </Box>
                                                                {
                                                                    mod.settings ? Object.keys(mod.settings).map((setting, i) => {
                                                                        const data = Mods.getModSettingsData(mod.acronym, setting);
                                                                        let value;
                                                                        let valueTyped;
                                                                        // let originalValue = Mods.getModOriginalValue(beatmapData.beatmap, setting);
                                                                        let [originalValue, invertSkillHandler] = Mods.getModOriginalValue(beatmapData.beatmap, mod.acronym, setting);
                                                                        let color = undefined;


                                                                        // value = settings[setting];
                                                                        value = Mods.getModSettingValue(mod, setting);
                                                                        if (data.Type === 'number') {
                                                                            valueTyped = parseFloat(value);
                                                                        } else if (data.Type === 'boolean') {
                                                                            valueTyped = value;
                                                                        }

                                                                        if (originalValue !== null) {
                                                                            originalValue = parseFloat(originalValue);


                                                                            if (!invertSkillHandler) {
                                                                                if (valueTyped > originalValue) {
                                                                                    color = red[500];
                                                                                } else if (valueTyped < originalValue) {
                                                                                    color = green[500];
                                                                                }
                                                                            } else {
                                                                                if (valueTyped > originalValue) {
                                                                                    color = green[500];
                                                                                } else if (valueTyped < originalValue) {
                                                                                    color = red[500];
                                                                                }
                                                                            }
                                                                        }

                                                                        return (
                                                                            <div key={i} className='score-stats__group-row'>
                                                                                <ScoreViewStat
                                                                                    tooltip={data.Description}
                                                                                    label={data.Label}
                                                                                    originalValue={originalValue}
                                                                                    value={value}
                                                                                    small={true}
                                                                                    valueColor={color}
                                                                                />
                                                                            </div>
                                                                        );
                                                                    }) : null
                                                                }
                                                                {
                                                                    i < Mods.getMods(scoreData.score.mods).length - 1 ?
                                                                        <Divider sx={{
                                                                            mt: 0.25,
                                                                            mb: 0.25,
                                                                        }} /> : null
                                                                }
                                                            </div>
                                                        </Box>
                                                    );
                                                })
                                            }
                                        </Box>
                                    </Grid2>
                                </Grid2>
                            </Box>
                        </div>
                    </Card>
                </>
                : <></>
            }
        </>
    );
}
export default ScoreView;