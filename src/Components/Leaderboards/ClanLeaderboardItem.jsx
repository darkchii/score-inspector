import { Avatar, Box, Typography } from "@mui/material";
import GlowBar from "../UI/GlowBar";
import { LEADERBOARD_ITEM_HEIGHT, LeaderboardItem } from "./LeaderboardItem";
import { useNavigate } from "react-router";
import OsuTooltip from "../OsuTooltip";

function ClanLeaderboardItem(props) {
    const navigate = useNavigate();
    return (
        <LeaderboardItem
            height={props.height ?? undefined}
            background={props.clan?.header_image_url ? `${encodeURI(props.clan.header_image_url)}` : ''}
            backgroundColor={`#${props.clan?.color}`}
            onClick={() => {
                navigate(`/clan/${props.clan?.id}`);
            }}
        >
            <Box sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                width: '100px'
            }}>
                <Typography variant='h6' sx={{ fontSize: '1.3em' }} noWrap>
                    #{props.index}
                </Typography>
            </Box>

            <Box sx={{
                width: '7%',
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
                            color={`#${props.clan?.color}`}
                        />
                    </Box>
                </Box>
                <Box sx={{ pl: 2 }}>
                    <Typography sx={{ color: `#${props.clan?.color}` }}>
                        {
                            `[${props.clan?.tag}]`
                        }
                    </Typography>
                </Box>
            </Box>
            <Box sx={{
                display: 'flex',
                justifyContent: 'left',
                alignItems: 'center',
                width: '20%'
            }}>
                <Box sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                }}>
                    <Box sx={{
                        height: LEADERBOARD_ITEM_HEIGHT * 0.8,
                        width: LEADERBOARD_ITEM_HEIGHT * 0.8,
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}>
                        {
                            props.clan?.logo_image_url ?
                                <>
                                    {/* just a exact square with image fit inside */}
                                    <Avatar
                                        src={props.clan.logo_image_url}
                                        alt={props.clan.name}
                                        variant='rounded'
                                        style={{
                                            height: '100%',
                                            width: '100%',
                                            objectFit: 'contain',
                                        }}
                                    />
                                </> : null
                        }
                    </Box>
                    <Box sx={{
                        pl: 1
                    }}>
                        <Box sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            alignItems: 'left',
                        }}>
                            <Typography>
                                {props.clan?.name}
                            </Typography>
                            <Typography sx={{
                                fontSize: '0.8em',
                                color: 'rgba(255, 255, 255, 0.7)',
                                fontWeight: 100
                            }}>
                                Lead by <span style={{ fontWeight: 300, color: 'rgba(255,255,255,0.9)' }}>{props.clan?.owner_user?.known_username}</span>
                            </Typography>
                        </Box>
                    </Box>
                </Box>
            </Box>

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
                            <OsuTooltip key={index} title={value.tooltip ?? ''}>
                                <Box sx={{
                                    display: 'flex',
                                    justifyContent: value.alignment,
                                    alignItems: 'center',
                                    width: `${100 / props.values.length}%`,
                                    pl: 1,
                                    pr: 1,
                                }}>
                                    <Box>
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
                                </Box>
                            </OsuTooltip>
                        )
                    })
                }
            </Box>
            <Box sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                width: '100px'
            }}>
                {
                    props.iconValues?.map((value, index) => {
                        return (
                            <OsuTooltip key={index} title={value.tooltip ?? ''}>
                                <Box sx={{
                                    display: 'flex',
                                    justifyContent: value.alignment,
                                    alignItems: 'center',
                                    width: `${100 / props.iconValues.length}%`,
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
                            </OsuTooltip>
                        )
                    })
                }
            </Box>
        </LeaderboardItem>
    )
}

export default ClanLeaderboardItem;