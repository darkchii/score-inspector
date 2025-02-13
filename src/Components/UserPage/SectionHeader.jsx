import { Avatar, Box, Chip, Grid2, Paper, Stack, Typography } from "@mui/material";
import moment from "moment";
import { useEffect, useState } from "react";
import { GetFormattedName, GetRoleIcon, GetRoles } from "../../Helpers/Account";
import { Link as VLink } from 'react-router';
import { getFlagIcon } from "../../Helpers/Assets";
import OsuTooltip from "../OsuTooltip";
import ScoreViewStat from "../UI/ScoreViewStat";
import { formatNumber } from "../../Helpers/Misc";

const MAX_VISITORS = 5;
function SectionHeader(props) {
    const [visitorCount, setVisitorCount] = useState(0);
    useEffect(() => {
        if (props.user.visitors !== null) {
            const vc = props.user.visitors.reduce((acc, o) => { return acc + parseInt(o.count) }, 0);
            setVisitorCount(vc);
        }
    }, [props.user]);

    if (props.user == null) return (<></>);
    return (
        <>
            <Stack direction='column' spacing={1}>
                <Box component={Paper} elevation={2}>
                    <Stack direction='row' spacing={1} sx={{ m: 1 }}>
                        <Typography variant='body1'>
                            Recent visitors ({visitorCount.toLocaleString('en-US')} total):
                        </Typography>
                        {props.user.visitors === null || props.user.visitors.length === 0 ? 'Noone yet :(' : ''} {props.user.visitors != null && props.user.visitors.slice(0, MAX_VISITORS).map((visitor, index) => {
                            return (
                                <>
                                    {GetFormattedName(visitor.visitor_user, {
                                        custom_tooltip: `Last visit: ${moment(visitor.last_visit).fromNow()}`,
                                        is_link: null,
                                        size: 'large'
                                    })}{index < MAX_VISITORS - 1 ? ' ' : ''}
                                </>
                            )
                        })}
                    </Stack>
                </Box>
                <Grid2 sx={{
                    backgroundImage: `url(${props.user.osu.cover_url})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    borderRadius: '11px'
                }}>
                    <Box sx={{
                        backgroundColor: 'rgba(0, 0, 0, 0.7)',
                        width: '100%',
                        borderRadius: '10px',
                    }}>
                        <Grid2 container spacing={3} alignItems='center'>
                            <Grid2 size={3.5} sx={{
                                display: 'flex',
                                justifyContent: 'flex-end',
                            }}>
                                <Avatar
                                    src={`https://a.ppy.sh/${props.user.osu.id}`}
                                    alt='avatar'
                                    sx={{
                                        height: '8rem',
                                        width: '8rem',
                                        m: 1,
                                        //slight white glow
                                        filter: 'drop-shadow(0 0 10px rgba(255, 255, 255, 0.5))',
                                    }}
                                />
                            </Grid2>
                            <Grid2 size={8.5}>
                                <Stack direction='row' spacing={1}>
                                    <Typography variant='h4'>
                                        {
                                            props.user.inspector_user?.clan_member && !props.user.inspector_user?.clan_member.pending ?
                                                <span><VLink
                                                    // href={`/clan/${props.user.inspector_user?.clan_member.clan.tag}`}
                                                    to={`/clan/${props.user.inspector_user?.clan_member.clan.id}`}
                                                    style={{
                                                        color: `#${props.user.inspector_user?.clan_member.clan.color}`,
                                                        fontWeight: 'bold',
                                                        textDecoration: 'none'
                                                    }}>
                                                    {`[${props.user.inspector_user?.clan_member.clan.tag}] `}
                                                </VLink></span>
                                                : null
                                        }
                                        {props.user.osu.username}{
                                            props.user.inspector_user !== undefined ? <>
                                                {
                                                    GetRoles(props.user.inspector_user)?.map((role) => {
                                                        return (
                                                            <>
                                                                <Box sx={{ display: 'inline-block' }}>
                                                                    <OsuTooltip title={role.description}>
                                                                        <Chip size='small' sx={{ m: 0.2, backgroundColor: `#${role.color}aa` }} icon={GetRoleIcon(role)} label={role.title} />
                                                                    </OsuTooltip>
                                                                </Box>
                                                            </>
                                                        )
                                                    })
                                                }
                                            </> : <></>
                                        }</Typography>
                                </Stack>
                                <Stack alignItems='center' direction='row' spacing={1}>
                                    <img src={getFlagIcon(props.user.osu.country.code)} alt={props.user.osu.country.code} style={{ height: '1em', borderRadius: '5px' }} />
                                    <Typography variant='h6'>{props.user.osu.country.name}</Typography>
                                    {
                                        props.user.osu.groups.length > 0 ? <>
                                            {
                                                props.user.osu.groups.map((group) => {
                                                    return (
                                                        <>
                                                            <OsuTooltip title={group.name}>
                                                                <Chip size='small' sx={{ m: 0.2, backgroundColor: `${group.colour}aa` }} label={group.short_name} />
                                                            </OsuTooltip>
                                                        </>
                                                    )
                                                })
                                            }
                                        </> : <></>
                                    }
                                </Stack>
                                <Box sx={{ width: '400px' }}>
                                    <div className='score-stats__group score-stats__group--stats'>
                                        <div className='score-stats__group-row'>
                                            <ScoreViewStat backgroundColor='#000000aa' label='World' value={`#${formatNumber(props.user.osu.statistics.global_rank ?? 0, 0)}`} />
                                            <ScoreViewStat backgroundColor='#000000aa' label='Country' value={`#${formatNumber(props.user.osu.statistics.country_rank ?? 0, 0)}`} />
                                            <ScoreViewStat backgroundColor='#000000aa' label='Score' value={`#${formatNumber(props.user.osu.score_rank?.rank ?? 0, 0)}`} />
                                        </div>
                                    </div>
                                </Box>
                                {/* <Typography variant='h6'>{Math.round(props.user.osu.statistics.pp).toLocaleString('en-US')}pp ({(Math.round(getBonusPerformance(props.user.scores.length ?? 0) * 100) / 100).toLocaleString('en-US')}pp bonus, <OsuTooltip title='Sum of pp from every set score'><span>{Math.round(props.user.data?.total.pp ?? 0).toLocaleString('en-US')}pp total</span></OsuTooltip>)</Typography>
                                <Stack direction='row' spacing={1} sx={{ m: 0.5 }}>
                                    {
                                        props.user.osu.twitter !== null ? <>
                                            <Box>
                                                <Link href={`https://twitter.com/${props.user.osu.twitter}`} target='_blank' rel='noopener noreferrer'>
                                                    <Chip size='small' sx={{ m: 0.2, backgroundColor: `#00ACEEAA` }} icon={<TwitterIcon />} label={props.user.osu.twitter} />
                                                </Link>
                                            </Box>
                                        </> : <></>
                                    }
                                    {
                                        props.user.osu.discord !== null ? <>
                                            <Box>
                                                <Chip size='small' sx={{ m: 0.2, backgroundColor: `#5865F2AA` }} icon={<DiscordIcon />} label={props.user.osu.discord} />
                                            </Box>
                                        </> : <></>
                                    }
                                </Stack> */}
                            </Grid2>
                        </Grid2>
                    </Box>
                </Grid2>
            </Stack>
        </>
    )
}

export default SectionHeader;