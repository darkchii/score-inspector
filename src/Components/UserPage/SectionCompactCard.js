import { Avatar, Box, Grid, Paper, Stack, Table, TableBody, TableCell, tableCellClasses, TableContainer, TableRow, Typography } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { GetAPI } from "../../Helpers/Misc";
import moment from "moment";
import { getGradeIcon } from "../../Helpers/Assets";
import domtoimage from 'dom-to-image';
import ReactCountryFlag from "react-country-flag";

const SIZE = {
    width: '650px',
    height: '320px',
}
function SectionCompactCard(props) {
    const [image, setImage] = useState(null);
    const printRef = useRef(null);

    const convert = async () => {
        if (printRef.current === null) return;
        const data = await domtoimage.toPng(printRef.current);
        setImage(data);
    }

    useEffect(() => {
        convert();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [printRef.current]);

    return (
        <>
            {
                image != null ? (
                    <>
                        <Grid sx={{ justifyContent: 'center', alignItems: 'center', display: 'flex' }}>
                            <img src={image} alt='user compact card' />
                        </Grid>
                        <Typography sx={{ justifyContent: 'center', alignItems: 'center', display: 'flex' }}>Image is ready, you can copy it. If it messed up a bit, go to another user tab and back to this to regenerate. It is a bit buggy.</Typography>
                    </>
                ) : (<>
                    <Grid sx={{ justifyContent: 'center', alignItems: 'center', display: 'flex' }}>
                        <div ref={printRef}>
                            <Box sx={{ width: SIZE.width, height: SIZE.height, backgroundImage: `url('${GetAPI()}proxy/${btoa(props.user.osu.cover_url)}')`, backgroundSize: 'cover', backgroundPosition: 'center', borderRadius: '11px' }}>
                                <Paper sx={{ width: '100%', height: '100%', display: 'flex' }}>
                                    <Grid sx={{ m: 2, width: '100%' }}>
                                        <Stack direction='column' spacing={2}>
                                            <Grid container spacing={2} sx={{ height: '3rem' }}>
                                                <Grid item xs={1.7} sx={{ m: 'auto', justifyContent: 'center', display: 'flex' }}>
                                                    <Avatar src={`${GetAPI()}proxy/${btoa(`https://a.ppy.sh/${props.user.osu.id}`)}`} alt='avatar' />
                                                </Grid>
                                                <Grid item xs={10.3} sx={{ m: 'auto' }}>
                                                    <Typography variant='h5' sx={{ color: 'white', display: 'inline-block' }}><ReactCountryFlag style={{ lineHeight: '1em', fontSize: '1.4em', borderRadius: '5px' }} cdnUrl="https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/6.6.6/flags/4x3/" countryCode={props.user.osu.country.code} /></Typography>
                                                    <Typography variant='h5' sx={{ color: 'white', display: 'inline-block', ml: 1 }}>{props.user.osu.username}</Typography>
                                                    <Typography variant='body1' sx={{ color: 'white', float: 'right', display: 'inline-block' }}>{Math.round(props.user.osu.statistics.hit_accuracy*100)/100}% {Math.round(props.user.osu.statistics.pp).toLocaleString('en-US')}pp</Typography>
                                                </Grid>
                                            </Grid>
                                            <Grid sx={{ height: '3rem' }}>
                                                <Grid container component={Paper} sx={{ p: 0.5 }}>
                                                    {
                                                        Object.keys(props.user.data.grades).map((grade) => {
                                                            const c = props.user.data.grades[grade];
                                                            return (<>
                                                                <Grid item xs={1.5}>
                                                                    <Box textAlign='center'>
                                                                        <Box width='1.7rem' height='auto' component='img' src={getGradeIcon(grade)} />
                                                                        <Typography sx={{ mt: -0.5 }} variant='body1'>{c.toLocaleString('en-US')}</Typography>
                                                                    </Box>
                                                                </Grid>
                                                            </>)
                                                        })
                                                    }
                                                </Grid>
                                            </Grid>
                                            <Grid>
                                                <TableContainer>
                                                    <Table size='small' sx={{ [`& .${tableCellClasses.root}`]: { borderBottom: "none", fontSize: '0.75em', lineHeight: '0.5em' } }}>
                                                        <TableBody>
                                                            <TableRow>
                                                                <TableCell>Worldrank</TableCell>
                                                                <TableCell></TableCell>
                                                                <TableCell>#{(props.user.osu.statistics.global_rank ?? 0).toLocaleString('en-US')}</TableCell>

                                                                <TableCell>Clears</TableCell>
                                                                <TableCell>{(props.user.scores?.length.toLocaleString('en-US') ?? 0)}</TableCell>
                                                            </TableRow>
                                                            <TableRow>
                                                                <TableCell>Countryrank</TableCell>
                                                                <TableCell></TableCell>
                                                                <TableCell>#{(props.user.osu.statistics.country_rank ?? 0).toLocaleString('en-US')}</TableCell>

                                                                <TableCell>Playcount</TableCell>
                                                                <TableCell>{props.user.osu.statistics.play_count.toLocaleString('en-US')}</TableCell>
                                                            </TableRow>
                                                            <TableRow>
                                                                <TableCell>Scorerank</TableCell>
                                                                <TableCell></TableCell>
                                                                <TableCell>#{(props.user.osu.scoreRank ?? 0).toLocaleString('en-US')}</TableCell>

                                                                <TableCell>Completion</TableCell>
                                                                <TableCell>{(props.user.scores?.length > 0 ? Math.round((100 / props.user.data.total_beatmaps * props.user.scores?.length) * 100) / 100 : 0) + '%'}</TableCell>
                                                            </TableRow>
                                                            <TableRow>
                                                                <TableCell>Top 1s</TableCell>
                                                                <TableCell>{(props.user.data.leaderboardStats?.top1s ?? 0).toLocaleString('en-US')}</TableCell>
                                                                <TableCell>#{(props.user.data.leaderboardStats?.top1s_rank ?? 0).toLocaleString('en-US')}</TableCell>

                                                                <TableCell>Playtime</TableCell>
                                                                <TableCell>{Math.round(moment.duration(props.user.osu?.statistics.play_time ?? 0, 'seconds').asHours()) + ' hours'}</TableCell>
                                                            </TableRow>
                                                            <TableRow>
                                                                <TableCell>Top 8s</TableCell>
                                                                <TableCell>{(props.user.data.leaderboardStats?.top8s ?? 0).toLocaleString('en-US')}</TableCell>
                                                                <TableCell>#{(props.user.data.leaderboardStats?.top8s_rank ?? 0).toLocaleString('en-US')}</TableCell>

                                                                <TableCell>Total PP</TableCell>
                                                                <TableCell>{Math.round(props.user.data?.total.pp ?? 0).toLocaleString('en-US')}pp</TableCell>
                                                            </TableRow>
                                                            <TableRow>
                                                                <TableCell>Top 25s</TableCell>
                                                                <TableCell>{(props.user.data.leaderboardStats?.top25s ?? 0).toLocaleString('en-US')}</TableCell>
                                                                <TableCell>#{(props.user.data.leaderboardStats?.top25s_rank ?? 0).toLocaleString('en-US')}</TableCell>

                                                                <TableCell>Highest Combo</TableCell>
                                                                <TableCell>{(props.user.alt.maximum_combo ?? 0).toLocaleString('en-US') + 'x'}</TableCell>
                                                            </TableRow>
                                                            <TableRow>
                                                                <TableCell>Top 50s</TableCell>
                                                                <TableCell>{(props.user.data.leaderboardStats?.top50s ?? 0).toLocaleString('en-US')}</TableCell>
                                                                <TableCell>#{(props.user.data.leaderboardStats?.top50s_rank ?? 0).toLocaleString('en-US')}</TableCell>

                                                                <TableCell>Ranked Score</TableCell>
                                                                <TableCell>{props.user.data.total.score.toLocaleString('en-US')}</TableCell>
                                                            </TableRow>
                                                            <TableRow>
                                                                <TableCell>Top 100s</TableCell>
                                                                <TableCell>{(props.user.data.leaderboardStats?.top100s ?? 0).toLocaleString('en-US')}</TableCell>
                                                                <TableCell>#{(props.user.data.leaderboardStats?.top100s_rank ?? 0).toLocaleString('en-US')}</TableCell>

                                                                <TableCell>Total Score</TableCell>
                                                                <TableCell>{props.user.osu.statistics.total_score.toLocaleString('en-US')}</TableCell>
                                                            </TableRow>
                                                        </TableBody>
                                                    </Table>
                                                </TableContainer>
                                            </Grid>
                                            <Grid>
                                                <Typography variant='body2' sx={{ m: 1, fontStyle: 'oblique', opacity: 0.4 }}>darkchii.nl/score</Typography>
                                            </Grid>
                                        </Stack>
                                    </Grid>
                                </Paper>
                            </Box>
                        </div>
                    </Grid>
                    <Typography sx={{ justifyContent: 'center', alignItems: 'center', display: 'flex' }}>PLEASE WAIT.... Image is still generating</Typography>
                </>)
            }
        </>
    );
}

export default SectionCompactCard;