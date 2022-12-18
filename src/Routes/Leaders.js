import { Avatar, Box, Button, CircularProgress, Pagination, Paper, Stack, Table, TableBody, TableCell, tableCellClasses, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import React from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import ReactCountryFlag from 'react-country-flag';
import { useNavigate } from 'react-router-dom';
import { getLeaderboard } from '../Helpers/OsuAlt';

const RANKED_STATISTICS = [
    {
        name: 'pp', title: 'PP',
    },
    {
        name: 'ss', title: 'Total SS',
    },
    {
        name: 's', title: 'Total S',
    },
    {
        name: 'a', title: 'Total A',
    },
    {
        name: 'clears', title: 'Clears',
    }
]

const ROWS_PER_PAGE = 50;
function Leaders() {
    const [isLoading, setIsLoading] = useState(false);
    const [statistic, setStatistic] = useState(RANKED_STATISTICS[0]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [country, setCountry] = useState(null);
    const [leaderboard, setLeaderboard] = useState(null);
    const navigate = useNavigate();

    const update = (resetPage) => {
        if (isLoading) return;
        setIsLoading(true);
        if (resetPage) setPage(1);
        (async () => {
            let _page = page;
            if (resetPage) _page = 1;
            const lb = await getLeaderboard(statistic.name, ROWS_PER_PAGE, _page - 1, country);
            if (lb === null || lb.error !== undefined) {
                setLeaderboard(null);
                setIsLoading(false);
                return;
            }
            const pages = Math.ceil(lb.result_users / ROWS_PER_PAGE);
            setTotalPages(pages);
            setLeaderboard(lb.leaderboard);
            setIsLoading(false);
        })();
    };

    useEffect(() => {
        update(false);
    }, [page]);

    useEffect(() => {
        update(true);
    }, [statistic]);

    return (
        <>
            <Box sx={{ pb: 2 }}>
                {
                    RANKED_STATISTICS.map((stat) => {
                        return (
                            <Button disabled={isLoading} variant={stat.name === statistic.name ? 'contained' : 'outlined'} onClick={() => setStatistic(stat)}>{stat.title}</Button>
                        );
                    })
                }
            </Box>
            {
                totalPages > 1 ? <>
                    <Box sx={{ pb: 2, justifyContent: 'center', display: 'flex' }}>
                        <Pagination color="primary" boundaryCount={1} siblingCount={4} width='100%' disabled={isLoading} page={page} onChange={(e, v) => setPage(v)} count={totalPages} />
                    </Box>
                </> : <></>
            }
            {
                isLoading ?
                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
                        <CircularProgress />
                    </Box>
                    :
                    leaderboard !== null && leaderboard !== undefined && Array.isArray(leaderboard) ? <>
                        {
                            <TableContainer>
                                <Table size='small' sx={{
                                    [`& .${tableCellClasses.root}`]: {
                                        borderBottom: "none",
                                        mb: 1
                                    },
                                    borderCollapse: 'separate',
                                    borderSpacing: '0 0.4em',
                                }}>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell><Typography variant='subtitles1' noWrap>Rank</Typography></TableCell>
                                            <TableCell></TableCell>
                                            <TableCell></TableCell>
                                            <TableCell></TableCell>
                                            <TableCell><Typography variant='subtitles1' noWrap>{statistic.title}</Typography></TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {
                                            leaderboard.map((user) => {
                                                return (
                                                    <TableRow component={Paper}
                                                        sx={{
                                                            p: 1,
                                                            borderRadius: '5px',
                                                            "&:hover": {
                                                                opacity: 0.9,
                                                                cursor: 'pointer'
                                                            }
                                                        }}
                                                        onClick={() => { navigate(`/user/${user.user_id}`); }}
                                                        elevation={5}>
                                                        <TableCell width={'3%'}>
                                                            <Typography variant='subtitles1' noWrap>#{user.rank}</Typography>
                                                        </TableCell>
                                                        <TableCell width={'5%'}>
                                                            <Avatar sx={{ width: 24, height: 24 }} alt={user.username} src={`https://a.ppy.sh/${user.user_id}`} />
                                                        </TableCell>
                                                        <TableCell width={'5%'}>
                                                            <ReactCountryFlag
                                                                style={{ lineHeight: '1em', fontSize: '1.2em', borderRadius: '5px' }}
                                                                cdnUrl="https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/6.6.6/flags/4x3/"
                                                                countryCode={user.country_code}
                                                            />
                                                        </TableCell>
                                                        <TableCell>
                                                            <Typography variant='subtitles1' noWrap>
                                                                {user.username}
                                                            </Typography>
                                                        </TableCell>
                                                        <TableCell>
                                                            <Typography variant='subtitles1' noWrap>
                                                                {user.stat.toLocaleString('en-US')}
                                                            </Typography>
                                                        </TableCell>
                                                    </TableRow>
                                                )
                                            })
                                        }
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        }
                    </> : <><p>Couldn't get data. Try later...</p></>
            }
        </>
    );
}

export default Leaders;