import { useState } from "react";
import { useEffect } from "react";
import { Box, Stack, Tooltip, Typography, useTheme } from "@mui/material";
import GlowBar from "../UI/GlowBar";
import LevelIcon from "../UI/LevelIcon";
import { LEADERBOARD_BORDER_RADIUS, LEADERBOARD_ITEM_HEIGHT, LeaderboardItem } from "./LeaderboardItem";
import ReactCountryFlag from "react-country-flag";
import { GetRoleIcons } from "../../Helpers/Account";
import NotInterestedIcon from '@mui/icons-material/NotInterested';

function PlayerLeaderboardItem(props) {
    const [osu_user, setOsuUser] = useState({});
    const [inspector_user, setInspectorUser] = useState({});
    const [base_user, setBaseUser] = useState({});
    const theme = useTheme();

    useEffect(() => {
        const _base_user = props.user;
        const _osu_user = _base_user.osu_user;

        setOsuUser(_osu_user);
        setBaseUser(_base_user);

        let _inspector_user = {
            known_username: _base_user.username,
            osu_id: _osu_user?.id ?? _base_user?.id ?? 0,
            roles: [],
        };

        if (_base_user?.inspector_user) {
            _inspector_user = _base_user.inspector_user;
        }
        setInspectorUser(_inspector_user);
    }, [props]);

    return (
        <>
            <LeaderboardItem background={osu_user?.cover?.custom_url}>
                <img
                    src={`https://a.ppy.sh/${base_user?.user_id}`}
                    alt={base_user?.username}
                    style={{
                        aspectRatio: '1/1', display: 'flex',
                        borderRadius: LEADERBOARD_BORDER_RADIUS
                    }} />

                <Box sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    width: '80px'
                }}>
                    <Typography variant='h6' sx={{ fontSize: '1.3em' }} noWrap>
                        #{base_user?.rank ?? 0}
                    </Typography>
                </Box>

                <Box sx={{
                    width: '60px',
                    position: 'relative',
                    p: 0,
                    height: '100%',
                }}>
                    <Box sx={{ position: 'absolute', height: '100%', p: 1, pt: 2, pb: 2, left: -10 }}>
                        <Box sx={{ position: 'relative', height: '100%' }}>
                            <GlowBar
                                color={osu_user?.groups?.[0]?.colour ?? theme.typography.title.color}
                                size='6px'
                            />
                        </Box>
                    </Box>
                    <LevelIcon
                        size={LEADERBOARD_ITEM_HEIGHT}
                        level={osu_user?.statistics_rulesets?.osu?.level?.current ?? 0}
                        levelProgress={osu_user?.statistics_rulesets?.osu?.level?.progress ?? 0}
                        showLevelProgress={false}
                    />
                </Box>

                <Box sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    width: '50px'
                }}>
                    <Box>
                        <ReactCountryFlag
                            style={{ lineHeight: '1em', fontSize: '1.8em', borderRadius: '5px' }}
                            cdnUrl="https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/6.6.6/flags/4x3/"
                            countryCode={osu_user?.country_code ?? ''}
                        />
                    </Box>
                </Box>

                <Box sx={{
                    display: 'flex',
                    justifyContent: 'left',
                    alignItems: 'center',
                    width: '60%'
                }}>
                    <Stack direction='row' spacing={1} alignItems='center'>
                        <Typography variant='body1' noWrap>
                            {base_user?.username ?? 'Unknown'}
                        </Typography>
                        {GetRoleIcons(inspector_user?.roles ?? [])}
                        {
                            !osu_user &&
                            <Tooltip title='Cannot find osu! user profile. Probably restricted.'>
                                <Typography variant='body1' sx={{ color: 'red' }} noWrap>
                                    <NotInterestedIcon />
                                </Typography>
                            </Tooltip>
                        }
                    </Stack>
                </Box>

                <Box sx={{
                    display: 'flex',
                    justifyContent: 'right',
                    alignItems: 'center',
                }}>
                    <Typography variant='h6' textAlign={'right'} noWrap>
                        {
                            (props.statistic?.customFormat !== undefined && props.statistic?.customFormat != null) ?
                                <>
                                    {props.statistic?.customFormat(base_user?.stat)}
                                </> : <>
                                    {Math.round(base_user?.stat).toLocaleString('en-US')}
                                </>

                        }
                    </Typography>
                </Box>
            </LeaderboardItem>
        </>
    )
}

export default PlayerLeaderboardItem;