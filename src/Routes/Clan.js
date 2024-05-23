/* eslint-disable react-hooks/exhaustive-deps */
import { Helmet } from "react-helmet";
import config from "../config.json";
import { Alert, Box, Button, Card, CardContent, Container, Divider, Grid, Modal, Stack, Table, TableBody, TableCell, TableContainer, TableRow, TextField, Typography, tableCellClasses } from "@mui/material";
import { useState } from "react";
import { MODAL_STYLE, showNotification } from "../Helpers/Misc";
import { useEffect } from "react";
import { GetFormattedName, GetLoginID, GetLoginToken, GetUser } from "../Helpers/Account";
import { CreateClan, DeleteClan, GetClan, GetClanList, UpdateClan } from "../Helpers/Clan";
import { useNavigate, useParams } from "react-router-dom";
import Loader from "../Components/UI/Loader";
import PlayerCard from "../Components/PlayerCard";
import moment from "moment";
import ClanLeaderboardItem from "../Components/Leaderboards/ClanLeaderboardItem";
import { grey } from "@mui/material/colors";

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
        format: (stats) => (stats.ranked_score ?? 0).toLocaleString('en-US'),
        ranking: true,
    }, {
        name: 'Total score',
        format: (stats) => (stats.total_score ?? 0).toLocaleString('en-US'),
        ranking: true,
        key: 'total_score',
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
        key: 'total_ss',
    }, {
        name: 'Total S',
        format: (stats) => ((stats.total_s ?? 0) + (stats.total_sh ?? 0)).toLocaleString('en-US'),
        ranking: true,
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
        format: (stats) => (Math.round(moment.duration(stats.playtime ?? 0, 'seconds').asHours())) + ' hours',
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
    }
]

function Clan(props) {
    const [clanList, setClanList] = useState([]);
    const [clanCreatorModalOpen, setClanCreatorModalOpen] = useState(false);
    const [loggedInUser, setLoggedInUser] = useState(null);
    const [clanData, setClanData] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [clanRemoveModalOpen, setClanRemoveModalOpen] = useState(false);
    const [clanEditModalOpen, setClanEditModalOpen] = useState(false);
    const [currentClanSorter, setCurrentClanSorter] = useState('average_pp');
    const params = useParams();
    const navigate = useNavigate();

    const loadClan = (id) => {
        setClanData(null);
        setIsLoading(true);

        (async () => {
            try {
                const data = await GetClan(params.id);
                console.log(data);
                setClanData(data);
            } catch (err) {
                showNotification('Error', 'An error occurred while fetching the clan data.', 'error');
                showNotification('Error', err.message, 'error');
            }
            setIsLoading(false);
        })();
    }

    const loadClanList = () => {
        setIsLoading(true);
        setClanList([]);

        (async () => {
            try {
                const data = await GetClanList();

                //this is only ever used for sorting, so api doesnt do this
                //add member count to stats
                data.clans.forEach((clan) => {
                    clan.clan_stats.members = clan.clan_members.length;
                });
                let clans = data.clans;
                setClanList(clans ?? []);
            } catch (err) {
                showNotification('Error', 'An error occurred while fetching the clan list.', 'error');
                showNotification('Error', err.message, 'error');
            }
        })();

        setIsLoading(false);
    }

    useEffect(() => {
        if (params.id) {
            loadClan(params.id);
        }
    }, [params.id]);

    useEffect(() => {
        if (!params.id) {
            loadClanList();
        }
    }, []);

    useEffect(() => {
        (async () => {
            const _user = await GetLoginID();
            if (_user) {
                const __user = await GetUser(_user);
                setLoggedInUser(__user || null);
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
                                                        </CardContent>
                                                    </Card>
                                                    <Box sx={{ mt: 2 }} />
                                                    <Card elevation={3}>
                                                        <CardContent>
                                                            <Typography variant='h6'>Statistics</Typography>
                                                            <Typography variant='body1'>Members: {clanData.members.length}</Typography>
                                                            <Typography variant='body1'>Created: {moment(clanData.clan.creation_date).fromNow()}</Typography>
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
                                                                                return (
                                                                                    <TableRow key={stat.key}>
                                                                                        <TableCell>{stat.name}</TableCell>
                                                                                        <TableCell>{stat.format(clanData.stats)}</TableCell>
                                                                                        <TableCell>{stat.ranking ? `#${clanData.ranking[stat.key]}` : ''}</TableCell>
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
                                                        //if owner, show Edit button
                                                        loggedInUser && loggedInUser.clan_member.clan && loggedInUser.clan_member.clan.id === clanData.clan.id ?
                                                            <>
                                                                <Button
                                                                    variant='contained'
                                                                    color='primary'
                                                                    onClick={() => setClanEditModalOpen(true)}
                                                                >Edit</Button>
                                                                <Button
                                                                    sx={{ marginLeft: 1 }}
                                                                    variant='contained'
                                                                    color='error'
                                                                    onClick={() => setClanRemoveModalOpen(true)}
                                                                >Delete</Button>
                                                            </>
                                                            : <></>
                                                    }
                                                    <Box sx={{ mt: 2 }}>
                                                        <Typography variant='h6'>Owner</Typography>
                                                        <PlayerCard onClick={() => { navigate(`/user/${clanData.owner.osu_id}`); }} user={clanData.owner.user} />
                                                        <Divider sx={{ mt: 1, mb: 1 }} />
                                                        <Typography variant='h6'>Members</Typography>
                                                        {
                                                            //map clan members except owner
                                                            clanData.members.length > 1 ? clanData.members.filter((member) => member.user.osu_id !== clanData.owner.osu_id).map((member) => {
                                                                return (
                                                                    <Grid sx={{ height: '80px' }}>
                                                                        <PlayerCard onClick={() => { navigate(`/user/${member.osu_id}`); }} user={member.user} />
                                                                    </Grid>
                                                                )
                                                            }) :
                                                                <Typography variant='subtitle2' sx={{ fontStyle: 'italic', }}>No other members</Typography>
                                                        }
                                                    </Box>
                                                </Grid>
                                            </Grid>
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
                                        <Button
                                            onClick={() => setClanCreatorModalOpen(true)}
                                            variant='contained' color='primary' sx={{
                                                marginLeft: 'auto',
                                            }}>Create a clan</Button>
                                }
                            </Box>
                            <Box sx={{ mt: 2 }}>
                                {
                                    CLAN_STATS.map((stat) => {
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
                                                clanList.sort((a, b) => b.clan_stats[currentClanSorter] - a.clan_stats[currentClanSorter]).map((clan, index) => {
                                                    return (
                                                        <ClanLeaderboardItem
                                                            index={index + 1}
                                                            clan={clan}
                                                            onClick={() => navigate(`/clan/${clan.id}`)}
                                                            values={
                                                                [
                                                                    //empty
                                                                    { value: '', alignment: 'left', variant: 'body2' },
                                                                    //select stat name from clan_stats entry
                                                                    {
                                                                        value: CLAN_STATS.find((stat) => stat.key === currentClanSorter).name, alignment: 'right', variant: 'body2',
                                                                        color: grey[500]
                                                                    },
                                                                    //select clan_stat entry from sorter, then use format function
                                                                    { value: CLAN_STATS.find((stat) => stat.key === currentClanSorter).format(clan.clan_stats), alignment: 'left', variant: 'body2' },
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
            </Container>
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
    const [isEditMode] = useState(props.clan ? true : false);

    const [exampleUser, setExampleUser] = useState(null);

    const onUpdate = () => {
        let user = { ...props.user };
        user.clan = {
            tag: clanTag,
            color: clanColor,
        }
        setExampleUser(user);
    }

    useEffect(() => {
        onUpdate();
    }, [clanTag, clanColor]);

    useEffect(() => {
        console.log(props.clan);
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
                clanName,
                clanTag,
                clanDescription,
                clanColor,
                clanHeaderUrl,
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
                                    />
                                    <TextField
                                        label='Clan tag'
                                        variant='standard'
                                        value={clanTag}
                                        onChange={(e) => setClanTag(e.target.value)}
                                        disabled={isWorking}
                                    />
                                    <TextField
                                        label='Clan description'
                                        variant='standard'
                                        value={clanDescription}
                                        onChange={(e) => setClanDescription(e.target.value)}
                                        disabled={isWorking}
                                    />
                                    <TextField
                                        label='Clan color'
                                        variant='standard'
                                        value={clanColor}
                                        onChange={(e) => setClanColor(e.target.value)}
                                        disabled={isWorking}
                                    />
                                    {
                                        isEditMode ? <>
                                            <TextField
                                                label='Header  Image URL'
                                                variant='standard'
                                                value={clanHeaderUrl}
                                                onChange={(e) => setClanHeaderUrl(e.target.value)}
                                                disabled={isWorking}
                                            />
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