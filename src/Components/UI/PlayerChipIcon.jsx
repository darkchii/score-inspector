import { Alert, Box, Tooltip, Typography, styled } from "@mui/material";
import { useEffect } from "react";
import { useState } from "react";
import { cloneElement } from "react";
import Loader from "./Loader";
import { getFullUser } from "../../Helpers/Osu";
import PlayerCard from "../PlayerCard";

const PlayerTooltip = styled(({ className, ...props }) => (
    <Tooltip {...props} componentsProps={{ tooltip: { className: className } }} />
))(`
    background-color: transparent;
    max-width: none;
`);

function PlayerChipIcon(props) {
    const [isHovering, setIsHovering] = useState(false);
    const [isWorking, setIsWorking] = useState(false);
    const [playerData, setPlayerData] = useState(null);
    const [abortController, setAbortController] = useState(null);

    const AvatarClone = cloneElement(props.avatar, {
        sx: {
            width: '40px',
            height: '40px',
        }
    });

    useEffect(() => {
        if (!isHovering) {
            if (abortController !== null) {
                abortController.abort();
                setAbortController(null);
            }
        }
        if (isWorking) {
            return;
        }
        if (isHovering) {
            if (playerData === null) {
                setIsWorking(true);
                (async () => {
                    const _abortController = new AbortController();
                    setAbortController(_abortController);
                    let _playerData = null;
                    try {
                        _playerData = await getFullUser(props.user_id, {
                            skipAltData: true
                        }, null, _abortController.signal);
                        if (_playerData.length > 0) {
                            setPlayerData(_playerData[0]);
                        }
                    } catch (err) {
                        console.error(err);
                    }

                    setIsWorking(false);
                })();
            }
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isHovering]);

    return <>
        <PlayerTooltip
            onOpen={() => setIsHovering(true)}
            onClose={() => setIsHovering(false)}
            title={isWorking ?
                <Box sx={{ height: '150px', width: '400px' }}>
                    <Loader />
                </Box>
                : <>
                    {
                        playerData === null ? <>
                            <Alert severity='error'>
                                <Typography variant='body1'>Failed to load player data.</Typography>
                            </Alert>
                        </> : <>
                            <Box sx={{ height: '150px', width: '400px' }}>
                                <PlayerCard user={playerData} />
                            </Box>
                        </>
                    }
                </>}
            placement="top">
            <Box sx={{
                borderRadius: '50%',
                textDecoration: 'none',
                color: '#fff',
                width: 'fit-content',
                alignItems: 'center',
                justifyContent: 'center',
            }}>
                {AvatarClone}
            </Box>
        </PlayerTooltip>
    </>
}

export default PlayerChipIcon;