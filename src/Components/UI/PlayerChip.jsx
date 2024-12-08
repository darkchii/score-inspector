import { Alert, Avatar, Box, Grid2, Tooltip, Typography, styled, useTheme } from "@mui/material";
import { useEffect } from "react";
import { useState } from "react";
import { cloneElement } from "react";
import { GetLoginIDUnsafe, IsUserLoggedInUnsafe } from "../../Helpers/Account";
import PlayerTooltip from "./PlayerTooltip";

function PlayerChip(props) {
    const theme = useTheme();
    const [matchesLoggedInUser, setMatchesLoggedInUser] = useState(false);

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

    return <>
        <PlayerTooltip user_id={props.user_id}>
            <Box sx={{
                display: 'flex',
                // borderRadius: '5px',
                //borderRadius half of the height
                borderRadius: '1em',
                // bgcolor: '#ffffff22',
                bgcolor: `${matchesLoggedInUser ? theme.palette.primary.main : '#ffffff'}22`,
                textDecoration: 'none',
                color: '#fff',
                p: 0.25,
                pr: 1,
                width: 'fit-content',
                alignItems: 'center',
                justifyContent: 'center',
                //hover effect
                '&:hover': {
                    bgcolor: `${matchesLoggedInUser ? theme.palette.primary.main : '#ffffff'}44`,
                    cursor: 'pointer',
                    //animate
                    transition: 'background-color 0.2s',
                },
                transition: 'background-color 0.2s',
            }}>
                {AvatarClone}
                <Typography variant={props.variant}>
                    {props.label}
                </Typography>
                {
                    props.roleIcons && props.roleIcons.length > 0 ? <Grid2 sx={{ ml: 0.5, display: 'flex' }}>
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
                    </Grid2> : <></>
                }
            </Box>
        </PlayerTooltip>
    </>
}

export default PlayerChip;