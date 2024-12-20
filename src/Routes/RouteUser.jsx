import { Alert, Box, CircularProgress, Link, Stack, Typography } from '@mui/material';
import { useEffect } from 'react';
import { useState } from 'react';
import { getUserScores, isUserRegistered } from '../Helpers/OsuAlt';
import { CalculateNewXP, getFullUser } from '../Helpers/Osu';
import SectionHeader from '../Components/UserPage/SectionHeader';
import { processScores } from '../Helpers/ScoresProcessor';
import { Helmet } from 'react-helmet';
import UserDataContainer from '../Components/UserPage/UserDataContainer';
import config from '../config.json';
import { GetLoginID, GetVisitors, IsUserLoggedIn, UpdateVisitor } from '../Helpers/Account';
import { GetAPI, formatBytes } from '../Helpers/Misc';
import axios from 'axios';
import { useLocation, useParams } from 'react-router';

function RouteUser() {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [loadingState, setLoadingState] = useState('Test message');
    const [registered, setRegistered] = useState(false);
    const [errorMessage, setErrorMessage] = useState(null);
    const [extraErrorMessages, setExtraErrorMessages] = useState(null);
    const params = useParams();
    const location = useLocation();

    useEffect(() => {
        (async () => {
            setRegistered(false);
            setIsLoading(true);
            setUser(null);
            window.onTitleChange('No profile loaded');
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
                console.log(user_out);

                if (user_out === null || user_out.error !== undefined) {
                    setUser(null);
                    setIsLoading(false);
                    setErrorMessage("There was an error fetching user data. Please try again later.");
                    return;
                }

                if (!user_out.alt || !user_out.alt.username) {
                    setUser(null);
                    setIsLoading(false);
                    setErrorMessage("User is probably not in the osu!alt database.");
                    setExtraErrorMessages("If you are this user, please join the osu!alt discord and read #info channel.");
                    return;
                }

                if (!user_out.osu) {
                    setUser(null);
                    setIsLoading(false);
                    setErrorMessage("User is probably restricted from osu! or the osu! api is having issues.");
                    return;
                }

                if (user_out.inspector_user?.is_private) {
                    let skip = false;
                    if (await IsUserLoggedIn()) {
                        if(((await GetLoginID()).toString() === user_out.inspector_user.osu_id.toString())) {
                            skip = true;
                        }
                    }
                    if(!skip){
                        setUser(null);
                        setIsLoading(false);
                        setErrorMessage("User has set their profile to private.");
                        return;
                    }
                }

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

                setLoadingState('Fetching user scores (this can take a while)');
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
                    console.warn(e);
                    //ignore
                    user_out.milestones = [];
                }

                setLoadingState('Calculate XP');
                try{
                    user_out.xp = CalculateNewXP(user_out, user_out.scores)
                }catch(err){
                    console.warn(err);
                    user_out.xp = 0;
                }

                setLoadingState('Server side stuff');

                if (!config.USE_DEV_API) {
                    await UpdateVisitor(user_out.osu.id);
                }

                const visitors = await GetVisitors(user_out.osu.id);
                user_out.visitors = visitors;

                setUser(user_out);
                setIsLoading(false);
                window.onTitleChange(user_out.osu.username);
            } catch (e) {
                console.error(e);
                setUser(null);
                setIsLoading(false);
                setErrorMessage("Unable to get user data: " + e.message);
            }
        })();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [params.id]);

    return (
        <>
            {
                isLoading ? <>
                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
                        <Stack spacing={2} direction='column' alignItems='center'>
                            <CircularProgress />
                            {/* <Typography variant='subtitle1' sx={{ ml: 2 }}>{loadingState}</Typography> */}
                            <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
                                <Alert
                                    severity='info'
                                    sx={{ width: '100%' }}
                                >{loadingState}</Alert>
                            </Box>
                        </Stack>
                    </Box>
                </> : user === null || !user ? <>
                    <Stack spacing={2} direction='column'>
                        <Typography variant='h4'>Whoops, couldn&apos;t show profile</Typography>
                        <Typography variant='subtitle1'>What went wrong: {errorMessage}</Typography>
                        {/* if errorMessage contains 'user_out.alt is undefined' */}
                        {extraErrorMessages !== null ? <Alert severity='warning'>{extraErrorMessages}</Alert> : <></>}
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
                                </Helmet>
                            }
                        </> : <></>
                    }
                    <Stack spacing={0.5} direction='column'>
                        {
                            registered ? <></> : <Alert severity='warning'>
                                This user is not live tracked and the data is most likely inaccurate or even non-existent.
                                If you are this user, join <Link href='https://discord.gg/VZWRZZXcW4' target='_blank'>osu!alt discord</Link> and follow the guide there to get your scores available.
                            </Alert>
                        }
                        {
                            user.inspector_user?.is_private ? <Alert severity='warning'>
                                This profile is in private mode.
                            </Alert> : <></>
                        }
                        <SectionHeader user={user} />
                        <UserDataContainer user={user} />
                    </Stack>
                </>
            }
        </>
    );
}

export default RouteUser;