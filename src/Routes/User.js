import { Avatar, Box, Card, CardContent, Chip, CircularProgress, Grid, Stack, Tooltip, Typography } from '@mui/material';
import React from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import { useParams, useRouteError } from 'react-router-dom/dist';
import { getUser as getAltUser, getUserScores } from '../Helpers/OsuAlt';
import { getUser as getOsuUser } from '../Helpers/Osu';
import ReactCountryFlag from 'react-country-flag';

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
                    <Typography variant='h4'>User not found</Typography>
                </> : <>
                    {/* <Card elevation={3}>
                        <CardContent> */}
                    <Grid container sx={{height: '11rem'}}>
                        <Grid item xs={12} md={2}>
                            <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
                                <Avatar sx={{ width: '100%', height: 'auto' }} src={`https://a.ppy.sh/${user.osu.id}`} />
                            </Box>
                        </Grid>
                        <Grid item xs={12} md={10} sx={{
                            backgroundImage: `url(${user.osu.cover_url})`,
                            backgroundSize: 'cover',
                            borderRadius: '10px'
                        }}>
                            <Box sx={{
                                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                                height: '100%',
                                borderRadius: '10px',
                                p: 2
                            }}>
                                <Grid container>
                                    <Grid item xs={12} md={6}>
                                        <Typography variant='h4'>{user.osu.username}</Typography>
                                        <Stack alignItems='center' direction='row' spacing={1}>
                                            <ReactCountryFlag style={{ lineHeight: '1em', fontSize: '1.4em', borderRadius: '5px' }} cdnUrl="https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/6.6.6/flags/4x3/" countryCode={user.osu.country.code} />
                                            <Typography variant='h6'>{user.osu.country.name}</Typography>
                                        </Stack>
                                        {
                                            user.osu.groups.length > 0 ? <>
                                                {
                                                    user.osu.groups.map((group, index) => {
                                                        return (
                                                            <>
                                                                <Tooltip title={group.name}>
                                                                    <Chip size='small' sx={{m:0.2, backgroundColor: `${group.colour}aa`}} label={group.short_name} />
                                                                </Tooltip>
                                                            </>
                                                        )
                                                    })
                                                }
                                            </> : <></>
                                        }
                                    </Grid>
                                    <Grid item xs={12} md={6}>

                                    </Grid>
                                </Grid>
                            </Box>
                        </Grid>
                    </Grid>
                    {/* </CardContent>
                    </Card> */}
                </>
            }
        </>
    );
}

export default User;