import { useState } from "react";
import { useEffect } from "react";
import { Box, Stack, Tooltip, Typography, useTheme } from "@mui/material";
import GlowBar from "../UI/GlowBar";
import LevelIcon from "../UI/LevelIcon";
import { LEADERBOARD_BORDER_RADIUS, LEADERBOARD_ITEM_HEIGHT, LeaderboardItem } from "./LeaderboardItem";
import ReactCountryFlag from "react-country-flag";
import { GetRoleIcons } from "../../Helpers/Account";
import NotInterestedIcon from '@mui/icons-material/NotInterested';
import CheckIcon from '@mui/icons-material/Check';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { approval_state } from "../../Helpers/Osu";
import { green, red, yellow } from "@mui/material/colors";

function BeatmapLeaderboardItem(props) {
    const [base_beatmap, setBaseBeatmap] = useState({});
    const [osu_beatmap, setOsuBeatmap] = useState({});
    const [type, setType] = useState('');
    const theme = useTheme();

    useEffect(() => {
        const _base_beatmap = props.map;

        setBaseBeatmap(_base_beatmap);
        setOsuBeatmap(_base_beatmap?.osu_beatmap);
        setType(props.type);
    }, [props]);

    return (
        <>
            <LeaderboardItem
                background={`https://assets.ppy.sh/beatmaps/${osu_beatmap?.beatmapset_id}/covers/cover.jpg`}
                onClick={() => {
                    if(type === 'beatmapsets')
                        window.open(`https://osu.ppy.sh/beatmapsets/${base_beatmap?.beatmapset_id}`, "_blank");
                    else if(type === 'beatmaps')
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
                                `${osu_beatmap?.artist} - ${osu_beatmap?.title} ${type === 'beatmaps' ? `[${osu_beatmap?.version}]` : ''} `
                            }
                        </Typography>
                    </Box>
                </Box>

                <Box sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    width: '5%'
                }}>
                    <Typography variant='subtitles1' noWrap>
                        {Math.round(osu_beatmap?.star_rating * 100) / 100}*
                    </Typography>
                </Box>

                <Box sx={{
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
                </Box>
            </LeaderboardItem>
        </>
    )
}

export default BeatmapLeaderboardItem;