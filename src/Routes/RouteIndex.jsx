import { Alert, Box, Button, Card, CardActionArea, CardContent, CircularProgress, Divider, Grid2, Link, Modal, Paper, Stack, Table, TableBody, TableCell, TableContainer, TableRow, Typography } from '@mui/material';
import { Link as RouterLink, useSearchParams } from 'react-router';
import { useEffect, useState } from 'react';
import { formatNumberAsSize, GetAPI, MODAL_STYLE, parseReadableStreamToJson, showNotification } from '../Helpers/Misc';
import { GetFormattedName, GetLoginIDUnsafe, GetTopVisited, LoginUser } from '../Helpers/Account';
import axios from 'axios';
import moment from 'moment';
import momentDurationFormatSetup from "moment-duration-format";
import ScoreSubmissions from '../Components/ScoreSubmissions';
import { blue, blueGrey, green, pink, red } from '@mui/material/colors';
import GlowBar from '../Components/UI/GlowBar';
import Loader from '../Components/UI/Loader';
import config from "../config.json";
import info from '../Data/Info';
import PersonIcon from '@mui/icons-material/Person';
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium';
import BadgeIcon from '@mui/icons-material/Badge';
import TodayTopPlayers from '../Components/TodayTopPlayers';
import BetterAlert from '../Components/UI/BetterAlert';
import Error from '../Components/UI/Error';
import StatCard from '../Components/UI/StatCard';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';

momentDurationFormatSetup(moment);

const GUIDE_NEW_USERS = [
    'Join the osu!alternative discord',
    'Follow the guide to fetch your scores (go to #info channel, please read it)',
    'Wait for a couple hours. When done, you generally don\'t need to run it anymore, the live tracker takes over',
];

function RouteIndex() {
    const [isModalOpen, setIsModalOpen] = useState(true);
    const [osuAuthCode, setOsuAuthCode] = useState(null);
    const [searchParams] = useSearchParams();
    const [serverInfo, setServerInfo] = useState(null);
    const [todayData, setTodayData] = useState(null);
    const [visitorStats, setVisitorStats] = useState(null);
    const [isHoveringHelpButton, setIsHoveringHelpButton] = useState(false);

    useEffect(() => {
        window.onTitleChange(null);

        const _osuAuthCode = searchParams.get("code");

        (async () => {
            if (_osuAuthCode !== null) {
                setOsuAuthCode(_osuAuthCode);

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
                    console.error(err);
                });
            } catch (_err) {
                console.error(_err);
            }

            try {
                Promise.all([
                    axios.get(`${GetAPI()}system`),
                    axios.get(`${GetAPI()}scores/today?user_id=${GetLoginIDUnsafe()}`)
                ]).then(([system, today_data]) => {
                    system.data !== null && system.data !== undefined ? setServerInfo({ ...system.data }) : setServerInfo(null);
                    today_data.data !== null && today_data.data !== undefined ? setTodayData({ ...today_data.data }) : setTodayData({ error: true });
                }).catch((err) => {
                    setTodayData({ error: true });
                    console.error(err);
                });
            } catch (_err) {
                console.error(_err);
            }
        })();

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <>
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
            <Grid2 sx={{ pb: 1 }}>
                <Alert severity="warning">
                    Clans are archived now. Head to the clans page for more info.
                </Alert>
            </Grid2>
            <Grid2 sx={{ pb: 1 }}>
                <Alert severity="info">
                    Use this <Link href='https://github.com/darkchii/score-inspector-extension' target='_blank'>browser extension</Link> to integrate extra statistics into the official osu! website
                </Alert>
            </Grid2>
            <Grid2 container spacing={2}>
                <Grid2 size={{ xs: 12, md: 9 }}>
                    <Stack spacing={2}>
                        <Grid2>
                            <Card elevation={2}>
                                <CardContent>
                                    <Grid2 container spacing={1}>
                                        <Grid2 size={{ xs: 12, md: 5 }}>
                                            <div>
                                                <Grid2 container spacing={1}>
                                                    <Grid2 size={{ xs: 12, md: 12 / 2 }}>
                                                        <StatCard stats={serverInfo?.database?.alt?.user_count ? (parseInt(serverInfo?.database?.alt?.user_count ?? 0)).toLocaleString('en-US') : null} title={`Players (${(parseInt(serverInfo?.database?.alt?.priority_user_count ?? 0)).toLocaleString('en-US')} live)`} color={blue} icon={<PersonIcon />} />
                                                    </Grid2>
                                                    <Grid2 size={{ xs: 12, md: 12 / 2 }}>
                                                        <StatCard stats={serverInfo?.database?.alt?.score_count ? formatNumberAsSize(parseInt(serverInfo?.database?.alt?.score_count ?? 0)) : null} title={`Scores (${formatNumberAsSize(parseInt(serverInfo?.database?.alt?.lazerified_score_count ?? 0))} lazerified)`} color={red} icon={<WorkspacePremiumIcon />} />
                                                    </Grid2>
                                                    <Grid2 size={{ xs: 12, md: 12 / 2 }}>
                                                        <StatCard stats={serverInfo?.database?.inspector?.total_visits ? (parseInt(serverInfo?.database?.inspector?.total_visits ?? 0)).toLocaleString('en-US') : null} title={'Profile visits'} color={green} icon={<BadgeIcon />} />
                                                    </Grid2>
                                                    <Grid2 size={{ xs: 12, md: 12 / 2 }}>
                                                        <StatCard stats={serverInfo?.database?.inspector?.unique_visits ? (parseInt(serverInfo?.database?.inspector?.unique_visits ?? 0)).toLocaleString('en-US') : null} title={'Unique users visited'} color={blueGrey} icon={<BadgeIcon />} />
                                                    </Grid2>
                                                    <Grid2 size={12}>
                                                        <Alert severity='info'>
                                                            <Typography variant='body2'>Join the <Link href='https://discord.gg/VZWRZZXcW4' target='_blank'>osu!alternative discord</Link>!</Typography>
                                                        </Alert>
                                                    </Grid2>
                                                </Grid2>
                                            </div>
                                        </Grid2>
                                        <Grid2 size={{ xs: 12, md: 7 }}>
                                            <Paper sx={{
                                                width: '100%',
                                                height: '100%',
                                                position: 'relative',
                                                backgroundColor: `${pink[700]}`,
                                            }}>
                                                <Box sx={{
                                                    position: 'absolute',
                                                    top: 0,
                                                    left: 0,
                                                    right: 0,
                                                    bottom: 0,
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                }}>
                                                    {/* HelpOutlineIcon */}
                                                    <HelpOutlineIcon
                                                        sx={{
                                                            color: 'rgba(0, 0, 0, 0.1)',
                                                            //fontSize fit the box
                                                            fontSize: '10vw',
                                                        }}
                                                    />
                                                </Box>
                                                <Card sx={{
                                                    backgroundColor: `rgba(0, 0, 0, 0.7)`,
                                                    width: '100%',
                                                    height: '100%',
                                                    display: 'flex',
                                                }}>
                                                    <CardActionArea
                                                        component={RouterLink}
                                                        sx={{ flexGrow: 1 }}
                                                        onMouseEnter={() => setIsHoveringHelpButton(true)}
                                                        onMouseLeave={() => setIsHoveringHelpButton(false)}
                                                    >
                                                        <CardContent sx={{
                                                            flexGrow: 1,
                                                            display: 'flex',
                                                            //center vertically
                                                            alignItems: 'center',
                                                            height: '100%',
                                                        }}>
                                                            <Typography variant='h5' sx={{ color: 'white' }}>How to import stats</Typography>
                                                            {/* a dropdown Paper when helpbutton is hovered (show below the card, but overlaps anything underneath) */}
                                                            <Paper
                                                                sx={{
                                                                    position: 'absolute',
                                                                    bottom: isHoveringHelpButton ? 0 : -50,
                                                                    left: 0,
                                                                    right: 0,
                                                                    height: 'auto',
                                                                    zIndex: 1,
                                                                    // display: isHoveringHelpButton ? 'block' : 'none',
                                                                    opacity: isHoveringHelpButton ? 1 : 0,
                                                                    transition: 'all 0.3s',
                                                                }}>
                                                                <Stack spacing={0.2}>
                                                                    {
                                                                        GUIDE_NEW_USERS.map((note, index) => {
                                                                            return (
                                                                                <BetterAlert key={index} sx={{
                                                                                    padding: '2px'
                                                                                }} severity='primary'>
                                                                                    <Typography variant='body2'>{note}</Typography>
                                                                                </BetterAlert>
                                                                            );
                                                                        })
                                                                    }
                                                                </Stack>
                                                            </Paper>
                                                        </CardContent>
                                                    </CardActionArea>
                                                </Card>
                                            </Paper>
                                        </Grid2>
                                    </Grid2>
                                </CardContent>
                            </Card>
                        </Grid2>
                        <Grid2>
                            <div>
                                <Card elevation={2}>
                                    <CardContent>
                                        <Typography variant='title'>Top players today</Typography>
                                        <TodayTopPlayers data={todayData} />
                                    </CardContent>
                                </Card>
                            </div>
                        </Grid2>
                        <Grid2>
                            <div>
                                <Grid2 container spacing={2}>
                                    <Grid2 size={12}>
                                        <Card elevation={2}>
                                            <CardContent>
                                                <Typography variant='title'>Score submissions</Typography>
                                                <ScoreSubmissions />
                                            </CardContent>
                                        </Card>
                                    </Grid2>
                                </Grid2>
                            </div>
                        </Grid2>
                        <Grid2>
                            <Card elevation={2}>
                                <CardContent>
                                    <Typography variant='title'>FAQ</Typography>
                                    <Grid2 container spacing={2}>
                                        {
                                            info.map((v, i) => {
                                                return (
                                                    <Grid2 key={i} size={{ xs: 12, md: 6 }}>
                                                        <Typography variant='title' sx={{ fontSize: '18px' }}>{v.question}</Typography>
                                                        <Typography variant='body2'>{v.answer}</Typography>
                                                    </Grid2>
                                                )
                                            })
                                        }
                                    </Grid2>
                                </CardContent>
                            </Card>
                        </Grid2>
                    </Stack>
                </Grid2>
                <Grid2 size={{ xs: 12, md: 3 }}>
                    <Stack spacing={2}>
                        <Grid2>
                            <Card elevation={2}>
                                <CardContent>
                                    <Typography variant='title'>Most visited</Typography>
                                    <Stack spacing={0.5} sx={{ pl: 1 }}>
                                        {
                                            visitorStats ? (visitorStats.most_visited?.error ? <Error /> : visitorStats.most_visited?.map((v) => {
                                                return (
                                                    <>
                                                        <Grid2 container>
                                                            <Grid2 size={8}>
                                                                <Box sx={{ position: 'relative' }}>
                                                                    <GlowBar />
                                                                    <RouterLink to={`user/${v.target_user.osu_id}`}>
                                                                        {GetFormattedName(v.target_user, {
                                                                            custom_tooltip: `Last visit: ${moment(v.last_visit).fromNow()}`,
                                                                            is_link: true
                                                                        })}
                                                                    </RouterLink>
                                                                </Box>
                                                            </Grid2>
                                                            <Grid2 size={4}>
                                                                <Typography variant='body2' align='right'>{v.count.toLocaleString('en-US')}</Typography>
                                                            </Grid2>
                                                        </Grid2>
                                                    </>
                                                )
                                            })) : <Loader />
                                        }
                                    </Stack>
                                    <Divider style={{ margin: '10px 0' }} />
                                    <Typography variant='title'>Recent visited</Typography>
                                    <Stack spacing={0.5} sx={{ pl: 1 }}>
                                        {
                                            visitorStats ? (visitorStats.last_visited?.error ? <Error /> : visitorStats.last_visited?.map((v) => {
                                                return (
                                                    <>
                                                        <Grid2 container>
                                                            <Grid2 size={8}>
                                                                <Box sx={{ position: 'relative' }}>
                                                                    <GlowBar />
                                                                    <RouterLink to={`user/${v.target_user.osu_id}`}>
                                                                        {GetFormattedName(v.target_user, {
                                                                            custom_tooltip: `Last visit: ${moment(v.last_visit).fromNow()}`,
                                                                            is_link: true
                                                                        })}
                                                                    </RouterLink>
                                                                </Box>
                                                            </Grid2>
                                                            <Grid2 size={4}>
                                                                <Typography variant='body2' align='right'>{moment(v.last_visit).fromNow()}</Typography>
                                                            </Grid2>
                                                        </Grid2>
                                                    </>
                                                )
                                            })) : <Loader />
                                        }
                                    </Stack>
                                </CardContent>
                            </Card>
                        </Grid2>
                        <Grid2>
                            <Card elevation={2}>
                                <CardContent>
                                    {/* paypal dono link */}
                                    <Button
                                        component='a'
                                        href={config.PAYPAL_URL}
                                        target='_blank'
                                        variant='contained'
                                        fullWidth>Donate</Button>
                                    <Typography variant='body2' align='center'>Donations help keep the site running</Typography>
                                    <Typography variant='body2' align='center'>Add your username to the notes to get a Donator role on the site.</Typography>
                                </CardContent>
                            </Card>
                        </Grid2>
                        <Grid2>
                            <Box>
                                <iframe
                                    title='osu!alternative discord'
                                    src={`https://ptb.discord.com/widget?id=${config.DISCORD_SERVER_ID}&theme=dark`}
                                    width="100%"
                                    height="400"
                                    style={{
                                        border: 'none'
                                    }}
                                    sandbox="allow-popups allow-popups-to-escape-sandbox allow-same-origin allow-scripts"></iframe>
                            </Box>
                        </Grid2>
                        <Grid2>
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
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                </CardContent>
                            </Card>
                        </Grid2>
                    </Stack>
                </Grid2>
            </Grid2 >
        </>
    );
}

export default RouteIndex;