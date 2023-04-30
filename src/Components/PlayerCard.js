import { Box, Card, CardContent, CardMedia, Grid, Stack, Typography } from "@mui/material";
import ReactCountryFlag from "react-country-flag";
import { Navigate } from "react-router-dom";
import { GetFormattedName, GetRoleIcons } from "../Helpers/Account";
import { PNG_LEVEL_BADGE } from "../Helpers/Assets";
import LevelIcon from "./UI/LevelIcon";
//expected user object:
// {
//     ...users2 user
//     inspector_user: {
//         ...
//     }
//}

const CARD_HEIGHT = 150;
const BORDER_RADIUS = '15px';

function PlayerCard(props) {
    return (
        <>
            <Card
                onClick={() => props.onClick()}
                elevation={5}
                sx={{
                    borderRadius: BORDER_RADIUS, "&:hover": {
                        opacity: 0.9,
                        cursor: 'pointer'
                    },
                    position: 'relative',
                    height: CARD_HEIGHT,
                }}>
                <Grid sx={{
                    height: CARD_HEIGHT * 0.5, display: 'flex',
                    backgroundImage: `url(${props.user.osu?.cover?.url})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    borderRadius: BORDER_RADIUS,
                    width: '100%'
                }}>
                    <Box sx={{
                        backgroundColor: 'rgba(0, 0, 0, 0.7)',
                        width: '100%',
                        borderRadius: BORDER_RADIUS,
                        display: 'flex'
                    }}>
                        <CardMedia
                            component="img"
                            image={`https://a.ppy.sh/${props.user.user_id}`}
                            alt={props.user.username}
                            sx={{ aspectRatio: '1/1', width: CARD_HEIGHT * 0.5, borderRadius: BORDER_RADIUS, display: 'flex' }} />
                        <Box sx={{ display: 'flex', flexDirection: 'column', flex: '1 0 auto' }}>
                            <CardContent>
                                <Box sx={{ textDecoration: 'none' }} alignContent='center'>
                                    <Stack>
                                        <Typography>
                                            <ReactCountryFlag
                                                style={{
                                                    fontSize: '1.4em',
                                                    borderRadius: '5px',
                                                    paddingRight: '0.4em'
                                                }}
                                                cdnUrl="https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/6.6.6/flags/4x3/"
                                                countryCode={props.user.country_code}
                                            />
                                            {props.user.username}
                                        </Typography>
                                        <Stack direction='row' spacing={0.5}>
                                            {props.user?.inspector_user?.roles && GetRoleIcons(props.user?.inspector_user?.roles, true)}
                                        </Stack>
                                    </Stack>
                                </Box>
                            </CardContent>
                        </Box>
                        <Box sx={{
                            display: 'flex',
                            width: CARD_HEIGHT*0.5
                        }}>
                            <LevelIcon
                                size={CARD_HEIGHT*0.5}
                                borderRadius={BORDER_RADIUS}
                                level={props.user.osu.statistics_rulesets.osu.level.current} 
                                levelProgress={props.user.osu.statistics_rulesets.osu.level.progress}/>
                        </Box>
                    </Box>
                </Grid>
                <Grid sx={{
                    height: CARD_HEIGHT * 0.5, display: 'flex',
                    width: '100%'
                }}>
                    <Box
                        display="flex"
                        justifyContent="center"
                        alignItems="center"
                        sx={{
                            width: '100%',
                            borderRadius: BORDER_RADIUS,
                            p: 1,
                        }}>
                        <Grid container spacing={1}>
                            <Grid item xs={6}>
                                <Typography variant='subtitle1'>Global Rank</Typography>
                                <Typography variant='h5' sx={{
                                    background: "-webkit-linear-gradient(0deg, #8CF6FA, #F68DC4, #FEB887)",
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent'
                                }}>#{props.user.osu.statistics_rulesets.osu.global_rank > 0 ? (Math.max(0, props.user.osu.statistics_rulesets.osu.global_rank)).toLocaleString('en-US') : '-'}</Typography>
                            </Grid>
                            <Grid item xs={6}>
                                <Typography variant='subtitle1'>Score Rank</Typography>
                                <Typography variant='h5'>#{props.user.score_rank !== undefined ? ((Math.max(0, props.user.score_rank?.rank)).toLocaleString('en-US')) : '10.000+'}</Typography>
                            </Grid>
                        </Grid>
                    </Box>
                </Grid>
            </Card >
        </>
    )
}

export default PlayerCard;