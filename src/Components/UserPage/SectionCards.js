import { Box, Grid, Paper, Typography, useTheme } from "@mui/material";
import moment from "moment";
import BestScoreCard from "./BestScoreCard";
import Performance2016 from "./Performance/Performance2016";
import PerformanceFC from "./Performance/PerformanceFC";
import PerformanceSS from "./Performance/PerformanceSS";
import PerformanceXexxar from "./Performance/PerformanceXexxar";
import momentDurationFormatSetup from "moment-duration-format";
import { Chart, registerables } from 'chart.js'
import { Bar } from "react-chartjs-2";
import ChartDataLabels from 'chartjs-plugin-datalabels';
import PerformanceLazer from "./Performance/PerformanceLazer";
import Performance2014 from "./Performance/Performance2014";
import GlowBar from "../UI/GlowBar";
Chart.register(...registerables, ChartDataLabels)
momentDurationFormatSetup(moment);

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
                                    <Grid item xs={card.size}>
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
                <Grid sx={{ minHeight: '100%', p: 0.5 }} item xs={3}><BestScoreCard valueTitle={'Top performance'} valueLabel={`${props.user.data.bestScores.best_pp.pp.toFixed(1)}pp`} score={props.user.data.bestScores.best_pp} /></Grid>
                <Grid sx={{ minHeight: '100%', p: 0.5 }} item xs={3}><BestScoreCard valueTitle={'Top score'} valueLabel={`${props.user.data.bestScores.best_score.score.toLocaleString('en-US')} score`} score={props.user.data.bestScores.best_score} /></Grid>
                <Grid sx={{ minHeight: '100%', p: 0.5 }} item xs={3}><BestScoreCard valueTitle={'Top stars'} valueLabel={`${props.user.data.bestScores.best_sr.beatmap.modded_sr.star_rating.toFixed(1)}*`} score={props.user.data.bestScores.best_sr} /></Grid>
                <Grid sx={{ minHeight: '100%', p: 0.5 }} item xs={3}><BestScoreCard valueTitle={'Oldest'} valueLabel={`${moment(props.user.data.bestScores.oldest.date_played).format('MMMM Mo YYYY')}`} score={props.user.data.bestScores.oldest} /></Grid>
            </Grid>
            <Grid sx={{ p: 0.5 }}>
                <Paper elevation={2} sx={{ p: 2 }}>
                    <Grid container spacing={2}>
                        <Grid sx={{ minHeight: '100%', p: 0.5 }} item xs={12 / 6}><PerformanceFC data={props.user} /></Grid>
                        <Grid sx={{ minHeight: '100%', p: 0.5 }} item xs={12 / 6}><PerformanceSS data={props.user} /></Grid>
                        <Grid sx={{ minHeight: '100%', p: 0.5 }} item xs={12 / 6}><Performance2014 data={props.user} /></Grid>
                        <Grid sx={{ minHeight: '100%', p: 0.5 }} item xs={12 / 6}><Performance2016 data={props.user} /></Grid>
                        <Grid sx={{ minHeight: '100%', p: 0.5 }} item xs={12 / 6}><PerformanceLazer data={props.user} /></Grid>
                        <Grid sx={{ minHeight: '100%', p: 0.5 }} item xs={12 / 6}><PerformanceXexxar data={props.user} /></Grid>
                    </Grid>
                </Paper>
            </Grid>
            <Grid>
                {
                    props?.user?.data?.averageDaySpread && props?.user?.data?.averageDaySpread?.hours && props?.user?.data?.averageDaySpread?.values ?
                        <Paper sx={{ p: 0.5, m: 0.5 }} elevation={3}>
                            <Bar height={'220px'} options={{
                                type: 'bar',
                                data: {},
                                maintainAspectRatio: false,
                                plugins: {
                                    datalabels: {
                                        color: 'white',
                                        backgroundColor: '#00000088',
                                        borderRadius: 5,
                                        font: {
                                            family: "Roboto"
                                        },
                                    }
                                }
                            }}
                                data={{
                                    labels: props.user.data.averageDaySpread.hours,
                                    datasets: [
                                        {
                                            label: 'Scores set at time of day (UTC)',
                                            data: props.user.data.averageDaySpread.values,
                                            backgroundColor: `${theme.palette.primary.main}dd`,
                                            borderRadius: 10,
                                        }
                                    ]
                                }}
                            />
                        </Paper>
                        : <></>
                }
            </Grid>
        </>
    )
}

export default SectionCards;