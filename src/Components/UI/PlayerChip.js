import { Alert, Avatar, AvatarGroup, Box, Chip, Grid, Tooltip, Typography, styled, useTheme } from "@mui/material";
import { useEffect } from "react";
import { useState } from "react";
import { cloneElement } from "react";
import { GetLoginIDUnsafe, IsUserLoggedInUnsafe } from "../../Helpers/Account.js";
import Loader from "./Loader.js";
import { sleep } from "../../Helpers/Misc.js";
import { getFullUser } from "../../Helpers/Osu.js";
import { set } from "lodash";
import PlayerCard from "../PlayerCard.js";

const PlayerTooltip = styled(({ className, ...props }) => (
    <Tooltip {...props} componentsProps={{ tooltip: { className: className } }} />
))(`
    background-color: transparent;
    max-width: none;
`);

function PlayerChip(props) {
    const theme = useTheme();
    const [matchesLoggedInUser, setMatchesLoggedInUser] = useState(false);
    const [isHovering, setIsHovering] = useState(false);
    const [isWorking, setIsWorking] = useState(false);
    const [playerData, setPlayerData] = useState(null);
    const [abortController, setAbortController] = useState(null);

    const AvatarClone = cloneElement(props.avatar, {
        sx: {
            width: '20px',
            height: '20px',
            mr: 0.5,
        }
    });

    useEffect(() => {
        if (IsUserLoggedInUnsafe() && !isNaN(GetLoginIDUnsafe())) {
            setMatchesLoggedInUser(parseInt(GetLoginIDUnsafe()) === props.user_id);
        }
    }, [props]);

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
                            skipDailyData: true,
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
                display: 'flex',
                borderRadius: '5px',
                // bgcolor: '#ffffff22',
                bgcolor: `${matchesLoggedInUser ? theme.palette.primary.main : '#ffffff'}22`,
                textDecoration: 'none',
                color: '#fff',
                p: 0.25,
                pr: 1,
                width: 'fit-content',
                alignItems: 'center',
                justifyContent: 'center',
            }}>
                {AvatarClone}
                <Typography variant={props.variant}>
                    {props.label}
                </Typography>
                {
                    props.roleIcons && props.roleIcons.length > 0 ? <Grid sx={{ ml: 0.5, display: 'flex' }}>
                        {
                            props.roleIcons.map((v, i) => {
                                return (
                                    <Avatar
                                        key={i}
                                        sx={{
                                            width: '20px',
                                            height: '20px',
                                            backgroundColor: '#ffffff00',
                                            border: 'none'
                                        }}
                                    >
                                        {v}
                                    </Avatar>
                                )
                            })
                        }
                    </Grid> : <></>
                }
            </Box>
        </PlayerTooltip>
    </>
}

export default PlayerChip;