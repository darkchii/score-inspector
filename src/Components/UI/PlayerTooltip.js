import { Alert, Box, styled, Tooltip, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { getFullUser } from "../../Helpers/Osu";
import Loader from "./Loader";
import PlayerCard from "../PlayerCard";

const LocalStyledTooltip = styled(({ className, ...props }) => (
    <Tooltip {...props} componentsProps={{ tooltip: { className: className } }} />
))(`
    background-color: transparent;
    max-width: none;
`);

function PlayerTooltip(props) {
    const [isHovering, setIsHovering] = useState(false);
    const [isWorking, setIsWorking] = useState(false);
    const [abortController, setAbortController] = useState(null);
    const [playerData, setPlayerData] = useState(null);

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

    return (
        <LocalStyledTooltip
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
            placement="top"
            followCursor
        >
            {props.children}
        </LocalStyledTooltip>
    )
}

export default PlayerTooltip;