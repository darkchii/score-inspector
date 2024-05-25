/* eslint-disable react-hooks/exhaustive-deps */
import { Box, Card, CardContent, CardMedia, Grid, Stack, Typography } from "@mui/material";
import ReactCountryFlag from "react-country-flag";
import { GetRoleIcons } from "../Helpers/Account";
import LevelIcon from "./UI/LevelIcon";
import { useState } from "react";
import { useEffect } from "react";
import { useRef } from "react";

const SECTIONAL_HEIGHT = 75;
const BORDER_RADIUS = '15px';

function PlayerCard(props) {
    const [cardHeight, setCardHeight] = useState(0);
    const boxRef = useRef();
    const [rulesetStats, setRulesetStats] = useState(null);

    const sx = {
        rowHeight: SECTIONAL_HEIGHT,
        ...props.sx,
    }

    useEffect(() => {
        //get height of card element
        setCardHeight(boxRef?.current?.clientHeight);
    });

    useEffect(() => {
        //get ruleset stats
        if (props.user?.osu?.statistics_rulesets) {
            setRulesetStats(props.user?.osu?.statistics_rulesets?.osu);
        } else {
            setRulesetStats(props.user?.osu?.statistics);
        }
    }, []);

    if (!props.user.osu) {
        return null;
    }

    return (
        <Box
            ref={boxRef}
            sx={{
                minHeight: '100%',
            }}>
            <Card
                onClick={() => props.onClick()}
                elevation={5}
                sx={{
                    borderRadius: BORDER_RADIUS, "&:hover": {
                        opacity: 0.9,
                        cursor: 'pointer'
                    },
                    position: 'relative',
                    height: '100%',
                    minHeight: sx.rowHeight
                }}>
                <Grid sx={{
                    height: sx.rowHeight, display: 'flex',
                    minHeight: sx.rowHeight,
                    backgroundImage: `url(${props.user.osu?.cover?.url})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    borderRadius: `calc(${BORDER_RADIUS} + 1px)`,
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
                            image={`https://a.ppy.sh/${props.user.osu?.id}`}
                            alt={props.user.osu?.username}
                            sx={{ aspectRatio: '1/1', width: sx.rowHeight, borderRadius: BORDER_RADIUS, display: 'flex' }} />
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
                                                countryCode={props.user.osu?.country_code}
                                            />
                                            {
                                                props.user.inspector_user?.clan_member && !props.user.inspector_user?.clan_member.pending ? 
                                                    <span><b style={{color: `#${props.user.inspector_user?.clan_member.clan.color}` }}>{`[${props.user.inspector_user?.clan_member.clan.tag}] `}</b></span>
                                                : null
                                            }
                                            {props.user.osu?.username}
                                        </Typography>
                                        {
                                            sx.rowHeight >= SECTIONAL_HEIGHT &&
                                            <Stack direction='row' spacing={0.5}>
                                                {props.user?.inspector_user?.roles && GetRoleIcons(props.user?.inspector_user?.roles, true)}
                                            </Stack>
                                        }
                                    </Stack>
                                </Box>
                            </CardContent>
                        </Box>
                        <Box sx={{
                            display: 'flex',
                            width: sx.rowHeight
                        }}>
                            <LevelIcon
                                size={sx.rowHeight}
                                borderRadius={BORDER_RADIUS}
                                level={rulesetStats?.level.current ?? 0}
                                levelProgress={rulesetStats?.level.progress ?? 0} />
                        </Box>
                    </Box>
                </Grid>
                {
                    cardHeight >= sx.rowHeight * 2 &&
                    <Grid sx={{
                        height: sx.rowHeight, display: 'flex',
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
                                    }}>#{rulesetStats?.global_rank > 0 ? (Math.max(0, rulesetStats?.global_rank)).toLocaleString('en-US') : '-'}</Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography variant='subtitle1'>Score Rank</Typography>
                                    <Typography variant='h5'>#{
                                        props.user.osu.score_rank !== null ?
                                            ((Math.max(0, props.user.osu.score_rank.rank)).toLocaleString('en-US')) : (
                                        props.user.osu.scoreRank !== undefined ?
                                            ((Math.max(0, props.user.osu.scoreRank)).toLocaleString('en-US')) :
                                            '10.000+')}</Typography>
                                </Grid>
                            </Grid>
                        </Box>
                    </Grid>
                }
            </Card >
        </Box>
    )
}

export default PlayerCard;