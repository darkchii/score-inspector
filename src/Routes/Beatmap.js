import { Helmet } from "react-helmet";
import config from "../config.json";
import { Alert, Box, Button, Container, Tooltip, Typography, useTheme } from "@mui/material";
import { useEffect, useState } from "react";
import Loader from "../Components/UI/Loader";
import { useNavigate, useParams } from "react-router-dom";
import { GetAPI, showNotification } from "../Helpers/Misc";
import axios from "axios";
import { OsuModeIcon } from "../Components/Icons";
import PlayerCard from "../Components/PlayerCard";
import { getDifficultyColor } from "../Helpers/Osu";

function Beatmap(props) {
    const [isWorking, setIsWorking] = useState(false);
    const params = useParams();
    const theme = useTheme();

    useEffect(() => {
        //check if id or query is present
        console.log(params);
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
                params.id ? <BeatmapPage id={params.id} /> : <BeatmapList query={params.query} />
            }
        </>
    );
}

function BeatmapPage(props) {
    const [beatmap, setBeatmap] = useState(null);
    const [valid, setValid] = useState(true);
    const [isWorking, setIsWorking] = useState(true);
    const theme = useTheme();

    useEffect(() => {
        (async () => {
            //fetch beatmap data
            setIsWorking(true);
            try {
                const data = await axios.get(`${GetAPI()}beatmaps/${props.id}`);
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
                    backgroundImage: `url('https://bg.kirino.sh/get/${beatmap.beatmap_id}')`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    //mask interpolation opacity
                    maskImage: "linear-gradient(to bottom, rgba(0,0,0,0.5), rgba(0,0,0,0))",
                    borderRadius: "15px"
                }} />
                <Box sx={{
                    p: 2
                }}>
                    <BeatmapDifficultyPicker set={beatmap.set} active_id={beatmap.beatmap_id} />
                    <Box sx={{
                        pt: 25,

                    }}>
                        <Box sx={{
                            display: "flex",
                        }}>
                            <Box sx={{
                                //flex grow
                                flex: 1,
                            }}>
                                <Typography variant='h4'>{beatmap.title}</Typography>
                                <Typography variant='h6'>{beatmap.artist}</Typography>
                                <Typography variant='subtitle1'>{beatmap.diffname} - {(Math.round(beatmap.stars * 100) / 100)}*</Typography>
                            </Box>
                            <Box sx={{
                                width: '25em'
                            }}>
                                <PlayerCard user={beatmap.creator_obj} />
                            </Box>
                        </Box>
                        <Box sx={{
                            display: "flex",
                            pt: 2
                        }}>
                            {/* osu web */}
                            <Button
                                variant='contained'
                                color='primary'
                                sx={{ mr: 1 }}
                                href={`https://osu.ppy.sh/beatmaps/${beatmap.beatmap_id}`}
                                target='_blank'>osu! website</Button>
                            {/* osu direct */}
                            <Button
                                variant='contained'
                                color='primary'
                                sx={{ mr: 1 }}
                                href={`osu://b/${beatmap.beatmap_id}`}
                                target='_blank'>osu!direct</Button>
                            {/* catboy mirror */}
                        </Box>
                    </Box>
                </Box>
            </Box>
        </Container>
    </>;
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