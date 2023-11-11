import { Alert, Avatar, Box, Button, Card, CardContent, CircularProgress, Divider, Grid, Link, Modal, Paper, Skeleton, Stack, Table, TableBody, TableCell, TableContainer, TableRow, Typography } from '@mui/material';
import { Link as RouterLink, useSearchParams } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import { formatBytes, formatNumberAsSize, GetAPI, MODAL_STYLE, parseReadableStreamToJson, showNotification } from '../Helpers/Misc';
import { GetFormattedName, GetTopVisited, LoginUser } from '../Helpers/Account';
import axios from 'axios';
import moment from 'moment';
import momentDurationFormatSetup from "moment-duration-format";
import ScoreSubmissions from '../Components/ScoreSubmissions';
import { blue, green, grey, red } from '@mui/material/colors';
import GlowBar from '../Components/UI/GlowBar';
import Loader from '../Components/UI/Loader';
import config from "../config.json";
import { useTheme } from '@emotion/react';
import { Helmet } from 'react-helmet';
import info from '../Data/Info';
import PersonIcon from '@mui/icons-material/Person';
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium';
import BadgeIcon from '@mui/icons-material/Badge';

momentDurationFormatSetup(moment);

const IMPORTANT_NOTES = [
    'Only plays with highest score on a beatmap are counted, not highest PP',
    'Only scores that osu!alt has are available, join the Discord',
    'You can\'t add missing users, they have to add themselves',
    'For feature requests etc. join the Discord',
];

const GUIDE_NEW_USERS = [
    'Join the osu!alt discord',
    'Follow the guide to fetch your scores (#info channel)',
    'Wait a few hours. When done, you generally don\'t need to run it anymore',
    'Enter your username above and fetch'
];

function Root() {
    const theme = useTheme();
    const [isModalOpen, setIsModalOpen] = useState(true);
    const [osuAuthCode, setOsuAuthCode] = useState(null);
    const [searchParams] = useSearchParams();
    const [serverStatus, setServerStatus] = useState(null);
    const [serverInfo, setServerInfo] = useState(null);
    const [visitorStats, setVisitorStats] = useState(null);

    useEffect(() => {
        const _osuAuthCode = searchParams.get("code");

        if (_osuAuthCode !== null) {
            setOsuAuthCode(_osuAuthCode);

            (async () => {
                const res = await LoginUser(_osuAuthCode);
                const body = await parseReadableStreamToJson(res.body);
                if (body !== null && body !== undefined) {
                    const user_id = body.user_id;
                    const username = body.username;
                    const token = body.token;

                    if (user_id !== null && username !== null && token !== null && user_id !== undefined && username !== undefined && token !== undefined) {
                        localStorage.setItem('auth_osu_id', user_id);
                        localStorage.setItem('auth_username', username);
                        localStorage.setItem('auth_token', token);
                        const redirect = window.location.href.split('?')[0];
                        window.location.href = redirect;
                        // window.location.reload()
                        // window.dispatchEvent(new Event('auth_token'));
                        //showNotification('Logged in', `Welcome, ${username}`, 'success');
                    } else {
                        setIsModalOpen(false);
                        showNotification('Error', 'Something went wrong while logging in. Please try again.', 'error');
                    }
                } else {
                    setIsModalOpen(false);
                    showNotification('Error', 'Something went wrong while logging in. Please try again.', 'error');
                }
            })();
        }

        try {
            Promise.all([
                GetTopVisited('count', 5),
                GetTopVisited('last_visit', 5)
            ]).then(([most_visited, last_visited]) => {
                setVisitorStats({
                    most_visited: most_visited,
                    last_visited: last_visited
                });
            }).catch((err) => {
                console.log(err);
            });
        } catch (_err) {
            console.log(_err);
        }

        try {
            Promise.all([
                axios.get(`${GetAPI()}system`),
                axios.get(`${GetAPI()}system/status`)
            ]).then(([system, status]) => {
                system.data !== null && system.data !== undefined ? setServerInfo({ ...system.data }) : setServerInfo(null);
                status.data !== null && status.data !== undefined ? setServerStatus({ ...status.data, inspector: true }) : setServerStatus({
                    inspector: false
                });
            }).catch((err) => {
                setServerStatus({
                    inspector: false
                });
                console.log(err);
            });
        } catch (_err) {
            console.log(_err);
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (serverStatus === null)
            return;
        if (!serverStatus.inspector) {
            showNotification('Server down', 'The inspector server is currently down, please try again later.', 'error');
        } else {
            if (!serverStatus.osuv2) {
                showNotification('Server down', 'The osu!api v2 server is currently down, please try again later.', 'error');
            }

            if (!serverStatus.osualt) {
                showNotification('Server down', 'The osu!alternative server is currently down, please try again later.', 'error');
            }
        }
    }, [serverStatus]);

    return (
        <>
            <Helmet>
                <title>{config.APP_NAME}</title>
            </Helmet>
            {
                osuAuthCode !== null ?
                    <>
                        <Modal open={isModalOpen}>
                            <Card sx={MODAL_STYLE}>
                                <CardContent>
                                    <Stack spacing={2} sx={{ width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                        <Typography variant="h6" sx={{ color: 'white' }}>Logging in...</Typography>
                                        <CircularProgress />
                                    </Stack>
                                </CardContent>
                            </Card>
                        </Modal>
                    </> : <></>
            }
            <Box sx={{ mb: 1 }}>
                <Alert severity='info'>
                    <Typography>Join the osu!alternative Discord!</Typography>
                    <Button size='small' variant='contained' component='a' href='https://discord.gg/VZWRZZXcW4' target='_blank'>Join</Button>
                </Alert>
            </Box>
            <Grid container spacing={2} sx={{ pb: 1 }}>
                <Grid item xs={12} md={4}>
                    <StatCard stats={serverInfo?.database?.alt?.total_users ? (parseInt(serverInfo?.database?.alt?.total_users ?? 0)).toLocaleString('en-US') : null} title={`Players (${(parseInt(serverInfo?.database?.alt?.tracked_users ?? 0)).toLocaleString('en-US')} live)`} color={blue} icon={<PersonIcon />} />
                </Grid>
                <Grid item xs={12} md={4}>
                    <StatCard stats={serverInfo?.database?.alt?.total_scores ? formatNumberAsSize(parseInt(serverInfo?.database?.alt?.total_scores ?? 0)) : null} title={'Scores'} color={red} icon={<WorkspacePremiumIcon />} />
                </Grid>
                <Grid item xs={12} md={4}>
                    <StatCard stats={serverInfo?.database?.inspector?.total_visits ? (parseInt(serverInfo?.database?.inspector?.total_visits ?? 0)).toLocaleString('en-US') : null} title={'Profile visits'} color={green} icon={<BadgeIcon />} />
                </Grid>
            </Grid>
            <Grid container spacing={2}>
                <Grid item xs={12} md={9}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <Card elevation={2}>
                                <CardContent>
                                    <Grid container spacing={2}>
                                        <Grid item xs={12} md={6}>
                                            <Typography variant='title'>Info</Typography>
                                            <Stack spacing={0.5}>
                                                {
                                                    IMPORTANT_NOTES.map((note, index) => {
                                                        return (
                                                            <Alert icon={false} severity='info'>
                                                                <Typography>{note}</Typography>
                                                            </Alert>
                                                        );
                                                    })
                                                }
                                            </Stack>
                                        </Grid>
                                        <Grid item xs={12} md={6}>
                                            <Typography variant='title'>For new users</Typography>
                                            <Stack spacing={0.5}>
                                                {
                                                    GUIDE_NEW_USERS.map((note, index) => {
                                                        return (
                                                            <Alert icon={false} severity='info'>
                                                                <Typography>{note}</Typography>
                                                            </Alert>
                                                        );
                                                    })
                                                }
                                            </Stack>
                                        </Grid>
                                    </Grid>
                                </CardContent>
                            </Card>
                        </Grid>
                        <Grid item xs={12}>
                            <Grid container spacing={2}>
                                <Grid item xs={12}>
                                    <Card elevation={2}>
                                        <CardContent>
                                            <Typography variant='title'>Score submissions</Typography>
                                            <ScoreSubmissions />
                                        </CardContent>
                                    </Card>
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid item xs={12}>
                            <Card elevation={2}>
                                <CardContent>
                                    <Typography variant='title'>FAQ</Typography>
                                    <Grid container spacing={2}>
                                        {
                                            info.map((v, i) => {
                                                return (
                                                    <Grid item xs={12} md={6}>
                                                        <Typography variant='title' sx={{ fontSize: '18px' }}>{v.question}</Typography>
                                                        <Typography variant='body2'>{v.answer}</Typography>
                                                    </Grid>
                                                )
                                            })
                                        }
                                    </Grid>
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item xs={12} md={3}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <Card elevation={2}>
                                <CardContent>
                                    <Typography variant='title'>Most visited</Typography>
                                    <Stack spacing={1} sx={{ pl: 1 }}>
                                        {
                                            visitorStats ? visitorStats.most_visited?.map((v, i) => {
                                                return (
                                                    <>
                                                        <Grid container>
                                                            <Grid item xs={8}>
                                                                <Box sx={{ position: 'relative' }}>
                                                                    <GlowBar />
                                                                    <RouterLink to={`user/${v.target_user.osu_id}`}>
                                                                        {GetFormattedName(v.target_user, {
                                                                            custom_tooltip: `Last visit: ${moment(v.last_visit).fromNow()}`,
                                                                            is_link: true
                                                                        })}
                                                                    </RouterLink>
                                                                </Box>
                                                            </Grid>
                                                            <Grid item xs={4}>
                                                                <Typography variant='body2' align='right'>{v.count.toLocaleString('en-US')}</Typography>
                                                            </Grid>
                                                        </Grid>
                                                    </>
                                                )
                                            }) : <Loader />
                                        }
                                    </Stack>
                                    <Divider style={{ margin: '10px 0' }} />
                                    <Typography variant='title'>Recent visited</Typography>
                                    <Stack spacing={1} sx={{ pl: 1 }}>
                                        {
                                            visitorStats ? visitorStats.last_visited?.map((v, i) => {
                                                return (
                                                    <>
                                                        <Grid container>
                                                            <Grid item xs={8}>
                                                                <Box sx={{ position: 'relative' }}>
                                                                    <GlowBar />
                                                                    <RouterLink to={`user/${v.target_user.osu_id}`}>
                                                                        {GetFormattedName(v.target_user, {
                                                                            custom_tooltip: `Last visit: ${moment(v.last_visit).fromNow()}`,
                                                                            is_link: true
                                                                        })}
                                                                    </RouterLink>
                                                                </Box>
                                                            </Grid>
                                                            <Grid item xs={4}>
                                                                <Typography variant='body2' align='right'>{moment(v.last_visit).fromNow()}</Typography>
                                                            </Grid>
                                                        </Grid>
                                                    </>
                                                )
                                            }) : <Loader />
                                        }
                                    </Stack>
                                </CardContent>
                            </Card>
                        </Grid>
                        <Grid item xs={12}>
                            <Box>
                                <iframe
                                    title='osu!alternative discord'
                                    src={`https://ptb.discord.com/widget?id=${config.DISCORD_SERVER_ID}&theme=dark`}
                                    width="100%"
                                    height="400"
                                    allowtransparency="true"
                                    frameborder="0"
                                    sandbox="allow-popups allow-popups-to-escape-sandbox allow-same-origin allow-scripts"></iframe>
                            </Box>
                        </Grid>
                        <Grid item xs={12}>
                            <Box>
                                <a href="https://www.buymeacoffee.com/kirino" target='_blank' rel='noreferrer'>
                                    <img
                                        alt='Buy me a billion score'
                                        width='100%'
                                        src={`https://img.buymeacoffee.com/button-api/?text=Buy me a billion score&emoji=🍕&slug=kirino&button_colour=${theme.palette.background.paper.substring(1)}&font_colour=ffffff&font_family=Lato&outline_colour=000000&coffee_colour=FFDD00`} />
                                </a>
                            </Box>
                        </Grid>
                        <Grid item xs={12}>
                            <Card elevation={2}>
                                <CardContent>
                                    <Typography variant='title'>Credits</Typography>
                                    <TableContainer>
                                        <Table size='small'>
                                            <TableBody>
                                                <TableRow>
                                                    <TableCell>scores dataset</TableCell>
                                                    <TableCell><Link href='https://discord.gg/VZWRZZXcW4' target='_blank'>osu!alternative</Link></TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell>score ranking</TableCell>
                                                    <TableCell><Link href='https://github.com/respektive/osustats' target='_blank'>respektive</Link></TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell>historical data</TableCell>
                                                    <TableCell><Link href='https://osudaily.net/' target='_blank'>osu!daily</Link></TableCell>
                                                </TableRow>
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </>
    );
}

function StatCard(props) {
    const theme = useTheme();

    return <>
        <Paper sx={{
            backgroundColor: props.color[600],
            overflow: 'hidden',
            position: 'relative',
            height: props.height ?? 130
        }}>
            {
                props?.stats === null || props?.stats === undefined ?
                    <Skeleton
                        variant="rectangular"
                        animation="wave"
                        sx={{
                            position: 'absolute',
                            width: '100%',
                            height: '100%',
                            zIndex: 300,
                            backgroundColor: grey[800],
                            opacity: 0.5
                        }} /> : <></>
            }
            <Box sx={{ p: 1.5, zIndex: 300 }}>
                <Box sx={{
                    position: 'absolute',
                    width: '100%',
                    height: '100%',
                    zIndex: 200,
                    '&:after': {
                        content: '""',
                        position: 'absolute',
                        width: 0,
                        height: 0,
                        borderLeft: '100px solid transparent',
                        borderRight: '100px solid transparent',
                        borderBottom: '173.2px solid white', // You can adjust the color and size here
                        top: -85,
                        right: -95,
                        opacity: 0.1
                    },
                    '&:before': {
                        content: '""',
                        position: 'absolute',
                        width: 0,
                        height: 0,
                        borderLeft: '100px solid transparent',
                        borderRight: '100px solid transparent',
                        borderBottom: '173.2px solid white', // You can adjust the color and size here
                        top: -125,
                        right: -15,
                        opacity: 0.1,
                    }
                }} />
                <Grid container direction="column" sx={{ position: 'relative', zIndex: 500 }}>
                    <Grid item>
                        <Grid container direction="row" alignItems="center" spacing={1}>
                            <Grid item>
                                <Avatar variant="rounded" sx={{ color: props.color[300], backgroundColor: 'white' }}>
                                    {props.icon}
                                </Avatar>
                            </Grid>
                            <Grid item>
                                <Typography sx={{ fontSize: props.statSize ?? '2.125rem', fontWeight: 500, mt: 1.75, mb: 0.75 }}>
                                    {props?.stats ?? '-'}
                                </Typography>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item sx={{ mb: 1.25 }}>
                        <Typography
                            sx={{
                                fontSize: props.titleSize ?? '1rem',
                                fontWeight: 500,
                                color: theme.palette.secondary[200]
                            }}
                        >
                            {props.title}
                        </Typography>
                    </Grid>
                </Grid>
            </Box>
        </Paper>
    </>
}

export default Root;