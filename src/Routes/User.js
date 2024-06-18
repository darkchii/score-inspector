import { Alert, Box, CircularProgress, Link, Stack, Typography } from '@mui/material';
import React from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import { useLocation, useParams } from 'react-router-dom/dist';
import { getUserScores, isUserRegistered } from '../Helpers/OsuAlt';
import { getFullUser } from '../Helpers/Osu';
import SectionHeader from '../Components/UserPage/SectionHeader';
import { processScores } from '../Helpers/ScoresProcessor';
import { Helmet } from 'react-helmet';
import UserDataContainer from '../Components/UserPage/UserDataContainer';
import config from '../config.json';
import { GetVisitors, UpdateVisitor } from '../Helpers/Account';
import { GetAPI, formatBytes, showNotification } from '../Helpers/Misc';
import axios from 'axios';

function User() {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [loadingState, setLoadingState] = useState('Test message');
    const [registered, setRegistered] = useState(false);
    const [errorMessage, setErrorMessage] = useState(null);
    const params = useParams();
    const location = useLocation();

    useEffect(() => {
        (async () => {
            setRegistered(false);
            setIsLoading(true);
            setUser(null);
            try {
                const urlParams = new URLSearchParams(location.search);
                let loved = urlParams.get('loved') ?? true;
                if (loved === 'true' || loved === '1' || loved === true || loved === 1 || loved === '') {
                    loved = true;
                } else {
                    loved = false;
                }
                const user_in = params.id;
                setLoadingState('Fetching user data');
                const user_out = await getFullUser(user_in);

                const onScoreDownloadProgress = (progress) => {
                    setLoadingState(`Fetching user scores (${formatBytes(progress.loaded)})`);
                };

                if (user_out === null || user_out.error !== undefined || user_out.inspector_user?.is_banned) {
                    setUser(null);
                    setIsLoading(false);
                    setErrorMessage("User not found");

                    if (user_out?.inspector_user?.is_banned) {
                        setErrorMessage("User is banned from scores inspector");
                    }
                    return;
                }

                const registered = await isUserRegistered(user_out.osu.id);
                setRegistered(registered);

                const score_rank_history = (await axios.get(`
                    ${GetAPI()}scores/ranking?user_id=${user_out.osu.id}
                `))?.data;

                user_out.score_rank_history = score_rank_history;

                setLoadingState('Fetching user scores');
                const _scores = await getUserScores(user_out.alt.user_id, loved === true, onScoreDownloadProgress);
                if (_scores === null || _scores.error !== undefined) {
                    setUser(null);
                    setIsLoading(false);
                    setErrorMessage("Unable to get scores");
                    return;
                }
                user_out.scores = _scores;

                const onScoreProcessUpdate = (progress) => {
                    setLoadingState(`Processing user scores (${progress})`);
                };

                const onCallbackError = (error) => {
                    console.error(error);
                };

                setLoadingState('Processing user scores');
                let _data;
                try {
                    _data = await processScores(user_out, user_out.scores, onCallbackError, onScoreProcessUpdate, loved === true);
                } catch (e) {
                    console.error(e);
                    setUser(null);
                    setIsLoading(false);
                    setErrorMessage("Unable to process scores");
                    return;
                }

                if (_data === null || _data === undefined) {
                    setUser(null);
                    setIsLoading(false);
                    setErrorMessage("Invalid result from score processor");
                    return;
                }

                user_out.data = _data;

                setLoadingState('Get milestones')
                try {
                    const milestones = (await axios.get(`${GetAPI()}scores/milestones/user/${user_out.osu.id}`))?.data;
                    user_out.milestones = milestones;
                } catch (e) {
                    //ignore
                    user_out.milestones = [];
                }

                setLoadingState('Server side stuff');

                if (!config.USE_DEV_API) {
                    const update_visitor = await UpdateVisitor(user_out.osu.id);
                    // if(update_visitor.error !== undefined) {
                    //     showNotification('Error', update_visitor.error, 'error');
                    // }
                }

                const visitors = await GetVisitors(user_out.osu.id);
                user_out.visitors = visitors;

                setUser(user_out);
                setIsLoading(false);
            } catch (e) {
                console.error(e);
                setUser(null);
                setIsLoading(false);
                setErrorMessage("Unable to get user data: " + e.message ?? "Unknown error");
            }
        })();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [params.id]);

    return (
        <>
            <Helmet>
                <title>No profile loaded - {config.APP_NAME}</title>
            </Helmet>
            {
                isLoading ? <>
                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
                        <Stack spacing={2} direction='column' alignItems='center'>
                            <CircularProgress />
                            <Typography variant='subtitle1' sx={{ ml: 2 }}>{loadingState}</Typography>
                        </Stack>
                    </Box>
                </> : user === null || !user ? <>
                    <Stack spacing={2} direction='column'>
                        <Typography variant='h4'>Whoops, couldn't show profile</Typography>
                        <Typography variant='subtitle1'>What went wrong: {errorMessage}</Typography>
                        {/* if errorMessage contains 'user_out.alt is undefined' */}
                        {
                            errorMessage?.includes('user_out.alt is undefined') ? <Alert severity='warning'>
                                You likely registered with the bot very recently or haven't yet. If not, do so.
                                Please wait for up to an hour to update your profile.
                                You can check using the !clears command until your user is visible.
                            </Alert>
                                : <></>
                        }
                        <Link sx={{ textDecoration: 'none' }} href={`https://osu.ppy.sh/users/${params.id}`} target='_blank'>
                            <Typography variant='title' sx={{ fontSize: '1em' }}>Try osu! profile ....</Typography>
                        </Link>
                        <Alert severity='info'>
                            Join <Link href='https://discord.gg/VZWRZZXcW4' target='_blank'>osu!alt discord</Link> and follow the guide there to get your scores available on scores inspector.
                        </Alert>
                    </Stack>

                </> : <>
                    {
                        user.inspector_user !== null && user.inspector_user !== undefined && user.inspector_user.background_image !== null ? <>
                            {
                                <Helmet>
                                    <style>
                                        {`
                                            body { 
                                            background-image: url('${user.inspector_user.background_image}'); 
                                            background-repeat: no-repeat;
                                            background-size: cover;
                                            background-position: center;
                                            background-attachment: fixed;
                                        }`}
                                    </style>
                                    <title>{user.osu.username} - {config.APP_NAME}</title>
                                </Helmet>
                            }
                        </> : <></>
                        // user.osu.id === 10153735 ? <>
                        //     <Helmet>
                        //     </Helmet>

                        // </> : <></>
                    }
                    <Stack spacing={0.5} direction='column'>
                        {
                            registered ? <></> : <Alert severity='warning'>
                                This user is not live tracked and the data is most likely inaccurate or even non-existent.
                                If you are this user, join <Link href='https://discord.gg/VZWRZZXcW4' target='_blank'>osu!alt discord</Link> and follow the guide there to get your scores available.
                            </Alert>
                        }
                        <SectionHeader user={user} />
                        <UserDataContainer user={user} />
                    </Stack>
                </>
            }
        </>
    );
}

export default User;