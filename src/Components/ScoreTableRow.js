import { Box, Grid, LinearProgress, Tooltip, Typography, useTheme } from '@mui/material';
import { useEffect } from 'react';
import { useState } from 'react';
import { getGradeIcon, getModIcon } from '../Helpers/Assets';
import { toFixedNumber } from '../Helpers/Misc';
import { getModString, mods, mod_strings_long } from '../Helpers/Osu';
import moment from 'moment';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { red } from '@mui/material/colors';

function ScoreTableRow(props) {
    const theme = useTheme();
    const [score, setScore] = useState(null);

    useEffect(() => {
        setScore(props.data.score);
    }, [props.data]);

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
                                <Grid item xs={6} sx={{ height: '100%', display: 'flex', alignItems: 'center' }}>
                                    <Tooltip title={`${score.beatmap.artist} - ${score.beatmap.title} [${score.beatmap.diffname}]`}>
                                        <Typography sx={{ fontSize: '0.8rem', maxWidth: '100%', textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden' }}>
                                            {score.beatmap.artist} - {score.beatmap.title}
                                        </Typography>
                                        <Typography sx={{ fontSize: '0.7rem', maxWidth: '100%', textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden' }}>
                                            <span style={{ color: '#ea0' }}>{score.beatmap.diffname}</span> <span style={{ opacity: '0.7' }}>{moment(score.date_played_moment).fromNow()}</span>
                                        </Typography>
                                    </Tooltip>
                                </Grid>
                                <Grid item xs={0.2} sx={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'right' }}>
                                    {
                                        score.beatmap.approved === 4 ?
                                            <>
                                                <Tooltip title="Loved">
                                                    <FavoriteIcon sx={{ color: red[500] }} />
                                                </Tooltip>
                                            </> : <></>
                                    }
                                </Grid>
                                <Grid item xs={0.6} sx={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'right' }}>
                                    {
                                        score.beatmap.modded_sr[score.recalc[props.data.pp_version]?.model]?.base?.star_rating && score.beatmap.modded_sr[score.recalc[props.data.pp_version].model].base.star_rating !== score.beatmap.modded_sr[score.recalc[props.data.pp_version].model].star_rating ?
                                            <>
                                                <Typography variant="subtitle2" sx={{ opacity: 0.4 }}>
                                                    {score.beatmap.modded_sr[score.recalc[props.data.pp_version].model].base.star_rating.toFixed(2)}* {"-> "}
                                                </Typography>
                                            </> : <></>
                                    }
                                </Grid>
                                <Grid item xs={0.6} sx={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'left' }}>
                                    <Typography sx={{ ml: 0.4 }} variant="subtitle2"> {(score.beatmap.modded_sr[score.recalc[props.data.pp_version]?.model]?.star_rating ?? 0).toFixed(2)}*</Typography>
                                </Grid>
                                <Grid item xs={1.4} sx={{ height: '100%', alignContent: 'right', display: 'flex', alignItems: 'center' }}>
                                    {
                                        getModString(score.enabled_mods).map(mod => (
                                            <Tooltip title={mod_strings_long[mods[mod]]}>
                                                <img height="20px" src={getModIcon(mod)} alt={mod} />
                                            </Tooltip>
                                        ))
                                    }
                                </Grid>
                                <Grid item xs={0.6} sx={{ height: '100%', display: 'flex', alignItems: 'center' }}>
                                    <Typography variant="subtitle2">{score.accuracy.toFixed(2)}%</Typography>
                                </Grid>
                                <Grid item xs={1.35} sx={{ height: '100%', display: 'flex', alignItems: 'center' }}>
                                    <Box
                                        sx={{
                                            width: '100%',
                                            height: '100%',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'right',
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
                                        <Tooltip title={`Weight: ${(score.recalc[props.data.pp_version].weight * 100).toFixed(0)}% ${toFixedNumber(score.recalc[props.data.pp_version].total * score.recalc[props.data.pp_version].weight, 0).toLocaleString('en-US')}pp`}>
                                            <Typography variant="h6">
                                                {toFixedNumber(score.recalc[props.data.pp_version].total, 0).toLocaleString('en-US')}pp
                                            </Typography>
                                            {/* <Typography variant="h6">{toFixedNumber(score.pp_orig, 0).toLocaleString('en-US')}pp</Typography> */}
                                        </Tooltip>
                                    </Box>
                                </Grid>
                                <Grid item xs={0.75} sx={{ height: '100%', display: 'flex', alignItems: 'left', bgcolor: theme.palette.background.paper }}>
                                    <Typography sx={{ fontSize: '0.7rem' }} color={'' + (score.recalc[props.data.pp_version].total - score.pp >= 0 ? '#11cb5f' : 'error')} variant='subtitle2' display="inline">{(score.recalc[props.data.pp_version].total - score.pp >= 0 ? '+' : '-')}{toFixedNumber(Math.abs(score.recalc[props.data.pp_version].total - score.pp), 0)}pp</Typography>
                                </Grid>
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