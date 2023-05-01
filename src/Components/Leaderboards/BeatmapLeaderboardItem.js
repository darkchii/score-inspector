import { useState } from "react";
import { useEffect } from "react";
import { Box, Stack, Tooltip, Typography, useTheme } from "@mui/material";
import GlowBar from "../UI/GlowBar";
import LevelIcon from "../UI/LevelIcon";
import { LEADERBOARD_BORDER_RADIUS, LEADERBOARD_ITEM_HEIGHT, LeaderboardItem } from "./LeaderboardItem";
import ReactCountryFlag from "react-country-flag";
import { GetRoleIcons } from "../../Helpers/Account";
import NotInterestedIcon from '@mui/icons-material/NotInterested';

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
            <LeaderboardItem background={`https://assets.ppy.sh/beatmaps/${osu_beatmap?.beatmapset_id}/covers/cover.jpg`}>
                <Box sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    width: '80px'
                }}>
                    <Typography variant='h6' sx={{ fontSize: '1.3em' }} noWrap>
                        #{base_beatmap?.rank ?? 0}
                    </Typography>
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
                    <Box sx={{ position: 'absolute', height: '100%', p: 1, pt: 2, pb: 2, left: -12 }}>
                        <Box sx={{ position: 'relative', height: '100%' }}>
                            <GlowBar
                                size='6px'
                            />
                        </Box>
                    </Box>
                    <Typography>
                        {
                            `${osu_beatmap?.artist} - ${osu_beatmap?.title} ${type === 'beatmaps' ? `[${osu_beatmap?.version}]` : ''} `
                        }
                    </Typography>
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
                                    {Math.round(base_beatmap?.stat).toLocaleString('en-US')}
                                </>

                        }
                    </Typography>
                </Box>
            </LeaderboardItem>
        </>
    )
}

export default BeatmapLeaderboardItem;