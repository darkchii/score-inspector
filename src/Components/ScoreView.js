/* eslint-disable react-hooks/exhaustive-deps */
import { Box, Card, CardContent, CardMedia, Chip, Divider, Grid2, Link, ListItem, Stack, Table, TableBody, TableCell, tableCellClasses, TableContainer, TableHead, TableRow, Tooltip, Typography, useTheme } from '@mui/material';
import { Chart as ChartJS, ArcElement, Tooltip as ChartTooltip, Legend } from 'chart.js';
import moment from 'moment';
import { useEffect } from 'react';
import { useState } from 'react';
import { Doughnut } from 'react-chartjs-2';
import { getGradeIcon } from '../Helpers/Assets';
import { toFixedNumber, formatNumber } from '../Helpers/Misc';
import { getBeatmapMaxscore, getHitsFromAccuracy, getModString, mods } from '../Helpers/Osu';
import { getCalculator } from '../Helpers/Performance/Performance';
import { getBeatmapScores } from '../Helpers/OsuAlt';
import { prepareBeatmap, prepareScore } from '../Helpers/ScoresProcessor';
import { GetFormattedName } from '../Helpers/Account';
import { Grid, List } from "react-virtualized";
import { blue, green, grey, orange, red, yellow } from '@mui/material/colors';
import WarningIcon from '@mui/icons-material/Warning';
import Mods from '../Helpers/Mods';
import ScoreDial from './ScoreDial';
import StarsLabel from './StarsLabel';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import EditNoteIcon from '@mui/icons-material/EditNote';
import StarIcon from '@mui/icons-material/Star';
import * as d3 from 'd3';
ChartJS.register(ArcElement, ChartTooltip, Legend);

function ScoreViewStat(props) {
    const theme = useTheme();
    const arc = d3.arc();
    const pie = d3.pie().sortValues(null);

    return (
        <Tooltip title={props.tooltip ?? ''}>
            <div className={`score-stats__stat${props.small ? '-small' : ''}`}>
                <div className={`score-stats__stat-row score-stats__stat-row--label${props.small ? '-small' : ''}`} style={{
                    color: props.labelColor ?? undefined,
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                }}>
                    {props.labelIcon ?? null}
                    {props.label}

                    {/* add a colored horizontal line of 30px wide on the far right if props.lineDecorator is true */}
                    {props.lineDecorator ? <div style={{
                        width: '20px',
                        height: '4px',
                        backgroundColor: props.labelColor ?? theme.palette.text.primary,
                        marginLeft: '1em',
                        borderRadius: '20px',
                    }}></div> : null}
                </div>
                <div className={`score-stats__stat-row${props.small ? '-small' : ''}`} style={{
                    color: props.valueColor ?? undefined,
                    display: 'flex',
                    justifyContent: 'space-between',

                }}>
                    <span style={{
                        //align the icon with the text
                        display: 'flex',
                        alignItems: 'center',
                    }}>
                        {
                            props.originalValue ?
                                //this should be slightly smaller and gray
                                <span style={{
                                    fontSize: '0.8em',
                                    color: theme.palette.text.secondary,
                                    display: 'flex',
                                    alignItems: 'center',

                                }}>
                                    {props.originalValue}
                                    <KeyboardArrowRightIcon sx={{ fontSize: '1em' }} />
                                </span> : null
                        }
                        {props.value}
                        {props.valueIcon ?? null}
                    </span>

                    {/* progress circle on the far right, use inline styling, theres no class */}
                    {props.progress !== undefined ?
                        <div style={{
                            height: 'inherit',
                            width: '1em',
                            marginLeft: '1em',
                        }}>
                            <svg viewBox='0 0 26 26'>
                                <defs>
                                    <linearGradient gradientTransform='rotate(90)' id='dial-outer'>
                                        <stop className='score-dial_outer_gradient_start' offset='0%' />
                                        <stop className='score-dial_outer_gradient_end' offset='100%' />
                                    </linearGradient>
                                </defs>
                                <g transform="translate(13,13)">
                                    {
                                        pie([props.progress, 1 - props.progress]).map((d, i) => (
                                            <path
                                                key={i}
                                                className={`score_dial_outer score_dial_outer-${d.index}`}
                                                d={arc({ innerRadius: 10, outerRadius: 13, ...d }) ?? undefined}
                                            />
                                        ))
                                    }
                                </g>
                            </svg>
                        </div>
                        : null
                    }
                </div>
            </div>
        </Tooltip>
    );
}

function rankCutoffs(is_legacy) {
    let absoluteCutoffs;
    if (is_legacy) {
        absoluteCutoffs = [0, 0.6, 0.8, 0.867, 0.933, 0.99, 1];
    } else {
        absoluteCutoffs = [0, 0.7, 0.8, 0.9, 0.95, 0.99, 1];
    }

    return differenceBetweenConsecutiveElements(absoluteCutoffs);
}

function differenceBetweenConsecutiveElements(arr) {
    const result = [];

    for (let i = 1; i < arr.length; i++) {
        result.push(arr[i] - arr[i - 1]);
    }

    return result;
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
                <Card sx={{
                    ...props.data.style,
                    maxHeight: '90vh',
                    height: '90vh',
                    // minWidth: Mods.containsSettings(scoreData.score.mods) ? '70%' : '40%',
                }}>
                    <Box sx={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        zIndex: -1,
                        backgroundImage: `url(https://assets.ppy.sh/beatmaps/${beatmapData.beatmap.set_id}/covers/raw.jpg)`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        filter: 'blur(10px)',
                        opacity: 0.5
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
                                    <div className='score-stats__group-row'><ScoreViewStat valueIcon={<StarIcon sx={{ fontSize: '1em' }} />} label='Aim Rating' value={`${formatNumber(scoreData.difficulty_data?.aim_difficulty ?? 0, 2)}`} small={true} /></div>
                                    <div className='score-stats__group-row'><ScoreViewStat valueIcon={<StarIcon sx={{ fontSize: '1em' }} />} label='Speed Rating' value={`${formatNumber(scoreData.difficulty_data?.speed_difficulty ?? 0, 2)}`} small={true} /></div>
                                    <div className='score-stats__group-row'><ScoreViewStat valueIcon={<StarIcon sx={{ fontSize: '1em' }} />} label='Flashlight Rating' value={`${formatNumber(scoreData.difficulty_data?.flashlight_difficulty ?? 0, 2)}`} small={true} /></div>
                                    <div className='score-stats__group-row'><ScoreViewStat label='Speed note count' value={`${formatNumber(scoreData.difficulty_data?.speed_note_count ?? 0, 2)}`} small={true} /></div>
                                    <div className='score-stats__group-row'><ScoreViewStat label='Aim Difficult Strain Count' value={`${formatNumber(scoreData.difficulty_data?.aim_difficult_strain_count ?? 0, 2)}`} small={true} /></div>
                                    <div className='score-stats__group-row'><ScoreViewStat label='Speed Difficult Strain Count' value={`${formatNumber(scoreData.difficulty_data?.speed_difficult_strain_count ?? 0, 2)}`} small={true} /></div>
                                    <div className='score-stats__group-row'><ScoreViewStat label='Slider Factor' value={`${formatNumber(scoreData.difficulty_data?.slider_factor ?? 0, 3)}`} small={true} /></div>
                                </div>
                            </Grid2>
                            <Grid2 sx={{
                                // width: Mods.containsSettings(scoreData.score.mods) ? '60%' : '70%',
                                width: '60%',
                                padding: 1,
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
                                        <ScoreDial accuracy={scoreData.score.accuracy * 0.01} rank={scoreData.score.rank} rankCutoffs={rankCutoffs(Mods.hasMod(scoreData.score.mods, "CL"))} />
                                    </div>
                                    <Typography variant="h3">{toFixedNumber(scoreData.score.score, 0).toLocaleString('en-US')}</Typography>
                                    <Box sx={{
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                    }}>
                                        <Box sx={{ pr: 1 }}>
                                            <StarsLabel stars={beatmapData.difficulty_data?.star_rating} />
                                        </Box>
                                        {Mods.getModElements(scoreData.score.mods, 22)}
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
                                        <Typography variant="body2" sx={{ fontWeight: 'bold' }}>{beatmapData.beatmap.diffname}</Typography>
                                        <Typography variant="subtitles1" sx={{ fontWeight: 100 }}>mapped by <span style={{ fontWeight: 'bold' }}>{beatmapData.beatmap.creator}</span></Typography>
                                    </Box>
                                    <Box sx={{
                                        maxWidth: '700px',
                                    }}>
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
                                                        (scoreData.score.recalc['fc']?.total ?? 0) !== (scoreData.score.recalc[props.data.pp_version]?.total ?? 0) ?
                                                            'PP if your score were an FC' : undefined
                                                    }
                                                    originalValue={
                                                        (scoreData.score.recalc['fc']?.total ?? 0) !== (scoreData.score.recalc[props.data.pp_version]?.total ?? 0) ?
                                                            formatNumber(scoreData.score.recalc['fc']?.total ?? 0, 0) : undefined
                                                    }
                                                    label='PP'
                                                    value={`${formatNumber(scoreData.score.recalc[props.data.pp_version]?.total ?? 0, 0)}`} />
                                            </div>
                                            <div className='score-stats__group-row'>
                                                <ScoreViewStat lineDecorator={true} label='Great' value={`${formatNumber(scoreData.score.count300)}`} labelColor='#69EE00' />
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
                                                <ScoreViewStat label='Aim PP' value={`${formatNumber(scoreData.score.recalc[props.data.pp_version]?.aim ?? 0, 1)}`} />
                                                <ScoreViewStat label='Speed PP' value={`${formatNumber(scoreData.score.recalc[props.data.pp_version]?.speed ?? 0, 1)}`} />
                                                <ScoreViewStat label='Flashlight PP' value={`${formatNumber(scoreData.score.recalc[props.data.pp_version]?.flashlight ?? 0, 1)}`} />
                                            </div>
                                        </div>
                                    </Box>
                                    <Typography variant="subtitle2" display="flex" alignItems="center" sx={{ mt: 0 }} spacing="5">
                                        {/* pretty print like 23 November 2024 3:52 PM */}
                                        Played on {moment(scoreData.score.date_played).format('LLL')}<br />
                                        by {scoreData.score.user.username}
                                    </Typography>
                                </Stack>
                            </Grid2>
                            <Grid2 sx={{
                                width: '20%',
                                padding: 1,
                            }}>
                                {
                                    Mods.containsSettings(scoreData.score.mods) ?
                                        <>
                                            <Box sx={{ width: '100%' }}>
                                                {
                                                    Mods.getModsWithSettings(scoreData.score.mods).map((mod, i) => {
                                                        const settings = mod.settings;
                                                        return (
                                                            <Box>
                                                                <div key={mod.acronym} className='score-stats__group score-stats__group--stats'>
                                                                    <Box sx={{ display: 'flex', justifyContent: 'left', alignItems: 'center' }}>
                                                                        <Box sx={{ mr: 1 }}>
                                                                            {Mods.getModElement(mod, 20)}
                                                                        </Box>
                                                                        <Typography variant='subtitle2'>{mod.data.Name}</Typography>
                                                                    </Box>
                                                                    {
                                                                        Object.keys(settings).map((setting, i) => {
                                                                            const data = Mods.getModSettingsData(mod.acronym, setting);
                                                                            let value;
                                                                            let valueTyped;
                                                                            // let originalValue = Mods.getModOriginalValue(beatmapData.beatmap, setting);
                                                                            let [originalValue, invertSkillHandler] = Mods.getModOriginalValue(beatmapData.beatmap, mod.acronym, setting);
                                                                            let color = undefined;


                                                                            value = settings[setting];
                                                                            if (data.Type === 'number') {
                                                                                value = formatNumber(value, 2);
                                                                                valueTyped = parseFloat(value);
                                                                            } else if (data.Type === 'boolean') {
                                                                                value = value ? 'Yes' : 'No';
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

                                                                            console.log(originalValue, invertSkillHandler);

                                                                            return (
                                                                                <div className='score-stats__group-row'>
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
                                                                        })
                                                                    }
                                                                    {
                                                                        i < Mods.getModsWithSettings(scoreData.score.mods).length - 1 ?
                                                                            <Divider sx={{
                                                                                pb: 1
                                                                            }} /> : null
                                                                    }
                                                                </div>
                                                            </Box>
                                                        );
                                                    })
                                                }
                                            </Box>
                                            {/* when we are overflowing, add an icon to indicate there is more */}
                                            <Box sx={{
                                                display: 'flex',
                                                justifyContent: 'center',
                                                alignItems: 'center',
                                                mt: 1,
                                            }}>
                                                <Chip label='More' />
                                            </Box> </> : <Box sx={{
                                                width: '100%',
                                                height: '100%',
                                                display: 'flex',
                                                justifyContent: 'center',
                                                alignItems: 'center',
                                                flexDirection: 'column',
                                                color: grey[500]
                                            }}>
                                            <EditNoteIcon sx={{ fontSize: '5em' }} />
                                            <Typography variant='h6'>No mod settings applied</Typography>
                                        </Box>
                                }
                            </Grid2>
                        </Grid2>
                    </Box>
                </Card>
                : <></>
            }
        </>
    );
}
export default ScoreView;