import { Alert, AlertTitle, Card, CardContent, CardHeader, CircularProgress, Grid, Link, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, tableCellClasses, tableRowClasses } from "@mui/material";
import moment from "moment";
import { useEffect, useState } from "react";
import { IMG_SVG_GRADE_A, IMG_SVG_GRADE_B, IMG_SVG_GRADE_C, IMG_SVG_GRADE_D, IMG_SVG_GRADE_S, IMG_SVG_GRADE_SH, IMG_SVG_GRADE_X, IMG_SVG_GRADE_XH } from "../Helpers/Assets";
import { getScoreStats } from "../Helpers/OsuAlt";

const TIME_PERIODS = [
    { name: '24h', label: 'Last 24 hours' },
    { name: '7d', label: 'Last 7 days' },
    { name: 'all', label: 'All time' },
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
                                        <TableRow>
                                            <TableCell>Clears</TableCell>
                                            {
                                                TIME_PERIODS.map((period) => {
                                                    return (
                                                        <TableCell key={period.name} align='right'>{scoreStats ? parseInt(scoreStats?.[period.name]?.scores).toLocaleString('en-US') : <CircularProgress size={15} />} </TableCell>
                                                    );
                                                })
                                            }
                                        </TableRow>
                                        <TableRow>
                                            <TableCell>Score</TableCell>
                                            {
                                                TIME_PERIODS.map((period) => {
                                                    return (
                                                        <TableCell key={period.name} align='right'>{scoreStats ? parseInt(scoreStats?.[period.name]?.total_score).toLocaleString('en-US') : <CircularProgress size={15} />} </TableCell>
                                                    );
                                                })
                                            }
                                        </TableRow>
                                        <TableRow>
                                            <TableCell>Playtime</TableCell>
                                            {
                                                TIME_PERIODS.map((period) => {
                                                    return (
                                                        <TableCell key={period.name} align='right'>{scoreStats ? Math.round(moment.duration(parseInt(scoreStats?.[period.name]?.total_length), 'second').asHours()).toLocaleString('en-US') + ' hours' : <CircularProgress size={15} />} </TableCell>
                                                    );
                                                })
                                            }
                                        </TableRow>
                                        <TableRow>
                                            <TableCell><img src={IMG_SVG_GRADE_XH} alt='XH' /></TableCell>
                                            {
                                                TIME_PERIODS.map((period) => {
                                                    return (
                                                        <TableCell key={period.name} align='right'>{scoreStats ? parseInt(scoreStats?.[period.name]?.scores_xh).toLocaleString('en-US') : <CircularProgress size={15} />} </TableCell>
                                                    );
                                                })
                                            }
                                        </TableRow>
                                        <TableRow>
                                            <TableCell><img src={IMG_SVG_GRADE_X} alt='X' /></TableCell>
                                            {
                                                TIME_PERIODS.map((period) => {
                                                    return (
                                                        <TableCell key={period.name} align='right'>{scoreStats ? parseInt(scoreStats?.[period.name]?.scores_x).toLocaleString('en-US') : <CircularProgress size={15} />} </TableCell>
                                                    );
                                                })
                                            }
                                        </TableRow>
                                        <TableRow>
                                            <TableCell><img src={IMG_SVG_GRADE_SH} alt='SH' /></TableCell>
                                            {
                                                TIME_PERIODS.map((period) => {
                                                    return (
                                                        <TableCell key={period.name} align='right'>{scoreStats ? parseInt(scoreStats?.[period.name]?.scores_sh).toLocaleString('en-US') : <CircularProgress size={15} />} </TableCell>
                                                    );
                                                })
                                            }
                                        </TableRow>
                                        <TableRow>
                                            <TableCell><img src={IMG_SVG_GRADE_S} alt='S' /></TableCell>
                                            {
                                                TIME_PERIODS.map((period) => {
                                                    return (
                                                        <TableCell key={period.name} align='right'>{scoreStats ? parseInt(scoreStats?.[period.name]?.scores_s).toLocaleString('en-US') : <CircularProgress size={15} />} </TableCell>
                                                    );
                                                })
                                            }
                                        </TableRow>
                                        <TableRow>
                                            <TableCell><img src={IMG_SVG_GRADE_A} alt='A' /></TableCell>
                                            {
                                                TIME_PERIODS.map((period) => {
                                                    return (
                                                        <TableCell key={period.name} align='right'>{scoreStats ? parseInt(scoreStats?.[period.name]?.scores_a).toLocaleString('en-US') : <CircularProgress size={15} />} </TableCell>
                                                    );
                                                })
                                            }
                                        </TableRow>
                                        <TableRow>
                                            <TableCell><img src={IMG_SVG_GRADE_B} alt='B' /></TableCell>
                                            {
                                                TIME_PERIODS.map((period) => {
                                                    return (
                                                        <TableCell key={period.name} align='right'>{scoreStats ? parseInt(scoreStats?.[period.name]?.scores_b).toLocaleString('en-US') : <CircularProgress size={15} />} </TableCell>
                                                    );
                                                })
                                            }
                                        </TableRow>
                                        <TableRow>
                                            <TableCell><img src={IMG_SVG_GRADE_C} alt='C' /></TableCell>
                                            {
                                                TIME_PERIODS.map((period) => {
                                                    return (
                                                        <TableCell key={period.name} align='right'>{scoreStats ? parseInt(scoreStats?.[period.name]?.scores_c).toLocaleString('en-US') : <CircularProgress size={15} />} </TableCell>
                                                    );
                                                })
                                            }
                                        </TableRow>
                                        <TableRow>
                                            <TableCell><img src={IMG_SVG_GRADE_D} alt='D' /></TableCell>
                                            {
                                                TIME_PERIODS.map((period) => {
                                                    return (
                                                        <TableCell key={period.name} align='right'>{scoreStats ? parseInt(scoreStats?.[period.name]?.scores_d).toLocaleString('en-US') : <CircularProgress size={15} />} </TableCell>
                                                    );
                                                })
                                            }
                                        </TableRow>
                                        <TableRow>
                                            <TableCell></TableCell>
                                            {
                                                TIME_PERIODS.map((period) => { return (<TableCell></TableCell>); })
                                            }
                                        </TableRow>
                                        <TableRow>
                                            <TableCell variant='head'>Averages</TableCell>
                                            {
                                                TIME_PERIODS.map((period) => { return (<TableCell></TableCell>); })
                                            }
                                        </TableRow>
                                        <TableRow>
                                            <TableCell>Stars</TableCell>
                                            {
                                                TIME_PERIODS.map((period) => {
                                                    return (
                                                        <TableCell key={period.name} align='right'>{scoreStats ? `${(Math.round(100 * scoreStats?.[period.name]?.avg_stars) / 100).toLocaleString('en-US')}*` : <CircularProgress size={15} />} </TableCell>
                                                    );
                                                })
                                            }
                                        </TableRow>
                                        <TableRow>
                                            <TableCell>Combo</TableCell>
                                            {
                                                TIME_PERIODS.map((period) => {
                                                    return (
                                                        <TableCell key={period.name} align='right'>{scoreStats ? `${(Math.round(scoreStats?.[period.name]?.avg_combo)).toLocaleString('en-US')}x` : <CircularProgress size={15} />} </TableCell>
                                                    );
                                                })
                                            }
                                        </TableRow>
                                        <TableRow>
                                            <TableCell>Length</TableCell>
                                            {
                                                TIME_PERIODS.map((period) => {
                                                    return (
                                                        <TableCell key={period.name} align='right'>{scoreStats ? `${(Math.round(scoreStats?.[period.name]?.avg_length)).toLocaleString('en-US')} sec` : <CircularProgress size={15} />} </TableCell>
                                                    );
                                                })
                                            }
                                        </TableRow>
                                        <TableRow>
                                            <TableCell>Score</TableCell>
                                            {
                                                TIME_PERIODS.map((period) => {
                                                    return (
                                                        <TableCell key={period.name} align='right'>{scoreStats ? `${(Math.round(scoreStats?.[period.name]?.avg_score)).toLocaleString('en-US')}` : <CircularProgress size={15} />} </TableCell>
                                                    );
                                                })
                                            }
                                        </TableRow>
                                        <TableRow>
                                            <TableCell>PP</TableCell>
                                            {
                                                TIME_PERIODS.map((period) => {
                                                    return (
                                                        <TableCell key={period.name} align='right'>{scoreStats ? `${(Math.round(100*scoreStats?.[period.name]?.avg_pp) / 100).toLocaleString('en-US')}pp` : <CircularProgress size={15} />} </TableCell>
                                                    );
                                                })
                                            }
                                        </TableRow>
                                        <TableRow>
                                            <TableCell>FC Rate</TableCell>
                                            {
                                                TIME_PERIODS.map((period) => {
                                                    return (
                                                        <TableCell key={period.name} align='right'>{scoreStats ? `${(Math.round(10000*scoreStats?.[period.name]?.fc_rate) / 100).toLocaleString('en-US')}%` : <CircularProgress size={15} />} </TableCell>
                                                    );
                                                })
                                            }
                                        </TableRow>
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
                                                <TableHead>
                                                    <TableRow>
                                                        <TableCell>{period.label}</TableCell>
                                                        <TableCell align='right'></TableCell>
                                                    </TableRow>
                                                </TableHead>
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
                                                                    <TableCell sx={{ backgroundColor: `rgba(0,0,0,${black_overlay})` }}>
                                                                        {map.title} [{map.diffname}]
                                                                    </TableCell>
                                                                    <TableCell sx={{ backgroundColor: `rgba(0,0,0,${black_overlay})` }} align='right'>{Math.round(map.count).toLocaleString('en-US')}</TableCell>
                                                                </TableRow>
                                                            )
                                                        })
                                                    }
                                                </TableBody>
                                            </Table>
                                        </TableContainer>
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