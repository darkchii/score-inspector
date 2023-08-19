import { Box, Card, CardContent, Container, Modal, Stack, Tooltip, Typography } from "@mui/material";
import { useImperativeHandle } from "react";
import { forwardRef } from "react";
import { useState } from "react";
import { LeaderboardItem } from "../Leaderboards/LeaderboardItem";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import { green, red } from "@mui/material/colors";
import Loader from "../UI/Loader";

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
                                            <Loader />
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