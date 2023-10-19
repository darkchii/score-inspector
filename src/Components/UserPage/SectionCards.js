import { Grid, Paper, Typography, useTheme } from "@mui/material";
import moment from "moment";
import BestScoreCard from "./BestScoreCard";
import PerformanceFC from "./Performance/PerformanceFC";
import PerformanceSS from "./Performance/PerformanceSS";
import PerformanceXexxar from "./Performance/PerformanceXexxar";
import GlowBar from "../UI/GlowBar";
import { BarChart } from "@mui/x-charts";
import PerformanceAny from "./Performance/PerformanceAny.js";

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
            size: 1
        },
        {
            title: 'Avg Acc',
            value: (Math.round((props.user.data?.average.acc ?? 0) * 100) / 100).toLocaleString('en-US') + '%',
            size: 1
        },
        {
            title: 'Avg Length',
            value: moment.duration(props.user.data?.average.length ?? 0, 'seconds').format('mm:ss'),
            size: 1
        },
        {
            title: 'Avg Stars',
            value: (Math.round((props.user.data?.average.star_rating ?? 0) * 100) / 100).toLocaleString('en-US') + '*',
            size: 1
        },
        {
            title: 'Score per clear',
            value: Math.round(props.user.data?.average.score)?.toLocaleString('en-US') ?? 0,
            size: 1
        },
        {
            title: 'Fullcombo\'d',
            value: (((Math.round(props.user.data?.fcRate * 1000) ?? 0) / 10).toLocaleString('en-US') ?? 0) + '%',
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
            title: 'Lazer Score',
            value: Math.round(props.user.data?.total.scoreLazer)?.toLocaleString('en-US') ?? 0,
            size: 1.5
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
            title: 'Completion',
            value: (props.user.scores?.length > 0 ? Math.round((100 / props.user.data.total_beatmaps * props.user.scores?.length) * 100) / 100 : 0) + '%',
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
        },
        {
            title: 'Unique SS',
            value: (props.user.alt.unique_ss?.length ?? 0).toLocaleString('en-US'),
            size: 1.2
        },
        {
            title: 'Unique FC',
            value: (props.user.alt.unique_fc?.length ?? 0).toLocaleString('en-US'),
            size: 1.2
        },
        {
            title: 'Unique DT FC',
            value: (props.user.alt.unique_dt_fc?.length ?? 0).toLocaleString('en-US'),
            size: 1.2
        }
    ];

    return (
        <>
            <Paper elevation={2} sx={{ p: 1, pt: 2, pb: 2, pl: 2 }}>
                <Grid container rowSpacing={2} columnSpacing={1}>
                    {
                        _cards.map((card) => {
                            return (
                                <>
                                    <Grid item xs={6} sm={3} md={1.5} lg={card.size}>
                                        <Grid container sx={{ p: 0.2, position: 'relative' }}>
                                            <GlowBar />
                                            <Grid item xs={12} sx={{ textAlign: 'left' }}>
                                                <Typography variant='title' sx={{ fontSize: '0.75em' }}>{card.title}</Typography>
                                            </Grid>
                                            <Grid item xs={12} sx={{ textAlign: 'left' }}>
                                                <Typography variant='body1' sx={{ fontSize: '1.1em' }}>{card.value}</Typography>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                    {/* <Divider orientation='vertical' variant='middle' flexItem sx={{ mr: "-1px" }} /> */}
                                </>
                            )
                        })
                    }
                </Grid>
            </Paper>
            <Grid container>
                <Grid sx={{ minHeight: '100%', p: 0.5 }} item xs={6} md={3}><BestScoreCard valueTitle={'Top performance'} valueLabel={`${props.user.data.bestScores.best_pp.pp.toFixed(1)}pp`} score={props.user.data.bestScores.best_pp} /></Grid>
                <Grid sx={{ minHeight: '100%', p: 0.5 }} item xs={6} md={3}><BestScoreCard valueTitle={'Top score'} valueLabel={`${props.user.data.bestScores.best_score.score.toLocaleString('en-US')} score`} score={props.user.data.bestScores.best_score} /></Grid>
                <Grid sx={{ minHeight: '100%', p: 0.5 }} item xs={6} md={3}><BestScoreCard valueTitle={'Top stars'} valueLabel={`${props.user.data.bestScores.best_sr.beatmap.modded_sr['live'].star_rating.toFixed(1)}*`} score={props.user.data.bestScores.best_sr} /></Grid>
                <Grid sx={{ minHeight: '100%', p: 0.5 }} item xs={6} md={3}><BestScoreCard valueTitle={'Oldest'} valueLabel={`${moment(props.user.data.bestScores.oldest.date_played).format('MMMM Mo YYYY')}`} score={props.user.data.bestScores.oldest} /></Grid>
            </Grid>
            <Grid sx={{ p: 0.5 }}>
                <Paper elevation={2} sx={{ p: 2 }}>
                    <Grid container spacing={2}>
                        <Grid sx={{ minHeight: '100%', p: 0.5 }} item xs={6} md={12 / 8}><PerformanceAny data={props.user} pp_version='live' hide_diff={true} /></Grid>
                        <Grid sx={{ minHeight: '100%', p: 0.5 }} item xs={6} md={12 / 8}><PerformanceFC data={props.user} /></Grid>
                        <Grid sx={{ minHeight: '100%', p: 0.5 }} item xs={6} md={12 / 8}><PerformanceSS data={props.user} /></Grid>
                        <Grid sx={{ minHeight: '100%', p: 0.5 }} item xs={6} md={12 / 8}><PerformanceAny data={props.user} pp_version='v1' /></Grid>
                        <Grid sx={{ minHeight: '100%', p: 0.5 }} item xs={6} md={12 / 8}><PerformanceAny data={props.user} pp_version='2014may'/></Grid>
                        <Grid sx={{ minHeight: '100%', p: 0.5 }} item xs={6} md={12 / 8}><PerformanceAny data={props.user} pp_version='2014july'/></Grid>
                        {/* <Grid sx={{ minHeight: '100%', p: 0.5 }} item xs={6} md={18 / 7}><PerformanceAny data={props.user} pp_version='2015february'/></Grid>
                        <Grid sx={{ minHeight: '100%', p: 0.5 }} item xs={6} md={12 / 8}><PerformanceAny data={props.user} pp_version='2015april'/></Grid> */}
                        <Grid sx={{ minHeight: '100%', p: 0.5 }} item xs={6} md={12 / 8}><PerformanceAny data={props.user} pp_version='2018'/></Grid>
                        <Grid sx={{ minHeight: '100%', p: 0.5 }} item xs={6} md={12 / 8}><PerformanceAny data={props.user} pp_version='2019'/></Grid>
                        <Grid sx={{ minHeight: '100%', p: 0.5 }} item xs={6} md={12 / 8}><PerformanceAny data={props.user} pp_version='2021january'/></Grid>
                        <Grid sx={{ minHeight: '100%', p: 0.5 }} item xs={6} md={12 / 8}><PerformanceAny data={props.user} pp_version='2021july'/></Grid>
                        <Grid sx={{ minHeight: '100%', p: 0.5 }} item xs={6} md={12 / 8}><PerformanceAny data={props.user} pp_version='2021november'/></Grid>
                        <Grid sx={{ minHeight: '100%', p: 0.5 }} item xs={6} md={12 / 8}><PerformanceXexxar data={props.user} /></Grid>
                    </Grid>
                </Paper>
            </Grid>
            <Grid>
                {
                    props?.user?.data?.averageDaySpread && props?.user?.data?.averageDaySpread?.hours && props?.user?.data?.averageDaySpread?.values ?
                        <Paper elevation={3}>
                            <BarChart
                                margin={{
                                    top: 20,
                                    bottom: 40
                                }}
                                height={250}
                                series={
                                    [
                                        {
                                            type: 'bar',
                                            data: props.user.data.averageDaySpread.values,
                                            color: theme.palette.primary.main,
                                        }
                                    ]
                                }
                                xAxis={[
                                    {
                                        data: props.user.data.averageDaySpread.hours,
                                        scaleType: 'band'
                                    }
                                ]}
                            />
                        </Paper>
                        : <></>
                }
            </Grid>
        </>
    )
}

export default SectionCards;