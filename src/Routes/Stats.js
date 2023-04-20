import { Alert, AlertTitle, Box, Card, CardContent, CardHeader, CircularProgress, Grid, Link, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Tooltip, Typography, tableCellClasses, tableRowClasses } from "@mui/material";
import moment from "moment";
import { useEffect, useState } from "react";
import { IMG_SVG_GRADE_A, IMG_SVG_GRADE_B, IMG_SVG_GRADE_C, IMG_SVG_GRADE_D, IMG_SVG_GRADE_S, IMG_SVG_GRADE_SH, IMG_SVG_GRADE_X, IMG_SVG_GRADE_XH } from "../Helpers/Assets";
import { getScoreStats } from "../Helpers/OsuAlt";
import { approval_state } from "../Helpers/Osu";
import CheckIcon from '@mui/icons-material/Check';
import FavoriteIcon from '@mui/icons-material/Favorite';

const TIME_PERIODS = [
    { name: '30min', label: 'Last 30 minutes' },
    { name: '24h', label: 'Last 24 hours' },
    { name: '7d', label: 'Last 7 days' },
    { name: 'all', label: 'All time' },
];

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
    { name: '', label: '', format: (value) => '' }, //empty row
    { name: '', label: 'Averages', format: (value) => '' }, //title row
    { name: 'avg_stars', label: 'Stars', format: (value) => (Math.round(100 * value) / 100).toLocaleString('en-US') },
    { name: 'avg_combo', label: 'Combo', format: (value) => (Math.round(value)).toLocaleString('en-US') },
    { name: 'avg_length', label: 'Length', format: (value) => (Math.round(value)).toLocaleString('en-US') + ' sec' },
    { name: 'avg_score', label: 'Score', format: (value) => (Math.round(value)).toLocaleString('en-US') },
    { name: 'avg_pp', label: 'PP', format: (value) => (Math.round(value)).toLocaleString('en-US') },
    { name: 'average_map_age', label: 'Map age', format: (value) => (moment(value).fromNow(true)) + ' old' },
    { name: 'fc_rate', label: 'FC rate', format: (value) => (Math.round(100 * value) / 100).toLocaleString('en-US') + '%' },
    { name: '', label: '', format: (value) => '' }, //empty row
    { name: '', label: 'Users', format: (value) => '' }, //title row
    { name: 'user_most_scores', label: 'Clears', format: (value) => (<><Link target='_blank' href={`https://osu.ppy.sh/users/${value.user_id}`}>{value.username}</Link><Typography>{`${Math.round(value.c).toLocaleString('en-US')}`}</Typography></>) },
    { name: 'user_most_pp', label: 'Total PP', format: (value) => (<><Link target='_blank' href={`https://osu.ppy.sh/users/${value.user_id}`}>{value.username}</Link><Typography>{`${Math.round(value.c).toLocaleString('en-US')}pp`}</Typography></>) },
    { name: 'user_top_pp', label: 'Top PP', format: (value) => (<><Link target='_blank' href={`https://osu.ppy.sh/users/${value.user_id}`}>{value.username}</Link><Typography>{`${Math.round(value.c).toLocaleString('en-US')}pp`}</Typography></>) },
    { name: 'user_most_score', label: 'Score', format: (value) => (<><Link target='_blank' href={`https://osu.ppy.sh/users/${value.user_id}`}>{value.username}</Link><Typography>{`${Math.round(value.c).toLocaleString('en-US')}`}</Typography></>) },
    { name: 'user_top_score', label: 'Top Score', format: (value) => (<><Link target='_blank' href={`https://osu.ppy.sh/users/${value.user_id}`}>{value.username}</Link><Typography>{`${Math.round(value.c).toLocaleString('en-US')}`}</Typography></>) },
    { name: '', label: '', format: (value) => '' }, //empty row
    { name: 'updated_at', label: 'Last updated', format: (value) => moment(value).fromNow() }, //empty row
]

function Stats(props) {
    const [scoreStats, setScoreStats] = useState(undefined);
    const [statsTime, setStatsTime] = useState(-1);

    useEffect(() => {
        (async () => {
            const data = await getScoreStats();
            setScoreStats(data);

            setStatsTime(data.time);
        })();
    }, []);

    return (
        <>
            <Alert severity='info' sx={{ mb: 1 }}>
                <AlertTitle>Notice</AlertTitle>
                These stats are based on what osu!alternative has gathered. Most if not all active and top players are in it, but alot is missing as well.
            </Alert>

            <Grid container spacing={2}>
                <Grid item xs={12} md={6.5}>
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
                                                        <TableCell key={period.name} align='right'>{period.label}</TableCell>
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
                                                            <TableCell>{stat.label}</TableCell>
                                                            {
                                                                TIME_PERIODS.map((period) => {
                                                                    return (
                                                                        <TableCell key={period.name} align='right'>{scoreStats ? stat.format(scoreStats?.[period.name]?.[stat.name]) : <CircularProgress size={15} />} </TableCell>
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
                </Grid>
                <Grid item xs={12} md={5.5}>
                    <Card>
                        <CardHeader title='Most cleared maps' />
                        <CardContent>
                            {
                                scoreStats && TIME_PERIODS.map((period) => {
                                    return (
                                        <Grid>
                                            <Typography key={period.name} variant='h6'>{period.label}</Typography>
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
                                                                            <Tooltip title={`${approval_state[map?.approved] ?? ''}`}>
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
                                                                            </Tooltip>
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
                                        </Grid>
                                    )
                                })
                            }
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {
                statsTime && (
                    <Typography variant='caption' style={{ marginTop: 10, display: 'block' }}>
                        Last updated {moment(statsTime).fromNow()}
                    </Typography>
                )
            }
        </>
    )
}

export default Stats;