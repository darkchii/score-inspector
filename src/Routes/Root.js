import { Accordion, AccordionDetails, AccordionSummary, Alert, Box, Button, Card, CardContent, CircularProgress, Divider, Grid, Link, Modal, Stack, Table, TableBody, TableCell, tableCellClasses, TableContainer, TableHead, TableRow, tableRowClasses, Typography } from '@mui/material';
import { updates } from '../updates';
import { Link as RouterLink, useSearchParams } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import { GetAPI, MODAL_STYLE, parseReadableStreamToJson, showNotification } from '../Helpers/Misc';
import { GetFormattedName, GetTopVisited, LoginUser } from '../Helpers/Account';
import { toast, ToastContainer } from 'react-toastify';
import config from '../config.json';
import CircleIcon from '@mui/icons-material/Circle';
import axios from 'axios';
import moment from 'moment';
function Root() {
    const [isModalOpen, setIsModalOpen] = useState(true);
    const [osuAuthCode, setOsuAuthCode] = useState(null);
    const [searchParams, setSearchParams] = useSearchParams();
    const [loginStatus, setLoginStatus] = useState(null);
    const [serverStatus, setServerStatus] = useState(null);
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

        (async () => {
            const res = await axios.get(`${GetAPI()}system/status`);
            res.data !== null && res.data !== undefined ? setServerStatus({ ...res.data, inspector: true }) : setServerStatus({
                inspector: false
            });

            const most_visited = await GetTopVisited('count', 5);
            const last_visited = await GetTopVisited('last_visit', 5);

            if (most_visited && last_visited) {
                setVisitorStats({
                    most_visited: most_visited,
                    last_visited: last_visited
                });
            }
        })();
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
            <Grid container spacing={2}>
                <Grid item xs={12} md={8}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <Card elevation={2}>
                                <CardContent>
                                    <Typography variant='title'>What does it do</Typography>
                                    <Typography>This website takes the dump of all your scores, and generates statistics and graphs from it.</Typography>
                                    <Typography>All of your scores means every TOP score on a beatmap, so not plays that are overridden or set with different mods.</Typography>
                                    <Typography>Because of this, stats like periodic activity can be off due to missing scores, if they were overridden later in time.</Typography>
                                    <Typography variant='title'>Can I see other users</Typography>
                                    <Typography>Every user that has fetched their scores can be viewed here. The user in question has to fetch them themselves, others cannot do that.</Typography>
                                    <Typography variant='title'>Where can I recommend changes</Typography>
                                    <Typography>The following two places are fine:</Typography>
                                    <Typography>- The #feature-ideas channel in the <Link href='https://discord.gg/VZWRZZXcW4' target='_blank'>osu!alt discord</Link> (make sure to tag Amayakase#9198)</Typography>
                                    <Typography>- Opening an issue on the <Link href='https://github.com/darkchii/score-inspector' target='_blank'>GitHub</Link></Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                        <Grid item xs={12}>
                            <Grid container spacing={2}>
                                <Grid item xs={6}>
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
                                                            <TableCell>top50s dataset</TableCell>
                                                            <TableCell><Link href='https://github.com/respektive/osustats' target='_blank'>respektive</Link></TableCell>
                                                        </TableRow>
                                                        <TableRow>
                                                            <TableCell>score ranking</TableCell>
                                                            <TableCell><Link href='https://github.com/respektive/osustats' target='_blank'>respektive</Link></TableCell>
                                                        </TableRow>
                                                        <TableRow>
                                                            <TableCell>raw pp and rank data</TableCell>
                                                            <TableCell><Link href='https://osudaily.net/' target='_blank'>osu!daily</Link></TableCell>
                                                        </TableRow>
                                                    </TableBody>
                                                </Table>
                                            </TableContainer>
                                        </CardContent>
                                    </Card>
                                </Grid>
                                <Grid item xs={6}>
                                    <Card elevation={2}>
                                        <CardContent>
                                            <Typography variant='title'>Loved scores</Typography>
                                            <Typography>Loved scores are by default not included.</Typography>
                                            <Typography>To include them, add <code>?loved</code> at the end of the profile URL</Typography>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item xs={12} md={4}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <Card elevation={2}>
                                <CardContent>
                                    <Typography variant='title'>Most visited</Typography>
                                    <TableContainer>
                                        <Table size='small' sx={{ [`& .${tableCellClasses.root}`]: { borderBottom: "none" } }}>
                                            <TableBody>
                                                {
                                                    visitorStats && visitorStats.most_visited.map((v, i) => {
                                                        return (
                                                            <>
                                                                <TableRow>
                                                                    <TableCell>
                                                                        <RouterLink to={`user/${v.osu_id}`}>
                                                                            {GetFormattedName(v, `Last visit: ${moment(v.last_visit).fromNow()}`, true)}
                                                                        </RouterLink>
                                                                    </TableCell>
                                                                    <TableCell>
                                                                        {v.count.toLocaleString('en-US')}
                                                                    </TableCell>
                                                                </TableRow>
                                                            </>
                                                        )
                                                    })
                                                }
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                    <Divider style={{ margin: '10px 0' }} />
                                    <Typography variant='title'>Recent visited</Typography>
                                    <TableContainer>
                                        <Table size='small' sx={{ [`& .${tableCellClasses.root}`]: { borderBottom: "none" } }}>
                                            <TableBody>
                                                {
                                                    visitorStats && visitorStats.last_visited.map((v, i) => {
                                                        return (
                                                            <>
                                                                <TableRow>
                                                                    <TableCell>
                                                                        <RouterLink to={`user/${v.osu_id}`}>
                                                                            {GetFormattedName(v, `Last visit: ${moment(v.last_visit).fromNow()}`, true)}
                                                                        </RouterLink>
                                                                    </TableCell>
                                                                    <TableCell>
                                                                        {moment(v.last_visit).fromNow(true)}
                                                                    </TableCell>
                                                                </TableRow>
                                                            </>
                                                        )
                                                    })
                                                }
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                </CardContent>
                            </Card>
                        </Grid>
                        <Grid item xs={12}>
                            <Card elevation={2}>
                                <CardContent>
                                    <Typography variant='title'>For new users</Typography>
                                    <TableContainer>
                                        <Table size='small'>
                                            <TableBody>
                                                <TableRow><TableCell>Join the osu!alt discord</TableCell></TableRow>
                                                <TableRow><TableCell>Follow the guide to fetch your scores (#info channel)</TableCell></TableRow>
                                                <TableRow><TableCell>Wait a few hours. When done, you generally don't need to run it anymore</TableCell></TableRow>
                                                <TableRow><TableCell>Enter your username above and fetch</TableCell></TableRow>
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                </CardContent>
                            </Card>
                        </Grid>
                        <Grid item xs={12}>
                            <Card elevation={2}>
                                <CardContent>
                                    <Typography variant='title'>Server Status</Typography>
                                    <TableContainer>
                                        <Table size='small'>
                                            <TableBody>
                                                <TableRow><TableCell><CircleIcon sx={{ color: serverStatus?.inspector === undefined ? 'grey' : (serverStatus?.inspector ? 'green' : 'red') }} /></TableCell><TableCell>inspector api</TableCell><TableCell></TableCell></TableRow>
                                                <TableRow><TableCell><CircleIcon sx={{ color: serverStatus?.osuv2 === undefined ? 'grey' : (serverStatus?.osuv2 ? 'green' : 'red') }} /></TableCell><TableCell>osu!apiv2</TableCell><TableCell></TableCell></TableRow>
                                                <TableRow><TableCell><CircleIcon sx={{ color: serverStatus?.osualt === undefined ? 'grey' : (serverStatus?.osualt ? 'green' : 'red') }} /></TableCell><TableCell>osu! alternative</TableCell><TableCell></TableCell></TableRow>
                                                <TableRow><TableCell><CircleIcon sx={{ color: serverStatus?.osudaily === undefined ? 'grey' : (serverStatus?.osudaily ? 'green' : 'red') }} /></TableCell><TableCell>osu!daily</TableCell><TableCell></TableCell></TableRow>
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

export default Root;