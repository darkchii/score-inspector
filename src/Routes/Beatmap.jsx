import { Helmet } from "react-helmet";
import config from "../config.json";
import { Alert, Box, Button, Card, CardContent, Chip, Container, Grid2, Modal, Paper, Slider, Stack, TextField, Tooltip, Typography, useTheme } from "@mui/material";
import { useEffect, useState } from "react";
import Loader from "../Components/UI/Loader";
import { Link, useNavigate, useParams } from "react-router";
import { GetAPI, MODAL_STYLE, showNotification } from "../Helpers/Misc";
import axios from "axios";
import { OsuModeIcon } from "../Components/Icons";
import PlayerCard from "../Components/PlayerCard";
import { getDifficultyColor } from "../Helpers/Osu";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import { AdminValidate, GetFormattedName } from "../Helpers/Account";

function Beatmap() {
    const [isWorking, setIsWorking] = useState(false);
    const [userHasEditAccess, setUserHasEditAccess] = useState(false);
    const params = useParams();

    useEffect(() => {
        (async () => {
            const _isAdmin = await AdminValidate();
            setUserHasEditAccess(_isAdmin);
        })();
    }, [])

    if (isWorking) {
        return <Loader />;
    }

    return (
        <>
            <Helmet>
                <title>Beatmaps - {config.APP_NAME}</title>
            </Helmet>

            {
                params.id ? <BeatmapPage userHasEditAccess={userHasEditAccess} id={params.id} /> : <BeatmapList query={params.query} />
            }
        </>
    );
}

function BeatmapPage(props) {
    const [beatmap, setBeatmap] = useState(null);
    const [valid, setValid] = useState(true);
    const [isWorking, setIsWorking] = useState(true);
    const [beatmapTags, setBeatmapTags] = useState([]);
    const [backgroundTags, setBackgroundTags] = useState([]);
    const [showBeatmapTags, setShowBeatmapTags] = useState(false);
    const [showBackgroundTags, setShowBackgroundTags] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const theme = useTheme();

    useEffect(() => {
        (async () => {
            //fetch beatmap data
            setIsWorking(true);
            try {
                const data = await axios.get(`${GetAPI()}beatmaps/${props.id}?include_remote_data=true&include_scores=true&score_limit=500`);
                if (data.status !== 200) {
                    showNotification("error", "Failed to fetch beatmap data");
                    setValid(false);
                    setIsWorking(false);
                    return;
                }

                if (!data.data) {
                    showNotification("error", "Beatmap not found");
                    setValid(false);
                    setIsWorking(false);
                    return;
                }

                let _tags = data.data.tags.split(" ");
                _tags = _tags.map((tag) => { return tag.replace("-", ""); });
                _tags = [...new Set(_tags)];
                _tags = _tags.filter((tag) => { return tag.length > 1; });
                _tags = _tags.filter((tag) => { return tag.toLowerCase() !== data.data.source.toLowerCase() && tag.toLowerCase() !== data.data.artist.toLowerCase(); });
                setBeatmapTags(_tags);

                setBeatmap(data.data);
                setValid(true);
            } catch (err) {
                console.error(err);
                setValid(false);
            }
            setIsWorking(false);
        })();
    }, [props.id])

    if (isWorking) {
        return <Loader />;
    }

    if (!valid) {
        return <>
            <Alert severity="error">Invalid beatmap ID</Alert>
        </>;
    }

    return <>
        {
            props.userHasEditAccess && <BeatmapEditor beatmap={beatmap} userHasEditAccess={props.userHasEditAccess} open={showEditModal} onClose={() => { setShowEditModal(false) }}
            />
        }
        <Container>
            {/* beatmap cover */}
            {/* a background which with opacity 1 on top, and opacity 0 bottom */}
            <Box sx={{
                position: "relative",
                minHeight: "400px",
            }}>
                <Box sx={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "auto",
                    minHeight: "400px",
                    backgroundImage: `url('https://bg.kirino.sh/get/${beatmap.beatmap_id}'), url('${beatmap.remote_data?.beatmapset.covers.cover}')`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    //mask interpolation opacity
                    maskImage: "linear-gradient(to bottom, rgba(0,0,0,0.5), rgba(0,0,0,0))",
                    borderRadius: "15px"
                }} />
                <Box sx={{
                    p: 2,
                    position: "relative",
                    zIndex: 1,
                }}>
                    <BeatmapDifficultyPicker set={beatmap.set} active_id={beatmap.beatmap_id} />
                    <Box sx={{
                        pt: 25,

                    }}>
                        <Grid2 container>
                            <Grid2 size={8}>
                                <Box sx={{
                                    //flex grow
                                    flex: 1,
                                }}>
                                    <Typography variant='h4'>{beatmap.title}</Typography>
                                    <Typography variant='h6'>{beatmap.artist}</Typography>
                                    <Typography variant='subtitle1'>{beatmap.diffname} - {(Math.round(beatmap.stars * 100) / 100)}*</Typography>
                                    <Box sx={{
                                        display: 'flex'
                                    }}>
                                        <Typography variant='subtitle2'>Set owner</Typography>
                                        <Box sx={{ ml: 0.5 }}>
                                            {GetFormattedName(beatmap.creator_obj.inspector_user)}
                                        </Box>
                                    </Box>
                                </Box>
                                <Box sx={{
                                    display: "flex",
                                    pt: 2
                                }}>
                                    {/* edit map(set) data */}
                                    {/* {
                                        props.userHasEditAccess && <Button
                                            size='small'
                                            variant='contained'
                                            color='error'
                                            sx={{ mr: 1 }}
                                            onClick={() => {
                                                if (props.userHasEditAccess) {
                                                    setShowEditModal(true);
                                                }
                                            }}>Edit</Button>
                                    } */}
                                    {/* osu web */}
                                    <Button
                                        size='small'
                                        variant='contained'
                                        color='primary'
                                        sx={{ mr: 1 }}
                                        href={`https://osu.ppy.sh/beatmaps/${beatmap.beatmap_id}`}
                                        target='_blank'>osu! website</Button>
                                    {/* osu direct */}
                                    <Button
                                        size='small'
                                        variant='contained'
                                        color='primary'
                                        sx={{ mr: 1 }}
                                        href={`osu://b/${beatmap.beatmap_id}`}
                                        target='_blank'>osu!direct</Button>
                                    {/* catboy mirror */}
                                </Box>
                            </Grid2>
                            <Grid2 size={4}>
                                <Box>
                                    <PlayerCard user={beatmap.remote_data.creator_obj} />
                                </Box>
                                <Box sx={{
                                    mt: 0.5
                                }}>
                                    {/* very simple audio player in MUI style */}
                                    <audio controls style={{
                                        width: '100%',
                                        borderRadius: '5px',
                                    }}>
                                        <source src={beatmap.remote_data?.beatmapset.preview_url} type="audio/mp3" />
                                    </audio>
                                </Box>
                                <Box sx={{
                                    mt: 0.5
                                }}>
                                    <Paper sx={{
                                        p: 0.5,
                                    }}>
                                        <BeatmapAttributeRange name="CS" min={0} max={10} value={beatmap.cs} />
                                        <BeatmapAttributeRange name="HP" min={0} max={10} value={beatmap.hp} />
                                        <BeatmapAttributeRange name="OD" min={0} max={10} value={beatmap.od} />
                                        <BeatmapAttributeRange name="AR" min={0} max={10} value={beatmap.ar} />
                                        <BeatmapAttributeRange name="Stars" min={0} max={10} value={beatmap.stars} />
                                    </Paper>
                                </Box>
                                <Box sx={{
                                    mt: 0.5
                                }}>
                                    <Paper sx={{
                                        p: 0.5,
                                    }}>
                                        <Typography variant='subtitle1'>Source</Typography>
                                        {/* <Typography variant='body2'>{beatmap.source}</Typography> */}
                                        {/* link */}
                                        <Link to={`/beatmaps?query=source:${beatmap.source}`}><span style={{
                                            color: theme.palette.primary.main,
                                            textDecoration: 'none',
                                        }}>{beatmap.source}</span></Link>
                                    </Paper>
                                </Box>
                                <Box sx={{
                                    mt: 0.5
                                }}>
                                    <Paper sx={{
                                        p: 0.5,
                                    }}>
                                        <Typography variant='subtitle1'>Beatmap tags ({beatmapTags?.length ?? 0}) <Button
                                            size='small'
                                            variant='text'
                                            color='primary'
                                            onClick={() => {
                                                setShowBeatmapTags(!showBeatmapTags);
                                            }}
                                            disabled={!beatmapTags || beatmapTags?.length === 0}>
                                            {showBeatmapTags ? <ExpandLessIcon /> : <ExpandMoreIcon />}</Button></Typography>
                                        {
                                            showBeatmapTags && beatmapTags?.map((tag, i) => {
                                                return <Chip
                                                    key={i}
                                                    size='small'
                                                    variant='outlined'
                                                    color='primary'
                                                    sx={{ m: 0.1 }}
                                                    label={tag}
                                                    component={'a'}
                                                    clickable
                                                />
                                            })
                                        }
                                    </Paper>
                                </Box>
                                {/* <Box sx={{
                                    mt: 0.5
                                }}>
                                    <Paper sx={{
                                        p: 0.5,
                                    }}>
                                        <Typography variant='subtitle1'>Background tags ({backgroundTags?.length ?? 0}) <Button
                                            size='small'
                                            variant='text'
                                            color='primary'
                                            onClick={() => {
                                                setShowBackgroundTags(!showBackgroundTags);
                                            }}
                                            disabled={!backgroundTags || backgroundTags?.length === 0}
                                        >{showBackgroundTags ? <ExpandLessIcon /> : <ExpandMoreIcon />}</Button></Typography>
                                        <Box sx={{
                                            display: 'flex',
                                            alignItems: 'center',
                                        }}>
                                            <DangerousIcon color='error' />
                                            <Typography variant='body2'>No background tags</Typography>
                                        </Box>
                                    </Paper>
                                </Box> */}
                            </Grid2>
                        </Grid2>
                    </Box>
                </Box>
            </Box>
        </Container>
    </>;
}

function BeatmapEditor(props) {
    const [sources, setSources] = useState([]);

    useEffect(() => {
        setSources(JSON.parse(JSON.stringify(props.beatmap.sources)));
    }, [])

    if (!props.userHasEditAccess) {
        return <></>
    }

    const handleSourceTypeChange = (e, i) => {
        const clone = JSON.parse(JSON.stringify(sources));
        clone[i].source_type = e.target.value;
        setSources(clone);
    }

    const handleSourceURLChange = (e, i) => {
        const clone = JSON.parse(JSON.stringify(sources));
        clone[i].source_url = e.target.value;
        setSources(clone);
    }

    const handleSourceRemoval = (i) => {
        let _sources = JSON.parse(JSON.stringify(sources));
        _sources.splice(i, 1);
        setSources(_sources);
    }

    const handleSourceAddition = () => {
        setSources([...sources, {
            beatmapset_id: props.beatmap.set_id,
            source_type: '',
            source_url: '',
        }]);
    }

    return (
        <Modal open={props.open} onClose={props.onClose}>
            <Card sx={MODAL_STYLE}>
                <CardContent>
                    <Typography variant='h6'>Edit beatmap details</Typography>

                    {/* dynamic input list, based on sources length */}
                    <Box sx={{
                        mt: 1
                    }}>
                        <Typography variant='subtitle1'>Song locations</Typography>
                        {/* small info */}
                        <Typography variant='body2'>Add links to places to find the song (spotify, etc.)</Typography>
                        <Stack spacing={1} sx={{ mt: 1 }}>
                            {
                                sources.map((source, i) => {
                                    return <Box key={i} sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        mt: 1,
                                        flexWrap: 'wrap'
                                    }}>
                                        <TextField
                                            size='small'
                                            variant='outlined'
                                            label='Source type'
                                            value={source.source_type}
                                            onChange={(e) => { handleSourceTypeChange(e, i) }}
                                        />
                                        <TextField
                                            size='small'
                                            variant='outlined'
                                            label='Source URL'
                                            value={source.source_url}
                                            onChange={(e) => { handleSourceURLChange(e, i) }}
                                        />
                                        <Button
                                            size='small'
                                            variant='contained'
                                            color='error'
                                            onClick={() => { handleSourceRemoval(i) }}
                                        >Remove</Button>
                                    </Box>
                                })
                            }
                            <Button size='small' variant='contained' color='primary' onClick={handleSourceAddition} >Add</Button>
                        </Stack>
                    </Box>
                </CardContent>
            </Card>
        </Modal>
    )
}

function BeatmapAttributeRange(props) {
    return <Grid2 container>
        <Grid2 size={1.5}>
            <Typography variant='body2'>{props.name}</Typography>
        </Grid2>
        <Grid2 size={9}>
            <Slider
                size='small'
                min={props.min}
                max={props.max}
                defaultValue={props.value}
                style={{
                    pointerEvents: 'none',
                    padding: '0px',
                }}
                //remove thumb
                slots={{
                    thumb: null,
                }}
            />
        </Grid2>
        <Grid2 size={1.5} sx={{
            textAlign: 'right',
        }}>
            <Typography variant='body2'>{Math.round(Number(props.value) * 100) / 100}</Typography>
        </Grid2>
    </Grid2>;
}

function BeatmapDifficultyPicker(props) {
    const navigate = useNavigate();
    const theme = useTheme();

    return <>
        <Box sx={{
            display: 'flex',
            flexWrap: 'wrap',
            width: 'fit-content',
        }}>
            {
                props.set?.map && props.set.map((diff, i) => {
                    return <Tooltip title={diff.diffname} key={i}>
                        <Box sx={{
                            opacity: 0.7,
                            padding: '4px',
                            cursor: 'pointer',
                            transform: 'translateZ(0)',
                            transition: 'all 0.1s ease-in-out',
                            backgroundColor: '#00000044',
                            borderRadius: '5px',
                            '&:hover': {
                                opacity: 1,
                                transform: 'scale(1.1)',
                            },
                            '&:active': {
                                transform: 'scale(1.05)',
                            },
                            display: 'flex',
                            margin: '2px',
                            position: 'relative',
                        }}
                            key={i}
                            href={`/beatmaps/${diff.beatmap_id}`}
                            onClick={() => {
                                navigate(`/beatmaps/${diff.beatmap_id}`);
                            }}
                        >
                            {
                                diff.beatmap_id === props.active_id && <>
                                    {/* add a line below */}
                                    <Box sx={{
                                        width: '100%',
                                        height: '4px',
                                        backgroundColor: getDifficultyColor(diff.stars),
                                        position: 'absolute',
                                        bottom: 0,
                                        left: 0,
                                    }} />
                                </>
                            }
                            <OsuModeIcon mode={diff.mode} sx={{
                                width: '20px',
                                height: '20px',
                                marginRight: '3px',
                                color: getDifficultyColor(diff.stars)
                            }} />
                            <Typography variant='body2' sx={{
                                //max width, text ellipsis
                                maxWidth: '150px',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap',
                            }}>
                                {diff.diffname}
                            </Typography>
                        </Box>
                    </Tooltip>
                })
            }
        </Box>
    </>;
}

function BeatmapList(props) {
    return <></>;
}

export default Beatmap;