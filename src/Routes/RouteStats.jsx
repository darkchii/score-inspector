import { Alert, AlertTitle, Box, Card, CardContent, CardHeader, CircularProgress, Grid2, Link, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, tableCellClasses, tableRowClasses } from "@mui/material";
import moment from "moment";
import { useEffect, useState } from "react";
import { IMG_SVG_GRADE_A, IMG_SVG_GRADE_B, IMG_SVG_GRADE_C, IMG_SVG_GRADE_D, IMG_SVG_GRADE_S, IMG_SVG_GRADE_SH, IMG_SVG_GRADE_X, IMG_SVG_GRADE_XH } from "../Helpers/Assets";
import { getScoreStats } from "../Helpers/OsuAlt";
import { approval_state } from "../Helpers/Osu";
import CheckIcon from '@mui/icons-material/Check';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { GetFormattedName } from "../Helpers/Account";
import OsuTooltip from "../Components/OsuTooltip";

const TIME_PERIODS = [
    { name: '30min', label: 'Last 30 minutes' },
    { name: '24h', label: 'Last 24 hours' },
    { name: '7d', label: 'Last 7 days' },
    { name: 'all', label: 'All time' },
];

const USER_STAT = (data, prefix = '', suffix = '') => (
    <>
        <Link target='_blank' href={`https://osu.ppy.sh/users/${data.user_id}`}>{data.username}</Link>
        <Typography sx={{ fontSize: 'inherit' }}>{`${prefix}${Math.round(data.c).toLocaleString('en-US')}${suffix}`}</Typography>
    </>
)

const MISC_STATS = [
    { name: 'scores', label: 'Clears', format: (value) => parseInt(value).toLocaleString('en-US') },
    { name: 'total_score', label: 'Score', format: (value) => parseInt(value).toLocaleString('en-US') },
    { name: 'total_length', label: 'Playtime', format: (value) => Math.round(moment.duration(parseInt(value), 'second').asHours()).toLocaleString('en-US') + ' hours' },
    //these need images as labels
    { name: 'scores_xh', label: (<img src={IMG_SVG_GRADE_XH} alt='XH' />), format: (value) => parseInt(value).toLocaleString('en-US') },
    { name: 'scores_x', label: (<img src={IMG_SVG_GRADE_X} alt='X' />), format: (value) => parseInt(value).toLocaleString('en-US') },
    { name: 'scores_sh', label: (<img src={IMG_SVG_GRADE_SH} alt='SH' />), format: (value) => parseInt(value).toLocaleString('en-US') },
    { name: 'scores_s', label: (<img src={IMG_SVG_GRADE_S} alt='S' />), format: (value) => parseInt(value).toLocaleString('en-US') },
    { name: 'scores_a', label: (<img src={IMG_SVG_GRADE_A} alt='A' />), format: (value) => parseInt(value).toLocaleString('en-US') },
    { name: 'scores_b', label: (<img src={IMG_SVG_GRADE_B} alt='B' />), format: (value) => parseInt(value).toLocaleString('en-US') },
    { name: 'scores_c', label: (<img src={IMG_SVG_GRADE_C} alt='C' />), format: (value) => parseInt(value).toLocaleString('en-US') },
    { name: 'scores_d', label: (<img src={IMG_SVG_GRADE_D} alt='D' />), format: (value) => parseInt(value).toLocaleString('en-US') },
    { name: '', label: '', format: () => '' }, //empty row
    { name: '', label: 'Averages', format: () => '' }, //title row
    { name: 'avg_stars', label: 'Stars', format: (value) => `${(Math.round(100 * value) / 100).toLocaleString('en-US')}*` },
    { name: 'avg_combo', label: 'Combo', format: (value) => `${(Math.round(value)).toLocaleString('en-US')}x` },
    { name: 'avg_length', label: 'Length', format: (value) => (Math.round(value)).toLocaleString('en-US') + ' sec' },
    { name: 'avg_score', label: 'Score', format: (value) => (Math.round(value)).toLocaleString('en-US') },
    { name: 'avg_pp', label: 'PP', format: (value) => `${(Math.round(value)).toLocaleString('en-US')}pp` },
    { name: 'average_map_age', label: 'Map age', format: (value) => (moment(value).fromNow(true)) + ' old' },
    { name: 'fc_rate', label: 'FC rate', format: (value) => (Math.round(10000 * value) / 100).toLocaleString('en-US') + '%' },
    { name: '', label: '', format: () => '' }, //empty row
    { name: '', label: 'Users', format: () => '' }, //title row
    { name: 'user_most_scores', label: 'Clears', format: (value) => USER_STAT(value) },
    { name: 'user_most_pp', label: 'Total PP', format: (value) => (USER_STAT(value, '', 'pp')) },
    { name: 'user_top_pp', label: 'Top PP', format: (value) => (USER_STAT(value, '', 'pp')) },
    { name: 'user_most_score', label: 'Score', format: (value) => (USER_STAT(value)) },
    { name: 'user_top_score', label: 'Top Score', format: (value) => (USER_STAT(value)) },
    { name: '', label: '', format: () => '' }, //empty row
    { name: 'updated_at', label: 'Last updated', format: (value) => moment(value).fromNow() }, //empty row
]

function RouteStats() {
    const [scoreStats, setScoreStats] = useState(undefined);
    const [statsTime, setStatsTime] = useState(-1);

    useEffect(() => {
        (async () => {
            const data = await getScoreStats();
            setScoreStats(data);
            setStatsTime(data.time);
        })();
        window.onTitleChange('Stats');
    }, []);

    return (
        <>
            <Stack direction='column' spacing={2}>

                <Alert severity='info' sx={{ mb: 1 }}>
                    <AlertTitle>Notice</AlertTitle>
                    These stats are based on what osu!alternative has gathered. Most if not all active and top players are in it, but alot is missing as well.
                </Alert>

                <Grid2 container>
                    <Grid2 size={{ xs: 12, lg: 6.5 }}>
                        <Card>
                            <CardHeader title='Score Stats' />
                            <CardContent>
                                <TableContainer>
                                    <Table size='small'>
                                        <TableHead>
                                            <TableRow>
                                                <TableCell></TableCell>
                                                {
                                                    TIME_PERIODS.map((period) => {
                                                        return (
                                                            <TableCell key={period.name} align='right'>
                                                                {period.label}
                                                            </TableCell>
                                                        );
                                                    })
                                                }
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {
                                                MISC_STATS.map((stat) => {
                                                    return (
                                                        <>
                                                            <TableRow>
                                                                <TableCell>
                                                                    <Typography sx={{ fontSize: '0.75rem' }}>
                                                                        {stat.label}
                                                                    </Typography>
                                                                </TableCell>
                                                                {
                                                                    TIME_PERIODS.map((period) => {
                                                                        return (
                                                                            <TableCell key={period.name} align='right'>
                                                                                <Typography sx={{ fontSize: '0.75rem' }}>
                                                                                    {scoreStats ? stat.format(scoreStats?.[period.name]?.[stat.name]) : <CircularProgress size={15} />}
                                                                                </Typography>
                                                                            </TableCell>
                                                                        );
                                                                    })
                                                                }
                                                            </TableRow>
                                                        </>
                                                    )
                                                })
                                            }
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </CardContent>
                        </Card>
                    </Grid2>
                    <Grid2 size={{ xs: 12, lg: 5.5 }}>
                        <Card>
                            <CardHeader title='Performance distribution' />
                            <CardContent>
                                <TableContainer>
                                    <Table size='small'>
                                        <TableHead>
                                            <TableRow>
                                                <TableCell>PP Range</TableCell>
                                                <TableCell>Scores</TableCell>
                                                <TableCell></TableCell>
                                                <TableCell>Most common user</TableCell>
                                                <TableCell>Count</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {
                                                scoreStats ? scoreStats.pp_distribution.map((pp_dis, index) => {
                                                    const pp_low = Number(pp_dis.pp_range);
                                                    const pp_high = pp_low + 100;
                                                    const scores = Number(pp_dis.count);
                                                    const user = pp_dis.most_common_user;
                                                    const user_count = Number(pp_dis.most_common_user_id_count);
                                                    return (
                                                        <TableRow key={index}>
                                                            <TableCell>{pp_low}pp - {pp_high}pp</TableCell>
                                                            <TableCell>{scores.toLocaleString('en-US')}</TableCell>
                                                            <TableCell></TableCell>
                                                            <TableCell>{user ? GetFormattedName(user.inspector_user) : ''}</TableCell>
                                                            <TableCell>{user ? user_count.toLocaleString('en-US') : ''}</TableCell>
                                                        </TableRow>
                                                    );
                                                }) : <></>
                                            }
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </CardContent>
                        </Card>
                    </Grid2>
                    <Grid2 size={12}>
                        <Card>
                            <CardHeader title='Most cleared maps' />
                            <CardContent>
                                <Grid2 container spacing={2}>
                                    {
                                        scoreStats && TIME_PERIODS.map((period, index) => {
                                            return (
                                                <Grid2 size={{ xs: 12, md: 6 }} key={index}>
                                                    <Typography key={period.name} variant='body1'>{period.label}</Typography>
                                                    <TableContainer key={period.name} style={{ marginBottom: 20 }}>
                                                        <Table size='small' sx={{
                                                            [`& .${tableCellClasses.root} `]: {
                                                                mb: 1,
                                                                borderBottom: "none",
                                                            },
                                                            [`& .${tableRowClasses.root} `]: {
                                                                borderRadius: 10,
                                                            },
                                                            borderCollapse: 'separate',
                                                            borderSpacing: '0 0.4em',
                                                        }}>
                                                            <TableBody>
                                                                {
                                                                    scoreStats[period.name].most_played_maps.map((map) => {
                                                                        const background = `https://assets.ppy.sh/beatmaps/${map.set_id}/covers/cover.jpg`;
                                                                        const black_overlay = background ? '0.8' : '0';
                                                                        return (
                                                                            <TableRow component={Card} key={map.beatmap_id} sx={{
                                                                                "&:hover": {
                                                                                    opacity: 0.5,
                                                                                    cursor: 'pointer'
                                                                                },
                                                                                backgroundImage: `url(${background})`,
                                                                                backgroundSize: 'cover',
                                                                                backgroundPosition: 'center',
                                                                                backgroundRepeat: 'no-repeat'
                                                                            }}
                                                                                onClick={() => {
                                                                                    window.open(`https://osu.ppy.sh/beatmaps/${map.beatmap_id}`, "_blank");
                                                                                }}
                                                                            >
                                                                                <TableCell width={'3%'} sx={{ backgroundColor: `rgba(0,0,0,${black_overlay})` }}>
                                                                                    <OsuTooltip title={`${approval_state[map?.approved] ?? ''}`}>
                                                                                        <Box>
                                                                                            {
                                                                                                map?.approved === 1 || map?.approved === 2 ?
                                                                                                    <CheckIcon sx={{ color: 'green' }} />
                                                                                                    : map?.approved === 3 ?
                                                                                                        <CheckIcon sx={{ color: 'yellow' }} />
                                                                                                        : map?.approved === 4 ?
                                                                                                            <FavoriteIcon sx={{ color: 'red' }} />
                                                                                                            : <></>
                                                                                            }
                                                                                        </Box>
                                                                                    </OsuTooltip>
                                                                                </TableCell>
                                                                                <TableCell sx={{ backgroundColor: `rgba(0,0,0,${black_overlay})` }}>
                                                                                    {map.title} [{map.diffname}]
                                                                                </TableCell>
                                                                                <TableCell width={'5%'} sx={{ backgroundColor: `rgba(0,0,0,${black_overlay})` }} align='right'>{Math.round(map.count).toLocaleString('en-US')}</TableCell>
                                                                            </TableRow>
                                                                        )
                                                                    })
                                                                }
                                                            </TableBody>
                                                        </Table>
                                                    </TableContainer>
                                                </Grid2>
                                            )
                                        })
                                    }
                                </Grid2>
                            </CardContent>
                        </Card>
                    </Grid2>
                </Grid2>

                {
                    statsTime && (
                        <Typography variant='caption' style={{ marginTop: 10, display: 'block' }}>
                            Last updated {moment(statsTime).fromNow()}
                        </Typography>
                    )
                }
            </Stack>
        </>
    )
}

export default RouteStats;