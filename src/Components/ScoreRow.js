import { Box, Grid2, Tooltip, Typography, useTheme } from "@mui/material";
import { useEffect, useState } from "react";
import { getGradeIcon, getModIcon } from "../Helpers/Assets.js";
import FavoriteIcon from '@mui/icons-material/Favorite';
import { red } from "@mui/material/colors";
import { getModString, mod_strings_long, mods } from "../Helpers/Osu.js";
import { toFixedNumber } from "../Helpers/Misc.js";

function ScoreRow(props) {
    const theme = useTheme();
    const [score, setScore] = useState(null);
    const [beatmap, setBeatmap] = useState(null);

    useEffect(() => {
        setScore(props.data.score);
        setBeatmap(props.data.score.beatmap);
    }, [props.data]);


    return (
        <>
            {
                score !== null ?
                    <>
                        <Box
                            sx={{
                                margin: 0,
                                width: '100%',
                                height: '2.5rem',
                                bgcolor: theme.palette.background.default,
                            }} >
                            <Grid2 container>
                                <Grid2 size={0.5}>
                                    <Box sx={{ height: '100%', display: 'flex', alignItems: 'center' }}>
                                        <img src={getGradeIcon(score.rank)} alt={score.rank} />
                                    </Box>
                                    {/* {getGradeIcon(score.rank)} */}
                                </Grid2>

                                <Grid2 size={3.8}>
                                    <Box sx={{ height: '100%', display: 'flex', alignItems: 'center' }}>
                                        <Tooltip title={`${score.beatmap.artist} - ${score.beatmap.title} [${score.beatmap.diffname}]`}>
                                            <Typography sx={{ fontSize: '0.8rem', maxWidth: '100%', textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden' }}>
                                                {score.beatmap.artist} - {score.beatmap.title}
                                            </Typography>
                                            <Typography sx={{ fontSize: '0.7rem', maxWidth: '100%', textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden' }}>
                                                <span style={{ color: '#ea0' }}>{score.beatmap.diffname}</span> <span style={{ opacity: '0.7' }}>{score.date_played_moment.fromNow()}</span>
                                            </Typography>
                                        </Tooltip>
                                    </Box>
                                </Grid2>

                                <Grid2 size={0.5}>
                                    <Box sx={{ height: '100%', display: 'flex', alignItems: 'center' }}>
                                        <Typography sx={{ fontSize: '0.8rem', maxWidth: '100%', textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden' }}>
                                            {score.top_score?.pos ? `#${score.top_score?.pos.toLocaleString('en-US')}` : ''}
                                        </Typography>
                                    </Box>
                                </Grid2>

                                <Grid2 size={1}>
                                    <Box sx={{ height: '100%', display: 'flex', alignItems: 'center' }}>
                                        <Box>
                                            <Typography sx={{ fontSize: '0.9rem', maxWidth: '100%', textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden' }}>
                                                {score.score.toLocaleString('en-US')}
                                            </Typography>
                                            <Typography sx={{ fontSize: '0.75rem', maxWidth: '100%', textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden' }}>
                                                {score.scoreLazerStandardised.toLocaleString('en-US')} (lazer)
                                            </Typography>
                                        </Box>
                                    </Box>
                                </Grid2>

                                <Grid2 size={1}>
                                    <Box sx={{ height: '100%', display: 'flex', alignItems: 'center' }}>
                                        <Typography sx={{ fontSize: '0.8rem', maxWidth: '100%', textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden' }}>
                                            {score.combo}/{beatmap.maxcombo}x
                                        </Typography>
                                    </Box>
                                </Grid2>

                                <Grid2 size={0.4}>
                                    <Box sx={{ height: '100%', display: 'flex', alignItems: 'center' }}>
                                        <Box>
                                            <Typography sx={{ fontSize: '0.8rem', maxWidth: '100%', textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden' }}>
                                                AR: {toFixedNumber(beatmap.modded_sr.modded_ar, 1)}
                                            </Typography>
                                            <Typography sx={{ fontSize: '0.8rem', maxWidth: '100%', textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden' }}>
                                                CS: {toFixedNumber(beatmap.modded_sr.modded_cs, 1)}
                                            </Typography>
                                        </Box>
                                    </Box>
                                </Grid2>

                                <Grid2 size={0.4}>
                                    <Box sx={{ height: '100%', display: 'flex', alignItems: 'center' }}>
                                        <Box>
                                            <Typography sx={{ fontSize: '0.8rem', maxWidth: '100%', textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden' }}>
                                                OD: {toFixedNumber(beatmap.modded_sr.modded_od, 1)}
                                            </Typography>
                                            <Typography sx={{ fontSize: '0.8rem', maxWidth: '100%', textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden' }}>
                                                HP: {toFixedNumber(beatmap.modded_sr.modded_hp, 1)}
                                            </Typography>
                                        </Box>
                                    </Box>
                                </Grid2>

                                <Grid2 size={0.2}>
                                    {
                                        score.beatmap.approved === 4 ?
                                            <>
                                                <Box sx={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'right' }}>
                                                    <Tooltip title="Loved">
                                                        <FavoriteIcon sx={{ color: red[500] }} />
                                                    </Tooltip>
                                                </Box>
                                            </> : <></>
                                    }
                                </Grid2>

                                <Grid2 size={0.55}>
                                    <Box sx={{ height: '100%', alignContent: 'right', display: 'flex', alignItems: 'center', justifyContent: 'right', pr: 0.3 }}>
                                        {
                                            score.beatmap.modded_sr.star_rating && score.beatmap.modded_sr.star_rating !== score.beatmap.stars ?
                                                <>
                                                    <Typography variant="subtitle2" sx={{ opacity: 0.4 }}>
                                                        {score.beatmap.stars.toFixed(2)}*
                                                    </Typography>
                                                </> : <></>
                                        }
                                    </Box>
                                </Grid2>
                                <Grid2 size={0.1}>
                                    <Box sx={{ height: '100%', alignContent: 'right', display: 'flex', alignItems: 'center' }}>
                                        {
                                            score.beatmap.modded_sr.star_rating && score.beatmap.modded_sr.star_rating !== score.beatmap.stars ?
                                                <>
                                                    <Typography variant="subtitle2" sx={{ opacity: 0.4 }}>{"-> "}</Typography>
                                                </> : <></>
                                        }
                                    </Box>
                                </Grid2>
                                <Grid2 size={0.55}>
                                    <Box sx={{ height: '100%', alignContent: 'right', display: 'flex', alignItems: 'center', justifyContent: 'left' }}>
                                    <Typography sx={{ ml: 0.4 }} variant="subtitle2"> {(score.beatmap.modded_sr.star_rating ?? 0).toFixed(2)}*</Typography>
                                    </Box>
                                </Grid2>

                                <Grid2 size={1.4}>
                                    <Box sx={{ height: '100%', alignContent: 'right', display: 'flex', alignItems: 'center' }}>
                                        {
                                            getModString(score.enabled_mods).map(mod => (
                                                <Tooltip title={mod_strings_long[mods[mod]]}>
                                                    <img height="20px" src={getModIcon(mod)} alt={mod} />
                                                </Tooltip>
                                            ))
                                        }
                                    </Box>
                                </Grid2>

                                <Grid2 size={0.6}>
                                    <Box sx={{ height: '100%', display: 'flex', alignItems: 'center' }}>
                                        <Typography variant="subtitle2">{score.accuracy.toFixed(2)}%</Typography>
                                    </Box>
                                </Grid2>

                                <Grid2 size={1}>
                                    <Box sx={{ height: '100%', display: 'flex', alignItems: 'center' }}>
                                        <Box
                                            sx={{
                                                width: '100%',
                                                height: '100%',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: props.data.hide_diff ? 'center' : 'right',
                                                bgcolor: theme.palette.background.paper,
                                                borderRadius: 0,
                                                position: 'relative',
                                                pr: 1,
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
                                            <Typography variant="h6">{toFixedNumber(score.pp > 0 ? score.pp : score.estimated_pp, 2).toLocaleString('en-US')}pp</Typography>
                                        </Box>
                                    </Box>
                                </Grid2>
                            </Grid2>
                        </Box>
                    </>
                    : <></>
            }
        </>
    )
}

export default ScoreRow;