import { Avatar, Box, Card, CardContent, Chip, CircularProgress, Grid, Link, Stack, Tooltip, Typography } from '@mui/material';
import React from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import { useParams, useRouteError } from 'react-router-dom/dist';
import { getUser as getAltUser, getUserScores } from '../Helpers/OsuAlt';
import { getUser as getOsuUser } from '../Helpers/Osu';
import ReactCountryFlag from 'react-country-flag';
import SectionHeader from '../Components/UserPage/SectionHeader';
import SectionGrades from '../Components/UserPage/SectionGrades';
import { processScores } from '../Helpers/Scores';
import SectionCards from '../Components/UserPage/SectionCards';

function User() {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const params = useParams();

    useEffect(() => {
        (async () => {
            setIsLoading(true);
            setUser(null);
            const user_out = {};
            const user_in = params.id;
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

            const _scores = await getUserScores(user_out.alt.user_id, true);
            if (_scores === null || _scores.error !== undefined) {
                setUser(null);
                setIsLoading(false);
                return;
            }
            user_out.scores = _scores;

            const _data = await processScores(user_out.scores);
            user_out.data = _data;

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
                        <CircularProgress />
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
                    <Stack spacing={2} direction='column'>
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