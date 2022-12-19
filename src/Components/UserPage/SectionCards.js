import { Avatar, Box, Button, Card, CardContent, Chip, Container, Grid, Input, Modal, Paper, Stack, Table, TableBody, TableCell, TableContainer, TableRow, Tooltip, Typography } from "@mui/material";
import moment from "moment";
import ReactCountryFlag from "react-country-flag";
import { getGradeIcon, IMG_SVG_GRADE_X, IMG_SVG_GRADE_XH } from "../../Helpers/Assets";
import BestScoreCard from "./BestScoreCard";
import Performance2016 from "./Performance/Performance2016";
import PerformanceFC from "./Performance/PerformanceFC";
import PerformanceSS from "./Performance/PerformanceSS";
import PerformanceXexxar from "./Performance/PerformanceXexxar";

function SectionCards(props) {
    if (props.user == null) return (<></>);

    const _cards = [
        {
            title: 'Clears',
            value: props.user.scores?.length.toLocaleString('en-US') ?? 0,
            size: 1.25
        },
        {
            title: 'Play Count',
            value: props.user.osu.statistics.play_count.toLocaleString('en-US'),
            size: 1.25
        },
        {
            title: 'Avg PP',
            value: (Math.round((props.user.data?.average.pp ?? 0) * 100) / 100).toLocaleString('en-US'),
            size: 1.25
        },
        {
            title: 'Avg Acc',
            value: (Math.round((props.user.data?.average.acc ?? 0) * 100) / 100).toLocaleString('en-US') + '%',
            size: 1.25
        },
        {
            title: 'Avg Length',
            value: moment.utc(moment.duration(props.user.data?.average.length ?? 0, 'seconds').asMilliseconds()).format('mm:ss') + ' min',
            size: 1.5
        },
        {
            title: 'Avg Stars',
            value: (Math.round((props.user.data?.average.star_rating ?? 0) * 100) / 100).toLocaleString('en-US') + '*',
            size: 1.25
        },
        {
            title: 'Score per clear',
            value: Math.round(props.user.data?.average.score)?.toLocaleString('en-US') ?? 0,
            size: 2.5
        },
        {
            title: 'Fullcombo\'d',
            value: (((Math.round(props.user.data?.fcRate * 1000) ?? 0) / 10).toLocaleString('en-US') ?? 0) + '%',
            size: 1.75
        },
        {
            title: 'Ranked Score',
            value: props.user.data.total.score.toLocaleString('en-US'),
            size: 2
        },
        {
            title: 'Total Score',
            value: props.user.osu.statistics.total_score?.toLocaleString('en-US') ?? 'N/A',
            size: 2
        },
        {
            title: 'Lazer Score',
            value: Math.round(props.user.data?.total.scoreLazer)?.toLocaleString('en-US') ?? 0,
            size: 2
        },
        {
            title: 'Score Length',
            value: Math.round(moment.duration(props.user.data.total.length, 'seconds').asHours()) + ' hours',
            size: 2
        },
        {
            title: 'Profile playtime',
            value: Math.round(moment.duration(props.user.osu?.statistics.play_time ?? 0, 'seconds').asHours()) + ' hours',
            size: 2
        },
        {
            title: 'Approx playtime',
            value: Math.round(moment.duration(props.user.data.approximatePlaytime ?? 0, 'seconds').asHours()) + ' hours',
            size: 2
        }
    ];

    return (
        <>
            <Grid container>
                {
                    _cards.map((card) => {
                        return (
                            <Grid item xs={card.size} sx={{ p: 0.3 }}>
                                <Card elevation={2}>
                                    <CardContent>
                                        <Grid container>
                                            <Grid item xs={12}>
                                                <Typography variant='title' sx={{ fontSize: '0.85em' }}>{card.title}</Typography>
                                            </Grid>
                                            <Grid item xs={12}>
                                                <Typography variant='body1' sx={{ fontSize: '1.2em' }}>{card.value}</Typography>
                                            </Grid>
                                        </Grid>
                                    </CardContent>
                                </Card>
                            </Grid>
                        )
                    })
                }
            </Grid>
            <Grid container>
                <Grid sx={{ minHeight: '100%', p: 0.5 }} item xs={4}><BestScoreCard valueTitle={'performance'} valueLabel={`${props.user.data.bestScores.best_pp.pp.toFixed(1)}pp`} score={props.user.data.bestScores.best_pp} /></Grid>
                <Grid sx={{ minHeight: '100%', p: 0.5 }} item xs={4}><BestScoreCard valueTitle={'score'} valueLabel={`${props.user.data.bestScores.best_score.score.toLocaleString('en-US')} score`} score={props.user.data.bestScores.best_score} /></Grid>
                <Grid sx={{ minHeight: '100%', p: 0.5 }} item xs={4}><BestScoreCard valueTitle={'stars'} valueLabel={`${props.user.data.bestScores.best_sr.star_rating.toFixed(1)}*`} score={props.user.data.bestScores.best_sr} /></Grid>
            </Grid>
            <Grid container>
                <Grid sx={{ minHeight: '100%', p: 0.5 }} item xs={3}><PerformanceFC data={props.user} /></Grid>
                <Grid sx={{ minHeight: '100%', p: 0.5 }} item xs={3}><PerformanceSS data={props.user} /></Grid>
                <Grid sx={{ minHeight: '100%', p: 0.5 }} item xs={3}><Performance2016 data={props.user} /></Grid>
                <Grid sx={{ minHeight: '100%', p: 0.5 }} item xs={3}><PerformanceXexxar data={props.user} /></Grid>
            </Grid>
        </>
    )
}

export default SectionCards;