import { Avatar, AvatarGroup, Box, Chip, Grid, Typography } from "@mui/material";
import { cloneElement } from "react";

function PlayerChip(props) {
    const AvatarClone = cloneElement(props.avatar, {
        sx: {
            width: '20px',
            height: '20px',
            mr: 0.5,
        }
    });

    return <>
        <Box sx={{
            display: 'flex',
            borderRadius: '5px',
            bgcolor: '#ffffff22',
            textDecoration: 'none',
            color: '#fff',
            p: 0.25,
            pl: 1,
            pr: 1,
            width: 'fit-content',
            alignItems: 'center',
            justifyContent: 'center',
        }}>
            {AvatarClone}
            <Typography variant='body2'>
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
    </>
}

export default PlayerChip;