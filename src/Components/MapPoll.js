import { Box, Button, Radio, Tooltip, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { GetCurrentPoll, SubmitVote } from "../Helpers/MapPoll";
import Loader from "./UI/Loader";
import CloseIcon from '@mui/icons-material/Close';
import CheckIcon from '@mui/icons-material/Check';
import { green, red } from "@mui/material/colors";
import { showNotification } from "../Helpers/Misc";

function MapPoll() {
    const [activePoll, setActivePoll] = useState(null);
    const [selectedMap, setSelectedMap] = useState(null);
    const [canVote, setCanVote] = useState(true);
    const [userData, setUserData] = useState(null);
    const [isWorking, setIsWorking] = useState(false);
    const [preVote, setPreVote] = useState(null);

    useEffect(() => {
        (async () => {
            const current_poll = await GetCurrentPoll();
            if(current_poll && current_poll.maps){
                const user = localStorage.getItem('auth_token');
                if (current_poll.voted) {
                    setPreVote(current_poll.voted);
                    setSelectedMap(current_poll.voted);
                }
                setActivePoll(current_poll);
                setUserData(user);
                setCanVote(current_poll.scores?.length === current_poll.maps.length && !current_poll.voted)
            }
        })();
    }, []);

    const submitVote = async () => {
        (async () => {
            setIsWorking(true);
            const response = await SubmitVote(selectedMap);
            if (!response || response?.error) {
                // showNotification('error', response?.error || 'Failed to submit vote');
                showNotification('Poll error', response?.error || 'Failed to submit vote', 'error');
            } else {
                showNotification('Poll success', 'Vote submitted', 'success');
            }
            setIsWorking(false);
        })();
    }

    if (!activePoll || !activePoll.maps) {
        return <>
            <Loader />
        </>
    }

    return <>
        <Box fullWidth>
            {
                activePoll.maps.map((map, index) => {
                    return <>
                        <Box sx={{
                            display: 'flex',
                            alignItems: 'center',
                        }}>
                            <Radio
                                value={map.beatmap_id}
                                checked={selectedMap === map.beatmap_id}
                                onChange={(e) => setSelectedMap(map.beatmap_id)}
                                size="small"
                                disabled={!selectedMap || !canVote || !userData}
                            />
                            {/* <CloseIcon sx={{ color: red[500] }} /> */}
                            <Tooltip title={activePoll.scores?.includes(map.beatmap_id) ? 'Played' : 'Unplayed'}>
                                {
                                    activePoll.scores?.includes(map.beatmap_id) ?
                                        <CheckIcon sx={{ color: green[500] }} />
                                        : <CloseIcon sx={{ color: red[500] }} />
                                }
                            </Tooltip>
                            <Typography variant="subtitle2">{map.artist} - {map.title} [{map.diffname}]</Typography>
                            <Box sx={{ flexGrow: 1 }} />
                            <Box sx={{
                                minWidth: '50px',
                            }}>
                                <Typography variant="subtitle2">{Math.round(map.stars * 100) / 100} ★</Typography>
                            </Box>
                        </Box>
                    </>
                })
            }
            <Button variant="contained" size='small' color="primary"
                disabled={!selectedMap || !canVote || !userData || isWorking}
                onClick={submitVote}
            >{
                    preVote ? 'You have already voted' : (
                        canVote ? 'Submit' : 'Not all maps played yet')
                }</Button>
        </Box>
    </>
}

export default MapPoll;