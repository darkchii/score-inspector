import { Alert, Box, Button, ButtonGroup, Chip, Grid, Paper, Skeleton, Stack, Tooltip, Typography } from "@mui/material";
import moment from "moment";
import { useEffect, useState } from "react";
import Marquee from "react-fast-marquee";
import { Link } from "react-router-dom";
import ScoreModal from "../Components/ScoreModal";
import { getBestScores } from "../Helpers/OsuAlt";
import { prepareScores } from "../Helpers/ScoresProcessor";

const SCORES_TO_FETCH = 5;
const PERIODS = [
    { value: "day", label: "Past Day" },
    { value: "week", label: "Past Week" },
    { value: "month", label: "Past Month" },
    { value: "year", label: "Past Year" },
    { value: "all", label: "Alltime" },
];

const SCORE_CARD_HEIGHT = '6em';
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
            console.log('getting scores');
            try {
                let scores_pp = await getBestScores(selected_period.value, "pp", SCORES_TO_FETCH, false);
                let scores_score = await getBestScores(selected_period.value, "score", SCORES_TO_FETCH, false);

                scores_pp = prepareScores(scores_pp);
                scores_score = prepareScores(scores_score);

                setScores({
                    0: {
                        name: 'Performance',
                        scores: scores_pp,
                        significantStat: 'pp'
                    },
                    1: {
                        name: 'Score',
                        scores: scores_score,
                        significantStat: 'score'
                    },
                });
            } catch (err) {
                console.log(err.message);
            }
            setIsWorking(false);
        })();
    }

    useEffect(() => {
        refresh();
    }, [selected_period]);

    useEffect(() => {
        setSelectedPeriod(PERIODS[0]);
    }, []);

    return (
        <>
            <ScoreModal data={modalData} />
            <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", width: "100%" }}>
                <ButtonGroup disabled={isWorking}>
                    {PERIODS.map((period) => (
                        <Button variant={period.value === selected_period.value ? 'contained' : 'outlined'} onClick={() => setSelectedPeriod(period)}>{period.label}</Button>
                    ))}
                </ButtonGroup>
            </Box>
            <Grid sx={{ pt: 1 }} container spacing={2}>
                {
                    Array.from(Array(SCORE_TYPES).keys()).map((i) => {
                        return (
                            <Grid item xs={12} md={6}>
                                <Paper elevation={2}>
                                    <Stack sx={{ p: 1 }} direction='column' spacing={2}>
                                        <Typography variant='title'>{SCORE_TYPE_NAMES[i]}</Typography>
                                        {
                                            Array.from(Array(SCORES_TO_FETCH).keys()).map((j) => {
                                                if (scores?.[i]?.scores?.[j] && !isWorking) {
                                                    const score = scores[i].scores[j];
                                                    return (
                                                        <Box
                                                            sx={{
                                                                backgroundImage: `url(https://assets.ppy.sh/beatmaps/${score.set_id}/covers/cover.jpg)`,
                                                                backgroundSize: 'cover',
                                                                backgroundPosition: 'center',
                                                                borderRadius: '10px'
                                                            }}>
                                                            <Box sx={{
                                                                display: 'flex',
                                                                flexDirection: 'row',
                                                                alignItems: 'center',
                                                                justifyContent: 'space-between',
                                                                height: SCORE_CARD_HEIGHT,
                                                                backgroundColor: 'rgba(0, 0, 0, 0.7)',
                                                                p: 1,
                                                                borderRadius: '10px'
                                                            }}>
                                                                <Stack direction='column' spacing={0} sx={{ width: '100%' }}>
                                                                    {/* <Marquee pauseOnHover={true} speed={40} gradient={false}> */}
                                                                    <Tooltip title={`${score.artist} - ${score.title} [${score.diffname}]`}>
                                                                        <Typography textOverflow='ellipsis' noWrap variant='h6' sx={{ fontSize: '1em' }}>{score.artist} - {score.title} [{score.diffname}]</Typography>
                                                                    </Tooltip>
                                                                    {/* </Marquee> */}
                                                                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                                                        <Box>
                                                                            <Typography variant='body1'>
                                                                                By <Typography component={Link} variant='body1' sx={{ textDecoration: 'none' }} color='primary' to={`/user/${score.user_id}`}>{score.username}</Typography> <Tooltip title={moment(score.date_played).format('HH:mm MMMM Do, YYYY')}><Chip label={moment(score.date_played).fromNow()} color='primary' size='small' /></Tooltip>
                                                                            </Typography>
                                                                            <Button onClick={() => { setModalData({ active: true, score: score }) }} size='small' variant='contained'>View</Button>
                                                                        </Box>
                                                                        <Typography sx={{ float: 'right' }} variant='h6'>
                                                                            {Math.round(score[scores[i].significantStat]).toLocaleString('en-US')}{scores[i].significantStat === 'pp' ? 'pp' : ''}
                                                                        </Typography>
                                                                    </Box>
                                                                </Stack>
                                                            </Box>
                                                        </Box>

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