import { Alert, AlertTitle, Box, Button, CircularProgress, FormControl, InputLabel, Link, MenuItem, Pagination, Paper, Select, Stack, Tooltip, Typography } from '@mui/material';
import React from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import ReactCountryFlag from 'react-country-flag';
import { useNavigate, useParams } from 'react-router-dom';
import { getLeaderboard } from '../Helpers/OsuAlt';
import moment from 'moment/moment';
import countries from "countries-list";
import momentDurationFormatSetup from "moment-duration-format";
import PlayerLeaderboardItem from '../Components/Leaderboards/PlayerLeaderboardItem';
import BeatmapLeaderboardItem from '../Components/Leaderboards/BeatmapLeaderboardItem';
import { Helmet } from 'react-helmet';
import config from "../config.json";
import { green, grey, red } from '@mui/material/colors';
import { convertEpochToHumanReadable } from '../Helpers/Misc.js';
momentDurationFormatSetup(moment);

const GROUPED_STATS = {
    'pp': [
        {
            name: 'pp', title: 'PP', customFormat: (value) => (Math.round(value)).toLocaleString('en-US') + 'pp',
            description: 'Weighted pp of all scores. This is the main ranking metric.',
            group: 'pp'
        },
        {
            name: 'pp_v1', title: 'PP v1', customFormat: (value) => (Math.round(value)).toLocaleString('en-US') + 'pp',
            description: 'The old pp system',
            group: 'pp'
        },
        {
            name: 'total_pp', title: 'Total PP', customFormat: (value) => (Math.round(value)).toLocaleString('en-US') + 'pp',
            description: 'Total pp of all scores.',
            group: 'pp'
        },
        {
            name: 'avg_pp', title: 'Average PP', customFormat: (value) => (Math.round(value)).toLocaleString('en-US') + 'pp',
            description: 'Average pp of all scores.',
            group: 'pp'
        },
        {
            name: 'top_pp', title: 'Highest PP', customFormat: (value) => (Math.round(value)).toLocaleString('en-US') + 'pp',
            description: 'Highest pp achieved by the user.',
            group: 'pp'
        },
    ],
    'score': [
        {
            name: 'ranked_score', title: 'Ranked Score',
            description: 'Total ranked score of all scores.',
            group: 'score'
        },
        {
            name: 'total_score', title: 'Total Score',
            description: 'Total score of all scores.',
            group: 'score'
        },
        {
            name: 'avg_score', title: 'Average Score',
            description: 'Average score of all scores.',
            group: 'score'
        },
        {
            name: 'top_score', title: 'Highest Score',
            description: 'Highest score achieved by the user.',
            group: 'score'
        },
        {
            name: 'ss_score', title: 'SS Score',
            description: 'Ranked score but only with plays that are 100% accuracy',
            group: 'score'
        },
        {
            name: 'fc_score', title: 'FC Score',
            description: 'Ranked score but only with plays that are full combo',
            group: 'score'
        },
        {
            name: 'as_one_map', title: 'Singular Score',
            description: 'The score users have if osu was one massive beatmap',
            group: 'score'
        }
    ],
    'grade': [
        {
            name: 'ss', title: 'Total SS',
            group: 'grade'
        },
        {
            name: 's', title: 'Total S',
            group: 'grade'
        },
        {
            name: 'a', title: 'Total A',
            group: 'grade'
        },
        {
            name: 'b', title: 'Total B',
            group: 'grade'
        },
        {
            name: 'c', title: 'Total C',
            group: 'grade'
        },
        {
            name: 'd', title: 'Total D',
            group: 'grade'
        },
    ],
    'accuracy': [
        {
            name: 'acc', title: 'Profile Accuracy', customFormat: (value) => `${(Math.round(value * 100) / 100)}%`,
            description: 'Weighted accuracy',
            group: 'accuracy'
        },
        {
            name: 'avg_acc', title: 'Average Accuracy', customFormat: (value) => `${(Math.round(value * 100) / 100)}%`,
            description: 'Average accuracy of all scores.',
            group: 'accuracy'
        },
    ],
    'generic': [
        {
            name: 'total_hits', title: 'Hit Count',
            description: 'Total number of hits that the user has achieved.',
            group: 'generic'
        },
        {
            name: 'playcount', title: 'Play Count',
            description: 'Number of times that the user has played a beatmap.',
            group: 'generic'
        },
        {
            name: 'playtime', title: 'Play Time', customFormat: (value) => (Math.round(moment.duration(value, 'seconds').asHours())).toLocaleString('en-US') + ' hours',
            description: 'Total tracked time spent playing osu!',
            group: 'generic'
        },
        {
            name: 'followers', title: 'Followers',
            description: 'Number of users that follow the user.',
            group: 'generic'
        },
        {
            name: 'replays_watched', title: 'Replays Watched',
            description: 'Number of times that the user\'s replays have been watched.',
            group: 'generic'
        },
        {
            name: 'scores_first_count', title: 'First Places',
            description: 'Number of number ones on beatmaps',
            group: 'generic'
        },
        {
            name: 'post_count', title: 'Forum Posts',
            description: 'Number of forum posts that the user has created.',
            group: 'generic'
        },
        {
            name: 'ranked_beatmapset_count', title: 'Ranked Beatmaps',
            description: 'Number of ranked beatmaps that the user has created.',
            group: 'generic'
        },
        {
            name: 'user_achievements', title: 'Medals',
            description: 'Amount of medals a user has',
            group: 'generic'
        },
        {
            name: 'user_badges', title: 'Badges',
            description: 'Amount of badges a user has',
            group: 'generic'
        }
    ],
    'completion': [
        {
            name: 'clears', title: 'Clears',
            description: 'Amount of clears the user has. This includes B, C and D ranks',
            group: 'grade'
        },
        {
            name: 'fc_clears', title: 'FC Clears',
            description: 'Amount of full combo clears the user has',
            group: 'grade'
        },
        {
            name: 'completion', title: 'Completion', customFormat: (value) => `${(Math.round(value * 100) / 100)}%`,
            description: 'Percentage of ranked beatmaps that have been cleared.',
            group: 'generic'
        },
        {
            name: 'unique_ss', title: 'Unique SS',
            description: 'Amount of unique SS the user has',
            group: 'generic'
        },
        // {
        //     name: 'unique_hd_ss', title: 'Unique HD SS',
        //     description: 'Amount of unique HD SS the user has',
        //     group: 'generic'
        // },
        {
            name: 'unique_fc', title: 'Unique FC',
            description: 'Amount of unique FCs the user has',
            group: 'generic'
        },
        {
            name: 'unique_dt_fc', title: 'Unique DT FC',
            description: 'Amount of unique DT FCs the user has',
            group: 'generic'
        },
    ],
    'beatmaps': [
        {
            name: 'most_played', title: 'Most Played',
            description: 'List of most played beatmaps',
        },
        {
            name: 'most_played_loved', title: 'Most Played Loved',
            description: 'List of most played loved beatmaps',
        },
        {
            name: 'most_ssed', title: 'Most SSed',
            description: 'List of most SSed beatmaps',
        },
        {
            name: 'most_fm_ssed', title: 'Most FMSSed',
            description: 'List of most four-mod (HDDTHRFL) SSed beatmaps',
        },
        {
            name: 'longest_approval', title: 'Longest Rank Time',
            description: 'List of beatmaps sorted by longest time from submission to ranked',
            customFormat: (value) => moment.duration(value, 'seconds').format('y[y] M[m] d[d]')
        },
        {
            name: 'longest_maps', title: 'Longest Maps',
            description: 'List of beatmaps sorted by length',
            customFormat: (value) => moment.duration(value, 'seconds').format('h[h] m[m] s[s]')
        },
        {
            name: 'set_with_most_maps', title: 'Most difficulties',
            description: 'Sets with the most difficulties'
        }
    ]
}

const ROWS_PER_PAGE = 50;
function Leaders() {
    const params = useParams();

    const [isLoading, setIsLoading] = useState(false);
    const [statistic, setStatistic] = useState(params.stat ? Object.values(GROUPED_STATS).flat(1).find((stat) => stat.name === params.stat) : GROUPED_STATS['pp'][0]);
    const [page, setPage] = useState(params.page ? parseInt(params.page) : 1);
    const [totalPages, setTotalPages] = useState(0);
    const [country, setCountry] = useState(params.country && countries.countries[params.country.toUpperCase()] ? params.country.toLowerCase() : 'world');
    const [countryList, setCountryList] = useState([]);
    const [leaderboard, setLeaderboard] = useState(null);
    const [leaderboardType, setLeaderboardType] = useState('users');
    const navigate = useNavigate();

    useEffect(() => {
        const _c = [];
        for (const key in countries.countries) {
            _c.push({ code: key.toLowerCase(), name: countries.countries[key].name });
        }
        setCountryList([{ code: 'world', name: 'Worldwide' }, ..._c]);
    }, []);

    //if stat portion of url changes
    useEffect(() => {
        if (params.stat) {
            const _stat = Object.values(GROUPED_STATS).flat(1).find((stat) => stat.name === params.stat);
            if (_stat) setStatistic(_stat);
            else setStatistic(GROUPED_STATS['pp'][0]);
        } else {
            setStatistic(GROUPED_STATS['pp'][0]);
        }
    }, [params.stat]);

    //if page portion of url changes
    useEffect(() => {
        if (params.page) {
            setPage(parseInt(params.page));
        }
    }, [params.page]);

    //if country portion of url changes
    useEffect(() => {
        if (params.country) {
            setCountry(params.country.toLowerCase());
        }
    }, [params.country]);

    useEffect(() => {
        if (page > 1) {
            update(false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page]);

    useEffect(() => {
        update(true);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [country, statistic]);

    const update = (resetPage) => {
        if (isLoading) return;
        let _page = page;
        if (resetPage) {
            _page = 1;
        }
        setIsLoading(true);
        (async () => {
            setLeaderboard(null);
            const lb = await getLeaderboard(statistic.name, ROWS_PER_PAGE, _page - 1, country);
            if (lb === null || lb.error !== undefined) {
                setIsLoading(false);
                return;
            }

            const pages = Math.ceil(lb.result_count / ROWS_PER_PAGE);
            setTotalPages(pages);
            setLeaderboard(lb.leaderboard);
            setLeaderboardType(lb.result_type);
            setIsLoading(false);
        })();
    };

    if (statistic === undefined || statistic === null) return (<></>);

    return (
        <>
            <Helmet>
                <title>{statistic.title} Leaderboards - {config.APP_NAME}</title>
            </Helmet>
            <Box sx={{ pb: 2 }}>
                {
                    Object.keys(GROUPED_STATS).map((group) => {
                        return (
                            <Paper elevation={3} sx={{ m: 0.2, p: 0.4, display: 'inline-block' }}>
                                {
                                    GROUPED_STATS[group].map((stat) => {
                                        return (
                                            <Tooltip title={stat.description ?? ''}>
                                                <Button sx={{ m: 0.1 }} disabled={isLoading} size='small' variant={stat.name === statistic.name ? 'contained' : 'outlined'} onClick={() => navigate(`stat/${stat.name}/page/1/country/${country ?? 'world'}`)}>{stat.title}</Button>
                                            </Tooltip>
                                        );
                                    })
                                }
                            </Paper>
                        )
                    })
                }
                {
                    countryList.length > 0 ?
                        <Paper elevation={3} sx={{ m: 0.2, p: 0.4, width: '300px' }}>
                            <FormControl sx={{ width: '100%' }} size='small'>
                                <InputLabel size='small' id={`country_dropdown_label`}>Country</InputLabel>
                                <Select
                                    size='small'
                                    value={country ?? 'world'}
                                    // onChange={e => setCountry(e.target.value)}
                                    onChange={e => navigate(`stat/${statistic.name}/page/1/country/${e.target.value}`)}
                                    labelId={`country_dropdown_label`}
                                    label='Country'
                                    disabled={!(!isLoading && leaderboardType === 'users')}
                                >
                                    {
                                        countryList.map((value) => {
                                            return (
                                                <MenuItem key={value.code} value={value.code}>
                                                    {
                                                        value.code !== 'world' ? <ReactCountryFlag style={{ lineHeight: '1em', fontSize: '1.4em', borderRadius: '5px' }} cdnUrl="https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/6.6.6/flags/4x3/" countryCode={value.code} /> : <></>
                                                    }
                                                    &nbsp;{value.name}
                                                </MenuItem>
                                            )
                                        })
                                    }
                                </Select>
                            </FormControl>
                        </Paper>
                        : <></>
                }
            </Box>
            <Box sx={{ mt: 1, mb: 1 }}>
                <Typography variant='body1'>{statistic?.description ?? ' '}</Typography>
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
                        <Stack direction='column' spacing={0.6}>
                            {
                                leaderboard.map((entry) => {
                                    const reformat = (value) => {
                                        if (statistic?.customFormat !== undefined && statistic?.customFormat != null) {
                                            return statistic?.customFormat(value);
                                        }
                                        return Math.round(value).toLocaleString('en-US');
                                    }
                                    if (leaderboardType === 'users') {
                                        return (
                                            <PlayerLeaderboardItem
                                                values={
                                                    [
                                                        {
                                                            value: '',
                                                            alignment: 'left'
                                                        },
                                                        {
                                                            value: reformat(entry?.stat),
                                                            alignment: 'right'
                                                        },
                                                        {
                                                            value: entry?.diff !== undefined && entry?.diff != null ?
                                                                (entry?.diff > 0 ? `+${reformat(entry?.diff)}` : `${reformat(entry?.diff)}`) :
                                                                '',
                                                            alignment: 'left',
                                                            variant: 'body2',
                                                            color: grey[500]
                                                        }
                                                    ]
                                                }
                                                user={entry} />
                                        );
                                    }

                                    if (leaderboardType === 'beatmaps' || leaderboardType === 'beatmapsets') {
                                        return (
                                            <BeatmapLeaderboardItem
                                                statistic={statistic}
                                                map={entry}
                                                type={leaderboardType}
                                                values={[
                                                    ...(leaderboardType === 'beatmaps' ?
                                                        [{
                                                            value: `${Math.round(entry?.osu_beatmap?.stars * 100) / 100}*`
                                                        }]
                                                        : []),
                                                    {
                                                        value: reformat(entry?.stat),
                                                        alignment: 'right'
                                                    },
                                                    {
                                                        value: entry?.diff !== undefined && entry?.diff != null ?
                                                            (entry?.diff > 0 ? `+${reformat(entry?.diff)}` : `${reformat(entry?.diff)}`) :
                                                            '',
                                                        alignment: 'left',
                                                        variant: 'body2',
                                                        color: grey[500]
                                                    }
                                                ]}
                                            />
                                        );
                                    }


                                    return (
                                        <></>
                                    )
                                })
                            }
                        </Stack>
                    </> : <><p>Couldn't get data. Try later...</p></>
            }
            <Alert severity='info' sx={{ marginTop: 2 }}>
                <AlertTitle>Information</AlertTitle>
                <Typography variant='body2'>
                    These leaderboards are based on data collected by osu!alt and will always be incomplete. Join the <Link href='https://discord.gg/VZWRZZXcW4' target='_blank'>osu!alt discord</Link> to get your account tracked and to improve the accuracy of the statistics shown.
                </Typography>
            </Alert>
        </>
    );
}

export default Leaders;