import { Avatar, Box, Chip, Grid2, Link, Paper, Stack, Table, TableBody, TableCell, tableCellClasses, TableContainer, TableRow, Typography } from "@mui/material";
import moment from "moment";
import { useEffect, useState } from "react";
import { GetFormattedName, GetRoleIcon, GetRoles } from "../../Helpers/Account";
import TwitterIcon from '@mui/icons-material/Twitter';
import { DiscordIcon } from "../../Components/Icons";
import { getBonusPerformance } from "../../Helpers/Osu";
import { Link as VLink } from 'react-router';
import { getFlagIcon } from "../../Helpers/Assets";
import OsuTooltip from "../OsuTooltip";

const MAX_VISITORS = 5;
function SectionHeader(props) {
    const [visitorCount, setVisitorCount] = useState(0);
    useEffect(() => {
        if (props.user.visitors !== null) {
            const vc = props.user.visitors.reduce((acc, o) => { return acc + o.count }, 0);
            setVisitorCount(vc);
        }
    }, [props.user]);

    if (props.user == null) return (<></>);
    return (
        <>
            <Stack direction='column' spacing={1}>
                <Box component={Paper} elevation={2} sx={{ p: 0.25 }}>
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
                            <Grid2 size={2}>
                                <Avatar src={`https://a.ppy.sh/${props.user.osu.id}`} alt='avatar' sx={{ height: '8rem', width: '8rem', m: 1 }} />
                            </Grid2>
                            <Grid2 size={8}>
                                <Stack direction='row' spacing={1} sx={{ m: 0.5 }}>
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
                                                        //const _role = ROLES.find(r => r.id === role);
                                                        //if (_role === undefined) return <></>;
                                                        //if(!role.is_visible) return <></>
                                                        return (
                                                            <>
                                                                <Box sx={{ display: 'inline-block' }}>
                                                                    {/* <Tooltip title={role.title}>
                                                                    {GetRoleIcon(role)}
                                                                </Tooltip> */}
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
                                <Typography variant='h6'>{Math.round(props.user.osu.statistics.pp).toLocaleString('en-US')}pp ({(Math.round(getBonusPerformance(props.user.scores.length ?? 0) * 100) / 100).toLocaleString('en-US')}pp bonus, <OsuTooltip title='Sum of pp from every set score'><span>{Math.round(props.user.data?.total.pp ?? 0).toLocaleString('en-US')}pp total</span></OsuTooltip>)</Typography>
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
                                </Stack>
                            </Grid2>
                            <Grid2 size={2}>
                                <TableContainer>
                                    <Table size='small' sx={{ [`& .${tableCellClasses.root}`]: { borderBottom: "none", fontSize: '0.75em', lineHeight: '0.5em' } }}>
                                        <TableBody>
                                            <TableRow><TableCell>World</TableCell><TableCell>#{(props.user.osu.statistics.global_rank ?? 0).toLocaleString('en-US')}</TableCell></TableRow>
                                            <TableRow><TableCell>Country</TableCell><TableCell>#{(props.user.osu.statistics.country_rank ?? 0).toLocaleString('en-US')}</TableCell></TableRow>
                                            <TableRow><TableCell>Score</TableCell><TableCell>#{(props.user.osu.score_rank?.rank ?? 0).toLocaleString('en-US')}</TableCell></TableRow>
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </Grid2>
                        </Grid2>
                    </Box>
                </Grid2>
            </Stack>
        </>
    )
}

export default SectionHeader;