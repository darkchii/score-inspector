import { Avatar, Box, Button, Card, CircularProgress, Pagination, Paper, Stack, Table, TableBody, TableCell, tableCellClasses, TableContainer, TableHead, TableRow, tableRowClasses, Tooltip, Typography } from '@mui/material';
import React from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import ReactCountryFlag from 'react-country-flag';
import { useNavigate, useParams } from 'react-router-dom';
import { getLeaderboard } from '../Helpers/OsuAlt';
import VerifiedIcon from '@mui/icons-material/Verified';
import moment from 'moment/moment';

const RANKED_STATISTICS = [
    {
        name: 'pp', title: 'PP', customFormat: (value) => (Math.round(value)).toLocaleString('en-US') + 'pp'
    },
    {
        name: 'ranked_score', title: 'Ranked Score'
    },
    {
        name: 'total_score', title: 'Total Score'
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
    },
    {
        name: 'total_hits', title: 'Hit Count'
    },
    {
        name: 'playcount', title: 'Play Count',
    },
    {
        name: 'playtime', title: 'Play Time', customFormat: (value) => (Math.round(moment.duration(value, 'seconds').asHours())).toLocaleString('en-US') + ' hours'
    },
    {
        name: 'followers', title: 'Followers'
    },
    {
        name: 'replays_watched', title: 'Replays Watched'
    },
    {
        name: 'scores_first_count', title: 'First Places'
    }, {
        name: 'post_count', title: 'Forum Posts'
    }, {
        name: 'ranked_beatmapset_count', title: 'Ranked Beatmaps'
    }
]

const ROWS_PER_PAGE = 50;
function Leaders() {
    const params = useParams();

    const [isLoading, setIsLoading] = useState(false);
    const [statistic, setStatistic] = useState(params.stat ? RANKED_STATISTICS.find((stat) => stat.name === params.stat) : RANKED_STATISTICS[0]);
    const [page, setPage] = useState(params.page ? parseInt(params.page) : 1);
    const [totalPages, setTotalPages] = useState(0);
    const [country, setCountry] = useState(null);
    const [leaderboard, setLeaderboard] = useState(null);
    const navigate = useNavigate();

    //if stat portion of url changes
    useEffect(() => {
        if (params.stat) {
            const _stat = RANKED_STATISTICS.find((stat) => stat.name === params.stat);
            if (_stat) setStatistic(_stat);
            else setStatistic(RANKED_STATISTICS[0]);
        } else {
            setStatistic(RANKED_STATISTICS[0]);
        }
    }, [params.stat]);

    //if page portion of url changes
    useEffect(() => {
        if (params.page) {
            setPage(parseInt(params.page));
        }
    }, [params.page]);

    useEffect(() => {
        update(true);
    }, [statistic]);

    useEffect(() => {
        update(false);
    }, [page]);

    const update = (resetPage) => {
        if (isLoading) return;
        let _page = page;
        if (resetPage) {
            _page = 1;
        }
        console.log('update');
        setIsLoading(true);
        (async () => {
            setLeaderboard(null);
            const lb = await getLeaderboard(statistic.name, ROWS_PER_PAGE, _page - 1, country);
            if (lb === null || lb.error !== undefined) {
                setIsLoading(false);
                return;
            }

            const pages = Math.ceil(lb.result_users / ROWS_PER_PAGE);
            setTotalPages(pages);
            setLeaderboard(lb.leaderboard);
            setIsLoading(false);
        })();
    };

    if (statistic === undefined || statistic === null) return (<></>);

    return (
        <>
            <Box sx={{ pb: 2 }}>
                {
                    RANKED_STATISTICS.map((stat) => {
                        return (
                            <Button disabled={isLoading} size='small' variant={stat.name === statistic.name ? 'contained' : 'outlined'} onClick={() => navigate(`stat/${stat.name}/page/1`)}>{stat.title}</Button>
                        );
                    })
                }
            </Box>
            {
                totalPages > 1 ? <>
                    <Box sx={{ pb: 2, justifyContent: 'center', display: 'flex' }}>
                        <Pagination color="primary" boundaryCount={1} siblingCount={4} width='100%' disabled={isLoading} page={page} onChange={(e, v) => navigate(`stat/${statistic.name}/page/${v}`)} count={totalPages} />
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
                                        mb: 1,
                                        borderBottom: "none",
                                    },
                                    [`& .${tableRowClasses.root}`]: {
                                        borderRadius: 10,
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
                                                    <TableRow component={Card}
                                                        sx={{
                                                            "&:hover": {
                                                                opacity: 0.5,
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
                                                                style={{ lineHeight: '1em', fontSize: '1.8em', borderRadius: '5px' }}
                                                                cdnUrl="https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/6.6.6/flags/4x3/"
                                                                countryCode={user.country_code}
                                                            />
                                                        </TableCell>
                                                        <TableCell>
                                                            <Stack direction='row' spacing={1} alignItems='center'>
                                                                <Typography variant='subtitles1' noWrap>
                                                                    {user.username}
                                                                </Typography>
                                                                {
                                                                    user.tracked ?
                                                                        <Tooltip title='This user is tracked by osu!alternative and can be viewed'>
                                                                            <VerifiedIcon color='primary' fontSize='small' />
                                                                        </Tooltip>
                                                                        : <></>
                                                                }
                                                            </Stack>
                                                        </TableCell>
                                                        <TableCell>
                                                            <Typography variant='subtitles1' noWrap>
                                                                {
                                                                    (statistic.customFormat !== undefined && statistic.customFormat != null) ?
                                                                        <>
                                                                            {statistic.customFormat(user.stat)}
                                                                        </> : <>
                                                                            {Math.round(user.stat).toLocaleString('en-US')}
                                                                        </>

                                                                }
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