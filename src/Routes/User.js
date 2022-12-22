import { Box, CircularProgress, Link, Stack, Typography } from '@mui/material';
import React from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import { useLocation, useParams } from 'react-router-dom/dist';
import { getUser as getAltUser, getUserScores } from '../Helpers/OsuAlt';
import { getUser as getOsuUser, getUserLeaderboardStats } from '../Helpers/Osu';
import SectionHeader from '../Components/UserPage/SectionHeader';
import { processScores } from '../Helpers/ScoresProcessor';
import { Helmet } from 'react-helmet';
import UserDataContainer from '../Components/UserPage/UserDataContainer';
import config from '../config.json';

function User() {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [loadingState, setLoadingState] = useState('Test message');
    const params = useParams();
    const location = useLocation();

    useEffect(() => {
        (async () => {
            const urlParams = new URLSearchParams(location.search);
            let loved = urlParams.get('loved');
            if (loved === 'true' || loved === '1' || loved === true || loved === 1 || loved === '') {
                loved = true;
            } else {
                loved = false;
            }
            setIsLoading(true);
            setUser(null);
            const user_out = {};
            const user_in = params.id;
            setLoadingState('Fetching user data');
            const alt_user = await getAltUser(user_in);

            if (alt_user === null || alt_user.error !== undefined) {
                setUser(null);
                setIsLoading(false);
                return;
            }
            user_out.alt = (alt_user === null || alt_user.error !== undefined) ? null : alt_user;

            const osu_user = await getOsuUser(user_out.alt.user_id);
            if (osu_user === null || osu_user.error !== undefined) {
                setUser(null);
                setIsLoading(false);
                return;
            }
            user_out.osu = osu_user;

            const onScoreDownloadProgress = (progress) => {
                setLoadingState(`Fetching user scores (${parseInt(Math.round(progress.loaded * 100) / progress.total)}%)`);
            };

            setLoadingState('Fetching user scores');
            const _scores = await getUserScores(user_out.alt.user_id, loved === true, onScoreDownloadProgress);
            if (_scores === null || _scores.error !== undefined) {
                setUser(null);
                setIsLoading(false);
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
                _data = await processScores(user_out, user_out.scores, onCallbackError, onScoreProcessUpdate);
            } catch (e) {
                console.error(e);
                setUser(null);
                setIsLoading(false);
                return;
            }

            if (_data === null || _data === undefined) {
                setUser(null);
                setIsLoading(false);
                return;
            }

            user_out.data = _data;

            setLoadingState('Fetching user leaderboard positions');
            const _leaderboardStats = await getUserLeaderboardStats(user_out.alt.user_id);
            user_out.data.leaderboardStats = (_leaderboardStats === null || _leaderboardStats.error !== undefined) ? null : _leaderboardStats;

            setUser(user_out);
            setIsLoading(false);
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
                            <Typography variant='subtitle1' sx={{ ml: 2 }}>{loadingState}</Typography>
                        </Stack>
                    </Box>
                </> : user === null || !user ? <>
                    <Stack spacing={2} direction='column'>
                        <Typography variant='h4'>User not found</Typography>
                        <Typography variant='subtitle1'>This user is most likely not registered on osu!alt</Typography>
                        <Link sx={{ textDecoration: 'none' }} href={`https://osu.ppy.sh/users/${params.id}`} target='_blank'>
                            <Typography variant='title' sx={{ fontSize: '1em' }}>Try osu! profile ....</Typography>
                        </Link>
                    </Stack>

                </> : <>
                    {
                        config.SPECIAL_USERS[user.osu.id] ? <>
                            {
                                config.SPECIAL_USERS[user.osu.id].background_image !== undefined ? <Helmet>

                                    <style>
                                        {`
                                            body { 
                                            background-image: url('${config.SPECIAL_USERS[user.osu.id].background_image}'); 
                                            background-repeat: no-repeat;
                                            background-size: cover;
                                            background-position: center;
                                            background-attachment: fixed;
                                        }`}
                                    </style>
                                </Helmet> : <></>
                            }
                        </> : <></>
                        // user.osu.id === 10153735 ? <>
                        //     <Helmet>
                        //     </Helmet>

                        // </> : <></>
                    }
                    <Stack spacing={1} direction='column'>
                        <SectionHeader user={user} />
                        <UserDataContainer user={user} />
                    </Stack>
                </>
            }
        </>
    );
}

export default User;