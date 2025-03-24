import { Alert, Box, Card, CardActionArea, CardContent, Grid2, Paper, Skeleton, Stack, Tab, Tabs, Typography } from "@mui/material";
import moment from "moment";
import { useEffect, useState } from "react";
import { Link } from "react-router";
import ScoreModal from "../Components/ScoreModal";
import { getBestScores } from "../Helpers/OsuAlt";
import { prepareScores } from "../Helpers/ScoresProcessor";
import { getDiffColor, MassCalculatePerformance } from "../Helpers/Osu";
import { grey } from "@mui/material/colors";
import { getGradeIcon } from "../Helpers/Assets";
import Mods from "../Helpers/Mods";
import StarsLabel from "../Components/StarsLabel";
import OsuTooltip from "../Components/OsuTooltip";

const SCORES_TO_FETCH = 10;
const PERIODS = [
    { value: "day", label: "Today" },
    { value: "week", label: "This week" },
    { value: "month", label: "This month" },
    { value: "year", label: "This year" },
    { value: "all", label: "Alltime" },
];

const SCORE_CARD_HEIGHT = '8em';
const SCORE_TYPES = 2;
const SCORE_TYPE_NAMES = ['Performance', 'Score'];

function RouteTop() {
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
                    let pp_scores_prep = prepareScores(null, values[0], false);
                    let sc_scores_prep = prepareScores(null, values[1], false);
                    const [pp_scores] = await MassCalculatePerformance(pp_scores_prep);
                    const [sc_scores] = await MassCalculatePerformance(sc_scores_prep);

                    pp_scores.sort((a, b) => {
                        if (a.pp > b.pp) { return -1; }
                        if (a.pp < b.pp) { return 1; }
                        return 0;
                    });

                    sc_scores.sort((a, b) => {
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

                    console.log(_scores);

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
        window.onTitleChange('Top Scores');
    }, []);

    return (
        <>
            <ScoreModal data={modalData} />
            <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", width: "100%" }}>
                <Tabs value={selected_period.value} onChange={(e, v) => setSelectedPeriod(PERIODS.find(p => p.value === v))}>
                    {
                        PERIODS.map((period, index) => (
                            <Tab disabled={isWorking} value={period.value} label={period.label} key={index} />
                        ))
                    }
                </Tabs>
            </Box>
            <Grid2 sx={{ pt: 1 }} container spacing={2}>
                {
                    Array.from(Array(SCORE_TYPES).keys()).map((i) => {
                        return (
                            <Grid2 size={{ xs: 12, md: 6 }} key={i}>
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
                                                            key={j}
                                                            sx={{
                                                                // backgroundImage: `url(https://assets.ppy.sh/beatmaps/${score.beatmap.set_id}/covers/cover.jpg)`,
                                                                // backgroundSize: 'cover',
                                                                // backgroundPosition: 'center',
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
                                                                        <Box sx={{
                                                                            position: 'absolute',
                                                                            top: 0,
                                                                            left: 0,
                                                                            width: '100%',
                                                                            height: '100%',
                                                                            backgroundImage: `url(https://assets.ppy.sh/beatmaps/${score.beatmap.set_id}/covers/cover.jpg)`,
                                                                            backgroundSize: 'cover',
                                                                            backgroundPosition: 'center',
                                                                            borderRadius: '10px',
                                                                        }} />
                                                                        <Box sx={{
                                                                            position: 'absolute',
                                                                            top: 0,
                                                                            left: 0,
                                                                            width: '100%',
                                                                            height: '100%',
                                                                            backgroundColor: 'rgba(0, 0, 0, 0.75)',
                                                                            borderRadius: '10px',
                                                                        }} />
                                                                        <Box sx={{
                                                                            position: 'absolute',
                                                                            top: 0,
                                                                            left: 0,
                                                                            width: '100%',
                                                                            height: '100%',
                                                                            backgroundImage: `linear-gradient(90deg, ${getDiffColor(score.beatmap.difficulty?.star_rating ?? 0)} 0%, rgba(0,0,0,0) 100%)`,
                                                                            opacity: 0.6,
                                                                            borderRadius: '10px',
                                                                        }} />
                                                                        <Stack direction='column' spacing={0} sx={{ width: '100%', zIndex: 2 }}>
                                                                            <Box sx={{
                                                                                display: 'flex',
                                                                                alignItems: 'center',
                                                                            }}>
                                                                                <StarsLabel style={{ marginRight: '1em' }} stars={score.beatmap.difficulty?.star_rating} />
                                                                                <OsuTooltip title={`${score.beatmap.artist} - ${score.beatmap.title} [${score.beatmap.diffname}]`}>
                                                                                    <Typography textOverflow='ellipsis' noWrap variant='h6' sx={{ fontSize: '1em' }}>{score.beatmap.artist} - {score.beatmap.title} [{score.beatmap.diffname}]</Typography>
                                                                                </OsuTooltip>
                                                                            </Box>
                                                                            {/* <Marquee pauseOnHover={true} speed={40} gradient={false}> */}
                                                                            {/* </Marquee> */}
                                                                            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                                                                <Box>
                                                                                    <Typography variant='body1'>
                                                                                        By <Typography component={Link} variant='body1' sx={{ textDecoration: 'none' }} color='primary' to={`/user/${score.user_id}`}>
                                                                                            {
                                                                                                score.user.inspector_user?.team && <>
                                                                                                    <span style={{ color: score.user.inspector_user?.team?.color, fontWeight: 'bold' }}>[{score.user.inspector_user?.team?.short_name}] </span>
                                                                                                </>
                                                                                            }
                                                                                            {score.user.inspector_user?.known_username}
                                                                                        </Typography> <OsuTooltip title={moment(score.date_played).format('HH:mm MMMM Do, YYYY')}>{moment(score.date_played).fromNow()}</OsuTooltip>
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
                                                                                                    : `${Math.round(score.recalc['live'].total).toLocaleString('en-US')}pp ${(!score.is_fc && score.recalc['fc']) ? `(${Math.round(score.recalc['fc']?.total).toLocaleString('en-US')}pp if FC)` : ''}`
                                                                                            }
                                                                                            {' | '}

                                                                                        </Typography>
                                                                                        <Typography sx={{
                                                                                            textAlign: 'left',
                                                                                            display: 'flex',
                                                                                            justifyContent: 'flex-start',
                                                                                            alignItems: 'center',
                                                                                            ml: 1,
                                                                                            pl: 2,
                                                                                            transition: 'all 0.3s',
                                                                                            '& > *': {
                                                                                                ml: -2,
                                                                                                //offset to compensate for the margin
                                                                                                transition: 'margin-left 0.3s',
                                                                                            },
                                                                                            //on hover, all children no margin
                                                                                            '&:hover > *': {
                                                                                                ml: 0,
                                                                                                transition: 'margin-left 0.3s',
                                                                                            },
                                                                                            '&:hover': {
                                                                                                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                                                                                                borderRadius: '5px',
                                                                                                transition: 'all 0.3s',
                                                                                                pl: 0
                                                                                            }
                                                                                        }} variant='h6'>
                                                                                            {Mods.valueOf(score.mods).map(mod => Mods.getModElement(mod, 20))}
                                                                                        </Typography>
                                                                                    </Box>
                                                                                    {/* <Button onClick={() => { setModalData({ active: true, score: score }) }} size='small' variant='contained'>View</Button> */}
                                                                                </Box>
                                                                                <Box sx={{ float: 'right' }}>

                                                                                    <Typography sx={{ textAlign: 'right' }} variant='h6'>
                                                                                        {(scores[i].significantStat === 'pp' && !score.is_fc && score.recalc['fc']) ? `(${Math.round(score.recalc['fc']?.total).toLocaleString('en-US')}pp if FC)` : ''} {Math.round(score[scores[i].significantStat]).toLocaleString('en-US')}{scores[i].significantStat === 'pp' ? `pp` : ''}
                                                                                    </Typography>
                                                                                    <Typography sx={{ textAlign: 'right' }} variant='body1'>
                                                                                        {score.is_fc ? 'FC' : ''} {Math.round(score.accuracy * 100) / 100}%
                                                                                    </Typography>
                                                                                </Box>
                                                                            </Box>
                                                                            <Box sx={{
                                                                                display: 'flex',
                                                                                justifyContent: 'space-between',
                                                                                fontWeight: 100
                                                                            }}>
                                                                                {
                                                                                    score.beatmap.difficulty ? <>
                                                                                        <Typography variant='body1' sx={{ color: grey[500] }}>Aim: {score.beatmap.difficulty.aim_difficulty.toFixed(2)}* | Speed: {score.beatmap.difficulty.speed_difficulty.toFixed(2)}* | {score.beatmap.difficulty.flashlight_difficulty > 0 ? `Flashlight: ${score.beatmap.difficulty.flashlight_difficulty.toFixed(2)}* |` : ''} Speed Notes: {score.beatmap.difficulty.speed_note_count.toFixed(2)}</Typography>
                                                                                        <Typography variant='body1' sx={{ color: grey[500] }}>OD{score.beatmap.difficulty.overall_difficulty.toFixed(2)} AR{score.beatmap.difficulty.approach_rate.toFixed(2)} CS{score.beatmap.difficulty.circle_size.toFixed(2)} HP{score.beatmap.difficulty.drain_rate.toFixed(2)}</Typography>
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
                                                        <Skeleton key={j} animation='wave' variant='rectangular' height={SCORE_CARD_HEIGHT} />
                                                    )
                                                }
                                            })
                                        }
                                    </Stack>
                                </Paper>
                            </Grid2>
                        )
                    })
                }
            </Grid2>
            <Box sx={{ pt: 1 }}>
                <Stack direction='column' spacing={2}>
                    <Alert severity='info'>
                        Getting this data can take a minute sometimes, it most likely isn&apos;t broken. If you think it is, check the browser console for any errors and forward them to me (Amayakase).
                    </Alert>
                    <Alert severity='warning'>
                        These scores are ones from tracked osu!alternative users. If theres a missing score, it likely gets added when the monthly data dump is released.
                    </Alert>
                </Stack>
            </Box>
        </>
    );
}

export default RouteTop;