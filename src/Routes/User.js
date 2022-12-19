import { Avatar, Box, Card, CardContent, Chip, CircularProgress, Grid, Link, Stack, Tooltip, Typography } from '@mui/material';
import React from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import { useParams, useRouteError } from 'react-router-dom/dist';
import { getUser as getAltUser, getUserScores } from '../Helpers/OsuAlt';
import { getUser as getOsuUser, getUserLeaderboardStats } from '../Helpers/Osu';
import ReactCountryFlag from 'react-country-flag';
import SectionHeader from '../Components/UserPage/SectionHeader';
import SectionGrades from '../Components/UserPage/SectionGrades';
import { processScores } from '../Helpers/Scores';
import SectionCards from '../Components/UserPage/SectionCards';
import { Helmet } from 'react-helmet';

function User() {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [loadingState, setLoadingState] = useState('Test message');
    const params = useParams();

    useEffect(() => {
        (async () => {
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
            const _scores = await getUserScores(user_out.alt.user_id, true, onScoreDownloadProgress);
            if (_scores === null || _scores.error !== undefined) {
                setUser(null);
                setIsLoading(false);
                return;
            }
            user_out.scores = _scores;

            const onScoreProcessUpdate = (progress) => {
                setLoadingState(`Processing user scores (${progress})`);
            };

            setLoadingState('Processing user scores');
            const _data = await processScores(user_out, user_out.scores, onScoreProcessUpdate);
            user_out.data = _data;

            setLoadingState('Fetching user leaderboard positions');
            const _leaderboardStats = await getUserLeaderboardStats(user_out.alt.user_id);
            user_out.data.leaderboardStats = (_leaderboardStats === null || _leaderboardStats.error !== undefined) ? null : _leaderboardStats;

            console.log(user_out);

            setUser(user_out);
            setIsLoading(false);
        })();
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
                        user.osu.id === 10153735 ? <>
                            <Helmet>
                                <style>
                                    {`
                            body { 
                                background-image: url('https://cdn.donmai.us/original/a6/01/__megumin_kono_subarashii_sekai_ni_shukufuku_wo_drawn_by_sirokohi__a60163a9b4e6afc466c36cbe01277277.jpg'); 
                                background-repeat: no-repeat;
                                background-size: cover;
                                background-position: center;
                                background-attachment: fixed;
                            }`}
                                </style>
                            </Helmet>

                        </> : <></>
                    }
                    <Stack spacing={1} direction='column'>
                        <SectionHeader user={user} />
                        <SectionGrades user={user} />
                        <SectionCards user={user} />
                    </Stack>
                </>
            }
        </>
    );
}

export default User;