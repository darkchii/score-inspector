import { Box, Button, Card, CardContent, CircularProgress, Container, Grid, Modal, Stack, TextField, Tooltip, Typography } from "@mui/material";
import { useEffect, useImperativeHandle } from "react";
import { forwardRef } from "react";
import { useState } from "react";
import { GetUser as GetInspectorUser, UpdateProfile } from "../../Helpers/Account";
import { showNotification, validateImage } from "../../Helpers/Misc";
import BeatmapLeaderboardItem from "../Leaderboards/BeatmapLeaderboardItem";
import { LeaderboardItem } from "../Leaderboards/LeaderboardItem";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import { green, red } from "@mui/material/colors";

const style = {
    position: 'absolute',
    top: '50%',
    width: '100%',
    transform: 'translate(0, -50%)',
};

function PackCompletionModal(props, ref) {
    const [open, setOpen] = useState(false);

    useImperativeHandle(ref, () => ({
        setOpen(value) {
            setOpen(value);
        }
    }));

    useEffect(() => {
        console.log(props.data);
    }, [open, props.data]);

    return (
        <>
            <Modal open={open} onClose={() => setOpen(false)}>
                <Box sx={style}>
                    <Container>
                        <Card sx={{ borderRadius: '10px' }}>
                            <CardContent>
                                {
                                    props.data !== null ?
                                        <>
                                            <Typography variant="h5">{props.data?.pack_id} {props.data?.name ? ` - ${props.data?.name}` : ''}</Typography>
                                            <Typography variant="h6">{props.data?.scores.length} / {props.data?.beatmaps?.length} ({Math.round(props.data?.played / props.data?.total * 100)}%)</Typography>
                                            <Box sx={{
                                                maxHeight: '700px',
                                                overflowY: 'auto',
                                            }}>
                                                <Stack direction='column' spacing={1}>
                                                    {
                                                        props.data?.beatmaps.map((beatmap, index) => {
                                                            const hasScore = props.data?.scores.find(x => x.beatmap_id === beatmap?.beatmap_id) !== undefined;
                                                            return (
                                                                <LeaderboardItem
                                                                    background={`https://assets.ppy.sh/beatmaps/${beatmap?.set_id}/covers/cover.jpg`}
                                                                    onClick={() => {
                                                                        window.open(`https://osu.ppy.sh/beatmaps/${beatmap?.beatmap_id}`, "_blank");
                                                                    }}
                                                                    sx={{
                                                                        opacity: hasScore ? 1 : 0.5,
                                                                        height: '35px'
                                                                    }}
                                                                >
                                                                    <Box sx={{
                                                                        display: 'flex',
                                                                        alignItems: 'center',
                                                                        justifyContent: 'center',
                                                                        width: '5%',
                                                                        p: 2
                                                                    }}>
                                                                        <Tooltip title={
                                                                            hasScore ?
                                                                                'Completed'
                                                                                :
                                                                                'Not completed'
                                                                        }>
                                                                            {
                                                                                hasScore ?
                                                                                    <CheckCircleIcon sx={{ color: green[500] }} />
                                                                                    :
                                                                                    <CancelIcon sx={{ color: red[500] }} />
                                                                            }
                                                                        </Tooltip>
                                                                    </Box>
                                                                    <Box sx={{
                                                                        display: 'flex',
                                                                        alignItems: 'center',
                                                                        width: '95%',
                                                                        p: 2
                                                                    }}>
                                                                        <Typography variant='h6' sx={{ fontSize: '1.3em' }} noWrap>
                                                                            {beatmap.artist} - {beatmap.title} [{beatmap.diffname}]
                                                                        </Typography>
                                                                    </Box>
                                                                </LeaderboardItem>
                                                            );
                                                        })
                                                    }
                                                </Stack>
                                            </Box>
                                        </> : <>
                                            <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", backgroundColor: "rgba(0,0,0,0.5)", display: "flex", justifyContent: "center", alignItems: "center" }}>
                                                <CircularProgress />
                                            </div>
                                        </>
                                }
                            </CardContent>
                        </Card>
                    </Container>
                </Box>
            </Modal>
        </>
    )
}

export default forwardRef(PackCompletionModal);