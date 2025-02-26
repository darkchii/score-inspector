import { Alert, Avatar, Box, Button, Card, CardContent, CardMedia, Chip, Container, Divider, FormControl, Grid2, MenuItem, Paper, Select, Stack, Tab, Table, TableBody, TableCell, tableCellClasses, TableContainer, TableHead, TableRow, TextField, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import { FormatClanLog, GetClan } from "../../Helpers/Clan";
import { GetFormattedName, GetLoginToken } from "../../Helpers/Account";
import { showNotification } from "../../Helpers/Misc";
import Loader from "../UI/Loader";
import { Helmet } from "react-helmet";
import OsuTabs from "../OsuTabs";
import ClanTabPanel from "./ClanTabPanel";
import GlowBarText from "../UI/GlowBarText";
import ScoreViewStat from "../UI/ScoreViewStat";
import moment from "moment";
import OsuTooltip from "../OsuTooltip";
import CLAN_STATS_MAP from "./ClanStatsMap";
import { DiscordIcon } from "../Icons";
import PlayerLeaderboardItem from "../Leaderboards/PlayerLeaderboardItem";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import SecurityIcon from '@mui/icons-material/Security';
import { grey } from "@mui/material/colors";

function ClanPage(props) {
    const [clanData, setClanData] = useState(null);
    const [sorter, setSorter] = useState('average_pp');
    const navigate = useNavigate();
    const params = useParams();
    const [activeTab, setActiveTab] = useState(0);
    const [hasModeratorPermissions, setHasModeratorPermissions] = useState(false);

    const loadClan = (id) => {
        setClanData(null);

        (async () => {
            try {
                const data = await GetClan(id, props.me?.osu_id ?? null, (await GetLoginToken()) ?? null);
                if (data && data.clan.default_sort) {
                    setSorter(data.clan.default_sort);
                }
                setClanData(data);
                window.onTitleChange(`${data.clan.name}`);

                //check if the user has moderator permissions
                if (props.me?.clan_member?.clan?.id === data.clan.id) {
                    setHasModeratorPermissions(props.me.clan_member.is_moderator === true || props.me.osu_id === data.clan.owner);
                }
            } catch (err) {
                showNotification('Error', 'An error occurred while fetching the clan data.', 'error');
                showNotification('Error', err.message, 'error');
                window.onTitleChange('Clans');
            }
        })();
    }

    useEffect(() => {
        //apply the tab change to the URL (dont navigate, just update the URL)
        switch (activeTab) {
            case 1:
                navigate(`/clan/${props.id}/members`);
                break;
            case 2:
                navigate(`/clan/${props.id}/logs`);
                break;
            default:
                navigate(`/clan/${props.id}`);
                break;
        }
    }, [activeTab]);

    useEffect(() => {
        if (!props.id) return;
        if (isNaN(props.id)) return;
        if (params.page) {
            switch (params.page) {
                case 'members':
                    setActiveTab(1);
                    break;
                case 'logs':
                    setActiveTab(2);
                    break;
                default:
                    setActiveTab(0);
                    break;
            }
        }
        loadClan(props.id);
    }, [props.id, props.me]);

    if (!clanData)
        return <Loader />

    return (
        <>
            {
                clanData.clan.background_image_url ?
                    <Helmet>
                        <style>
                            {`
                        body { 
                        background-image: url('${clanData.clan.background_image_url}'); 
                        background-repeat: no-repeat;
                        background-size: cover;
                        background-position: center;
                        background-attachment: fixed;
                    }`}
                        </style>
                    </Helmet> : <></>
            }
            <Container>
                <Card>
                    {
                        clanData.clan.header_image_url ?
                            <CardMedia
                                component="img"
                                height="200"
                                image={clanData.clan.header_image_url}
                                alt="Clan header"
                                sx={{
                                    objectFit: 'cover',
                                }}
                            /> : <></>
                    }
                    <CardContent sx={{
                        m: 0,
                        p: 0,
                        //disable border radius on children
                        '& > *': {
                            borderRadius: '0 !important',
                            //add a shadow on the bottom
                            boxShadow: '0px 0px 5px rgba(0,0,0,0.1) !important',
                            pl: 4,
                            pr: 4,
                        }
                    }}>
                        {/* CLAN NAME CONTAINER START */}
                        <Paper
                            sx={{
                                height: '6em'
                            }}>
                            <Box sx={{
                                height: '100%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'left',
                                fontWeight: '400 !important',
                            }}
                            >
                                {/* <Typography variant='h4'>Hello</Typography> */}
                                {
                                    clanData.clan.logo_image_url ?
                                        <>
                                            <Box sx={{
                                                alignSelf: 'flex-end',
                                                flex: 'none',
                                                overflow: 'hidden',
                                                transform: 'translateZ(0)',
                                                width: '8em',
                                                marginBottom: '8px'
                                            }}>
                                                <Avatar variant='rounded' src={clanData.clan.logo_image_url} sx={{
                                                    height: '100%',
                                                    width: '100%',
                                                    display: 'block',
                                                    margin: 0,
                                                    //small shadow
                                                    boxShadow: '0px 0px 5px rgba(0,0,0,0.1)',
                                                }} />
                                            </Box>
                                        </> : null
                                }
                                <Box sx={{
                                    pl: 2
                                }}>
                                    <Typography variant='h4'>{clanData.clan.name}</Typography>
                                    <Typography
                                        sx={{
                                            color: `#${clanData.clan.color}`
                                        }}
                                        variant='body1'
                                    >[{clanData.clan.tag}]</Typography>
                                </Box>
                            </Box>
                        </Paper>

                        {/* CLAN NAME CONTAINER END */}

                        {/* CLAN CATEGORY TABS START*/}
                        <OsuTabs
                            size='small'
                            value={activeTab}
                            onChange={(event, newValue) => setActiveTab(newValue)}
                        >
                            <Tab label='Summary' a11yProps={0} />
                            <Tab label='Members' a11yProps={1} />
                            <Tab label='Logs' a11yProps={2} />
                        </OsuTabs>
                        {/* CLAN CATEGORY TABS END */}

                        {/* CLAN CATEGORY TAB PANELS START */}
                        <Box sx={{
                            pt: 1,
                            pl: 2,
                            pr: 2,
                        }}>
                            <Card
                                elevation={6}
                                sx={{
                                    p: 1
                                }}
                            >
                                <CardContent>
                                    <ClanTabPanel value={activeTab} index={0}>
                                        <Grid2 container spacing={5}>
                                            <Grid2 size={{ xs: 12, sm: 4 }}>
                                                <GlowBarText sx={{ pb: 1 }}><Typography variant='body1'>Info</Typography></GlowBarText>
                                                <div className='score-stats__group score-stats__group--stats'>
                                                    <div className='score-stats__group-row'>
                                                        <ScoreViewStat label='Owner' value={
                                                            <Link to={`/user/${clanData.owner?.user?.inspector_user?.osu_id}`} style={{ color: 'inherit' }}>
                                                                {GetFormattedName(clanData.owner?.user?.inspector_user ?? {}, { is_link: true })}
                                                            </Link>
                                                        } />
                                                    </div>
                                                    <div className='score-stats__group-row'>
                                                        <ScoreViewStat label='Members' value={
                                                            <span>
                                                                {clanData.members.length}
                                                                {/* moderator count, excluding the owner */}
                                                                <span style={{
                                                                    color: 'grey',
                                                                    fontSize: '0.8em',
                                                                    marginLeft: '0.5em',
                                                                }}>{`(${clanData.members.filter(m =>
                                                                    m.is_moderator &&
                                                                    ((m.user.alt ? m.user.alt.user_id : m.user.osu.id) !== clanData.owner?.user?.inspector_user?.osu_id)
                                                                ).length + 1} mod${(clanData.members.filter(m =>
                                                                    m.is_moderator &&
                                                                    (m.user.alt ? m.user.alt.user_id : m.user.osu.id) !== clanData.owner?.user?.inspector_user?.osu_id
                                                                ).length + 1) > 1 ? 's' : ''})`}</span>
                                                            </span>
                                                        } />
                                                        <ScoreViewStat
                                                            label='Created'
                                                            value={moment(clanData.clan.creation_date).fromNow()}
                                                            tooltip={moment(clanData.clan.creation_date).format('MMMM Do YYYY, h:mm:ss a')}
                                                        />
                                                    </div>
                                                    {
                                                        clanData.clan.discord_invite ? <>
                                                            <OsuTooltip title={`${clanData.clan.name} has a Discord server, join them!`}>
                                                                <Button size='small' variant='contained' sx={{ backgroundColor: '#7289da' }} startIcon={<DiscordIcon />} href={clanData.clan.discord_invite} target='_blank'>Join Discord</Button>
                                                            </OsuTooltip>
                                                        </> : <></>
                                                    }
                                                    <Box>
                                                        {/* read-only, clickable input field to copy shareable clan link */}
                                                        <OsuTooltip title='Click to copy. This URL adds metadata that displays name, image in places like Discord.'>
                                                            <TextField
                                                                variant='outlined'
                                                                fullWidth
                                                                size="small"
                                                                value={`https://clan.kirino.sh/${clanData.clan.id}`}
                                                                onClick={(e) => {
                                                                    e.target.select();
                                                                    // document.execCommand('copy'); //deprecated
                                                                    navigator.clipboard.writeText(`https://clan.kirino.sh/${clanData.clan.id}`);
                                                                    showNotification('Copied', 'Clan link copied to clipboard.', 'info');
                                                                }}
                                                            />
                                                        </OsuTooltip>
                                                    </Box>
                                                </div>
                                                <Divider sx={{ mt: 2, mb: 2 }} />
                                                <GlowBarText sx={{ pb: 1 }}><Typography variant='body1'>Description</Typography></GlowBarText>
                                                <Typography variant='body2'>{clanData.clan.description}</Typography>
                                                <Divider sx={{ mt: 2, mb: 2 }} />
                                                <GlowBarText sx={{ pb: 1 }}><Typography variant='body1'>Rankings</Typography></GlowBarText>
                                                <TableContainer>
                                                    <Table size='small' sx={{
                                                        [`& .${tableCellClasses.root}`]: {
                                                            borderBottom: "none",
                                                            height: '18px',
                                                        }
                                                    }}>
                                                        <TableBody>
                                                            {
                                                                //remove where display is false
                                                                CLAN_STATS_MAP.filter((stat) => stat.display !== false).map((stat) => {
                                                                    let ranking = clanData.ranking[stat.key] ?? 0;
                                                                    if (stat.key === 'level') {
                                                                        ranking = clanData.ranking['total_score'] ?? 0;
                                                                    } else if (stat.key === 'xp_level') {
                                                                        ranking = clanData.ranking['xp'] ?? 0;
                                                                    }

                                                                    let rank_color = null
                                                                    //bright colors
                                                                    if (ranking === 1) rank_color = '#ffd700';
                                                                    if (ranking === 2) rank_color = '#e5e4e2';
                                                                    if (ranking === 3) rank_color = '#cd7f32'
                                                                    //up to 10 also has a color
                                                                    if (ranking > 3 && ranking <= 10) rank_color = '#C0C0C0';
                                                                    return (
                                                                        <TableRow key={stat.key}>
                                                                            <TableCell>
                                                                                <Typography sx={{
                                                                                    fontSize: '0.7rem',
                                                                                }}>
                                                                                    {stat.name}
                                                                                </Typography>
                                                                            </TableCell>
                                                                            <TableCell>{stat.format(clanData.stats)}</TableCell>
                                                                            {/* <TableCell>{ranking > 0 ? `#${ranking.toLocaleString()}` : ''}</TableCell> */}
                                                                            {/* make this a nice chip */}
                                                                            <TableCell>
                                                                                <Chip label={ranking > 0 ? `#${ranking.toLocaleString()}` : ''} size='small' style={{
                                                                                    // backgroundColor: rank_color,
                                                                                    // color: 'black',
                                                                                    color: rank_color ?? '#C0C0C0',
                                                                                    fontWeight: rank_color ? 'bold' : 'normal',
                                                                                }} />
                                                                            </TableCell>
                                                                        </TableRow>
                                                                    )
                                                                })
                                                            }
                                                        </TableBody>
                                                    </Table>
                                                </TableContainer>
                                            </Grid2>
                                            <Grid2 size={{ xs: 12, sm: 8 }}>
                                                <GlowBarText sx={{ pb: 1 }}><Typography variant='body1'>Recent Activity</Typography></GlowBarText>
                                                <Typography variant='body2'>Not loading these to preserve performance for the rest of the site.</Typography>
                                            </Grid2>
                                        </Grid2>
                                    </ClanTabPanel>
                                    <ClanTabPanel value={activeTab} index={1}>
                                        <Box>
                                            <GlowBarText sx={{ pb: 1 }}>
                                                <Typography variant='body1'>Members</Typography>
                                                <FormControl sx={{
                                                    ml: 1
                                                }}>
                                                    <Select
                                                        variant='standard'
                                                        size="small"
                                                        value={sorter}
                                                        onChange={(e) => setSorter(e.target.value)}
                                                    >
                                                        {
                                                            CLAN_STATS_MAP.filter((stat) => stat.user !== false).map((stat, i) => {
                                                                return (
                                                                    <MenuItem key={i} value={stat.key}>{stat.name}</MenuItem>
                                                                )
                                                            })
                                                        }
                                                    </Select>
                                                </FormControl>
                                            </GlowBarText>
                                        </Box>

                                        <Stack spacing={1}>
                                            {
                                                clanData.members.length > 0 ?
                                                    // clanData.members.map((member, index) => {

                                                    //sort then map
                                                    clanData.members.sort(
                                                        (a, b) => {
                                                            const a_sorter = CLAN_STATS_MAP.find((stat) => stat.key === sorter).sort_value ? CLAN_STATS_MAP.find((stat) => stat.key === sorter).sort_value(a.user.extra) : a.user.extra[sorter];
                                                            const b_sorter = CLAN_STATS_MAP.find((stat) => stat.key === sorter).sort_value ? CLAN_STATS_MAP.find((stat) => stat.key === sorter).sort_value(b.user.extra) : b.user.extra[sorter];
                                                            return b_sorter - a_sorter;
                                                        }
                                                    ).map((member, index) => {
                                                        const _member = member.user.osu ?? member.user.alt;
                                                        const _username = _member?.username ?? member.user.inspector_user?.known_username;
                                                        const _user_id = _member?.id ?? member.user.inspector_user?.osu_id;
                                                        const _is_moderator = member?.is_moderator ?? false;
                                                        let clanRoleIcon = <AccountCircleIcon />;
                                                        let clanRoleName = 'Member';

                                                        if (clanData.clan.owner === _user_id) {
                                                            clanRoleIcon = <SecurityIcon />;
                                                            clanRoleName = 'Owner';
                                                        } else if (_is_moderator) {
                                                            clanRoleIcon = <AdminPanelSettingsIcon />;
                                                            clanRoleName = 'Moderator';
                                                        }
                                                        return (
                                                            <>
                                                                <Box display='flex' alignItems='center'>
                                                                    <Box flexGrow={1}>
                                                                        <PlayerLeaderboardItem
                                                                            remote_profile={true}
                                                                            user={{
                                                                                osu_user: _member,
                                                                                username: _username,
                                                                                rank: index + 1,
                                                                                user_id: _user_id,
                                                                            }}
                                                                            values={[
                                                                                {
                                                                                    value: CLAN_STATS_MAP.find((stat) => stat.key === sorter).name, alignment: 'right', variant: 'body2',
                                                                                    color: grey[500]
                                                                                },
                                                                                {
                                                                                    value: CLAN_STATS_MAP.find((stat) => stat.key === sorter).format(member.user.extra), alignment: 'left', variant: 'body2'
                                                                                }
                                                                            ]}
                                                                        />
                                                                    </Box>
                                                                    <Box sx={{
                                                                        ml: 1,
                                                                        //center vertically
                                                                        display: 'flex',
                                                                        alignItems: 'center',
                                                                    }}>
                                                                        <OsuTooltip title={clanRoleName}>
                                                                            {clanRoleIcon}
                                                                        </OsuTooltip>
                                                                    </Box>
                                                                </Box>
                                                            </>
                                                        )
                                                    }) :
                                                    <Typography variant='subtitle2' sx={{ fontStyle: 'italic', }}>No other members</Typography>
                                            }
                                        </Stack>
                                        {
                                            //if owner, show member requests
                                            hasModeratorPermissions ?
                                                <>
                                                    <Divider sx={{ mt: 1, mb: 1 }} />
                                                    <GlowBarText sx={{ pb: 1 }}><Typography variant='body1'>Member requests</Typography></GlowBarText>
                                                    <Grid2 sx={{
                                                        maxHeight: '60vh',
                                                        overflowY: 'auto',
                                                    }}>
                                                        <Stack spacing={1}>
                                                            {
                                                                clanData.pending_members?.length > 0 ?
                                                                    //for testing, duplicate the requests multiple times
                                                                    clanData.pending_members.map((request, i) => {
                                                                        const _member = request.user.osu ?? request.user.alt;
                                                                        const _username = _member?.username ?? request.user.inspector_user?.known_username;
                                                                        const _user_id = _member?.id ?? request.user.inspector_user?.osu_id;
                                                                        return (
                                                                            <Box key={i} display='flex' alignItems='center'>
                                                                                <Box flexGrow={1}>
                                                                                    <PlayerLeaderboardItem
                                                                                        remote_profile={true}
                                                                                        user={{
                                                                                            osu_user: _member,
                                                                                            username: _username,
                                                                                            rank: i + 1,
                                                                                            user_id: _user_id,
                                                                                        }}
                                                                                    />
                                                                                </Box>
                                                                            </Box>
                                                                        )
                                                                    }) :
                                                                    <Typography variant='subtitle2' sx={{ fontStyle: 'italic', }}>No requests</Typography>
                                                            }
                                                        </Stack>
                                                    </Grid2>
                                                </> : <></>
                                        }
                                    </ClanTabPanel>
                                    <ClanTabPanel value={activeTab} index={2}>
                                        <GlowBarText sx={{ pb: 1 }}><Typography variant='body1'>Clan History</Typography></GlowBarText>
                                        {
                                            clanData.clan.disable_logs ?
                                                <Alert severity='info'>Clan logs visibility are made private by the owner. Only members can see these.</Alert>
                                                : <></>
                                        }
                                        {
                                            clanData.logs && clanData.logs.length > 0 ?
                                                <TableContainer>
                                                    <Table size='small'>
                                                        <TableHead>
                                                            <TableRow>
                                                                <TableCell>Date</TableCell>
                                                                <TableCell>Action</TableCell>
                                                                <TableCell>Moderator</TableCell>
                                                            </TableRow>
                                                        </TableHead>
                                                        <TableBody>
                                                            {
                                                                clanData.logs && clanData.logs.map((log, index) => {
                                                                    if (FormatClanLog(clanData, log) === null) return <></>;
                                                                    return <TableRow key={index}>
                                                                        <TableCell>
                                                                            <OsuTooltip title={moment(log.created_at).format('MMMM Do YYYY, h:mm:ss a')}>
                                                                                {moment(log.created_at).fromNow()}
                                                                            </OsuTooltip>
                                                                        </TableCell>
                                                                        <TableCell sx={{
                                                                            maxWidth: '60%'
                                                                        }}>
                                                                            <Typography variant='body2'>
                                                                                {FormatClanLog(clanData, log)}
                                                                            </Typography>
                                                                        </TableCell>
                                                                        <TableCell>
                                                                            {
                                                                                JSON.parse(log.data)?.moderator_id ?
                                                                                    GetFormattedName(clanData.logs_user_data.find(u => u.osu_id === JSON.parse(log.data)?.moderator_id))
                                                                                    : <></>
                                                                            }
                                                                        </TableCell>
                                                                    </TableRow>
                                                                })
                                                            }
                                                        </TableBody>
                                                    </Table>
                                                </TableContainer>
                                                : <Typography variant='body2'>No (visible) logs</Typography>
                                        }
                                    </ClanTabPanel>
                                </CardContent>
                            </Card>
                        </Box>
                        {/* CLAN CATEGORY TAB PANELS END */}
                    </CardContent>
                </Card >
            </Container >
        </>
    )
}

export default ClanPage;