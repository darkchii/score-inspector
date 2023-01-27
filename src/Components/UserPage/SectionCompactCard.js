import { Box, Button, Divider, Grid, Paper, Stack, Typography } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import MUIRichTextEditor from 'mui-rte';
import { EditorState, convertFromRaw, convertToRaw } from 'draft-js';
import { DeleteComment, GetComments, GetFormattedName, IsUserLoggedIn, IsUserLoggedInUnsafe, SendComment } from "../../Helpers/Account";
import { showNotification } from "../../Helpers/Misc";
import { stateToHTML } from "draft-js-export-html";
import parse from 'html-react-parser';
import moment from "moment";

const SIZE = {
    width: '500px',
    height: '250px',
}
function SectionCompactCard(props) {
    return (
        <>
            <Grid sx={{ justifyContent: 'center', alignItems: 'center', display: 'flex' }}>
                <Box sx={{ width: SIZE.width, height: SIZE.height, backgroundImage: `url(${props.user.osu.cover_url})`, backgroundSize: 'cover', backgroundPosition: 'center', borderRadius: '11px' }}>
                    <Paper sx={{ width: '100%', height: '100%', display: 'flex' }}>
                        <Grid sx={{ m: 2 }}>
                            <Grid container direction='row' spacing={2}>
                                <Grid item xs={2} sx={{ justifyContent: 'center', alignItems: 'center', display: 'flex' }}>
                                    <img src={props.user.osu.avatar_url} alt='avatar' style={{ width: '100%', height: 'auto', borderRadius: '50%' }} />
                                </Grid>
                                <Grid item xs={10} sx={{ justifyContent: 'center', alignItems: 'center', display: 'flex' }}>
                                    <Typography variant='h4' sx={{ color: 'white' }}>{props.user.osu.username}</Typography>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Paper>
                </Box>
            </Grid>
        </>
    );
}

export default SectionCompactCard;