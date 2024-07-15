/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from "react";
import { Alert, Box, Button, Card, CardContent, Divider, Grid, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, useTheme } from "@mui/material";
import moment from "moment";
import { IMG_SVG_GRADE_A, IMG_SVG_GRADE_B, IMG_SVG_GRADE_C, IMG_SVG_GRADE_D, IMG_SVG_GRADE_S, IMG_SVG_GRADE_SH, IMG_SVG_GRADE_X, IMG_SVG_GRADE_XH } from "../../Helpers/Assets";

function SectionSessions(props) {
    const theme = useTheme();
    const [sessions, setSessions] = React.useState([]);
    const [selectedSession, _setSelectedSession] = React.useState(null);

    const setSelectedSession = (session) => {
        //get stats for this session
        const stats = {
            grades: {
                XH: 0,
                X: 0,
                SH: 0,
                S: 0,
                A: 0,
                B: 0,
                C: 0,
                D: 0,
            },
            score: 0,
            highest_score: 0,
            average_score: 0,
            start: session.start,
            end: session.end,
            guid: session.guid,
            total_length: moment.duration(0, 'seconds'),
            average_length: moment.duration(0, 'seconds'),
            longest_length: moment.duration(0, 'seconds'),
            longest_break_time: moment.duration(0, 'seconds'),
            total_break_time: moment.duration(0, 'seconds'),
            average_break_time: moment.duration(0, 'seconds'),
            total_breaks: session.breaks.length,
            count300: 0,
            count100: 0,
            count50: 0,
            countmiss: 0,
            total_hits: 0,
            average_hits: 0,
            total_pp: 0,
            average_pp: 0,
            highest_pp: 0,
        };

        session.scores.forEach((score) => {
            stats.grades[score.rank]++;
            stats.score += score.score;
            if (score.score > stats.highest_score) {
                stats.highest_score = score.score;
            }
            stats.total_length.add(moment.duration(score.beatmap.modded_length, 'seconds'));
            if (score.beatmap.modded_length > stats.longest_length.asSeconds()) {
                stats.longest_length = moment.duration(score.beatmap.modded_length, 'seconds');
            }

            stats.count300 += score.count300;
            stats.count100 += score.count100;
            stats.count50 += score.count50;
            stats.countmiss += score.countmiss;
            stats.total_hits += score.totalhits;

            stats.total_pp += score.pp;
            if (score.pp > stats.highest_pp) {
                stats.highest_pp = score.pp;
            }
        });
        stats.average_score = Math.floor(stats.score / session.scores.length);
        stats.average_length = moment.duration(stats.total_length.asSeconds() / session.scores.length, 'seconds');
        stats.average_hits = Math.floor(stats.total_hits / session.scores.length);
        stats.average_pp = Math.floor(stats.total_pp / session.scores.length);

        //round pp to 2 decimal places
        stats.total_pp = Math.round(stats.total_pp * 100) / 100;
        stats.average_pp = Math.round(stats.average_pp * 100) / 100;
        stats.highest_pp = Math.round(stats.highest_pp * 100) / 100;

        if (session.breaks.length > 0) {
            session.breaks.forEach((brk) => {
                stats.total_break_time += brk.length;
                if (brk.length > stats.longest_break_time.asSeconds()) {
                    stats.longest_break_time = moment.duration(brk.length, 'seconds');
                }
            });

            stats.total_break_time = moment.duration(stats.total_break_time, 'seconds');

            // stats.average_break_time = Math.floor(stats.total_break_time / session.breaks.length);
            stats.average_break_time = moment.duration(stats.total_break_time.asSeconds() / session.breaks.length, 'seconds');
        }

        console.log(stats);
        _setSelectedSession(stats);
    }

    useEffect(() => {
        console.log(props.user.data.sessions);
        const _sessions = props.user.data.sessions.map((session) => {
            const start = moment(session.start * 1000);
            const end = moment(session.end * 1000);
            return {
                start: start.format('YYYY-MM-DD HH:mm:ss'),
                end: end.format('YYYY-MM-DD HH:mm:ss'),
                duration: moment.duration(end.diff(start)),
                //random
                guid: Math.random().toString(36).substring(7),
                scores: session.scores,
                breaks: session.breaks,
            };
        });

        //order by duration
        _sessions.sort((a, b) => b.duration - a.duration);

        setSessions(_sessions);
        setSelectedSession(_sessions[0]);
    }, []);

    if (sessions.length === 0) return (<></>);

    return (
        <>
            <Grid container spacing={2}>
                {/* left panel, list of session */}
                <Grid item xs={12} md={4}>
                    {/* scroll view */}
                    <Box sx={{
                        height: '550px',
                        overflow: 'auto',
                        padding: theme.spacing(1),
                        borderRadius: theme.spacing(1),
                        backgroundColor: theme.palette.background.paper,
                    }}>
                        <Stack spacing={1}>
                            {/* list of sessions */}
                            {sessions.map((session, i) => {
                                return (
                                    <Button key={i}
                                        //block
                                        fullWidth
                                        variant={selectedSession && selectedSession.guid === session.guid ? 'contained' : 'outlined'}
                                        sx={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                            textAlign: 'left',
                                        }}
                                        onClick={() => {
                                            setSelectedSession(session);
                                        }}
                                    >
                                        <span>{session.start}</span>
                                        {/* //we only want minutes and hours, not days */}
                                        {/* <span>{session.duration.humanize()}</span> */}
                                        <span>{session.duration.asHours() >= 1 ? Math.floor(session.duration.asHours()) + 'h' : ''} {Math.floor(session.duration.minutes()) + 'm'}</span>
                                        <span>{session.end}</span>
                                    </Button>
                                );
                            })}
                        </Stack>
                    </Box>
                </Grid>
                {/* right panel, selected session stats/data/whatever */}
                <Grid item xs={12} md={8}>
                    {
                        selectedSession && <>
                            <Card>
                                <CardContent>
                                    <Typography variant="h6">Showing session: {selectedSession.start} - {selectedSession.end}</Typography>
                                    <Stack direction="column" spacing={2}>
                                        <Grid>
                                            <Stack direction="row" sx={{ justifyContent: 'center', alignItems: 'center' }}>
                                                <Grid sx={{ mr: 3, ml: 3 }}>
                                                    <img src={IMG_SVG_GRADE_XH} alt='XH' /> {selectedSession.grades.XH.toLocaleString('en-US')}
                                                </Grid>
                                                <Grid sx={{ mr: 3 }}>
                                                    <img src={IMG_SVG_GRADE_X} alt='X' /> {selectedSession.grades.X.toLocaleString('en-US')}
                                                </Grid>
                                                <Grid sx={{ mr: 3 }}>
                                                    <img src={IMG_SVG_GRADE_SH} alt='SH' /> {selectedSession.grades.SH.toLocaleString('en-US')}
                                                </Grid>
                                                <Grid sx={{ mr: 3 }}>
                                                    <img src={IMG_SVG_GRADE_S} alt='S' /> {selectedSession.grades.S.toLocaleString('en-US')}
                                                </Grid>
                                                <Grid sx={{ mr: 3 }}>
                                                    <img src={IMG_SVG_GRADE_A} alt='A' /> {selectedSession.grades.A.toLocaleString('en-US')}
                                                </Grid>
                                                <Grid sx={{ mr: 3 }}>
                                                    <img src={IMG_SVG_GRADE_B} alt='B' /> {selectedSession.grades.B.toLocaleString('en-US')}
                                                </Grid>
                                                <Grid sx={{ mr: 3 }}>
                                                    <img src={IMG_SVG_GRADE_C} alt='C' /> {selectedSession.grades.C.toLocaleString('en-US')}
                                                </Grid>
                                                <Grid sx={{ mr: 3 }}>
                                                    <img src={IMG_SVG_GRADE_D} alt='D' /> {selectedSession.grades.D.toLocaleString('en-US')}
                                                </Grid>
                                            </Stack>
                                        </Grid>
                                    </Stack>
                                    <Divider />
                                    <TableContainer>
                                        <Table size="small">
                                            <TableBody>
                                                <TableRow>
                                                    <TableCell colSpan={2} sx={{ fontWeight: 'bold' }}>Score</TableCell>
                                                    <TableCell colSpan={2}>{selectedSession.score.toLocaleString('en-US')}</TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell colSpan={2} sx={{ fontWeight: 'bold' }}>Average Score</TableCell>
                                                    <TableCell colSpan={2}>{selectedSession.average_score.toLocaleString('en-US')}</TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell colSpan={2} sx={{ fontWeight: 'bold' }}>Highest Score</TableCell>
                                                    <TableCell colSpan={2}>{selectedSession.highest_score.toLocaleString('en-US')}</TableCell>
                                                </TableRow>
                                                <Grid sx={{ mt: theme.spacing(4), }} />
                                                <TableRow>
                                                    <TableCell colSpan={2} sx={{ fontWeight: 'bold' }}>Total PP</TableCell>
                                                    <TableCell colSpan={2}>{selectedSession.total_pp.toLocaleString('en-US')}pp</TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell colSpan={2} sx={{ fontWeight: 'bold' }}>Average PP</TableCell>
                                                    <TableCell colSpan={2}>{selectedSession.average_pp.toLocaleString('en-US')}pp</TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell colSpan={2} sx={{ fontWeight: 'bold' }}>Highest PP</TableCell>
                                                    <TableCell colSpan={2}>{selectedSession.highest_pp.toLocaleString('en-US')}pp</TableCell>
                                                </TableRow>
                                                <Grid sx={{ mt: theme.spacing(4), }} />
                                                <TableRow>
                                                    <TableCell colSpan={2} sx={{ fontWeight: 'bold' }}>Total Map Length</TableCell>
                                                    {/* show as HH:mm:ss */}
                                                    <TableCell colSpan={2}>{selectedSession.total_length.format('H[h] m[m] s[s]')}</TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell colSpan={2} sx={{ fontWeight: 'bold' }}>Average Map Length</TableCell>
                                                    <TableCell colSpan={2}>{selectedSession.average_length.format('H[h] m[m] s[s]')}</TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell colSpan={2} sx={{ fontWeight: 'bold' }}>Longest Map Length</TableCell>
                                                    <TableCell colSpan={2}>{selectedSession.longest_length.format('H[h] m[m] s[s]')}</TableCell>
                                                </TableRow>
                                                <Grid sx={{ mt: theme.spacing(4), }} />
                                                <TableRow>
                                                    <TableCell sx={{ fontWeight: 'bold' }}>Total Hits</TableCell>
                                                    <TableCell>{selectedSession.total_hits.toLocaleString('en-US')}</TableCell>
                                                    <TableCell sx={{ fontWeight: 'bold' }}>Average Hits</TableCell>
                                                    <TableCell>{selectedSession.average_hits.toLocaleString('en-US')}</TableCell>
                                                    </TableRow>
                                                <TableRow>
                                                    <TableCell sx={{ fontWeight: 'bold' }}>300s</TableCell>
                                                    <TableCell>{selectedSession.count300.toLocaleString('en-US')}</TableCell>
                                                    <TableCell sx={{ fontWeight: 'bold' }}>100s</TableCell>
                                                    <TableCell>{selectedSession.count100.toLocaleString('en-US')}</TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell sx={{ fontWeight: 'bold' }}>50s</TableCell>
                                                    <TableCell>{selectedSession.count50.toLocaleString('en-US')}</TableCell>
                                                    <TableCell sx={{ fontWeight: 'bold' }}>Misses</TableCell>
                                                    <TableCell>{selectedSession.countmiss.toLocaleString('en-US')}</TableCell>
                                                </TableRow>
                                                <Grid sx={{ mt: theme.spacing(4), }} />
                                                <TableRow>
                                                    <TableCell colSpan={2} sx={{ fontWeight: 'bold' }}>Total Breaks</TableCell>
                                                    <TableCell colSpan={2}>{selectedSession.total_breaks.toLocaleString('en-US')}</TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell colSpan={2} sx={{ fontWeight: 'bold' }}>Total Break Time</TableCell>
                                                    <TableCell colSpan={2}>{selectedSession.total_break_time.format('H[h] m[m] s[s]')}</TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell colSpan={2} sx={{ fontWeight: 'bold' }}>Average Break Time</TableCell>
                                                    <TableCell colSpan={2}>{selectedSession.average_break_time.format('H[h] m[m] s[s]')}</TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell colSpan={2} sx={{ fontWeight: 'bold' }}>Longest Break Time</TableCell>
                                                    <TableCell colSpan={2}>{selectedSession.longest_break_time.format('H[h] m[m] s[s]')}</TableCell>
                                                </TableRow>
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                </CardContent>
                            </Card>
                            <Alert severity="info" sx={{ mt: theme.spacing(2) }}>
                                A break is when there is more than 5 minutes between two scores. Not accounting for retries due to limitations.
                            </Alert>
                        </>
                    }
                </Grid>
            </Grid>
        </>
    );
}

export default SectionSessions;