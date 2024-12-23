import { Alert, Avatar, Box, Button, Card, CardContent, CardMedia, Container, Divider, Grid2, Stack, Table, TableCell, TableContainer, TableRow, TextField, Typography } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router";
import Loader from "../Components/UI/Loader";
import { formatNumber, GetAPI, showNotification } from "../Helpers/Misc";
import axios from "axios";
import { getGradeIcon } from "../Helpers/Assets";
import ScoreViewStat from "../Components/UI/ScoreViewStat";
import { prepareScores } from "../Helpers/ScoresProcessor";
import ScoreModal from "../Components/ScoreModal";
import { MassCalculatePerformance } from "../Helpers/Osu";
import Mods from "../Helpers/Mods";
import { toPng } from "html-to-image";
import StarsLabel from "../Components/StarsLabel";
import { LoadingButton } from "@mui/lab";

function RouteWrapped() {
    const [id, setID] = useState(null);
    let { id: _id } = useParams();

    useEffect(() => {
        if (_id) {
            setID(_id);
        }
    }, [_id]);

    useEffect(() => {
        if (id) {
            window.history.pushState({}, null, `/wrapped/${id}`);
        }
    }, [id]);

    return (
        <Container>
            {
                !id ? <>
                    <RouteWrappedEntry onUserIDInput={(req_id) => {
                        setID(req_id);
                    }} />
                </> : <>
                    <RouteWrappedView id={id} />
                </>
            }
        </Container>
    )
}

const PLAYCARD_HEIGHT = 105;
function WrappedPlayCard({ score, focus = 'pp' }) {
    const [modalData, setModalData] = useState({ active: false });

    const onClick = () => {
        setModalData({ active: true, score: score });
    }

    return (
        <>
            <ScoreModal data={modalData} />
            <Box
                onClick={onClick}
                sx={{
                    width: '100%',
                    height: PLAYCARD_HEIGHT,
                    position: 'relative',
                    zIndex: 2,
                    overflow: 'hidden',
                    borderRadius: '10px',
                    '&:hover': {
                        cursor: 'pointer'
                    }
                }}>
                <Box sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    backgroundImage: `url(${score.beatmap.cover})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    filter: 'blur(3px)',
                    zIndex: 1
                }} />
                <Box sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    backgroundColor: 'rgba(0, 0, 0, 0.6)',
                    zIndex: 2
                }} />
                <Box sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    zIndex: 3,
                    p: 1
                }}>
                    <Stack spacing={0.1}>
                        <Typography noWrap sx={{ lineHeight: 1 }} variant='subtitle2'>{score.beatmap.artist} - {score.beatmap.title}</Typography>
                        <Typography noWrap variant='body2'>
                            [{score.beatmap.diffname}]
                        </Typography>
                        <Box sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                        }}>
                            <Box sx={{
                                display: 'flex',
                                alignItems: 'center',
                            }}>
                                {Mods.getModElements(score.mods, 20, undefined, false, 3)}
                            </Box>
                            <StarsLabel stars={score.beatmap.difficulty_data?.star_rating} />
                        </Box>
                        <Box sx={{
                            //left and right align
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            lineHeight: 1
                        }}>
                            <Typography sx={{
                                lineHeight: 1
                            }} variant='h6'>{
                                    //inline switch statement for focus
                                    focus === 'pp' ? `${formatNumber(score.pp, 2)}pp` : `${formatNumber(score.score)}`
                                }</Typography>
                            <Typography variant='subtitle1'>Played on <span style={{ fontWeight: 'bold' }}>
                                {score.date_played_moment.format('YYYY-MM-DD')}
                            </span></Typography>
                        </Box>
                    </Stack>
                </Box>
            </Box>
        </>
    )
}

function RouteWrappedView(props) {
    const [wrapped, setWrapped] = useState(null);
    const [isWorking, setIsWorking] = useState(false);
    const [error, setError] = useState(null);
    const containerRef = useRef(null);

    useEffect(() => {
        (async () => {
            setIsWorking(true);
            try {
                if (!props.id) {
                    showNotification('Error', 'No user ID provided.', 'error');
                    setIsWorking(false);
                    throw new Error('No user ID provided.');
                }

                if (isNaN(props.id)) {
                    showNotification('Error', 'Invalid user ID provided.', 'error');
                    setIsWorking(false);
                    throw new Error('Invalid user ID provided.');
                }

                const data = await axios.get(`${GetAPI()}users/wrapped/${props.id}`);

                if (data && data.data && data.data.error) {
                    showNotification('Error', data.data.error, 'error');
                    setIsWorking(false);
                    setError("User is most likely not tracked by osu!alternative.");
                    throw new Error('Failed to fetch wrapped data.');
                }

                if (data && data.data) {
                    if (data.data.top_pp_scores) {
                        data.data.top_pp_scores = prepareScores(null, data.data.top_pp_scores);
                        let [_scores] = await MassCalculatePerformance(data.data.top_pp_scores);
                        data.data.top_pp_scores = _scores;

                        data.data.top_pp_scores = data.data.top_pp_scores.sort((a, b) => {
                            return b.pp - a.pp;
                        });
                    }

                    if (data.data.top_score_scores) {
                        data.data.top_score_scores = prepareScores(null, data.data.top_score_scores);
                        let [_scores] = await MassCalculatePerformance(data.data.top_score_scores);
                        data.data.top_score_scores = _scores;

                        data.data.top_score_scores = data.data.top_score_scores.sort((a, b) => {
                            return b.score - a.score;
                        });
                    }

                    window.onTitleChange(`${data.data.username ?? 'n/a'} - osu!wrapped 2024`);
                    setWrapped(data.data);
                } else {
                    throw new Error('Failed to fetch wrapped data.');
                }

            } catch (err) {
                console.error(err);
                if (err.response && err.response.data && err.response.data.error) {
                    setError(err.response.data.error);
                }
                showNotification('Error', 'Failed to fetch wrapped data.', 'error');
                window.onTitleChange('osu!wrapped 2024');
            }
            setIsWorking(false);
        })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const onRequestImage = async () => {
        setIsWorking(true);
        try {
            const img = await toPng(containerRef.current, { cacheBust: true });
            const imgBlob = await fetch(img).then(r => r.blob());
            await navigator.clipboard.write([new ClipboardItem({ 'image/png': imgBlob })]);
            showNotification('Copied', 'Image copied to clipboard.', 'success');
        } catch (err) {
            console.error(err);
            showNotification('Error', 'Failed to copy image to clipboard.', 'error');
        }
        setIsWorking(false);
    }

    if (!props.id) {
        return <Typography>Something went wrong</Typography>
    }

    if (isWorking && !wrapped) {
        return <Loader />
    }

    if (error) {
        return <Alert severity="error">{error}</Alert>
    }

    if (!wrapped) {
        return <Typography>Something went wrong</Typography>
    }

    return (
        <>
            <Box>
                <Alert severity="warning">
                    If you see a suspicious amount of &quot;NM&quot; (this is lazer nomod, not stable/CL nomod) mod combination count, you might want to refetch (https://osualt.respektive.pw/)
                </Alert>
                <LoadingButton
                    onClick={onRequestImage}
                    variant="contained"
                    fullWidth
                    disabled={isWorking}
                    loading={isWorking}
                    sx={{
                        mb: 2,
                        mt: 2
                    }}>
                    Copy as image to clipboard
                </LoadingButton>
                <Card
                    ref={containerRef}
                    elevation={3}>
                    <div style={{
                        position: 'relative'
                    }}>
                        <CardMedia
                            component="img"
                            height="200"
                            image={wrapped.cover}
                            alt={wrapped.username}
                        />
                        <div style={{ position: "absolute", top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0, 0, 0, 0.6)' }}>
                            <Grid2 container sx={{ height: '100%' }} spacing={2}>
                                <Grid2 size={2} sx={{
                                    display: 'flex',
                                    justifyContent: 'right',
                                    alignItems: 'center'
                                }}>
                                    <Avatar
                                        src={wrapped.avatar}
                                        sx={{ width: 150, height: 150 }}
                                    />
                                </Grid2>
                                <Grid2 size={10} sx={{
                                    display: 'flex',
                                    justifyContent: 'left',
                                    alignItems: 'center'
                                }}>
                                    <Stack>
                                        <Typography variant="h6" sx={{ fontStyle: 'italic' }}>osu!wrapped 2024, according to osu!alt</Typography>
                                        <Typography variant="h4">{
                                            wrapped.clan_data ? <span style={{ color: `#${wrapped.clan_data.clan.color}` }}>[{wrapped.clan_data.clan.tag}]</span> : <span></span>
                                        } {wrapped.username}</Typography>
                                    </Stack>
                                </Grid2>
                            </Grid2>
                        </div>
                    </div>
                    <CardContent>
                        <Stack spacing={2}>
                            <Typography variant="h6">In 2024, {wrapped.username} achieved these statistics...</Typography>
                            <Divider />
                            <Grid2 container>
                                {
                                    Object.keys(wrapped.scores.grades).map((grade) => {
                                        const c = wrapped.scores.grades[grade];
                                        return (<>
                                            <Grid2 size={{ xs: 3, md: 1.5 }}>
                                                <Box minHeight='100%' display='flex' alignItems='center' justifyContent='center'>
                                                    <Box width='2.5rem' height='auto' component='img' src={getGradeIcon(grade)} />
                                                    <Typography sx={{ ml: 1 }} variant='subtitle1'>{c ? formatNumber(c) : '-'}</Typography>
                                                </Box>
                                            </Grid2>
                                        </>)
                                    })
                                }
                            </Grid2>
                            <Divider />
                            <Grid2 container spacing={1}>
                                <Grid2 size={3}>
                                    <div className='score-stats__group score-stats__group--stats'>
                                        <div className='score-stats__group-row'>
                                            <ScoreViewStat label='Clears' value={wrapped.scores.total_scores ? formatNumber(wrapped.scores.total_scores) : '-'} />
                                            <ScoreViewStat label='Top Combo' value={wrapped.scores.max_combo ? `${formatNumber(wrapped.scores.max_combo)}x` : '-'} />
                                        </div>
                                        <div className='score-stats__group-row'>
                                            <ScoreViewStat label='Score' value={wrapped.scores.score ? formatNumber(wrapped.scores.score) : '-'} />
                                        </div>
                                        <div className='score-stats__group-row'>
                                            <ScoreViewStat label='SS Score' value={wrapped.scores.ss_score ? formatNumber(wrapped.scores.ss_score) : '-'} />
                                        </div>
                                        <div className='score-stats__group-row'>
                                            <ScoreViewStat label='Playcount' value={formatNumber(wrapped.playcount)} />
                                            <ScoreViewStat label='Replays Watched' value={formatNumber(wrapped.replays_watched)} />
                                        </div>
                                        <div className='score-stats__group-row'>
                                            <ScoreViewStat label='Medals' value={formatNumber(wrapped.achievements)} />
                                            <ScoreViewStat label='Badges' value={formatNumber(wrapped.badges)} />
                                        </div>
                                        <div className='score-stats__group-row'>
                                            <ScoreViewStat label='Most used mods' value={
                                                <>
                                                    <TableContainer size='small'>
                                                        <Table sx={{
                                                            //no table borders etc
                                                            border: 'none',
                                                            '& th': {
                                                                border: 'none',
                                                            },
                                                            '& td': {
                                                                border: 'none',
                                                                paddingTop: 0.5,
                                                                paddingBottom: 0.5
                                                            }

                                                        }}>
                                                            {
                                                                wrapped.most_used_mods.map((mod, index) => {
                                                                    const mod_info = Mods.getModData(mod.mod);
                                                                    return (
                                                                        <TableRow key={index}>
                                                                            <TableCell>{mod_info.Name}</TableCell>
                                                                            <TableCell sx={{
                                                                                textAlign: 'right'
                                                                            }}>{formatNumber(mod.count)}</TableCell>
                                                                        </TableRow>
                                                                    )
                                                                })
                                                            }
                                                        </Table>
                                                    </TableContainer>
                                                </>
                                            } />
                                        </div>
                                        <div className='score-stats__group-row'>
                                            <ScoreViewStat label='Most used mod combinations' value={
                                                <>
                                                    <TableContainer size='small'>
                                                        <Table sx={{
                                                            //no table borders etc
                                                            border: 'none',
                                                            '& th': {
                                                                border: 'none',
                                                            },
                                                            '& td': {
                                                                border: 'none',
                                                                paddingTop: 0.5,
                                                                paddingBottom: 0.5
                                                            }

                                                        }}>
                                                            {
                                                                wrapped.most_used_mod_combos.map((mod, index) => {
                                                                    return (
                                                                        <TableRow key={index}>
                                                                            <TableCell>{mod.mod_combo}</TableCell>
                                                                            <TableCell sx={{
                                                                                textAlign: 'right'
                                                                            }}>{formatNumber(mod.count)}</TableCell>
                                                                        </TableRow>
                                                                    )
                                                                })
                                                            }
                                                        </Table>
                                                    </TableContainer>
                                                </>
                                            } />
                                        </div>
                                    </div>

                                </Grid2>
                                <Grid2 size={4.5}>
                                    <Typography variant='h6'>Top Performance</Typography>
                                    <Stack spacing={1}>
                                        {
                                            (wrapped.top_pp_scores && wrapped.top_pp_scores.length > 0) ? wrapped.top_pp_scores.map((score, index) => {
                                                return <WrappedPlayCard key={index} score={score} />
                                            }) : <Typography>No top performance plays found...</Typography>
                                        }
                                    </Stack>
                                </Grid2>
                                <Grid2 size={4.5}>
                                    <Typography variant='h6'>Top Score</Typography>
                                    <Stack spacing={1}>
                                        {
                                            (wrapped.top_score_scores && wrapped.top_score_scores.length > 0) ? wrapped.top_score_scores.map((score, index) => {
                                                return <WrappedPlayCard key={index} score={score} focus='score' />
                                            }) : <Typography>No top score plays found...</Typography>
                                        }
                                    </Stack>
                                </Grid2>
                            </Grid2>
                            <Alert severity="info">
                                osu!wrapped 2024 made on score.kirino.sh/wrapped
                            </Alert>
                        </Stack>
                    </CardContent>
                </Card >
            </Box>
        </>
    )
}

function RouteWrappedEntry({ onUserIDInput }) {
    const [inputUserID, setInputUserID] = useState('');

    return (
        <>
            <Stack spacing={2}>
                <Alert severity="warning">
                    If you see a suspicious amount of &quot;NM&quot; (this is lazer nomod, not stable/CL nomod) mod combination count, you might want to refetch (https://osualt.respektive.pw/)
                </Alert>
                <Alert severity="info">
                    Players tracked and fetched by osu!alternative will have more accurate data. Also only works for osu!standard unfortunately.
                </Alert>

                <TextField
                    label="User ID"
                    value={inputUserID}
                    onChange={(e) => setInputUserID(e.target.value)}
                    fullWidth
                    type="number"
                />
                <Button
                    onClick={() => {
                        onUserIDInput(inputUserID);
                    }}
                    variant="contained"
                    color="primary"
                    fullWidth>
                    Show Wrapped
                </Button>
            </Stack>
        </>
    )
}

export default RouteWrapped;