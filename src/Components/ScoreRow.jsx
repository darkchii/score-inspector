import { Box, Grid2, Tooltip, Typography, useTheme } from "@mui/material";
import { useEffect, useState } from "react";
import { getGradeIcon } from "../Helpers/Assets";
import FavoriteIcon from '@mui/icons-material/Favorite';
import { grey, orange, red } from "@mui/material/colors";
import { formatNumber, toFixedNumber } from "../Helpers/Misc";
import Mods from "../Helpers/Mods";
import WarningIcon from '@mui/icons-material/Warning';
import ScoreModal from "./ScoreModal";
import OsuTooltip from "./OsuTooltip";

function ScoreRow(props) {
    const theme = useTheme();
    const [score, setScore] = useState(null);
    const [beatmap, setBeatmap] = useState(null);
    const [modalData, setModalData] = useState({ active: false });
    const [isHovering, setIsHovering] = useState(false);

    useEffect(() => {
        setScore(props.data.score);
        setBeatmap(props.data.score.beatmap);
    }, [props.data]);

    const onClick = () => {
        setModalData({ active: true, score: score });
    }

    return (
        <>
            {
                score !== null ?
                    <>
                        <ScoreModal data={modalData} />
                        <Box
                            onClick={onClick}
                            onMouseEnter={() => setIsHovering(true)}
                            onMouseLeave={() => setIsHovering(false)}
                            sx={{
                                margin: 0,
                                width: '100%',
                                height: '2.5rem',
                                bgcolor: theme.palette.background.default,
                                borderRadius: theme.shape.borderRadius,
                                '&:hover': {
                                    bgcolor: theme.palette.background.paper,
                                    cursor: 'pointer'
                                },
                                position: 'relative',
                                overflow: 'hidden',
                            }} >
                            <Box
                                sx={{
                                    width: '100%',
                                    height: '100%',
                                    top: 0,
                                    left: 0,
                                    position: 'absolute',
                                    backgroundImage: `url(https://assets.ppy.sh/beatmaps/${score.beatmap.set_id}/covers/cover.jpg)`,
                                    backgroundSize: 'cover',
                                    backgroundPosition: 'center',
                                    filter: 'blur(5px)',
                                    borderRadius: theme.shape.borderRadius,
                                    transform: 'scale(1.2)',
                                }}
                            />
                            <Box sx={{
                                width: '100%',
                                height: '100%',
                                top: 0,
                                left: 0,
                                position: 'absolute',
                                // backgroundColor: 'rgba(0, 0, 0, 0.7)',
                                backgroundColor: `rgba(0, 0, 0, ${isHovering ? 0.85 : 0.7})`,
                                transition: 'all 0.2s',
                                borderRadius: theme.shape.borderRadius,
                            }} />
                            <Grid2 container sx={{
                                zIndex: 10,
                                //force zIndex on all children
                                '& > *': {
                                    zIndex: 10
                                },
                                borderRadius: theme.shape.borderRadius,
                            }}>
                                <Grid2 size={props.small ? 1 : 0.3}>
                                    <Box sx={{
                                        height: '100%',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}>
                                        <img src={getGradeIcon(score.rank)} alt={score.rank} />
                                    </Box>
                                    {/* {getGradeIcon(score.rank)} */}
                                </Grid2>

                                <Grid2 size={props.small ? 5.5 : 4.3}>
                                    <Box sx={{
                                        height: '100%',
                                        alignItems: 'center',
                                        maxWidth: '100%',
                                    }}>
                                        <OsuTooltip
                                            title={`${score.beatmap.artist} - ${score.beatmap.title} [${score.beatmap.diffname}]`}
                                        >
                                            <Typography noWrap sx={{ fontSize: '0.8rem', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                                {props.small ? undefined : `${score.beatmap.artist} -`} {score.beatmap.title}
                                            </Typography>
                                            <Typography noWrap sx={{ fontSize: '0.7rem', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                                <span style={{ color: '#ea0' }}>{score.beatmap.diffname}</span> <span style={{ opacity: '0.7' }}>{score.date_played_moment.fromNow()}</span>
                                            </Typography>
                                        </OsuTooltip>
                                    </Box>
                                </Grid2>

                                {
                                    !props.small ?
                                        <>
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
                                            <Grid2 size={0.8}>
                                                <Box sx={{ height: '100%', display: 'flex', alignItems: 'center' }}>
                                                    <Typography sx={{ fontSize: '0.8rem', maxWidth: '100%', textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden' }}>
                                                        {score.combo}/{beatmap.maxcombo}x
                                                    </Typography>
                                                </Box>
                                            </Grid2>
                                            <Grid2 size={0.3}>
                                                <Box sx={{ height: '100%', display: 'flex', alignItems: 'center' }}>
                                                    <Box>
                                                        <Typography sx={{ fontSize: '0.8rem', maxWidth: '100%', textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden' }}>
                                                            AR: {formatNumber(beatmap.difficulty_data.approach_rate ?? -1, 1)}
                                                        </Typography>
                                                        <Typography sx={{ fontSize: '0.8rem', maxWidth: '100%', textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden' }}>
                                                            CS: {formatNumber(beatmap.difficulty_data.circle_size ?? -1, 1)}
                                                        </Typography>
                                                    </Box>
                                                </Box>
                                            </Grid2>
                                            <Grid2 size={0.3}>
                                                <Box sx={{ height: '100%', display: 'flex', alignItems: 'center' }}>
                                                    <Box>
                                                        <Typography sx={{ fontSize: '0.8rem', maxWidth: '100%', textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden' }}>
                                                            OD: {formatNumber(beatmap.difficulty_data.overall_difficulty ?? -1, 1)}
                                                        </Typography>
                                                        <Typography sx={{ fontSize: '0.8rem', maxWidth: '100%', textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden' }}>
                                                            HP: {formatNumber(beatmap.difficulty_data.drain_rate ?? -1, 1)}
                                                        </Typography>
                                                    </Box>
                                                </Box>
                                            </Grid2>
                                        </>
                                        : <> </>
                                }


                                <Grid2 size={props.small ? 0.5 : 0.2}>
                                    {
                                        score.beatmap.approved === 4 ?
                                            <>
                                                <Box sx={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'right' }}>
                                                    <OsuTooltip title="Loved">
                                                        <FavoriteIcon sx={{ color: red[500] }} />
                                                    </OsuTooltip>
                                                </Box>
                                            </> : <></>
                                    }
                                </Grid2>

                                {
                                    !props.small ?
                                        <>
                                            <Grid2 size={0.4}>
                                                <Box sx={{ height: '100%', alignContent: 'right', display: 'flex', alignItems: 'center', justifyContent: 'right', pr: 0.3 }}>
                                                    {
                                                        score.beatmap.difficulty_data.star_rating && (Math.round(score.beatmap.difficulty_data.star_rating * 100) / 100) !== (Math.round(score.beatmap.stars * 100) / 100) ?
                                                            <>
                                                                <Typography variant="subtitle2" sx={{ opacity: 0.4 }}>
                                                                    {formatNumber(score.beatmap.stars, 2)}*
                                                                </Typography>
                                                            </> : <></>
                                                    }
                                                </Box>
                                            </Grid2>
                                            <Grid2 size={0.1}>
                                                <Box sx={{ height: '100%', alignContent: 'right', display: 'flex', alignItems: 'center' }}>
                                                    {
                                                        score.beatmap.difficulty_data.star_rating && (Math.round(score.beatmap.difficulty_data.star_rating * 100) / 100) !== (Math.round(score.beatmap.stars * 100) / 100) ?
                                                            <>
                                                                <Typography variant="subtitle2" sx={{ opacity: 0.4 }}>{"-> "}</Typography>
                                                            </> : <></>
                                                    }
                                                </Box>
                                            </Grid2>
                                        </>
                                        : <></>
                                }
                                <Grid2 size={props.small ? 0.7 : 0.4}>
                                    <Box sx={{ height: '100%', alignContent: 'right', display: 'flex', alignItems: 'center', justifyContent: 'left' }}>
                                        <OsuTooltip title={
                                            `Aim: ${formatNumber(score.beatmap.difficulty_data.aim_difficulty, 2)}, Speed: ${formatNumber(score.beatmap.difficulty_data.speed_difficulty, 2)}, Flashlight: ${formatNumber(score.beatmap.difficulty_data.flashlight_rating ?? 0, 2)}*`
                                        }>
                                            <Typography sx={{ ml: 0.4 }} variant="subtitle2"> {formatNumber(score.beatmap.difficulty_data.star_rating ?? 0, 2)}*</Typography>
                                        </OsuTooltip>
                                    </Box>
                                </Grid2>

                                <Grid2 size={props.small ? 1.5 : 1.7} sx={{
                                    zIndex: 12,
                                }}>
                                    <Box sx={{
                                        height: '100%',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'left',
                                    }}>
                                        <Typography sx={{
                                            display: 'flex',
                                            justifyContent: 'flex-start',
                                            alignItems: 'center',
                                            ml: 1,
                                            pl: 2,
                                            transition: 'all 0.3s',
                                            '& > *': {
                                                ml: -2.5,
                                                opacity: 0.8,
                                                //offset to compensate for the margin
                                                transition: 'margin-left 0.3s',
                                            },
                                            //on hover, all children no margin
                                            '&:hover > *': {
                                                ml: 0,
                                                opacity: 1,
                                                zIndex: 12,
                                                transition: 'margin-left 0.3s',
                                            },
                                            '&:hover': {
                                                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                                                borderRadius: '5px',
                                                transition: 'all 0.3s',
                                                pl: 0
                                            }
                                        }}>
                                            {
                                                Mods.valueOf(score.mods).map(mod => Mods.getModElement(mod, 20))
                                            }
                                        </Typography>
                                    </Box>
                                </Grid2>

                                <Grid2 size={props.small ? 1.1 : 0.6}>
                                    <Box sx={{ height: '100%', display: 'flex', alignItems: 'center' }}>
                                        <Typography variant="subtitle2">
                                            {formatNumber(score.accuracy, 2)}%
                                        </Typography>
                                    </Box>
                                </Grid2>

                                {
                                    !props.small ?
                                        <Grid2 size={0.6}>
                                            <Box sx={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'left', pr: 1, color: grey[500] }}>
                                                {
                                                    !score.is_fc && score.recalc['fc'] ?
                                                        <Typography variant="caption">If FC:<br />{formatNumber(Math.round(score.recalc['fc']?.total))}pp</Typography>
                                                        : <></>
                                                }
                                            </Box>
                                        </Grid2>
                                        : <></>
                                }

                                <Grid2 size={props.small ? 1.4 : 1}>
                                    <Box sx={{
                                        height: '100%',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'right',
                                        pr: 1,
                                    }}>
                                        {
                                            score.beatmap.difficulty_data.is_legacy ?
                                                <OsuTooltip title="This score uses old star ratings and may cause incorrect mod and/or pp values">
                                                    <WarningIcon sx={{ color: orange[500] }} />
                                                </OsuTooltip>
                                                : <></>
                                        }
                                        <Typography variant="subtitle1">
                                            {/* {toFixedNumber(score.pp > 0 ? score.pp : score.estimated_pp, 2).toLocaleString('en-US')}pp */}
                                            {formatNumber(score.pp > 0 ? score.pp : score.estimated_pp, 0)}pp
                                        </Typography>
                                        {/* <Box
                                            sx={{
                                                width: '100%',
                                                height: '100%',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: props.data.hide_diff ? 'center' : 'right',
                                                bgcolor: theme.palette.background.paper,
                                                borderRadius: theme.shape.borderRadius,
                                                position: 'relative',
                                                pr: 1,
                                                zIndex: 7
                                            }}>
                                        </Box> */}
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