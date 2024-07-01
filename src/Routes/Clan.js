/* eslint-disable react-hooks/exhaustive-deps */
import { Helmet } from "react-helmet";
import config from "../config.json";
import { Alert, Box, Button, Card, CardContent, Chip, Container, Divider, FormControl, Grid, MenuItem, Modal, Paper, Select, Stack, Switch, Table, TableBody, TableCell, TableContainer, TableRow, TextField, Typography, tableCellClasses } from "@mui/material";
import { useState } from "react";
import { MODAL_STYLE, showNotification } from "../Helpers/Misc";
import { useEffect } from "react";
import { GetFormattedName, GetLoginID, GetLoginToken, GetUser } from "../Helpers/Account";
import { AcceptJoinRequestClan, CreateClan, DeleteClan, GetClan, GetClanList, JoinRequestClan, LeaveClan, RejectJoinRequestClan, RemoveClanMember, UpdateClan } from "../Helpers/Clan";
import { useNavigate, useParams } from "react-router-dom";
import Loader from "../Components/UI/Loader";
import moment from "moment";
import ClanLeaderboardItem from "../Components/Leaderboards/ClanLeaderboardItem";
import { grey } from "@mui/material/colors";
import sanitize from "sanitize-html";
import { getLevelForScore } from "../Helpers/Osu";
import PlayerLeaderboardItem from '../Components/Leaderboards/PlayerLeaderboardItem';
import LockIcon from '@mui/icons-material/Lock';
import LockOpenIcon from '@mui/icons-material/LockOpen';

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
        format: (stats) => ((stats.total_ss ?? 0) + (stats.total_ssh ?? 0)).toLocaleString('en-US'),
        ranking: true,
        sort_value: (stats) => (stats.total_ss ?? 0) + (stats.total_ssh ?? 0),
        key: 'total_ss',
    }, {
        name: 'Total S',
        format: (stats) => ((stats.total_s ?? 0) + (stats.total_sh ?? 0)).toLocaleString('en-US'),
        ranking: true,
        sort_value: (stats) => (stats.total_s ?? 0) + (stats.total_sh ?? 0),
        key: 'total_s',
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
    const [clanList, setClanList] = useState([]);
    const [totalClanStats, setTotalClanStats] = useState({
        clan_amount: 0,
        member_amount: 0,
    });
    const [clanCreatorModalOpen, setClanCreatorModalOpen] = useState(false);
    const [loggedInUser, setLoggedInUser] = useState(null);
    const [clanData, setClanData] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [clanRemoveModalOpen, setClanRemoveModalOpen] = useState(false);
    const [clanEditModalOpen, setClanEditModalOpen] = useState(false);
    const [currentClanSorter, setCurrentClanSorter] = useState(CLAN_STATS[0].key);
    const params = useParams();
    const navigate = useNavigate();

    const eventRequestJoinClan = async () => {
        try {
            const response = await JoinRequestClan(params.id, loggedInUser.osu_id, await GetLoginToken());
            if (response.error) {
                showNotification('Error', response.error, 'error');
            } else {
                showNotification('Success', 'Request sent successfully.', 'success');
                await loadClan(params.id, true);
            }
        } catch (err) {
            showNotification('Error', 'An error occurred while requesting to join the clan.', 'error');
        }
    }

    const eventLeaveClan = async () => {
        try {
            const response = await LeaveClan(loggedInUser.osu_id, await GetLoginToken(), params.id);
            if (response.error) {
                showNotification('Error', response.error, 'error');
            } else {
                showNotification('Success', 'Left the clan.', 'success');
                await loadClan(params.id, true);
            }
        } catch (err) {
            showNotification('Error', 'An error occurred while leaving the clan.', 'error');
        }
    }

    const eventAcceptJoinRequest = async (request) => {
        try {
            const user_id = request.user?.osu?.id ?? request.user?.alt?.user_id;
            if (!user_id) return showNotification('Error', 'No user data found...', 'error');
            const response = await AcceptJoinRequestClan(loggedInUser.osu_id, user_id, await GetLoginToken(), clanData.clan.id);
            if (response.error) {
                showNotification('Error', response.error, 'error');
            } else {
                showNotification('Success', 'Request accepted successfully.', 'success');
                await loadClan(params.id, true);
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
            const response = await RejectJoinRequestClan(loggedInUser.osu_id, user_id, await GetLoginToken(), clanData.clan.id);
            if (response.error) {
                showNotification('Error', response.error, 'error');
            } else {
                showNotification('Success', 'Request rejected successfully.', 'success');
                await loadClan(params.id, true);
            }
        } catch (err) {
            showNotification('Error', 'An error occurred while rejecting the join request.', 'error');
        }
    }

    const eventRemoveMember = async (user_id) => {
        try {
            const response = await RemoveClanMember(loggedInUser.osu_id, user_id, await GetLoginToken(), clanData.clan.id);
            if (response.error) {
                showNotification('Error', response.error, 'error');
            } else {
                showNotification('Success', 'Member removed successfully.', 'success');
                await loadClan(params.id, true);
            }
        } catch (err) {
            showNotification('Error', 'An error occurred while removing the member.', 'error');
        }
    }

    const loadUser = async (force_reload_user = false) => {
        if (loggedInUser && !force_reload_user) return loggedInUser;
        const _user = await GetLoginID();
        if (_user) {
            const __user = await GetUser(_user);
            setLoggedInUser(__user || null);
            return __user;
        }
        return null;
    }

    const loadClan = (id, force_reload_user = false) => {
        setClanData(null);
        setIsLoading(true);

        (async () => {
            try {
                const _user = await loadUser(force_reload_user);
                const data = await GetClan(id, _user?.osu_id ?? null, (await GetLoginToken()) ?? null);
                setClanData(data);
                setCurrentClanSorter(CLAN_STATS[0].key);
            } catch (err) {
                showNotification('Error', 'An error occurred while fetching the clan data.', 'error');
                showNotification('Error', err.message, 'error');
            }
            setIsLoading(false);
        })();
    }

    const loadClanList = () => {
        if (isLoading) return;
        if (clanList && clanList.length > 0) return;
        setIsLoading(true);
        setClanList([]);

        (async () => {
            try {
                const data = await GetClanList();

                //this is only ever used for sorting, so api doesnt do this
                //add member count to stats
                let clans = data.clans;
                setClanList(clans ?? []);
                if (clans) {
                    setTotalClanStats({
                        clan_amount: clans.length,
                        member_amount: clans.reduce((acc, clan) => acc + clan.clan_stats.members, 0),
                    });
                }
                setCurrentClanSorter(CLAN_STATS[0].key);
                setIsLoading(false);
            } catch (err) {
                showNotification('Error', 'An error occurred while fetching the clan list.', 'error');
                showNotification('Error', err.message, 'error');
                setIsLoading(false);
            }
        })();
    }

    useEffect(() => {
        if (currentClanSorter && clanData && clanData.length > 1) {
            setClanData(clanData.sort((a, b) => b.clan_stats[currentClanSorter] - a.clan_stats[currentClanSorter]));
        }
    }, [currentClanSorter]);

    useEffect(() => {
        if (params.id) {
            loadClan(params.id);
        }
    }, [params.id]);

    useEffect(() => {
        (async () => {
            await loadUser();
            if (!params.id && clanList.length === 0) {
                loadClanList();
            }
        })()
    }, [params]);

    const removeClan = () => {
        (async () => {
            const data = {
                id: clanData.clan.id,
                user: {
                    id: loggedInUser.osu_id,
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

    return (
        <>
            <Helmet>
                <title>Clans - {config.APP_NAME}</title>

                {/* Meta tags */}
                <meta name="description" content="osu! clans" />
                <meta property="og:title" content={`Clans - ${config.APP_NAME}`} />
                <meta property="og:description" content="osu! clans" />
                <meta property="og:image" content={config.APP_LOGO} />

                <meta name="twitter:title" content={`Clans - ${config.APP_NAME}`} />
                <meta name="twitter:description" content="osu! clans" />
                <meta name="twitter:image" content={config.APP_LOGO} />
            </Helmet>
            <Modal
                open={clanCreatorModalOpen}
                onClose={() => setClanCreatorModalOpen(false)}
            >
                <ClanCreate user={loggedInUser} />
            </Modal>
            <Container>
                {
                    params.id ?
                        (
                            isLoading ? <Loader /> :
                                (
                                    !clanData ? <Typography variant='body1'>Something went wrong... Try later please!</Typography> :
                                        <>
                                            <Helmet>
                                                <title>{clanData.clan.name} - {config.APP_NAME}</title>
                                                {/* Meta tags */}
                                                <meta name="description" content={sanitize(clanData.clan.description)} />
                                                <meta property="og:title" content={`${clanData.clan.name} - ${config.APP_NAME}`} />
                                                <meta property="og:description" content={sanitize(clanData.clan.description)} />
                                                <meta property="og:image" content={clanData.clan.header_image_url} />

                                                <meta name="twitter:title" content={`${clanData.clan.name} - ${config.APP_NAME}`} />
                                                <meta name="twitter:description" content={sanitize(clanData.clan.description)} />
                                                <meta name="twitter:image" content={clanData.clan.header_image_url} />
                                            </Helmet>
                                            <Modal
                                                open={clanEditModalOpen}
                                                onClose={() => setClanEditModalOpen(false)}
                                            >
                                                <ClanEdit user={loggedInUser} clan={clanData} />
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
                                            {
                                                clanData.clan.header_image_url ?
                                                    //object-fit top of the image
                                                    <img src={clanData.clan.header_image_url} alt='Clan header' style={{
                                                        width: '100%',
                                                        height: '200px',
                                                        objectFit: 'cover',
                                                        borderRadius: '10px',
                                                        marginBottom: '5px'
                                                    }} /> : <></>
                                            }
                                            <Grid container spacing={2}>
                                                <Grid item xs={12} md={4}>
                                                    <Card elevation={3}>
                                                        <CardContent>
                                                            <Typography variant='h6'><span style={{ color: `#${clanData.clan.color}` }}>[{clanData.clan.tag}]</span> {clanData.clan.name}</Typography>
                                                            <Typography variant='body1'>{clanData.clan.description}</Typography>
                                                            {
                                                                loggedInUser
                                                                    && loggedInUser.clan_member?.clan?.owner !== loggedInUser?.osu_id
                                                                    ? (
                                                                        loggedInUser.clan_member && loggedInUser.clan_member.clan.id === clanData.clan.id ? <>
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
                                                            <Box sx={{
                                                                display: 'flex'
                                                            }}>
                                                                <Typography variant='body1'>Owner:</Typography>
                                                                <Box sx={{ ml: 1 }}> {GetFormattedName(clanData.owner?.user?.inspector_user ?? {})} </Box>
                                                            </Box>
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
                                                </Grid>
                                                <Grid item xs={12} md={8}>
                                                    {
                                                        loggedInUser && loggedInUser.clan_member?.clan?.id === clanData.clan.id && loggedInUser.clan_member?.pending ? <>
                                                            <Alert severity='info' sx={{
                                                                mb: 1
                                                            }}>
                                                                Your join request is still pending.
                                                            </Alert>
                                                        </> : <></>
                                                    }
                                                    {
                                                        //if owner, show Edit button
                                                        loggedInUser && loggedInUser?.clan_member?.clan && loggedInUser?.clan_member?.clan?.id === clanData.clan.id
                                                            && clanData.clan.owner === loggedInUser?.osu_id
                                                            ?
                                                            <>
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
                                                    <Box sx={{ mt: 2 }}>
                                                        <Box display='flex' sx={{ mb: 1 }}>
                                                            <Typography variant='h6'>Members</Typography>
                                                            {/* dropdown for sorter */}
                                                            <FormControl sx={{
                                                                ml: 1
                                                            }}>
                                                                <Select
                                                                    variant='standard'
                                                                    size="small"
                                                                    value={currentClanSorter}
                                                                    onChange={(e) => setCurrentClanSorter(e.target.value)}
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
                                                                            const a_sorter = CLAN_STATS.find((stat) => stat.key === currentClanSorter).sort_value ? CLAN_STATS.find((stat) => stat.key === currentClanSorter).sort_value(a.user.extra) : a.user.extra[currentClanSorter];
                                                                            const b_sorter = CLAN_STATS.find((stat) => stat.key === currentClanSorter).sort_value ? CLAN_STATS.find((stat) => stat.key === currentClanSorter).sort_value(b.user.extra) : b.user.extra[currentClanSorter];
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
                                                                                            user={{
                                                                                                osu_user: _member,
                                                                                                username: _username,
                                                                                                rank: index + 1,
                                                                                                user_id: _user_id,
                                                                                            }}
                                                                                            values={[
                                                                                                {
                                                                                                    value: CLAN_STATS.find((stat) => stat.key === currentClanSorter).name, alignment: 'right', variant: 'body2',
                                                                                                    color: grey[500]
                                                                                                },
                                                                                                {
                                                                                                    value: CLAN_STATS.find((stat) => stat.key === currentClanSorter).format(member.user.extra), alignment: 'left', variant: 'body2'
                                                                                                }
                                                                                            ]}
                                                                                        />
                                                                                    </Box>
                                                                                    {
                                                                                        loggedInUser && loggedInUser?.clan_member?.clan && loggedInUser?.clan_member?.clan?.id === clanData.clan.id
                                                                                            && clanData.clan.owner === loggedInUser?.osu_id ?
                                                                                            <Box>
                                                                                                <Button
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
                                                                                                </Button>
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
                                                            clanData.clan.owner === loggedInUser?.osu_id ?
                                                                <>
                                                                    <Divider sx={{ mt: 1, mb: 1 }} />
                                                                    <Typography variant='h6'>Member requests</Typography>
                                                                    <Grid sx={{
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
                                                                                                        user={{
                                                                                                            osu_user: _member,
                                                                                                            username: _username,
                                                                                                            rank: index + 1,
                                                                                                            user_id: _user_id,
                                                                                                        }}
                                                                                                    />
                                                                                                </Box>
                                                                                                {
                                                                                                    loggedInUser && loggedInUser?.clan_member?.clan && loggedInUser?.clan_member?.clan?.id === clanData.clan.id
                                                                                                        && clanData.clan.owner === loggedInUser?.osu_id ?
                                                                                                        <Box>
                                                                                                            <Button
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
                                                                                                            </Button>
                                                                                                        </Box>
                                                                                                        : <></>
                                                                                                }
                                                                                            </Box>
                                                                                        )
                                                                                    }) :
                                                                                    <Typography variant='subtitle2' sx={{ fontStyle: 'italic', }}>No requests</Typography>
                                                                            }
                                                                        </Stack>
                                                                    </Grid>
                                                                </> : <></>
                                                        }
                                                    </Box >
                                                </Grid >
                                            </Grid >
                                            <Alert severity='info' sx={{ mt: 2 }}>
                                                <Typography variant='body1'>Members not registered on the osu!alternative Discord may be missing stats.</Typography>
                                            </Alert>
                                        </>
                                )
                        )
                        :
                        <>
                            <Box style={{
                                display: 'flex',
                            }}>
                                <Typography variant='h6'>Clans</Typography>
                                {
                                    loggedInUser && loggedInUser.clan_member?.clan && loggedInUser.clan_member?.clan ?
                                        <Button
                                            onClick={() => navigate(`/clan/${loggedInUser.clan_member.clan.id}`)}
                                            variant='contained' color='primary' sx={{
                                                marginLeft: 'auto',
                                            }}>Go to {loggedInUser.clan_member.clan.name}</Button> :
                                        (
                                            loggedInUser ? <Button
                                                onClick={() => setClanCreatorModalOpen(true)}
                                                variant='contained' color='primary' sx={{
                                                    marginLeft: 'auto',
                                                }}>Create a clan</Button> :
                                                <></>
                                        )
                                }
                            </Box>
                            <Box sx={{ mt: 2, display: 'flex' }}>
                                <Paper
                                    elevation={3}
                                    sx={{
                                        p: 1,
                                        mr: 2,
                                        width: '300px',
                                        //center vertically
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                    }}>
                                    <Box>
                                        <Typography variant='body'>Clans {totalClanStats.clan_amount}</Typography>
                                    </Box>
                                    <Box>
                                        <Typography variant='body'>Members {totalClanStats.member_amount}</Typography>
                                    </Box>
                                </Paper>
                                <Box sx={{
                                    display: 'flex',
                                    flexWrap: 'wrap',
                                }}>
                                    {
                                        CLAN_STATS.filter((stat) => stat.clanlist !== false).map((stat) => {
                                            return (
                                                <Button
                                                    onClick={() => setCurrentClanSorter(stat.key)}
                                                    variant={currentClanSorter === stat.key ? 'contained' : 'outlined'}
                                                    size='small'
                                                    sx={{ mr: 1, mb: 1 }}
                                                >
                                                    {stat.name}
                                                </Button>
                                            )
                                        })
                                    }
                                </Box>
                            </Box>
                            {
                                clanList.length > 0 ? <>
                                    <Box sx={{
                                        mt: 2,
                                        //max height of 80vh
                                        maxHeight: '80vh',
                                        overflowY: 'auto'
                                    }}>
                                        <Stack direction='column' spacing={0.6}>
                                            {
                                                //sort by current sorter
                                                clanList.sort((a, b) =>
                                                // b.clan_stats[currentClanSorter] - a.clan_stats[currentClanSorter]
                                                {
                                                    //check if theres a sort_value function, if not, use the value directly
                                                    const a_sorter = CLAN_STATS.find((stat) => stat.key === currentClanSorter).sort_value ? CLAN_STATS.find((stat) => stat.key === currentClanSorter).sort_value(a.clan_stats) : a.clan_stats[currentClanSorter];
                                                    const b_sorter = CLAN_STATS.find((stat) => stat.key === currentClanSorter).sort_value ? CLAN_STATS.find((stat) => stat.key === currentClanSorter).sort_value(b.clan_stats) : b.clan_stats[currentClanSorter];

                                                    return b_sorter - a_sorter;
                                                }
                                                ).map((clan, index) => {
                                                    return (
                                                        <ClanLeaderboardItem
                                                            index={index + 1}
                                                            clan={clan}
                                                            onClick={() => navigate(`/clan/${clan.id}`)}
                                                            values={
                                                                [
                                                                    //empty
                                                                    { value: '', alignment: 'left', variant: 'body2' },
                                                                    { value: '', alignment: 'left', variant: 'body2' },
                                                                    //select stat name from clan_stats entry
                                                                    {
                                                                        value: CLAN_STATS.find((stat) => stat.key === currentClanSorter).name, alignment: 'right', variant: 'body2',
                                                                        color: grey[500]
                                                                    },
                                                                    //select clan_stat entry from sorter, then use format function
                                                                    { value: CLAN_STATS.find((stat) => stat.key === currentClanSorter).format(clan.clan_stats), alignment: 'left', variant: 'body2' },
                                                                    { value: clan.disable_requests ? <LockIcon color='error' /> : <LockOpenIcon color='success' />, alignment: 'right', variant: 'body2', tooltip: clan.disable_requests ? 'Join requests disabled' : 'Join requests enabled' }
                                                                ]
                                                            }
                                                        />
                                                    )
                                                })
                                            }
                                        </Stack>
                                    </Box>
                                </> : <Typography variant='body1'>Clan list empty.</Typography>
                            }
                        </>
                }
            </Container >
        </>
    );
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
    const [clanColor, setClanColor] = useState(props.clan?.clan.color ?? 'ffffff');
    const [clanHeaderUrl, setClanHeaderUrl] = useState(props.clan?.clan.header_image_url ?? '');
    const [clanDisableRequests, setClanDisableRequests] = useState(props.clan?.clan.disable_requests ?? false);
    const [isEditMode] = useState(props.clan ? true : false);

    const [exampleUser, setExampleUser] = useState(null);

    const onUpdate = () => {
        let user = { ...props.user };
        user.clan_member = {};
        user.clan_member.clan = {
            tag: clanTag,
            color: clanColor,
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

            await props.onSubmit({
                // clanName,
                // clanTag,
                // clanDescription,
                // clanColor,
                // clanHeaderUrl,
                clanName: sanitize(clanName),
                clanTag: sanitize(clanTag),
                clanDescription: sanitize(clanDescription),
                clanColor: sanitize(clanColor),
                clanHeaderUrl: sanitize(clanHeaderUrl),
                clanDisableRequests,
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
                        <Box sx={{ mt: 2 }}>
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
                                    <TextField
                                        label='Clan color'
                                        variant='standard'
                                        value={clanColor}
                                        onChange={(e) => setClanColor(e.target.value)}
                                        disabled={isWorking}
                                        inputProps={{
                                            maxLength: 6,
                                        }}
                                    />
                                    {
                                        isEditMode ? <>
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