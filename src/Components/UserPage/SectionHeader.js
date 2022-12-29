import { Alert, Avatar, Box, Chip, Grid, Paper, Stack, Table, TableBody, TableCell, tableCellClasses, TableContainer, TableRow, Tooltip, Typography } from "@mui/material";
import moment from "moment";
import { useEffect, useState } from "react";
import ReactCountryFlag from "react-country-flag";
import { GetFormattedName, GetRoles, ROLES } from "../../Helpers/Account";

const MAX_VISITORS = 5;
function SectionHeader(props) {
    const [visitorCount, setVisitorCount] = useState(0);
    useEffect(() => {
        const vc = props.user.visitors.reduce((acc, o) => { return acc + o.count }, 0);
        setVisitorCount(vc);
    }, [props.user]);

    if (props.user == null) return (<></>);
    return (
        <>
            <Stack direction='column' spacing={1}>
                <Box component={Paper} elevation={2} sx={{ p: 1 }}>
                    <Typography variant='body1' sx={{ m: 1 }}>
                        Recent visitors ({visitorCount.toLocaleString('en-US')} total): {props.user.visitors === null || props.user.visitors.length === 0 ? 'Noone yet :(' : ''} {props.user.visitors.slice(0, MAX_VISITORS).map((visitor, index) => {
                            return (
                                <>
                                    {GetFormattedName(visitor, `Last visit: ${moment(visitor.last_visit).fromNow()}`)}{index < MAX_VISITORS - 1 ? ' ' : ''}
                                </>
                            )
                        })}
                    </Typography>
                </Box>
                <Grid container sx={{
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
                        <Grid container spacing={3} alignItems='center'>
                            <Grid item xs={2}>
                                <Avatar src={`https://a.ppy.sh/${props.user.osu.id}`} alt='avatar' sx={{ height: '8rem', width: '8rem', m: 1 }} />
                            </Grid>
                            <Grid item xs={5}>
                                <Stack direction='row' spacing={1} sx={{ m: 0.5 }}>
                                    <Typography variant='h4'>{props.user.osu.username}{
                                        props.user.inspector !== undefined ? <>
                                            {
                                                GetRoles(props.user.inspector).map((role, index) => {
                                                    const _role = ROLES.find(r => r.id === role);
                                                    if (_role === undefined) return <></>;
                                                    return (
                                                        <>
                                                            <Box sx={{ display: 'inline-block' }}>
                                                                <Tooltip title={_role.name}>
                                                                    {_role.icon}
                                                                </Tooltip>
                                                            </Box>
                                                        </>
                                                    )
                                                })
                                            }
                                        </> : <></>
                                    }</Typography>
                                </Stack>
                                <Stack alignItems='center' direction='row' spacing={1}>
                                    <ReactCountryFlag style={{ lineHeight: '1em', fontSize: '1.4em', borderRadius: '5px' }} cdnUrl="https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/6.6.6/flags/4x3/" countryCode={props.user.osu.country.code} />
                                    <Typography variant='h6'>{props.user.osu.country.name}</Typography>
                                    {
                                        props.user.osu.groups.length > 0 ? <>
                                            {
                                                props.user.osu.groups.map((group, index) => {
                                                    return (
                                                        <>
                                                            <Tooltip title={group.name}>
                                                                <Chip size='small' sx={{ m: 0.2, backgroundColor: `${group.colour}aa` }} label={group.short_name} />
                                                            </Tooltip>
                                                        </>
                                                    )
                                                })
                                            }
                                        </> : <></>
                                    }
                                </Stack>
                                <Typography variant='h6'>{Math.round(props.user.osu.statistics.pp).toLocaleString('en-US')}pp <Tooltip title='Sum of pp from every set score'><span>({Math.round(props.user.data?.total.pp ?? 0).toLocaleString('en-US')}pp total)</span></Tooltip></Typography>
                            </Grid>
                            <Grid item xs={2}>
                                <TableContainer>
                                    <Table size='small' sx={{ [`& .${tableCellClasses.root}`]: { borderBottom: "none", fontSize: '0.75em', lineHeight: '0.5em' } }}>
                                        <TableBody>
                                            <TableRow><TableCell>World</TableCell><TableCell>#{(props.user.osu.statistics.global_rank ?? 0).toLocaleString('en-US')}</TableCell></TableRow>
                                            <TableRow><TableCell>Country</TableCell><TableCell>#{(props.user.osu.statistics.country_rank ?? 0).toLocaleString('en-US')}</TableCell></TableRow>
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </Grid>
                            <Grid item xs={3}>
                                <TableContainer>
                                    <Table size='small' sx={{ [`& .${tableCellClasses.root}`]: { borderBottom: "none", fontSize: '0.75em', lineHeight: '0.5em' } }}>
                                        <TableBody>
                                            <TableRow>
                                                <TableCell>Top 1s</TableCell>
                                                <TableCell>{(props.user.data.leaderboardStats?.top1s ?? 0).toLocaleString('en-US')}</TableCell>
                                                <TableCell>#{(props.user.data.leaderboardStats?.top1s_rank ?? 0).toLocaleString('en-US')}</TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell>Top 8s</TableCell>
                                                <TableCell>{(props.user.data.leaderboardStats?.top8s ?? 0).toLocaleString('en-US')}</TableCell>
                                                <TableCell>#{(props.user.data.leaderboardStats?.top8s_rank ?? 0).toLocaleString('en-US')}</TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell>Top 25s</TableCell>
                                                <TableCell>{(props.user.data.leaderboardStats?.top25s ?? 0).toLocaleString('en-US')}</TableCell>
                                                <TableCell>#{(props.user.data.leaderboardStats?.top25s_rank ?? 0).toLocaleString('en-US')}</TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell>Top 50s</TableCell>
                                                <TableCell>{(props.user.data.leaderboardStats?.top50s ?? 0).toLocaleString('en-US')}</TableCell>
                                                <TableCell>#{(props.user.data.leaderboardStats?.top50s_rank ?? 0).toLocaleString('en-US')}</TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell>Top 100s</TableCell>
                                                <TableCell>{(props.user.data.leaderboardStats?.top100s ?? 0).toLocaleString('en-US')}</TableCell>
                                                <TableCell>#{(props.user.data.leaderboardStats?.top100s_rank ?? 0).toLocaleString('en-US')}</TableCell>
                                            </TableRow>
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </Grid>
                        </Grid>
                    </Box>
                </Grid>
            </Stack>
        </>
    )
}

export default SectionHeader;