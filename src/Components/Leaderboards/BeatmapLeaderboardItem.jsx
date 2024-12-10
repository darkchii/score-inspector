import { useState, useEffect } from "react";
import { Box, Tooltip, Typography } from "@mui/material";
import GlowBar from "../UI/GlowBar";
import { LeaderboardItem } from "./LeaderboardItem";
import CheckIcon from '@mui/icons-material/Check';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { approval_state } from "../../Helpers/Osu";
import { green, red, yellow } from "@mui/material/colors";

function BeatmapLeaderboardItem(props) {
    const [base_beatmap, setBaseBeatmap] = useState({});
    const [osu_beatmap, setOsuBeatmap] = useState({});
    const [type, setType] = useState('');

    useEffect(() => {
        const _base_beatmap = props.map;

        setBaseBeatmap(_base_beatmap);
        setOsuBeatmap(_base_beatmap?.osu_beatmap);
        setType(props.type);
    }, [props]);

    return (
        <>
            <LeaderboardItem
                background={`https://assets.ppy.sh/beatmaps/${osu_beatmap?.set_id}/covers/cover.jpg`}
                backgroundColor={
                    //less obtrusive color, so darker shades of what we already have
                    osu_beatmap?.approved === 4 ? '#aa0000' :
                        osu_beatmap?.approved === 3 ? '#aa6600' :
                            osu_beatmap?.approved === 2 ? '#006600' :
                                osu_beatmap?.approved === 1 ? '#0066aa' : '#000000'
                }
                onClick={() => {
                    if (type === 'beatmapsets')
                        window.open(`https://osu.ppy.sh/beatmapsets/${base_beatmap?.set_id}`, "_blank");
                    else if (type === 'beatmaps')
                        window.open(`https://osu.ppy.sh/beatmaps/${base_beatmap?.beatmap_id}`, "_blank");
                }}
            >
                <Box sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    width: '50px'
                }}>
                    <Typography variant='h6' sx={{ fontSize: '1.3em' }} noWrap>
                        #{base_beatmap?.rank ?? 0}
                    </Typography>
                </Box>

                <Box sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    width: '40px'
                }}>
                    <Tooltip title={`${approval_state[osu_beatmap?.approved] ?? ''}`}>
                        <Box>
                            {
                                osu_beatmap?.approved === 1 || osu_beatmap?.approved === 2 ?
                                    <CheckIcon sx={{ color: green[400] }} />
                                    : osu_beatmap?.approved === 3 ?
                                        <CheckIcon sx={{ color: yellow[400] }} />
                                        : osu_beatmap?.approved === 4 ?
                                            <FavoriteIcon sx={{ color: red[400] }} />
                                            : <></>
                            }
                        </Box>
                    </Tooltip>
                </Box>

                <Box sx={{
                    width: '60%',
                    position: 'relative',
                    p: 0,
                    height: '100%',
                    display: 'flex',
                    justifyContent: 'center',
                    flexDirection: 'column'
                }}>
                    <Box sx={{ position: 'absolute', height: '100%', p: 1, pt: 2, pb: 2 }}>
                        <Box sx={{ position: 'relative', height: '100%' }}>
                            <GlowBar
                                size='6px'
                            />
                        </Box>
                    </Box>
                    <Box sx={{ pl: 2 }}>
                        <Typography>
                            {
                                `${osu_beatmap?.artist} - ${osu_beatmap?.title} ${type === 'beatmaps' ? `[${osu_beatmap?.diffname}]` : ''} `
                            }
                        </Typography>
                    </Box>
                </Box>

                {/* <Box sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    width: '5%'
                }}>
                    {
                        type === 'beatmaps' ?
                            <Typography variant='subtitles1' noWrap>
                                {Math.round(osu_beatmap?.stars * 100) / 100}*
                            </Typography> : <></>
                    }
                </Box> */}

                {/* <Box sx={{
                    display: 'flex',
                    justifyContent: 'right',
                    alignItems: 'center',
                    width: '15%'
                }}>
                    <Typography variant='h6' textAlign={'right'} noWrap>
                        {
                            (props.statistic?.customFormat !== undefined && props.statistic?.customFormat != null) ?
                                <>
                                    {props.statistic?.customFormat(base_beatmap?.stat)}
                                </> : <>
                                    {Math.round(base_beatmap?.stat ?? 0).toLocaleString('en-US')}
                                </>

                        }
                    </Typography>
                </Box> */}
                <Box sx={{
                    display: 'flex',
                    justifyContent: 'right',
                    alignItems: 'center',
                    flexGrow: 1,
                    pr: 1
                }}>
                    {
                        props.values?.map((value, index) => {
                            return (
                                <Box
                                    key={index}
                                    sx={{
                                        display: 'flex',
                                        justifyContent: value.alignment,
                                        alignItems: 'center',
                                        width: `${100 / props.values.length}%`,
                                        pl: 1,
                                        pr: 1,
                                    }}>
                                    <Typography
                                        sx={{
                                            color: value.color ?? 'inherit',
                                        }}
                                        variant={value.variant ?? 'h6'}
                                        textAlign={value.alignment}
                                        noWrap>
                                        {value.value}
                                    </Typography>
                                </Box>
                            )
                        })
                    }
                </Box>
                {/* <Box sx={{
                    display: 'flex',
                    justifyContent: 'left',
                    alignItems: 'center',
                    width: '15%',
                    pl: 2
                }}>
                    <Typography variant='h6' textAlign={'left'} noWrap>
                        {
                            props.statistic?.diff !== undefined && props.statistic?.diff != null ?
                            ((props.statistic?.customFormat !== undefined && props.statistic?.customFormat != null) ?
                                <>
                                    {props.statistic?.customFormat(base_beatmap?.diff)}
                                </> : <>
                                    {Math.round(base_beatmap?.diff ?? 0).toLocaleString('en-US')}
                                </>) : <></>

                        }
                    </Typography>
                </Box> */}
            </LeaderboardItem>
        </>
    )
}

export default BeatmapLeaderboardItem;