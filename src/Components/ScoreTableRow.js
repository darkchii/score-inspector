import { Box, Card, Grid, IconButton, LinearProgress, Paper, Tooltip, Typography, useTheme } from '@mui/material';
import { useEffect } from 'react';
import { useState } from 'react';
import { getGradeIcon, getModIcon } from '../Helpers/Assets';
import { toFixedNumber } from '../Helpers/Misc';
import { getModString, mods, mod_strings_long } from '../Helpers/Osu';
import VisibilityIcon from '@mui/icons-material/Visibility';
import moment from 'moment';

function ScoreTableRow(props) {
    const theme = useTheme();
    const [score, setScore] = useState(null);
    const [viewerOpen] = useState(false);
    const [allowScoreViewer, setAllowScoreViewer] = useState(true);

    const openScoreView = (index) => {
        props?.openScoreView(index);
    }

    useEffect(() => {
        setScore(props.data.score);
    }, [props.data]);

    useEffect(() => {
        setAllowScoreViewer(props.allowScoreViewer !== undefined ? props.allowScoreViewer : true);
    }, [props.allowScoreViewer])

    const toggleViewer = () => {
        //setViewerOpen(!viewerOpen);
        openScoreView(props.index);
    };

    return (
        <>
            {
                score !== null ?
                    <>
                        <Box
                            display="flex"
                            sx={{
                                margin: 0,
                                width: '100%',
                                height: '2.5rem',
                                bgcolor: theme.palette.background.default,
                            }} >
                            <Grid container>
                                <Grid item xs={0.5} sx={{ height: '100%', display: 'flex', alignItems: 'center', pl: 1 }}>
                                    {/* {getGradeIcon(score.rank)} */}
                                    <img src={getGradeIcon(score.rank)} alt={score.rank} />
                                </Grid>
                                <Grid item xs={7.5} sx={{ height: '100%', display: 'flex', alignItems: 'center' }}>
                                    <Tooltip title={`${score.beatmap.artist} - ${score.beatmap.title} [${score.beatmap.diffname}]`}>
                                        <Typography sx={{ fontSize: '0.8rem', maxWidth: '100%', textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden' }}>
                                            {score.beatmap.artist} - {score.beatmap.title}
                                        </Typography>
                                        <Typography sx={{ fontSize: '0.7rem', maxWidth: '100%', textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden' }}>
                                            <span style={{ color: '#ea0' }}>{score.beatmap.diffname}</span> <span style={{opacity: '0.7'}}>{moment(score.date_played_moment).fromNow()}</span>
                                        </Typography>
                                    </Tooltip>
                                </Grid>
                                <Grid item xs={1.5} sx={{ height: '100%', alignContent: 'right', display: 'flex', alignItems: 'center' }}>
                                    {
                                        getModString(score.enabled_mods).map(mod => (
                                            <Tooltip title={mod_strings_long[mods[mod]]}>
                                                <img height="20px" src={getModIcon(mod)} alt={mod} />
                                            </Tooltip>
                                        ))
                                    }
                                </Grid>
                                <Grid item xs={0.8} sx={{ height: '100%', display: 'flex', alignItems: 'center' }}>
                                    <Typography variant="subtitle2">{score.accuracy.toFixed(2)}%</Typography>
                                </Grid>
                                <Grid item xs={1.2} sx={{ height: '100%', display: 'flex', alignItems: 'center' }}>
                                    <Box
                                        sx={{
                                            width: '100%',
                                            height: '100%',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            bgcolor: theme.palette.background.paper,
                                            borderRadius: 0,
                                            position: 'relative',
                                            '&:before': {
                                                bgcolor: theme.palette.background.default,
                                                clipPath: 'polygon(0 0,100% 50%,0 100%)',
                                                WebkitClipPath: 'polygon(0 0,100% 50%,0 100%)',
                                                content: '""',
                                                height: '100%',
                                                width: '10px',
                                                position: 'absolute',
                                                left: 0,
                                                top: 0
                                            }
                                        }}>
                                        <Tooltip title={`Weight: ${(score.displayed_pp.weight * 100).toFixed(0)}% ${toFixedNumber(score.displayed_pp.total * score.displayed_pp.weight, 0).toLocaleString('en-US')}pp`}>
                                            <Typography variant="h6">{toFixedNumber(score.displayed_pp.total, 0).toLocaleString('en-US')}pp</Typography>
                                        </Tooltip>
                                    </Box>
                                </Grid>
                                {
                                    allowScoreViewer ?
                                        <Grid item xs={0.5}>
                                            <Box sx={{
                                                width: '100%',
                                                height: '100%',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                bgcolor: theme.palette.background.paper,
                                                //fix border radius
                                                position: 'relative',
                                            }}>
                                                <IconButton onClick={toggleViewer} size="small">
                                                    <VisibilityIcon />
                                                </IconButton>

                                            </Box>
                                        </Grid> : null
                                }
                            </Grid>
                        </Box>
                    </>
                    : <>
                        <Box sx={{ width: '100%' }}>
                            <LinearProgress />
                        </Box>
                    </>
            }
        </>
    );
}
export default ScoreTableRow;