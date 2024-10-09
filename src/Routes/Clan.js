/* eslint-disable react-hooks/exhaustive-deps */
import { Alert, Avatar, Box, Button, ButtonGroup, Card, CardActionArea, CardContent, CardMedia, Chip, Container, Divider, FormControl, Grid2, IconButton, InputAdornment, InputLabel, Menu, MenuItem, Modal, OutlinedInput, Pagination, Select, Stack, Switch, Tab, Table, TableBody, TableCell, TableContainer, TableRow, Tabs, TextField, Tooltip, Typography, styled, tableCellClasses, useTheme } from "@mui/material";
import { useState } from "react";
import { fixedEncodeURIComponent, MODAL_STYLE, showNotification } from "../Helpers/Misc";
import { useEffect } from "react";
import { GetFormattedName, GetLoginID, GetLoginToken, GetUser } from "../Helpers/Account";
import { AcceptJoinRequestClan, CreateClan, DeleteClan, FormatClanLog, GetClan, GetClanList, GetTopClans, JoinRequestClan, LeaveClan, RejectJoinRequestClan, RemoveClanMember, TransferClanOwnership, UpdateClan } from "../Helpers/Clan";
import { useNavigate, useParams } from "react-router-dom";
import Loader from "../Components/UI/Loader";
import moment from "moment";
import ClanLeaderboardItem from "../Components/Leaderboards/ClanLeaderboardItem";
import { blue, grey } from "@mui/material/colors";
import { getLevelForScore, getModString } from "../Helpers/Osu";
import PlayerLeaderboardItem from '../Components/Leaderboards/PlayerLeaderboardItem';
import LockIcon from '@mui/icons-material/Lock';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import { matchIsValidColor, MuiColorInput } from "mui-color-input";
import CancelIcon from '@mui/icons-material/Cancel';
import SyncIcon from '@mui/icons-material/Sync';
import SearchIcon from '@mui/icons-material/Search';
import StatCard from "../Components/UI/StatCard";
import GroupsIcon from '@mui/icons-material/Groups';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import DoneIcon from '@mui/icons-material/Done';
import ClearIcon from '@mui/icons-material/Clear';
import { IMG_TRIANGLES } from "../Helpers/Assets";
import { DiscordIcon } from "../Components/Icons";

//always round to 2 decimal places, and toLocaleString for commas
const CLAN_STATS = [
    {
        name: 'Performance',
        key: 'average_pp',
        format: (stats) => `${(Math.round((stats.average_pp ?? 0) * 100) / 100).toLocaleString('en-US')}pp`,
        description: 'Average PP of all members profile performance',
        ranking: true,
    },
    {
        name: 'Total PP',
        key: 'total_pp',
        format: (stats) => `${(Math.round((stats.total_pp ?? 0) * 100) / 100).toLocaleString('en-US')}pp`,
        description: 'Sum of all pp from all scores',
        ranking: true,
    },
    {
        name: 'Accuracy',
        format: (stats) => `${(Math.round((stats.accuracy ?? 0) * 100) / 100).toLocaleString('en-US')}%`,
        description: 'Average accuracy of all members',
        key: 'accuracy',
        ranking: true,
    },
    {
        name: 'Ranked score',
        key: 'ranked_score',
        format: (stats) => parseInt(stats.ranked_score ?? 0).toLocaleString('en-US'),
        ranking: true,
    }, {
        name: 'Total score',
        format: (stats) => parseInt(stats.total_score ?? 0).toLocaleString('en-US'),
        ranking: true,
        key: 'total_score',
    }, {
        name: 'Level',
        format: (stats) => getLevelForScore(stats.total_score ?? 0).toLocaleString('en-US'),
        ranking: false,
        display: true,
        sort_value: (stats) => getLevelForScore(stats.total_score ?? 0),
        key: 'level',
    }, {
        name: 'Clears',
        format: (stats) => (stats.clears ?? 0).toLocaleString('en-US'),
        description: 'Total clears of all members',
        ranking: true,
        key: 'clears',
    }, {
        name: 'Total SS',
        format: (stats) => (stats.total_ss_both ?? 0).toLocaleString('en-US'),
        ranking: true,
        key: 'total_ss_both',
    }, {
        name: 'Total S',
        format: (stats) => (stats.total_s_both ?? 0).toLocaleString('en-US'),
        ranking: true,
        key: 'total_s_both',
    }, {
        name: 'Total A',
        format: (stats) => (stats.total_a ?? 0).toLocaleString('en-US'),
        ranking: true,
        key: 'total_a',
    }, {
        name: 'Total B',
        format: (stats) => (stats.total_b ?? 0).toLocaleString('en-US'),
        ranking: true,
        key: 'total_b',
    }, {
        name: 'Total C',
        format: (stats) => (stats.total_c ?? 0).toLocaleString('en-US'),
        ranking: true,
        key: 'total_c',
    }, {
        name: 'Total D',
        format: (stats) => (stats.total_d ?? 0).toLocaleString('en-US'),
        ranking: true,
        key: 'total_d',
    }, {
        name: 'Playtime',
        format: (stats) => (Math.round(moment.duration(stats.playtime ?? 0, 'seconds').asHours()).toLocaleString('en-US')) + ' hours',
        ranking: true,
        key: 'playtime',
    }, {
        name: 'Playcount',
        format: (stats) => (stats.playcount ?? 0).toLocaleString('en-US'),
        ranking: true,
        key: 'playcount',
    }, {
        name: 'Replays watched',
        format: (stats) => (stats.replays_watched ?? 0).toLocaleString('en-US'),
        ranking: true,
        key: 'replays_watched',
    }, {
        name: 'Total hits',
        format: (stats) => (stats.total_hits ?? 0).toLocaleString('en-US'),
        ranking: true,
        key: 'total_hits',
    }, {
        name: 'Badges',
        format: (stats) => (stats.badges ?? 0).toLocaleString('en-US'),
        ranking: false,
        key: 'badges'
    }, {
        name: 'Medals',
        format: (stats) => (stats.medals ?? 0).toLocaleString('en-US'),
        ranking: false,
        key: 'medals'
    }, {
        name: 'Members',
        format: (stats) => (stats.members ?? 0).toLocaleString('en-US'),
        ranking: false,
        display: false,
        key: 'members',
        user: false, //not a user stat
    }, {
        name: 'Joined',
        format: (stats) => moment(stats.join_date).fromNow(),
        ranking: false,
        display: false,
        clanlist: false,
        key: 'join_date',
        sort_value: (stats) => new Date(stats.join_date),
        dir: 'asc',
    }
]

function Clan(props) {
    const [clanCreatorModalOpen, setClanCreatorModalOpen] = useState(false);
    const [loggedInUser, setLoggedInUser] = useState(null);
    const [isLoadingUser, setIsLoadingUser] = useState(true);
    const [tabValue, setTabValue] = useState(0);
    const params = useParams();
    const navigate = useNavigate();

    const loadUser = async (force_reload_user = false) => {
        if (loggedInUser && !force_reload_user) {
            setIsLoadingUser(false);
            return loggedInUser;
        }
        const _user = await GetLoginID();
        if (_user) {
            const __user = await GetUser(_user);
            setLoggedInUser(__user || null);
            setIsLoadingUser(false);
            return __user;
        }
        setIsLoadingUser(false);
        setLoggedInUser(false);
        return null;
    }

    useEffect(() => {
        (async () => {
            await loadUser();
        })()
    }, [params]);

    function a11yProps(index) {
        return {
            id: `clans-tab-${index}`,
            'aria-controls': `clans-tabpanel-${index}`,
        };
    }

    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
    };

    function CustomTabPanel(props) {
        const { children, value, index, ...other } = props;

        return (
            <div
                role="tabpanel"
                // hidden={value !== index}
                style={{
                    display: value === index ? 'block' : 'none',
                }}
                id={`simple-tabpanel-${index}`}
                aria-labelledby={`simple-tab-${index}`}
                {...other}
            >
                {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
            </div>
        );
    }

    if (isLoadingUser) return <Loader />

    return (
        <>
            {
                params.id ?
                    <ClanPage id={params.id} me={loggedInUser} /> :
                    <>
                        <Modal
                            open={clanCreatorModalOpen}
                            onClose={() => setClanCreatorModalOpen(false)}
                        >
                            <ClanCreate user={loggedInUser} />
                        </Modal>
                        <Box sx={{
                            borderBottom: 1, borderColor: 'divider',
                            //spacing in-between
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            mb: 1
                        }}>
                            <Tabs value={tabValue} onChange={handleTabChange} centered sx={{
                                //grow to fill the space
                                flexGrow: 1
                            }}>
                                <Tab label="Rankings" {...a11yProps(0)} />
                                <Tab label="Listing" {...a11yProps(1)} />
                            </Tabs>

                            <Box>
                                {
                                    loggedInUser && loggedInUser.clan_member?.clan && loggedInUser.clan_member?.clan ?
                                        <Button
                                            onClick={() => navigate(`/clan/${loggedInUser.clan_member.clan.id}`)}
                                            variant='contained' color='primary' fullWidth>Go to {loggedInUser.clan_member.clan.name}</Button> :
                                        (
                                            loggedInUser ? <Button
                                                onClick={() => setClanCreatorModalOpen(true)}
                                                variant='contained' color='primary' fullWidth>Create a clan</Button> :
                                                <></>
                                        )
                                }

                            </Box>
                        </Box>
                        <CustomTabPanel value={tabValue} index={0}>
                            <ClanTop me={loggedInUser} />
                        </CustomTabPanel>
                        <CustomTabPanel value={tabValue} index={1}>
                            <ClanList me={loggedInUser} />
                        </CustomTabPanel>
                    </>
            }
        </>
    )
}

function ClanPage(props) {
    const [clanEditModalOpen, setClanEditModalOpen] = useState(false);
    const [clanRemoveModalOpen, setClanRemoveModalOpen] = useState(false);
    const [clanData, setClanData] = useState(null);
    const [sorter, setSorter] = useState('average_pp');
    const [anchorEl, setAnchorEl] = useState(null);
    const [anchorData, setAnchorData] = useState(null);
    const navigate = useNavigate();
    const theme = useTheme();

    const handleDropdownClick = (event, data) => {
        setAnchorEl(event.currentTarget);
        setAnchorData(data);
    };

    const handleDropdownClose = () => {
        setAnchorEl(null);
    };

    const loadClan = (id, force_reload_user = false) => {
        setClanData(null);

        (async () => {
            try {
                const data = await GetClan(id, props.me?.osu_id ?? null, (await GetLoginToken()) ?? null);
                if (data && data.clan.default_sort) {
                    setSorter(data.clan.default_sort);
                }
                setClanData(data);
            } catch (err) {
                showNotification('Error', 'An error occurred while fetching the clan data.', 'error');
                showNotification('Error', err.message, 'error');
            }
        })();
    }

    const removeClan = () => {
        (async () => {
            const data = {
                id: clanData.clan.id,
                user: {
                    id: props.me?.osu_id,
                    token: await GetLoginToken(),
                }
            }
            const response = await DeleteClan(data);
            if (response.error) {
                showNotification('Error', response.error, 'error');
            } else {
                showNotification('Success', 'Clan removed successfully.', 'success');
                navigate('/clan');
            }
        })();
    }

    const eventRequestJoinClan = async () => {
        try {
            const response = await JoinRequestClan(props.id, props.me.osu_id, await GetLoginToken());
            if (response.error) {
                showNotification('Error', response.error, 'error');
            } else {
                showNotification('Success', 'Request sent successfully.', 'success');
                await loadClan(props.id, true);
            }
        } catch (err) {
            showNotification('Error', 'An error occurred while requesting to join the clan.', 'error');
        }
    }

    const eventLeaveClan = async () => {
        try {
            const response = await LeaveClan(props.me.osu_id, await GetLoginToken(), props.id);
            if (response.error) {
                showNotification('Error', response.error, 'error');
            } else {
                showNotification('Success', 'Left the clan.', 'success');
                await loadClan(props.id, true);
            }
        } catch (err) {
            showNotification('Error', 'An error occurred while leaving the clan.', 'error');
        }
    }

    const eventAcceptJoinRequest = async (request) => {
        try {
            const user_id = request.user?.osu?.id ?? request.user?.alt?.user_id;
            if (!user_id) return showNotification('Error', 'No user data found...', 'error');
            const response = await AcceptJoinRequestClan(props.me.osu_id, user_id, await GetLoginToken(), clanData.clan.id);
            if (response.error) {
                showNotification('Error', response.error, 'error');
            } else {
                showNotification('Success', 'Request accepted successfully.', 'success');
                await loadClan(props.id, true);
            }
        } catch (err) {
            console.error(err);
            showNotification('Error', 'An error occurred while accepting the join request.', 'error');
        }
    }

    const eventRejectJoinRequest = async (request) => {
        try {
            const user_id = request.user?.osu?.id ?? request.user?.alt?.user_id;
            if (!user_id) return showNotification('Error', 'No user data found...', 'error');
            const response = await RejectJoinRequestClan(props.me.osu_id, user_id, await GetLoginToken(), clanData.clan.id);
            if (response.error) {
                showNotification('Error', response.error, 'error');
            } else {
                showNotification('Success', 'Request rejected successfully.', 'success');
                await loadClan(props.id, true);
            }
        } catch (err) {
            showNotification('Error', 'An error occurred while rejecting the join request.', 'error');
        }
    }

    const eventRemoveMember = async (user_id) => {
        try {
            const response = await RemoveClanMember(props.me.osu_id, user_id, await GetLoginToken(), clanData.clan.id);
            if (response.error) {
                showNotification('Error', response.error, 'error');
            } else {
                showNotification('Success', 'Member removed successfully.', 'success');
                await loadClan(props.id, true);
            }
        } catch (err) {
            showNotification('Error', 'An error occurred while removing the member.', 'error');
        }
    }

    const eventTransferOwnership = async (user_id) => {
        try {
            const response = await TransferClanOwnership(props.me.osu_id, user_id, await GetLoginToken(), clanData.clan.id);
            if (response.error) {
                showNotification('Error', response.error, 'error');
            } else {
                showNotification('Success', 'Clan ownership has been transferred! There is a cooldown of 30 days before this clan can change owner again.', 'success');
                await loadClan(props.id, true);
            }
        } catch (err) {
            showNotification('Error', 'An error occurred while transferring ownership.', 'error');
            showNotification('Error', err.message, 'error');
        }
    }

    useEffect(() => {
        if (!props.id) return;
        if (isNaN(props.id)) return;
        loadClan(props.id);
    }, [props.id]);

    if (!clanData)
        return <Loader />

    return (
        <>
            <Modal
                open={clanEditModalOpen}
                onClose={() => setClanEditModalOpen(false)}
            >
                <ClanEdit user={props.me} clan={clanData} />
            </Modal>
            <Modal
                open={clanRemoveModalOpen}
                onClose={() => setClanRemoveModalOpen(false)}
            >
                <Card sx={MODAL_STYLE}>
                    <CardContent>
                        <Typography>Are you sure you want to remove your clan?</Typography>
                        <Button
                            variant='contained'
                            color='error'
                            onClick={removeClan}
                        >Delete</Button>
                        <Button
                            variant='contained'
                            color='primary'
                            onClick={() => setClanRemoveModalOpen(false)}
                        >Cancel</Button>
                    </CardContent>
                </Card>
            </Modal>
            <Box>
                {/* //if headerColor is set, linear gradient from top to half the page, have it stay behind the container */}
                {
                    clanData.clan.color ? <Box sx={{
                        height: '70vh',
                        background: `linear-gradient(#${clanData.clan.color}cc, #${clanData.clan.color}00)`,
                        position: 'absolute',
                        width: '100%',
                        zIndex: -1,
                        //translate it up and left from current pos, one of the parent containers has padding
                        transform: 'translate(-1em, -1em)',
                        borderRadius: '10px',
                    }} /> : <></>
                }
                <Container>
                    {
                        clanData.clan.header_image_url ?
                            //object-fit top of the image
                            <img
                                // src={clanData.clan.header_image_url} 
                                src={clanData.clan?.header_image_url ? `${fixedEncodeURIComponent(clanData.clan.header_image_url)}` : ''}
                                alt='Clan header' style={{
                                    width: '100%',
                                    height: '200px',
                                    objectFit: 'cover',
                                    borderRadius: '10px',
                                    marginBottom: '5px'
                                }} /> : <></>
                    }
                    <Grid2 container spacing={2}>
                        <Grid2 size={{ xs: 12, md: 4 }}>
                            <Card elevation={3}>
                                <CardContent>
                                    <Typography variant='h6'><span style={{ color: `#${clanData.clan.color}` }}>[{clanData.clan.tag}]</span> {clanData.clan.name}</Typography>
                                    <Typography variant='body1'>{clanData.clan.description}</Typography>
                                    {
                                        props.me
                                            && props.me.clan_member?.clan?.owner !== props.me?.osu_id
                                            ? (
                                                props.me.clan_member && props.me.clan_member.clan.id === clanData.clan.id ? <>
                                                    <Button
                                                        onClick={eventLeaveClan}
                                                        size='small'
                                                        variant='contained'
                                                        color='error'
                                                        sx={{
                                                            mt: 2
                                                        }}>
                                                        Leave
                                                    </Button>
                                                </> : <>
                                                    <Button
                                                        onClick={eventRequestJoinClan}
                                                        size='small'
                                                        variant='contained'
                                                        disabled={clanData.clan.disable_requests}
                                                        sx={{
                                                            mt: 2
                                                        }}>
                                                        Request to join
                                                    </Button>
                                                    {
                                                        clanData.clan.disable_requests ? <>
                                                            <Alert severity='info' sx={{ mt: 2 }}>
                                                                <Typography variant='subtitle2'>This clan disabled new requests.</Typography>
                                                            </Alert>
                                                        </> : <></>
                                                    }
                                                </>
                                            ) : <></>
                                    }
                                </CardContent>
                            </Card>
                            <Box sx={{ mt: 2 }} />
                            <Card elevation={3}>
                                <CardContent>
                                    <Typography variant='h6'>Statistics</Typography>
                                    <Typography variant='body1'>Members: {clanData.members.length}</Typography>
                                    <Typography variant='body1'>Created: {moment(clanData.clan.creation_date).fromNow()}</Typography>
                                    <Box sx={{ display: 'flex' }}>
                                        <Typography variant='body1'>Owner:</Typography>
                                        <Box sx={{ ml: 1 }}> {GetFormattedName(clanData.owner?.user?.inspector_user ?? {})} </Box>
                                    </Box>
                                    <Box sx={{
                                        mt: 1,
                                    }}>
                                        {/* read-only, clickable input field to copy shareable clan link */}
                                        <Tooltip title='Click to copy. This URL adds metadata that displays name, image in places like Discord.'>
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
                                        </Tooltip>
                                    </Box>
                                    {
                                        clanData.clan.discord_invite ? <>
                                            <Tooltip title={`${clanData.clan.name} has a Discord server, join them!`}>
                                                <Button size='small' variant='contained' sx={{ mt: 1, backgroundColor: '#7289da' }} startIcon={<DiscordIcon />} href={clanData.clan.discord_invite} target='_blank'>Join Discord</Button>
                                            </Tooltip>
                                        </> : <></>
                                    }
                                    {
                                        //if owner, show Edit button
                                        props.me && props.me?.clan_member?.clan && props.me?.clan_member?.clan?.id === clanData.clan.id
                                            && clanData.clan.owner === props.me?.osu_id
                                            ?
                                            <>
                                                <Divider sx={{ mt: 1, mb: 1 }} />
                                                <Alert severity={clanData.clan.disable_requests ? 'warning' : 'success'}>
                                                    Join requests are {clanData.clan.disable_requests ? 'disabled' : 'enabled'}.
                                                </Alert>
                                                <Box sx={{ pt: 1 }}>
                                                    <Button
                                                        variant='contained'
                                                        color='primary'
                                                        size='small'
                                                        onClick={() => setClanEditModalOpen(true)}
                                                    >Edit</Button>
                                                    <Button
                                                        sx={{ ml: 1 }}
                                                        variant='contained'
                                                        color='error'
                                                        size='small'
                                                        onClick={() => setClanRemoveModalOpen(true)}
                                                    >Delete</Button>
                                                </Box>
                                            </>
                                            : <></>
                                    }
                                    <Divider sx={{ mt: 1, mb: 1 }} />
                                    {/* <Typography variant='body1'>Ranked score: {clanData.stats.ranked_score ?? 0}</Typography>
                                                            <Typography variant='body1'>Total score: {clanData.stats.total_score ?? 0}</Typography> */}
                                    <TableContainer>
                                        <Table size='small' sx={{
                                            [`& .${tableCellClasses.root}`]: {
                                                borderBottom: "none",
                                                height: '20px',
                                            }
                                        }}>
                                            <TableBody>
                                                {
                                                    //remove where display is false
                                                    CLAN_STATS.filter((stat) => stat.display !== false).map((stat) => {
                                                        let ranking = clanData.ranking[stat.key] ?? 0;
                                                        if (stat.key === 'level') {
                                                            ranking = clanData.ranking['total_score'] ?? 0;
                                                        }
                                                        let rank_color = null;

                                                        //bright colors
                                                        if (ranking === 1) rank_color = '#ffd700';
                                                        if (ranking === 2) rank_color = '#e5e4e2';
                                                        if (ranking === 3) rank_color = '#cd7f32';

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
                                </CardContent>
                            </Card>
                        </Grid2>
                        <Grid2 size={{ xs: 12, md: 8 }}>
                            {
                                props.me && props.me.clan_member?.clan?.id === clanData.clan.id && props.me.clan_member?.pending ? <>
                                    <Alert severity='info' sx={{
                                        mb: 1
                                    }}>
                                        Your join request is still pending.
                                    </Alert>
                                </> : <></>
                            }
                            <Box>
                                <Box display='flex' sx={{ mb: 1 }}>
                                    <Typography variant='h6'>Members</Typography>
                                    {/* dropdown for sorter */}
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
                                                CLAN_STATS.filter((stat) => stat.user !== false).map((stat) => {
                                                    return (
                                                        <MenuItem value={stat.key}>{stat.name}</MenuItem>
                                                    )
                                                })
                                            }
                                        </Select>
                                    </FormControl>
                                </Box>

                                <Stack spacing={1}>
                                    {
                                        clanData.members.length > 0 ?
                                            // clanData.members.map((member, index) => {

                                            //sort then map
                                            clanData.members.sort(
                                                (a, b) => {
                                                    const a_sorter = CLAN_STATS.find((stat) => stat.key === sorter).sort_value ? CLAN_STATS.find((stat) => stat.key === sorter).sort_value(a.user.extra) : a.user.extra[sorter];
                                                    const b_sorter = CLAN_STATS.find((stat) => stat.key === sorter).sort_value ? CLAN_STATS.find((stat) => stat.key === sorter).sort_value(b.user.extra) : b.user.extra[sorter];
                                                    return b_sorter - a_sorter;
                                                }
                                            ).map((member, index) => {
                                                const _member = member.user.osu ?? member.user.alt;
                                                const _username = _member?.username ?? member.user.inspector_user?.known_username;
                                                const _user_id = _member?.id ?? member.user.inspector_user?.osu_id;
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
                                                                            value: CLAN_STATS.find((stat) => stat.key === sorter).name, alignment: 'right', variant: 'body2',
                                                                            color: grey[500]
                                                                        },
                                                                        {
                                                                            value: CLAN_STATS.find((stat) => stat.key === sorter).format(member.user.extra), alignment: 'left', variant: 'body2'
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
                                                                <Tooltip title={clanData.clan.owner === _user_id ? 'Owner' : 'Member'}>
                                                                    {
                                                                        clanData.clan.owner === _user_id ?
                                                                            <AdminPanelSettingsIcon />
                                                                            :
                                                                            <AccountCircleIcon />
                                                                    }
                                                                </Tooltip>
                                                            </Box>
                                                            {
                                                                props.me && props.me?.clan_member?.clan && props.me?.clan_member?.clan?.id === clanData.clan.id
                                                                    && clanData.clan.owner === props.me?.osu_id ?
                                                                    <Box sx={{
                                                                        ml: 1
                                                                    }}>
                                                                        {/* <Button
                                                                    onClick={() => { eventRemoveMember(_user_id) }}
                                                                    variant='contained'
                                                                    color='error'
                                                                    sx={{
                                                                        ml: 1,
                                                                        opacity: _user_id !== clanData.clan.owner ? 1 : 0
                                                                    }}
                                                                    size='small'
                                                                    disabled={_user_id === clanData.clan.owner}
                                                                >
                                                                    Remove
                                                                </Button> */}
                                                                        {/* show a button with 3 dots to open a dropdown */}
                                                                        <IconButton
                                                                            disabled={_user_id === clanData.clan.owner}
                                                                            onClick={(e) => handleDropdownClick(e, _user_id)}
                                                                        >
                                                                            <MoreHorizIcon fontSize="inherit" />
                                                                        </IconButton>
                                                                        {/* dropdown */}
                                                                        <Menu
                                                                            open={Boolean(anchorEl)}
                                                                            onClose={handleDropdownClose}
                                                                            keepMounted
                                                                            anchorEl={anchorEl}
                                                                        >
                                                                            <MenuItem
                                                                                onClick={() => { eventRemoveMember(anchorData) }}
                                                                            >
                                                                                <CancelIcon sx={{ mr: 1.75 }} color="error" /> Kick
                                                                            </MenuItem>
                                                                            <Tooltip title='There is a 30 day cooldown before ownership can be transferred again.'>
                                                                                <MenuItem
                                                                                    onClick={() => { eventTransferOwnership(anchorData) }}
                                                                                >
                                                                                    <SyncIcon sx={{ mr: 1.75, color: blue[500] }} /> Transfer ownership
                                                                                </MenuItem>
                                                                            </Tooltip>
                                                                            <Divider />
                                                                            <MenuItem disabled={true}>
                                                                                Be careful. These changes are permanent.
                                                                            </MenuItem>
                                                                        </Menu>
                                                                    </Box>
                                                                    : <></>
                                                            }
                                                        </Box>
                                                    </>
                                                )
                                            }) :
                                            <Typography variant='subtitle2' sx={{ fontStyle: 'italic', }}>No other members</Typography>
                                    }
                                </Stack>
                                {
                                    //if owner, show member requests
                                    clanData.clan.owner === props.me?.osu_id ?
                                        <>
                                            <Divider sx={{ mt: 1, mb: 1 }} />
                                            <Typography variant='h6'>Member requests</Typography>
                                            <Grid2 sx={{
                                                maxHeight: '60vh',
                                                overflowY: 'auto',
                                            }}>
                                                <Stack spacing={1}>
                                                    {
                                                        clanData.pending_members?.length > 0 ?
                                                            //for testing, duplicate the requests multiple times
                                                            clanData.pending_members.map((request, index) => {
                                                                const _member = request.user.osu ?? request.user.alt;
                                                                const _username = _member?.username ?? request.user.inspector_user?.known_username;
                                                                const _user_id = _member?.id ?? request.user.inspector_user?.osu_id;
                                                                return (
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
                                                                            />
                                                                        </Box>
                                                                        {
                                                                            props.me && props.me?.clan_member?.clan && props.me?.clan_member?.clan?.id === clanData.clan.id
                                                                                && clanData.clan.owner === props.me?.osu_id ?
                                                                                <Box>
                                                                                    <Tooltip title='Accept'>
                                                                                        <IconButton
                                                                                            onClick={(e) => eventAcceptJoinRequest(request)}
                                                                                            color='primary'
                                                                                            size="small"
                                                                                            sx={{
                                                                                                backgroundColor: theme.palette.success.main,
                                                                                                color: theme.palette.success.contrastText,
                                                                                                "&:hover": { backgroundColor: `${theme.palette.success.main}90` },
                                                                                                m: 1,
                                                                                                p: 1
                                                                                            }}
                                                                                        >
                                                                                            <DoneIcon fontSize="inherit" />
                                                                                        </IconButton>
                                                                                    </Tooltip>
                                                                                    <Tooltip title='Reject'>
                                                                                        <IconButton
                                                                                            onClick={(e) => eventRejectJoinRequest(request)}
                                                                                            color='error'
                                                                                            size="small"
                                                                                            sx={{
                                                                                                backgroundColor: theme.palette.error.main,
                                                                                                color: theme.palette.error.contrastText,
                                                                                                "&:hover": { backgroundColor: `${theme.palette.error.main}90` },
                                                                                                m: 1,
                                                                                                p: 1
                                                                                            }}
                                                                                        >
                                                                                            <ClearIcon fontSize="inherit" />
                                                                                        </IconButton>
                                                                                    </Tooltip>
                                                                                    {/* <Button
                                                                                    onClick={() => { eventAcceptJoinRequest(request) }}
                                                                                    variant='contained'
                                                                                    color='primary'
                                                                                    sx={{ mr: 1, ml: 1 }}>
                                                                                    Accept
                                                                                </Button>
                                                                                <Button
                                                                                    onClick={() => { eventRejectJoinRequest(request) }}
                                                                                    variant='contained'
                                                                                    color='error'
                                                                                    sx={{ mr: 1 }}>
                                                                                    Reject
                                                                                </Button> */}
                                                                                </Box>
                                                                                : <></>
                                                                        }
                                                                    </Box>
                                                                )
                                                            }) :
                                                            <Typography variant='subtitle2' sx={{ fontStyle: 'italic', }}>No requests</Typography>
                                                    }
                                                </Stack>
                                            </Grid2>
                                        </> : <></>
                                }
                            </Box >
                        </Grid2>
                    </Grid2>
                    {/* clan logs, scrollable div of ~250 height */}
                    <Card elevation={3} sx={{
                        mt: 2,
                    }}>
                        <CardContent>
                            <Box sx={{
                                maxHeight: '250px',
                                overflowY: 'auto',
                            }}>
                                <Typography variant='h6'>Clan history</Typography>
                                {/* <Stack spacing={1}>
                            {
                                clanData.logs.map((log, index) => {
                                    return <Typography>
                                        {FormatClanLog(clanData, log)}
                                    </Typography>
                                })
                            }
                        </Stack> */}
                                <TableContainer>
                                    <Table size='small'>
                                        <TableBody>
                                            {
                                                clanData.logs.map((log, index) => {
                                                    if (FormatClanLog(clanData, log) === null) return <></>;
                                                    return <TableRow key={index}>
                                                        <TableCell>
                                                            <Tooltip title={moment(log.created_at).format('MMMM Do YYYY, h:mm:ss a')}>
                                                                {moment(log.created_at).fromNow()}
                                                            </Tooltip>
                                                        </TableCell>
                                                        <TableCell>
                                                            <Typography variant='body2'>
                                                                {FormatClanLog(clanData, log)}
                                                            </Typography>
                                                        </TableCell>
                                                    </TableRow>
                                                })
                                            }
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </Box>
                        </CardContent>
                    </Card>
                    <Alert severity='info' sx={{ mt: 2 }}>
                        <Typography variant='body1'>Members not registered on the osu!alternative Discord may be missing stats.</Typography>
                    </Alert>
                </Container>
            </Box>
        </>
    )
}

const CLANS_PER_PAGE = 20;
function ClanList(props) {
    const [clanListData, setClanListData] = useState(null);
    const [sorter, setSorter] = useState('average_pp');
    const [page, setPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState('');
    const navigate = useNavigate();

    const fetchData = async (reset_page = false) => {
        try {
            if (reset_page) setPage(1);
            const _page = reset_page ? 1 : page;
            setClanListData(null);
            const response = await GetClanList(_page, sorter, 'desc', CLANS_PER_PAGE, searchQuery);
            if (response?.total_clans) {
                response.total_pages = Math.ceil(response.query_clans / CLANS_PER_PAGE);
                response.current_page = _page;
                setClanListData(response);
            }
        } catch (err) {
            console.error(err);
            showNotification('Error', 'An error occurred while fetching the clan list.', 'error');
        }
    }

    useEffect(() => {
        (async () => {
            await fetchData();
        })()
    }, [sorter, page]);

    return (
        <>
            {
                clanListData ?
                    <>
                        <Grid2 container spacing={1}>

                            <Grid2 size={{ xs: 12, md: 10 }}>
                                <Pagination
                                    color="primary"
                                    count={clanListData.total_pages}
                                    page={clanListData.current_page}
                                    showFirstButton
                                    showLastButton
                                    siblingCount={1}
                                    boundaryCount={1}
                                    onChange={(e, page) => setPage(page)}
                                    sx={{
                                        mt: 1,
                                        display: 'flex',
                                        justifyContent: 'center',
                                    }}
                                />
                                <Stack direction='column' spacing={0.6} sx={{
                                    mt: 1
                                }}>
                                    {
                                        clanListData.clans.map((clan, index) => {
                                            return (
                                                <ClanLeaderboardItem
                                                    index={index + 1 + (clanListData.current_page - 1) * CLANS_PER_PAGE}
                                                    clan={clan}
                                                    onClick={() => navigate(`/clan/${clan.id}`)}
                                                    values={
                                                        [
                                                            //empty
                                                            { value: '', alignment: 'left', variant: 'body2' },
                                                            { value: '', alignment: 'left', variant: 'body2' },
                                                            //select stat name from clan_stats entry
                                                            {
                                                                value: CLAN_STATS.find((stat) => stat.key === sorter).name, alignment: 'right', variant: 'body2',
                                                                color: grey[500]
                                                            },
                                                            //select clan_stat entry from sorter, then use format function
                                                            { value: CLAN_STATS.find((stat) => stat.key === sorter).format(clan.clan_stats), alignment: 'left', variant: 'body2' },
                                                        ]
                                                    }
                                                    iconValues={[
                                                        { value: (!clan.discord_invite || clan.discord_invite.length === 0) ? <></> : <DiscordIcon sx={{ color: grey[200] }} />, alignment: 'right', variant: 'body2', tooltip: clan.discord_invite ? 'Has a Discord community' : '' },
                                                        { value: clan.disable_requests ? <LockIcon color='error' /> : <LockOpenIcon color='success' />, alignment: 'right', variant: 'body2', tooltip: clan.disable_requests ? 'Join requests disabled' : 'Join requests enabled' }
                                                    ]}
                                                />
                                            )
                                        })
                                    }
                                </Stack>
                                <Pagination
                                    color="primary"
                                    count={clanListData.total_pages}
                                    page={clanListData.current_page}
                                    showFirstButton
                                    showLastButton
                                    siblingCount={1}
                                    boundaryCount={1}
                                    onChange={(e, page) => setPage(page)}
                                    sx={{
                                        mt: 1,
                                        display: 'flex',
                                        justifyContent: 'center',
                                    }}
                                />
                            </Grid2>
                            <Grid2 size={{ xs: 12, md: 2 }}>
                                <Box sx={{ mt: 1 }}>
                                    <Grid2 container spacing={1}>
                                        <Grid2 size={6}>
                                            <StatCard stats={clanListData?.total_clans ?? 0} title='Clans' color={grey} opacity={0.2} icon={<GroupsIcon />} />
                                        </Grid2>
                                        <Grid2 size={6}>
                                            <StatCard stats={clanListData?.total_members ?? 0} title='Members' color={grey} opacity={0.2} icon={<GroupsIcon />} />
                                        </Grid2>
                                    </Grid2>
                                </Box>
                                {/* search field with button right */}
                                <Box sx={{
                                    display: 'flex',
                                    mt: 1,
                                }}>
                                    <FormControl fullWidth size="small">
                                        <InputLabel
                                            htmlFor='clan-search'
                                        >Search</InputLabel>
                                        <OutlinedInput
                                            id='clan-search'
                                            type='text'
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            endAdornment={
                                                <InputAdornment position="end">
                                                    <IconButton
                                                        onClick={() => fetchData(true)}
                                                    >
                                                        <SearchIcon />
                                                    </IconButton>
                                                </InputAdornment>
                                            }
                                            label='Search clan'
                                        />
                                    </FormControl>
                                </Box>
                                <Divider sx={{ mt: 1, mb: 1 }} />
                                <ButtonGroup sx={{ mt: 1 }} orientation="vertical" color='primary' fullWidth>
                                    {
                                        CLAN_STATS.filter((stat) => stat.clanlist !== false).map((stat) => {
                                            return (
                                                <Button
                                                    onClick={() => setSorter(stat.key)}
                                                    variant={sorter === stat.key ? 'contained' : 'outlined'}
                                                >
                                                    {stat.name}
                                                </Button>
                                            )
                                        })
                                    }
                                </ButtonGroup>
                            </Grid2>
                        </Grid2>
                    </> : <Loader />
            }
        </>
    )
}

const TOP_CLAN_HEIGHT = 140;
const GOLD_HEIGHT_EXTRA = 30;
const TOP_CLAN_HEIGHT_OFFSET = 50;
const TOP_CLAN_COLORS = ['#ffd700', '#C0C0C0', '#cd7f32'];
const ClanPlayTooltip = styled(({ className, ...props }) => (
    <Tooltip {...props} componentsProps={{ tooltip: { className: className } }} />
))(`
    background-color: transparent;
    max-width: none;
`);
const CLAN_RANKING_STATS = {
    'weighted_pp': {
        name: 'Weighted PP',
        formatter: (clan) => `${(Math.round(clan.ranking_prepared.weighted_pp * 100) / 100).toLocaleString('en-US')}pp`,
    },
    'total_pp': {
        name: 'Total PP',
        formatter: (clan) => `${(Math.round(clan.ranking_prepared.total_pp * 100) / 100).toLocaleString('en-US')}pp`,
    },
    'total_scores': {
        name: 'Clears',
        formatter: (clan) => `${clan.ranking_prepared.total_scores.toLocaleString('en-US')}`,
    },
    'total_score': {
        name: 'Score',
        formatter: (clan) => `${clan.ranking_prepared.total_score.toLocaleString('en-US')}`,
    },
    'total_ss_score': {
        name: 'SS Score',
        formatter: (clan) => `${clan.ranking_prepared.total_ss_score.toLocaleString('en-US')}`,
    },
    'top_play': {
        name: 'Top PP play',
        formatter: (clan) => `${(Math.round((clan.ranking_prepared?.top_play?.pp ?? 0) * 100) / 100).toLocaleString('en-US')}pp`,
        tooltip: (clan) => (
            <Card>
                <CardMedia
                    component="img"
                    height="140"
                    image={`https://assets.ppy.sh/beatmaps/${clan.ranking_prepared?.top_play?.beatmap?.set_id}/covers/cover.jpg`}
                />
                <CardContent>
                    {
                        clan.ranking_prepared?.top_play ?
                            <>
                                <Typography variant='body1'>{clan.ranking_prepared?.top_play?.beatmap?.artist} - {clan.ranking_prepared?.top_play?.beatmap?.title} [{clan.ranking_prepared?.top_play?.beatmap?.diffname}]</Typography>
                                <Typography variant='body2'>{clan.ranking_prepared?.top_play?.beatmap?.version}</Typography>
                                <Typography variant='body2'>{clan.ranking_prepared?.top_play?.pp.toLocaleString('en-US')}pp</Typography>
                                <Typography variant='body2'>{clan.ranking_prepared?.top_play?.score.toLocaleString('en-US')} score</Typography>
                                <Typography variant='body2'>{clan.ranking_prepared?.top_play?.accuracy}%</Typography>
                                <Typography variant='body2'>{clan.ranking_prepared?.top_play?.enabled_mods !== '0' ? getModString(clan.ranking_prepared?.top_play?.enabled_mods) : 'No mods'}</Typography>
                                <Divider />
                                <Typography variant='body1'>{GetFormattedName(clan.ranking_prepared?.top_play?.user)}</Typography>
                            </>
                            : <Typography variant='body1'>Score data unavailable somehow</Typography>
                    }
                </CardContent>
            </Card>
        )
    },
    'top_score': {
        name: 'Top Score play',
        formatter: (clan) => `${(clan.ranking_prepared?.top_score?.score ?? 0).toLocaleString('en-US')}`,
        tooltip: (clan) => (
            <Card>
                <CardMedia
                    component="img"
                    height="140"
                    image={`https://assets.ppy.sh/beatmaps/${clan.ranking_prepared?.top_score?.beatmap?.set_id}/covers/cover.jpg`}
                />
                <CardContent>
                    {
                        clan.ranking_prepared?.top_score ?
                            <>
                                <Typography variant='body1'>{clan.ranking_prepared?.top_score?.beatmap?.artist} - {clan.ranking_prepared?.top_score?.beatmap?.title} [{clan.ranking_prepared?.top_score?.beatmap?.diffname}]</Typography>
                                <Typography variant='body2'>{clan.ranking_prepared?.top_score?.beatmap?.version}</Typography>
                                <Typography variant='body2'>{clan.ranking_prepared?.top_score?.pp.toLocaleString('en-US')}pp</Typography>
                                <Typography variant='body2'>{clan.ranking_prepared?.top_score?.score.toLocaleString('en-US')} score</Typography>
                                <Typography variant='body2'>{clan.ranking_prepared?.top_score?.accuracy}%</Typography>
                                <Typography variant='body2'>{clan.ranking_prepared?.top_score?.enabled_mods !== '0' ? getModString(clan.ranking_prepared?.top_score?.enabled_mods) : 'No mods'}</Typography>
                                <Divider />
                                <Typography variant='body1'>{GetFormattedName(clan.ranking_prepared?.top_score?.user)}</Typography>
                            </>
                            : <Typography variant='body1'>Score data unavailable somehow</Typography>
                    }
                </CardContent>
            </Card>
        )
    }
}

function ClanTop(props) {
    //todo; special leaderboards (monthly top scores etc)
    //these are seperate from regular all-time leaderboards
    //this is meant for short time competition
    const [data, setData] = useState(null);
    const [activeStatIndex, setActiveStatIndex] = useState(0);
    const [activeStat, setActiveStat] = useState(Object.keys(CLAN_RANKING_STATS)[activeStatIndex]);
    const navigate = useNavigate();

    useEffect(() => {
        setActiveStat(Object.keys(CLAN_RANKING_STATS)[activeStatIndex]);
    }, [activeStatIndex]);

    useEffect(() => {
        (async () => {
            try {
                const response = await GetTopClans();

                if (response) {
                    //convert response.date (YYYY-MM) to a more readable format (August 2024)
                    const date = moment(response.date, 'YYYY-MM').format('MMMM YYYY');
                    setData({
                        date: date,
                        data: response.data,
                    });
                } else {
                    setData(null);
                    showNotification('Error', 'An error occurred while fetching the top clans.', 'error');
                }
            } catch (err) {
                console.error(err);
                showNotification('Error', 'An error occurred while fetching the top clans.', 'error');
            }
        })()
    }, []);

    if (!data) return <Loader />

    //inline component for the top 3 clan card
    const TopClanCard = (props) => {
        return <ClanPlayTooltip title={CLAN_RANKING_STATS[activeStat].tooltip ? CLAN_RANKING_STATS[activeStat].tooltip(props.data) : ''}>
            <Box sx={{
                height: TOP_CLAN_HEIGHT + (GOLD_HEIGHT_EXTRA * (2 - props.pos)),
                position: 'relative',
                mt: `${GOLD_HEIGHT_EXTRA * props.pos}px`,
            }}>
                <Box sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    borderRadius: '10px',
                    overflow: 'hidden',
                    backgroundImage: `url(${IMG_TRIANGLES})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                    filter: 'brightness(0.5)',
                }}>

                </Box>
                <Card
                    elevation={3}
                    sx={{
                        width: '100%',
                        height: '100%',
                        background: `linear-gradient(#${props.data.color}77, #${props.data.color}00)`,
                    }}>
                    <CardActionArea
                        onClick={() => navigate(`/clan/${props.data.id}`)}
                        sx={{
                            height: '100%',
                        }}
                    >
                        <CardContent sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            height: '100%',
                            alignItems: 'center',
                            mt: '2em',
                        }}>
                            <Typography sx={{
                                color: '#' + props.data.color
                            }} variant='h6'>[{props.data.tag}]</Typography>
                            <Typography variant='body2'>{props.data.name}</Typography>
                            <Typography variant='body1'>{CLAN_RANKING_STATS[activeStat].formatter(props.data)}</Typography>
                        </CardContent>
                    </CardActionArea>
                </Card>
                <Avatar
                    sx={{
                        position: 'absolute',
                        top: `${-TOP_CLAN_HEIGHT_OFFSET}px`,
                        left: '50%',
                        transform: 'translateX(-50%)',
                        width: `${TOP_CLAN_HEIGHT_OFFSET * 2}px`,
                        height: `${TOP_CLAN_HEIGHT_OFFSET * 2}px`,
                        border: `5px solid ${TOP_CLAN_COLORS[props.pos]}`,
                        backgroundImage: props.data.header_image_url ? `url(${fixedEncodeURIComponent(props.data.header_image_url)})` : undefined,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        backgroundRepeat: 'no-repeat',
                    }}
                >
                    <img src='broken-image.jpg' alt='icon' style={{
                        opacity: 0
                    }} />
                </Avatar>
                {/* add to the bottom of avatar, show a small box with the position */}
                <Box sx={{
                    position: 'absolute',
                    top: `${TOP_CLAN_HEIGHT_OFFSET - 25 / 2}px`,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    display: 'flex',
                    width: '25px',
                    height: '25px',
                    borderRadius: '50%',
                    justifyContent: 'center',
                    backgroundColor: TOP_CLAN_COLORS[props.pos],
                }}>
                    <Typography variant='body1'>{props.pos + 1}</Typography>
                </Box>
            </Box>
        </ClanPlayTooltip>
    }

    return <Box>
        <Container maxWidth='lg'>
            <Box sx={{
                zIndex: 2
            }}>
                <Typography variant='body1'>Best clans of</Typography>
                <Typography variant='h5' sx={{
                    fontStyle: 'italic',
                }}>{data.date}</Typography>
            </Box>
            <Box sx={{
                //center horizontally
                justifyContent: 'center',
                display: 'flex',
            }}>
                <Tabs value={activeStatIndex} onChange={(e, value) => setActiveStatIndex(value)}>
                    {
                        Object.keys(CLAN_RANKING_STATS).map((stat) => {
                            return (
                                <Tab label={CLAN_RANKING_STATS[stat].name} />
                            )
                        })
                    }
                </Tabs>
            </Box>
            <Box>
                <Grid2 container sx={{
                    mt: `${TOP_CLAN_HEIGHT_OFFSET + 10}px`
                }}
                    spacing={1}
                >
                    <Grid2 size={{ xs: 4, md: 4 }}>
                        <TopClanCard pos={1} data={data.data[activeStat][1]} />
                    </Grid2>
                    <Grid2 size={{ xs: 4, md: 4 }}>
                        <TopClanCard pos={0} data={data.data[activeStat][0]} />
                    </Grid2>
                    <Grid2 size={{ xs: 4, md: 4 }}>
                        <TopClanCard pos={2} data={data.data[activeStat][2]} />
                    </Grid2>
                </Grid2>
                {/* the rest are index 3 - 9 clans, using leaderboard items */}
                <Stack spacing={1} sx={{
                    mt: 2
                }}>
                    {
                        data.data[activeStat].slice(3).map((clan, index) => {
                            return (
                                <ClanPlayTooltip title={CLAN_RANKING_STATS[activeStat].tooltip ? CLAN_RANKING_STATS[activeStat].tooltip(clan) : ''}>
                                    <Grid2>
                                        <ClanLeaderboardItem
                                            index={index + 4}
                                            clan={clan}
                                            values={[
                                                {
                                                    value: '', alignment: 'left', variant: 'body2'
                                                },
                                                {
                                                    value: CLAN_RANKING_STATS[activeStat].name, alignment: 'right', variant: 'body2',
                                                    color: grey[500]
                                                },
                                                {
                                                    value: CLAN_RANKING_STATS[activeStat].formatter(clan), alignment: 'left', variant: 'body2'
                                                },
                                                {
                                                    value: '', alignment: 'right', variant: 'body2'
                                                }
                                            ]}
                                        />
                                    </Grid2>
                                </ClanPlayTooltip>
                            )
                        })
                    }
                </Stack>
                <Box>
                    <Typography variant='body2' sx={{
                        fontStyle: 'italic',
                        color: grey[500],
                        mt: 1
                    }}>Last updated: {moment(data.data.update_date).fromNow()}</Typography>
                </Box>
                <Box sx={{
                    mt: 1,
                }}>
                    <Card elevation={3}>
                        <CardContent>
                            <Typography variant='h6'>Overall statistics</Typography>
                            <TableContainer>
                                <Table size='small'>
                                    <TableBody>
                                        <TableRow>
                                            <TableCell><Typography sx={{ fontSize: '0.7rem', }}>Weighted PP</Typography></TableCell>
                                            <TableCell><Typography sx={{ fontSize: '0.7rem', }}>Total PP</Typography></TableCell>
                                            <TableCell><Typography sx={{ fontSize: '0.7rem', }}>Clears</Typography></TableCell>
                                            <TableCell><Typography sx={{ fontSize: '0.7rem', }}>Total Score</Typography></TableCell>
                                            <TableCell><Typography sx={{ fontSize: '0.7rem', }}>Total SS Score</Typography></TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell>{(Math.round(data.data.global_stats.weighted_pp * 100) / 100).toLocaleString('en-US')}pp</TableCell>
                                            <TableCell>{(Math.round(data.data.global_stats.total_pp * 100) / 100).toLocaleString('en-US')}pp</TableCell>
                                            <TableCell>{data.data.global_stats.total_scores.toLocaleString('en-US')}</TableCell>
                                            <TableCell>{data.data.global_stats.total_score.toLocaleString('en-US')}</TableCell>
                                            <TableCell>{data.data.global_stats.total_ss_score.toLocaleString('en-US')}</TableCell>
                                        </TableRow>
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </CardContent>
                    </Card>
                </Box>
            </Box>
        </Container>
    </Box>
}

function ClanEdit(props) {
    const navigate = useNavigate();

    const onSubmit = async (data) => {
        if (!data.clanName || !data.clanTag || !data.clanDescription || !data.clanColor) {
            showNotification('Error', 'Please fill in all fields.', 'error');
            return;
        }

        const _data = {
            id: props.clan.clan.id,
            name: data.clanName,
            tag: data.clanTag,
            description: data.clanDescription,
            color: data.clanColor,
            header_image_url: data.clanHeaderUrl,
            disable_requests: data.clanDisableRequests,
            default_sort: data.clanDefaultSort,
            discord_invite: data.clanDiscordInvite,
            user: {
                id: props.user.osu_id,
                token: await GetLoginToken(),
            }
        }

        try {
            const response = await UpdateClan(_data);
            if (response.error) {
                showNotification('Error', response.error, 'error');
            } else {
                showNotification('Success', 'Clan updated successfully.', 'success');
                navigate(0);
            }
        } catch (err) {
            console.error(err);
            showNotification('Error', 'An error occurred while updating the clan.', 'error');
        }
    }

    return (
        <ClanFormFields user={props.user} clan={props.clan} onSubmit={onSubmit} />
    );
}

function ClanCreate(props) {
    const navigate = useNavigate();

    const onSubmit = async (data) => {
        if (!data.clanName || !data.clanTag || !data.clanDescription || !data.clanColor) {
            showNotification('Error', 'Please fill in all fields.', 'error');
            return;
        }
        const _data = {
            name: data.clanName,
            tag: data.clanTag,
            description: data.clanDescription,
            color: data.clanColor,
            user: {
                id: props.user.osu_id,
                token: await GetLoginToken(),
            }
        }

        try {
            const response = await CreateClan(_data);
            if (response.error) {
                showNotification('Error', response.error, 'error');
            } else {
                showNotification('Success', 'Clan created successfully.', 'success');
                navigate(`/clan/${response.clan.id}`);
            }
        } catch (err) {
            console.error(err);
            showNotification('Error', 'An error occurred while creating the clan.', 'error');
        }
    }

    return (
        <ClanFormFields user={props.user} onSubmit={onSubmit} />
    );
}

function ClanFormFields(props) {
    const [isWorking, setIsWorking] = useState(false);
    const [clanName, setClanName] = useState(props.clan?.clan.name ?? '');
    const [clanTag, setClanTag] = useState(props.clan?.clan.tag ?? '');
    const [clanDescription, setClanDescription] = useState(props.clan?.clan.description ?? '');
    const [clanColor, setClanColor] = useState(('#' + (props.clan?.clan.color ?? 'ffffff')));
    const [clanHeaderUrl, setClanHeaderUrl] = useState(props.clan?.clan.header_image_url ?? '');
    const [clanDisableRequests, setClanDisableRequests] = useState(props.clan?.clan.disable_requests ?? false);
    const [clanDefaultSort, setClanDefaultSort] = useState(props.clan?.clan.default_sort ?? 'average_pp');
    const [clanDiscordInvite, setClanDiscordInvite] = useState(props.clan?.clan.discord_invite ?? '');
    const [isEditMode] = useState(props.clan ? true : false);

    const [exampleUser, setExampleUser] = useState(null);

    const onUpdate = () => {
        let user = { ...props.user };
        user.clan_member = {};
        user.clan_member.clan = {
            tag: clanTag,
            //without hashtag
            color: clanColor.substring(1),
        }
        setExampleUser(user);
    }

    useEffect(() => {
        onUpdate();
    }, [clanTag, clanColor]);

    useEffect(() => {
        setIsWorking(false);
        onUpdate();
    }, []);

    const onSubmit = () => {
        if (isWorking) {
            return;
        }
        setIsWorking(true);
        //submit the clan
        (async () => {
            if (!matchIsValidColor(clanColor)) {
                showNotification('Error', 'Invalid color code.', 'error');
                setIsWorking(false);
                return;
            }

            await props.onSubmit({
                clanName: clanName,
                clanTag: clanTag,
                clanDescription: clanDescription,
                clanColor: clanColor.substring(1),
                clanHeaderUrl: clanHeaderUrl,
                clanDisableRequests: clanDisableRequests,
                clanDefaultSort: clanDefaultSort,
                clanDiscordInvite: clanDiscordInvite,
            });

            setIsWorking(false);
        })();
    }

    return (
        <>
            <Card sx={MODAL_STYLE}>
                <CardContent>
                    <Box>
                        <Typography variant='h6'>Create a clan</Typography>
                        {/* FORM */}
                        <Box sx={{
                            mt: 2,
                            maxHeight: '80vh',
                            overflowY: 'auto',
                        }}>
                            <Container>
                                <Stack spacing={1}>
                                    {
                                        exampleUser && GetFormattedName(exampleUser)
                                    }
                                    <TextField
                                        label='Clan name'
                                        variant='standard'
                                        value={clanName}
                                        onChange={(e) => setClanName(e.target.value)}
                                        disabled={isWorking}
                                        inputProps={{
                                            maxLength: 20,
                                        }}
                                    />
                                    <TextField
                                        label='Clan tag'
                                        variant='standard'
                                        value={clanTag}
                                        onChange={(e) => setClanTag(e.target.value)}
                                        disabled={isWorking}
                                        inputProps={{
                                            maxLength: 5,
                                        }}
                                    />
                                    <TextField
                                        label='Clan description'
                                        variant='standard'
                                        value={clanDescription}
                                        onChange={(e) => setClanDescription(e.target.value)}
                                        disabled={isWorking}
                                        inputProps={{
                                            maxLength: 100,
                                        }}
                                    />
                                    <MuiColorInput
                                        label='Clan color'
                                        format='hex'
                                        value={clanColor}
                                        isAlphaHidden={true}
                                        onChange={(color) => setClanColor(color)}
                                        variant="standard"
                                    />
                                    {
                                        isEditMode ? <>
                                            <TextField
                                                label='Discord Invite'
                                                variant='standard'
                                                value={clanDiscordInvite}
                                                onChange={(e) => setClanDiscordInvite(e.target.value)}
                                                disabled={isWorking}
                                                inputProps={{
                                                    maxLength: 255,
                                                }} />

                                            <TextField
                                                label='Header  Image URL'
                                                variant='standard'
                                                value={clanHeaderUrl}
                                                onChange={(e) => setClanHeaderUrl(e.target.value)}
                                                disabled={isWorking}
                                                inputProps={{
                                                    maxLength: 255,
                                                }}
                                            />

                                            <Box sx={{
                                                width: '100%',
                                            }}>
                                                <FormControl sx={{
                                                    mt: 1,
                                                    width: '100%',
                                                }}>
                                                    <InputLabel id="edit-default-sort">Default Sort</InputLabel>
                                                    <Select
                                                        labelId="edit-default-sort"
                                                        id="edit-default-sort-select"
                                                        variant='standard'
                                                        size="small"
                                                        value={clanDefaultSort}
                                                        onChange={(e) => setClanDefaultSort(e.target.value)}
                                                        disabled={isWorking}
                                                    >
                                                        {
                                                            CLAN_STATS.filter((stat) => stat.user !== false).map((stat) => {
                                                                return (
                                                                    <MenuItem value={stat.key}>{stat.name}</MenuItem>
                                                                )
                                                            })
                                                        }
                                                    </Select>
                                                </FormControl>
                                            </Box>

                                            {/* MUI switch */}
                                            <Stack direction='row' alignItems='center'>
                                                <Switch
                                                    checked={clanDisableRequests}
                                                    onChange={(e) => setClanDisableRequests(e.target.checked)}
                                                    disabled={isWorking}
                                                />
                                                <Typography>Disable join requests</Typography>
                                            </Stack>
                                        </> : <></>
                                    }
                                    <Button
                                        variant='contained'
                                        color='primary'
                                        onClick={onSubmit}
                                        disabled={isWorking}
                                    >
                                        {isEditMode ? 'Update' : 'Create'}
                                    </Button>
                                    <Alert severity='info' sx={{ mt: 1 }}>
                                        Header image must be a direct link to an image. (e.g. https://i.imgur.com/LqGgC4a.jpeg)
                                    </Alert>
                                    {/* add header image preview */}
                                    {
                                        clanHeaderUrl ? <img src={clanHeaderUrl} alt="Header Preview" style={{
                                            width: '100%',
                                            height: '200px',
                                            objectFit: 'cover',
                                            borderRadius: '10px',
                                            marginTop: '5px',
                                        }} /> : <></>
                                    }
                                </Stack>
                            </Container>
                        </Box>
                    </Box>
                </CardContent>
            </Card>
        </>
    );
}

export default Clan;