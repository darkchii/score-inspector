import { Alert, Box, Button, ButtonGroup, Card, CardActionArea, CardContent, Chip, Grid, Paper, Skeleton, Stack, Tab, Tabs, Tooltip, Typography } from "@mui/material";
import moment from "moment";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ScoreModal from "../Components/ScoreModal";
import { getBestScores } from "../Helpers/OsuAlt";
import { prepareScores } from "../Helpers/ScoresProcessor";
import { Helmet } from "react-helmet";
import config from "../config.json";
import { MassCalculatePerformance } from "../Helpers/Osu.js";
import { grey } from "@mui/material/colors";
import { getGradeIcon } from "../Helpers/Assets.js";

const SCORES_TO_FETCH = 10;
const PERIODS = [
    { value: "day", label: "Past Day" },
    { value: "week", label: "Past Week" },
    { value: "month", label: "Past Month" },
    { value: "year", label: "Past Year" },
    { value: "all", label: "Alltime" },
];

const SCORE_CARD_HEIGHT = '8em';
const SCORE_TYPES = 2;
const SCORE_TYPE_NAMES = ['Performance', 'Score'];

function Top(props) {
    const [isWorking, setIsWorking] = useState(false);
    const [scores, setScores] = useState([]);
    const [selected_period, setSelectedPeriod] = useState(PERIODS[0]);
    const [modalData, setModalData] = useState({ active: false });

    const refresh = () => {
        setIsWorking(true);
        (async () => {
            try {
                await Promise.all([
                    getBestScores(selected_period.value, "pp", SCORES_TO_FETCH, false),
                    getBestScores(selected_period.value, "score", SCORES_TO_FETCH, false)
                ]).then(async (values) => {
                    const [pp_scores] = await MassCalculatePerformance(values[0]);
                    const [sc_scores] = await MassCalculatePerformance(values[1]);
                    const pp_scores_prep = prepareScores(null, pp_scores, false);
                    const sc_scores_prep = prepareScores(null, sc_scores, false);

                    pp_scores_prep.sort((a, b) => {
                        if (a.pp > b.pp) { return -1; }
                        if (a.pp < b.pp) { return 1; }
                        return 0;
                    });

                    sc_scores_prep.sort((a, b) => {
                        if (a.score > b.score) { return -1; }
                        if (a.score < b.score) { return 1; }
                        return 0;
                    });

                    const _scores = {
                        0: {
                            name: 'Performance',
                            scores: pp_scores_prep,
                            significantStat: 'pp'
                        },
                        1: {
                            name: 'Score',
                            scores: sc_scores_prep,
                            significantStat: 'score'
                        },
                    }
                    setScores(_scores);
                });
            } catch (err) {
                console.error(err);
            }
            setIsWorking(false);
        })();
    }

    useEffect(() => {
        refresh();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selected_period]);

    useEffect(() => {
        setSelectedPeriod(PERIODS[0]);
    }, []);

    return (
        <>
            <Helmet>
                <title>Top Scores - {config.APP_NAME}</title>
            </Helmet>
            <ScoreModal data={modalData} />
            <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", width: "100%" }}>
                {/* <ButtonGroup disabled={isWorking}>
                    {PERIODS.map((period) => (
                        <Button variant={period.value === selected_period.value ? 'contained' : 'outlined'} onClick={() => setSelectedPeriod(period)}>{period.label}</Button>
                    ))}
                </ButtonGroup> */}
                <Tabs value={selected_period.value} onChange={(e, v) => setSelectedPeriod(PERIODS.find(p => p.value === v))}>
                    {/* <Tab label="Rankings" {...a11yProps(0)} />
                    <Tab label="Listing" {...a11yProps(1)} />
                    <Tab label="History" {...a11yProps(2)} /> */}
                    {
                        PERIODS.map((period) => (
                            <Tab disabled={isWorking} value={period.value} label={period.label} />
                        ))
                    }
                </Tabs>
            </Box>
            <Grid sx={{ pt: 1 }} container spacing={2}>
                {
                    Array.from(Array(SCORE_TYPES).keys()).map((i) => {
                        return (
                            <Grid item xs={12} md={6}>
                                <Paper elevation={2}>
                                    <Stack sx={{ p: 1, mx: 'auto' }} direction='column' spacing={1}>
                                        <Typography variant='title'>{SCORE_TYPE_NAMES[i]}</Typography>
                                        {
                                            Array.from(Array(SCORES_TO_FETCH).keys()).map((j) => {
                                                if (scores?.[i]?.scores?.[j] && !isWorking) {
                                                    const score = scores[i].scores[j];
                                                    if (!score || !score.user || isWorking) return (<>
                                                        <Skeleton animation='wave' variant='rectangular' height={SCORE_CARD_HEIGHT} />
                                                    </>);
                                                    return (
                                                        <Card
                                                            sx={{
                                                                backgroundImage: `url(https://assets.ppy.sh/beatmaps/${score.beatmap.set_id}/covers/cover.jpg)`,
                                                                backgroundSize: 'cover',
                                                                backgroundPosition: 'center',
                                                                borderRadius: '10px',
                                                                height: SCORE_CARD_HEIGHT,
                                                            }}>
                                                            <CardActionArea onClick={() => { setModalData({ active: true, score: score }) }} sx={{
                                                                height: '100%',
                                                                backgroundColor: 'rgba(0, 0, 0, 0.7)',
                                                                borderRadius: '10px',
                                                            }}>
                                                                <CardContent sx={{
                                                                    height: '100%',
                                                                    p: 1
                                                                }}>
                                                                    <Box sx={{
                                                                        display: 'flex',
                                                                        flexDirection: 'row',
                                                                        alignItems: 'center',
                                                                        justifyContent: 'space-between',
                                                                        width: '100%',
                                                                    }}>
                                                                        <Stack direction='column' spacing={0} sx={{ width: '100%' }}>
                                                                            {/* <Marquee pauseOnHover={true} speed={40} gradient={false}> */}
                                                                            <Tooltip title={`${score.beatmap.artist} - ${score.beatmap.title} [${score.beatmap.diffname}]`}>
                                                                                <Typography textOverflow='ellipsis' noWrap variant='h6' sx={{ fontSize: '1em' }}>{score.beatmap.artist} - {score.beatmap.title} [{score.beatmap.diffname}]</Typography>
                                                                            </Tooltip>
                                                                            {/* </Marquee> */}
                                                                            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                                                                <Box>
                                                                                    <Typography variant='body1'>
                                                                                        By <Typography component={Link} variant='body1' sx={{ textDecoration: 'none' }} color='primary' to={`/user/${score.user_id}`}>{score.user.username}</Typography> <Tooltip title={moment(score.date_played).format('HH:mm MMMM Do, YYYY')}><Chip label={moment(score.date_played).fromNow()} color='primary' size='small' /></Tooltip>
                                                                                    </Typography>
                                                                                    <Box sx={{
                                                                                        display: 'flex',
                                                                                        //center vertically
                                                                                        alignItems: 'center',
                                                                                        justifyContent: 'left',
                                                                                        pt: 0.5
                                                                                    }}>
                                                                                        <img style={{ height: '1.3em', mr: 1 }} alt={score.rank} src={getGradeIcon(score.rank)} />
                                                                                        <Typography sx={{ pl: 1 }} variant='body1'>{score.combo}/{score.beatmap.maxcombo}x</Typography>
                                                                                        {
                                                                                            score.countmiss > 0 ? <>
                                                                                                <Typography sx={{ pl: 1 }} variant='body1'> | {score.countmiss} miss{score.countmiss > 1 ? 'es' : ''}</Typography>
                                                                                            </> : <></>
                                                                                        }
                                                                                        <Typography sx={{ pl: 1 }} variant='body1'>
                                                                                            {' | '}
                                                                                            {
                                                                                                // {(scores[i].significantStat === 'pp' && !score.is_fc && score.recalc['fc']) ? `(${Math.round(score.recalc['fc']?.total).toLocaleString('en-US')}pp if FC)` : ''} {Math.round(score[scores[i].significantStat]).toLocaleString('en-US')}{scores[i].significantStat === 'pp' ? `pp` : ''}
                                                                                            }
                                                                                            {
                                                                                                scores[i].significantStat === 'pp' ?
                                                                                                    Math.round(score.score).toLocaleString('en-US')
                                                                                                    : `${Math.round(score.pp).toLocaleString('en-US')}pp ${(!score.is_fc && score.recalc['fc']) ? `(${Math.round(score.recalc['fc']?.total).toLocaleString('en-US')}pp if FC)` : ''}`
                                                                                            }

                                                                                        </Typography>
                                                                                    </Box>
                                                                                    {/* <Button onClick={() => { setModalData({ active: true, score: score }) }} size='small' variant='contained'>View</Button> */}
                                                                                </Box>
                                                                                <Box sx={{ float: 'right' }}>
                                                                                    <Typography sx={{ textAlign: 'right' }} variant='h6'>
                                                                                        {(scores[i].significantStat === 'pp' && !score.is_fc && score.recalc['fc']) ? `(${Math.round(score.recalc['fc']?.total).toLocaleString('en-US')}pp if FC)` : ''} {Math.round(score[scores[i].significantStat]).toLocaleString('en-US')}{scores[i].significantStat === 'pp' ? `pp` : ''}
                                                                                    </Typography>
                                                                                    <Typography sx={{ textAlign: 'right' }} variant='body1'>
                                                                                        {score.modString} {score.is_fc ? 'FC' : ''} {Math.round(score.accuracy * 100) / 100}% {Math.round((score.beatmap.modded_sr?.star_rating ?? 0) * 10) / 10}*
                                                                                    </Typography>
                                                                                </Box>
                                                                            </Box>
                                                                            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                                                                {
                                                                                    score.beatmap.modded_sr ? <>
                                                                                        <Typography variant='body1' sx={{ color: grey[500] }}>Aim: {score.beatmap.modded_sr.aim_diff.toFixed(2)}* | Speed: {score.beatmap.modded_sr.speed_diff.toFixed(2)}* | {score.beatmap.modded_sr.fl_diff > 0 ? `Flashlight: ${score.beatmap.modded_sr.fl_diff.toFixed(2)}* |` : ''} Speed Notes: {score.beatmap.modded_sr.speed_note_count.toFixed(2)}</Typography>
                                                                                        <Typography variant='body1' sx={{ color: grey[500] }}>OD{score.beatmap.modded_sr.modded_od.toFixed(2)} AR{score.beatmap.modded_sr.modded_ar.toFixed(2)} CS{score.beatmap.modded_sr.modded_cs.toFixed(2)} HP{score.beatmap.modded_sr.modded_hp.toFixed(2)}</Typography>
                                                                                    </> :
                                                                                        <Typography variant='body1' color='error'>Star ratings currently not available.</Typography>
                                                                                }
                                                                            </Box>
                                                                        </Stack>
                                                                    </Box>
                                                                </CardContent>
                                                            </CardActionArea>
                                                        </Card>

                                                    )
                                                } else {
                                                    return (
                                                        <Skeleton animation='wave' variant='rectangular' height={SCORE_CARD_HEIGHT} />
                                                    )
                                                }
                                            })
                                        }
                                    </Stack>
                                </Paper>
                            </Grid>
                        )
                    })
                }
                <Grid item xs={12} md={6}>
                    <Paper elevation={2}>

                    </Paper>
                </Grid>
                <Grid item xs={12} md={6}>
                    <Paper elevation={2}>

                    </Paper>
                </Grid>
            </Grid>
            <Box sx={{ pt: 1 }}>
                <Stack direction='column' spacing={2}>
                    <Alert severity='info'>
                        Getting this data can take a minute sometimes, it most likely isn't broken. If you think it is, check the browser console for any errors and forward them to me (Amayakase).
                    </Alert>
                    <Alert severity='warning'>
                        These scores are ones from tracked osu!alternative users. If theres a missing score, it likely gets added when the monthly data dump is released.
                    </Alert>
                </Stack>
            </Box>
        </>
    );
}

export default Top;