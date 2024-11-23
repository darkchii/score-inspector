import { Box, Grid2, Paper, Stack, Table, TableBody, TableCell, TableContainer, TableRow, Tooltip, Typography, useTheme } from "@mui/material";
import moment from "moment";
import BestScoreCard from "./BestScoreCard";
import GlowBar from "../UI/GlowBar";
import ChartWrapper from "../../Helpers/ChartWrapper.js";
import { MILESTONES_FORMATTER } from "../../Helpers/Misc.js";
import ScoreRow from "../ScoreRow.js";

function SectionCards(props) {
    const theme = useTheme();
    if (props.user == null) return (<></>);

    const _cards = [
        {
            title: 'Clears',
            value: props.user.scores?.length.toLocaleString('en-US') ?? 0,
            size: 1
        },
        {
            title: 'Play Count',
            value: props.user.osu.statistics.play_count.toLocaleString('en-US'),
            size: 1
        },
        {
            title: 'Avg PP',
            value: (Math.round((props.user.data?.average.pp ?? 0) * 100) / 100).toLocaleString('en-US'),
            size: 0.75
        },
        {
            title: 'Avg Acc',
            value: (Math.round((props.user.data?.average.acc ?? 0) * 100) / 100).toLocaleString('en-US') + '%',
            size: 0.75
        },
        {
            title: 'Avg Length',
            value: moment.duration(props.user.data?.average.length ?? 0, 'seconds').format('mm:ss'),
            size: 0.75
        },
        {
            title: 'Avg Stars',
            value: (Math.round((props.user.data?.average.star_rating ?? 0) * 100) / 100).toLocaleString('en-US') + '*',
            size: 0.75
        },
        {
            title: 'Fullcombo\'d',
            value: (((Math.round(props.user.data?.fcRate * 1000) ?? 0) / 10).toLocaleString('en-US') ?? 0) + '%',
            size: 1
        },
        {
            title: 'Score per clear',
            value: Math.round(props.user.data?.average.score)?.toLocaleString('en-US') ?? 0,
            size: 1
        },
        {
            title: 'Ranked Score',
            value: props.user.data.total.score.toLocaleString('en-US'),
            size: 1.25
        },
        {
            title: 'Total Score',
            value: props.user.osu.statistics.total_score?.toLocaleString('en-US') ?? 'N/A',
            size: 1.25
        },
        {
            title: 'Unique SS',
            value: (props.user.alt.unique_ss?.length ?? 0).toLocaleString('en-US'),
            size: 2.5 / 3
        },
        {
            title: 'Unique FC',
            value: (props.user.alt.unique_fc?.length ?? 0).toLocaleString('en-US'),
            size: 2.5 / 3
        },
        {
            title: 'Unique DT FC',
            value: (props.user.alt.unique_dt_fc?.length ?? 0).toLocaleString('en-US'),
            size: 2.5 / 3
        },
        {
            title: 'Score Length',
            value: Math.round(moment.duration(props.user.data.total.length, 'seconds').asHours()) + ' hours',
            size: 1
        },
        {
            title: 'Profile playtime',
            value: Math.round(moment.duration(props.user.osu?.statistics.play_time ?? 0, 'seconds').asHours()) + ' hours',
            size: 1
        },
        {
            title: 'Approx playtime',
            value: Math.round(moment.duration(props.user.data.approximatePlaytime ?? 0, 'seconds').asHours()) + ' hours',
            size: 1
        },
        {
            title: 'Total sessions',
            value: (props.user.data.sessions.length ?? 0).toLocaleString('en-US'),
            size: 1
        },
        {
            title: 'Avg session length',
            value: moment.duration(props.user.data.sessions.length > 0 ? (props.user.data.totalSessionLength / props.user.data.sessions.length) : 0, 'seconds').format('h [hrs], m [min]'),
            size: 1.2
        },
        {
            title: "Longest session",
            value: moment.duration(props.user.data.longestSession.length, 'seconds').format('h [hrs], m [min]'),
            size: 1.2,
            tooltip: 'Started at ' + moment.unix(props.user.data.longestSession.start).format('MMMM Do YYYY, h:mm:ss a') + ' and ended at ' + moment.unix(props.user.data.longestSession.end).format('MMMM Do YYYY, h:mm:ss a')
        },
        {
            title: 'Completion',
            value: (props.user.scores?.length > 0 ? Math.round((100 / props.user.data.beatmaps_count_total * props.user.scores?.length) * 100) / 100 : 0) + '%',
            size: 1
        },
        {
            title: 'Medals',
            value: (props.user.alt.medals?.length ?? 0).toLocaleString('en-US'),
            size: 1
        },
        {
            title: 'Highest Combo',
            value: (props.user.alt.maximum_combo ?? 0).toLocaleString('en-US') + 'x',
            size: 1.2
        }
    ];

    return (<>
        <Paper elevation={2} sx={{ p: 1, pt: 2, pb: 2, pl: 2 }}>
            <Grid2 container rowSpacing={2} columnSpacing={1}>
                {
                    _cards.map((card) => {
                        return (
                            <>
                                <Tooltip title={card.tooltip ?? ''} placement='top-start'>
                                    <Grid2 item xs={6} sm={3} md={1.5} lg={card.size}>
                                        <div>
                                            <Grid2 container sx={{ p: 0.2, position: 'relative' }}>
                                                <GlowBar />
                                                <Grid2 size={12} sx={{ textAlign: 'left' }}>
                                                    <Typography variant='title' sx={{ fontSize: '0.75em' }}>{card.title}</Typography>
                                                </Grid2>
                                                <Grid2 size={12} sx={{ textAlign: 'left' }}>
                                                    <Typography variant='body1' sx={{ fontSize: '1.1em' }}>{card.value}</Typography>
                                                </Grid2>
                                            </Grid2>
                                        </div>
                                    </Grid2>
                                </Tooltip>
                                {/* <Divider orientation='vertical' variant='middle' flexItem sx={{ mr: "-1px" }} /> */}
                            </>
                        )
                    })
                }
            </Grid2>
        </Paper>
        <Grid2 container>
            <Grid2 sx={{ minHeight: '100%', p: 0.5 }} size={{ xs: 6, md: 3 }}><BestScoreCard valueTitle={'Top performance'} valueLabel={`${props.user.data.bestScores.best_pp?.pp.toFixed(1)}pp`} score={props.user.data.bestScores.best_pp} /></Grid2>
            <Grid2 sx={{ minHeight: '100%', p: 0.5 }} size={{ xs: 6, md: 3 }}><BestScoreCard valueTitle={'Top score'} valueLabel={`${props.user.data.bestScores.best_score?.score.toLocaleString('en-US')} score`} score={props.user.data.bestScores.best_score} /></Grid2>
            <Grid2 sx={{ minHeight: '100%', p: 0.5 }} size={{ xs: 6, md: 3 }}><BestScoreCard valueTitle={'Top stars'} valueLabel={`${props.user.data.bestScores.best_sr?.beatmap.difficulty_data.star_rating.toFixed(1)}*`} score={props.user.data.bestScores.best_sr} /></Grid2>
            <Grid2 sx={{ minHeight: '100%', p: 0.5 }} size={{ xs: 6, md: 3 }}><BestScoreCard valueTitle={'Oldest'} valueLabel={`${moment(props.user.data.bestScores.oldest?.date_played).format('MMMM Do YYYY')}`} score={props.user.data.bestScores.oldest} /></Grid2>
        </Grid2>
        <Grid2>
            {
                props?.user?.data?.averageDaySpread && props?.user?.data?.averageDaySpread?.hours && props?.user?.data?.averageDaySpread?.values ?
                    <Paper elevation={3} sx={{ height: 250 }}>
                        <ChartWrapper
                            options={{
                                chart: {
                                    id: "user-hours-spread",
                                },
                            }}
                            series={[
                                {
                                    name: 'Scores set at this hour of the day',
                                    data: props.user.data.averageDaySpread.values.map((value, i) => {
                                        const start = props.user.data.averageDaySpread.hours[i];
                                        const end = i < props.user.data.averageDaySpread.hours.length - 1 ? props.user.data.averageDaySpread.hours[i + 1] : props.user.data.averageDaySpread.hours[0];
                                        return {
                                            x: `${start} - ${end}`,
                                            y: value
                                        }
                                    }),
                                    color: theme.palette.primary.main,
                                }
                            ]}
                            type={'bar'}
                        />
                    </Paper>
                    : <></>
            }
        </Grid2>
        <Grid2>
            {
                props?.user?.data?.latest_scores ?
                    <Paper elevation={2} sx={{ p: 1, pt: 2, pb: 2, pl: 2 }}>
                        <Typography variant='h6'>Latest scores</Typography>
                        <Stack direction="column" justifyContent="center" alignItems="center" sx={{ mt: 2 }} spacing={0.5}>
                            {
                                props?.user?.data?.latest_scores.map((score, index) => {
                                    return (
                                        <ScoreRow data={{
                                            score: score,
                                        }} />
                                    )
                                })
                            }
                        </Stack>
                    </Paper>
                    : <></>
            }
        </Grid2>
    </>);
}

export default SectionCards;