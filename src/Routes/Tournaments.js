import React, { useEffect, useState } from 'react';
import Loader from '../Components/UI/Loader';
import { GetAPI, showNotification } from '../Helpers/Misc';
import axios from 'axios';
import { Box, Button, ButtonGroup, Card, CardContent, Divider, Grid2, Typography } from '@mui/material';

function Tournaments() {
    const [tournaments, setTournaments] = useState(null);
    const [isWorking, setIsWorking] = useState(false);

    useEffect(() => {
        (async () => {
            setIsWorking(true);
            try {
                const res = await axios.get(`${GetAPI()}tournament/list`);
                if (!res.data?.tournaments) {
                    throw new Error('Cannot get tournaments data');
                }
                //correct some data, like capitalizing the first letter of each key
                const tournaments = {};
                for (const key in res.data.tournaments) {
                    tournaments[key.charAt(0).toUpperCase() + key.slice(1)] = res.data.tournaments[key];
                }
                setTournaments(tournaments);
                console.log(res.data);
            } catch (e) {
                console.error(e);
                showNotification('Oops', 'Cannot get tournaments data', 'error');
            } finally {
                setIsWorking(false);
            }
        })();
    }, []);

    if (isWorking) {
        return (
            <Loader />
        );
    }

    if (!isWorking && !tournaments) {
        return (
            <p>Cannot get data at the moment.</p>
        );
    }

    return (
        <>
            <Grid2 container spacing={1}>
                <Grid2 size={4}>
                    <Card>
                        <CardContent>
                            {
                                Object.keys(tournaments).map((key, index) => {
                                    return (
                                        <Box sx={{
                                            mb: 2
                                        }}>
                                            <Typography key={index} variant='h6'>{key}</Typography>
                                            <Divider sx={{ mt: 1, mb: 1 }} />
                                            <ButtonGroup orientation="vertical" color='primary' fullWidth size='small'>
                                                {
                                                    tournaments[key].map((tournament, index) => {
                                                        return (
                                                            <Button key={index} onClick={() => { console.log(tournament) }}>{tournament.name}</Button>
                                                        );
                                                    })
                                                }
                                            </ButtonGroup>
                                        </Box>
                                    );
                                })
                            }
                        </CardContent>
                    </Card>
                </Grid2>
                <Grid2 size={8}>

                </Grid2>
            </Grid2>
        </>
    );
}

export default Tournaments;