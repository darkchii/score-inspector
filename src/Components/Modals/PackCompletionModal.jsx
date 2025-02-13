import { Box, Card, CardContent, Modal, Stack, Typography } from "@mui/material";
import { useImperativeHandle } from "react";
import { forwardRef } from "react";
import { useState } from "react";
import { LeaderboardItem } from "../Leaderboards/LeaderboardItem";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import { green, red } from "@mui/material/colors";
import Loader from "../UI/Loader";
import OsuTooltip from "../OsuTooltip";
import { getGradeIcon } from "../../Helpers/Assets";

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '80%',
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
                    <Card sx={{ borderRadius: '10px' }}>
                        <CardContent>
                            {
                                props.data !== null ?
                                    <>
                                        {/* close button on */}
                                        <Typography variant="h5">{props.data?.pack_id} {props.data?.name ? ` - ${props.data?.name}` : ''}</Typography>
                                        <Typography variant="h6">{props.data?.scores.length} / {props.data?.beatmaps?.length} ({Math.round(props.data?.played / props.data?.total * 100)}%)</Typography>
                                        <Box sx={{
                                            maxHeight: '700px',
                                            overflowY: 'auto',
                                        }}>
                                            <Stack direction='column' spacing={1}>
                                                {
                                                    props.data?.beatmaps.map((beatmap, index) => {
                                                        // const hasScore = props.data?.scores.find(x => x.beatmap_id === beatmap?.beatmap_id) !== undefined;
                                                        const score = props.data?.scores.find(x => x.beatmap_id === beatmap?.beatmap_id);
                                                        const hasScore = score !== undefined;
                                                        return (
                                                            <LeaderboardItem
                                                                key={index}
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
                                                                    width: '3%',
                                                                    p: 2
                                                                }}>
                                                                    <OsuTooltip title={
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
                                                                    </OsuTooltip>
                                                                </Box>
                                                                <Box sx={{
                                                                    display: 'flex',
                                                                    alignItems: 'center',
                                                                    width: '4%',
                                                                }}>
                                                                    {
                                                                        score ?
                                                                            <Typography variant='h6' sx={{ fontSize: '1.3em' }} noWrap>
                                                                                {
                                                                                    score.is_pfc ?
                                                                                        'PFC'
                                                                                        : score.is_fc ?
                                                                                            'FC'
                                                                                            : ''
                                                                                }
                                                                            </Typography>
                                                                            : null
                                                                    }
                                                                </Box>
                                                                <Box sx={{
                                                                    display: 'flex',
                                                                    alignItems: 'center',
                                                                    width: '3%',
                                                                    p: 2
                                                                }}>
                                                                    {
                                                                        score ?
                                                                            <Box sx={{
                                                                                height: '100%',
                                                                                display: 'flex',
                                                                                alignItems: 'center',
                                                                                justifyContent: 'center'
                                                                            }}>
                                                                                <img src={getGradeIcon(score.rank)} alt={score.rank} />
                                                                            </Box> : null
                                                                    }
                                                                </Box>
                                                                <Box sx={{
                                                                    display: 'flex',
                                                                    alignItems: 'center',
                                                                    width: '90%',
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
                </Box>
            </Modal>
        </>
    )
}

export default forwardRef(PackCompletionModal);