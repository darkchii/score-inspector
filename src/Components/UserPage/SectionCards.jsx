import { Grid2, Paper, Stack, Typography, useTheme } from "@mui/material";
import moment from "moment";
import BestScoreCard from "./BestScoreCard";
import ChartWrapper from "../../Helpers/ChartWrapper";
import { formatNumber } from "../../Helpers/Misc";
import ScoreRow from "../ScoreRow";
import ScoreViewStat from "../UI/ScoreViewStat";
import { CalculateNewXPLevel } from "../../Helpers/Osu";

function SectionCards(props) {
    const theme = useTheme();
    if (props.user == null) return (<></>);

    const _cards = [
        {
            title: 'Clears',
            value: formatNumber(props.user.data.clears ?? 0),
            row: 0,
        },
        {
            title: 'Play Count',
            value: formatNumber(props.user.osu.statistics.play_count ?? 0),
            row: 0,
        },
        {
            title: 'Performance',
            value: formatNumber(props.user.osu.statistics.pp, 0) + 'pp',
            tooltip: `${formatNumber(props.user.osu.statistics.pp, 2)}pp`,
            row: 0,
        },
        {
            title: 'Avg PP',
            value: formatNumber(props.user.data?.average.pp) + 'pp',
            row: 0,
        },
        {
            title: 'Avg Acc',
            value: formatNumber(props.user.data?.average.acc, 2) + '%',
            row: 0,
        },
        {
            title: 'Avg Length',
            value: moment.duration(props.user.data?.average.length ?? 0, 'seconds').format('mm:ss'),
            row: 0,
        },
        {
            title: 'Avg Stars',
            value: formatNumber(props.user.data?.average.star_rating, 1) + '*',
            row: 0,
        },
        {
            title: 'Fullcombo\'d',
            value: formatNumber((props.user.data?.fcRate ?? 0) * 100, 2) + '%',
            row: 0,
        },
        {
            title: 'Score per clear',
            value: (
                <span>{formatNumber(props.user.data?.average.score, 0)}</span>
            ),
            row: 0,
        },
        {
            title: 'Ranked Score',
            value: (
                <span style={{ fontSize: '18px' }}>{formatNumber(props.user.data.total.score, 0)}</span>
            ),
            row: 0,
        },
        {
            title: 'Standardised Score',
            value: (
                <span style={{ fontSize: '18px' }}>{formatNumber(props.user.data?.total.scoreLazerStandardised, 0)}</span>
            ),
            row: 0,
        },
        {
            title: 'Total Score',
            // value: formatNumber(props.user.osu.statistics.total_score, 0) ?? 'N/A',
            value: (
                <span style={{ fontSize: '18px' }}>{formatNumber(props.user.osu.statistics.total_score, 0)}</span>
            ),
            row: 0,
        },
        {
            title: 'XP 2.0',
            // value: formatNumber(props.user.alt.unique_ss?.length ?? 0, 0),
            value: `${formatNumber(props.user.xp ?? 0, 0)}`,
            tooltip: 'New proposed XP/level system based on grades, score, medals and playtime',
            row: 1,
        },
        {
            title: 'Level 2.0',
            value: `${formatNumber(CalculateNewXPLevel(props.user.xp ?? 0), 2)}`,
            tooltip: 'New proposed XP/level system based on grades, score, medals and playtime',
            row: 1,
        },
        {
            title: 'Unique SS / FC / DT FC',
            // value: formatNumber(props.user.alt.unique_ss?.length ?? 0, 0),
            value: `${formatNumber(props.user.alt.unique_ss?.length ?? 0, 0)} / ${formatNumber(props.user.alt.unique_fc?.length ?? 0, 0)} / ${formatNumber(props.user.alt.unique_dt_fc?.length ?? 0, 0)}`,
            row: 1,
        },
        {
            title: 'Score Length',
            value: formatNumber(moment.duration(props.user.data.total.length, 'seconds').asHours(), 0) + ' hours',
            row: 1,
        },
        {
            title: 'Profile playtime',
            value: formatNumber(moment.duration(props.user.osu?.statistics.play_time ?? 0, 'seconds').asHours(), 0) + ' hours',
            row: 1,
        },
        {
            title: 'Approx playtime',
            value: formatNumber(moment.duration(props.user.data.approximatePlaytime ?? 0, 'seconds').asHours(), 0) + ' hours',
            row: 1,
        },
        {
            title: 'Total sessions',
            value: formatNumber(props.user.data.sessions.length ?? 0, 0),
            row: 1,
        },
        {
            title: 'Avg session length',
            value: moment.duration(props.user.data.sessions.length > 0 ? (props.user.data.totalSessionLength / props.user.data.sessions.length) : 0, 'seconds').format('h[h]m[m]'),
            row: 1,
        },
        {
            title: "Longest session",
            value: moment.duration(props.user.data.longestSession.length, 'seconds').format('h[h]m[m]'),
            tooltip: 'Started at ' + moment.unix(props.user.data.longestSession.start).format('MMMM Do YYYY, h:mm:ss a') + ' and ended at ' + moment.unix(props.user.data.longestSession.end).format('MMMM Do YYYY, h:mm:ss a'),
            row: 1,
        },
        {
            title: 'Completion',
            value: (props.user.scores?.length > 0 ? Math.round((100 / props.user.data.beatmaps_count_total * props.user.scores?.length) * 100) / 100 : 0) + '%',
            row: 1,
        },
        {
            title: 'Medals',
            value: (props.user.alt.medals?.length ?? 0).toLocaleString('en-US'),
            row: 1,
        },
        {
            title: 'Highest Combo',
            value: (props.user.alt.maximum_combo ?? 0).toLocaleString('en-US') + 'x',
            row: 1,
        },
        {
            title: 'Daily Challenge',
            // value: (props.user.osu.daily_challenge_user_stats?.daily_streak_current ?? 0)+ ' streak / ' + (props.user.osu.daily_challenge_user_stats?.playcount ?? 0) + ' total',
            value: (
                <>
                    <span>
                        {(props.user.osu.daily_challenge_user_stats?.daily_streak_current ?? 0)} <span style={{ color: theme.palette.text.secondary, fontSize: '0.7rem' }}>streak,</span> {(props.user.osu.daily_challenge_user_stats?.playcount ?? 0)} <span style={{ color: theme.palette.text.secondary, fontSize: '0.7rem' }}>total</span>
                    </span>
                </>
            ),
            row: 1,
        }
    ];

    return (<>
        <Paper elevation={2} sx={{ p: 1 }}>
            <Grid2 container rowSpacing={2} columnSpacing={1}>
                <div className='score-stats__group score-stats__group--stats'>
                    {
                        //map by row
                        Array.from(new Set(_cards.map(card => card.row))).map((row, index) => {
                            return (
                                <div key={index} className='score-stats__group-row'>
                                    {
                                        _cards.filter(card => card.row === row).map((card, j) => {
                                            return (
                                                <ScoreViewStat
                                                    key={j}
                                                    label={card.title}
                                                    value={card.value}
                                                    tooltip={card.tooltip}
                                                />
                                            )
                                        })
                                    }
                                </div>
                            )
                        })
                    }
                </div>
            </Grid2>
        </Paper >
        <Grid2 container spacing={0.5}>
            <Grid2 sx={{ minHeight: '100%' }} size={{ xs: 6, md: 3 }}><BestScoreCard valueTitle={'Top performance'} valueLabel={`${props.user.data.bestScores.best_pp?.pp.toFixed(1)}pp`} score={props.user.data.bestScores.best_pp} /></Grid2>
            <Grid2 sx={{ minHeight: '100%' }} size={{ xs: 6, md: 3 }}><BestScoreCard valueTitle={'Top score'} valueLabel={`${props.user.data.bestScores.best_score?.score.toLocaleString('en-US')} score`} score={props.user.data.bestScores.best_score} /></Grid2>
            <Grid2 sx={{ minHeight: '100%' }} size={{ xs: 6, md: 3 }}><BestScoreCard valueTitle={'Top stars'} valueLabel={`${props.user.data.bestScores.best_sr?.beatmap.difficulty.star_rating.toFixed(1)}*`} score={props.user.data.bestScores.best_sr} /></Grid2>
            <Grid2 sx={{ minHeight: '100%' }} size={{ xs: 6, md: 3 }}><BestScoreCard valueTitle={'Oldest'} valueLabel={`${moment(props.user.data.bestScores.oldest?.date_played).format('MMMM Do YYYY')}`} score={props.user.data.bestScores.oldest} /></Grid2>
        </Grid2>
        <Grid2 container spacing={1}>
            <Grid2 size={{ xs: 12, md: 6 }}>
                {
                    props?.user?.data?.averageDaySpread && props?.user?.data?.averageDaySpread?.hours && props?.user?.data?.averageDaySpread?.values ?
                        <Paper elevation={3} sx={{ height: 250, p: 1 }}>
                            <Typography variant='h6'>Average played hours spread</Typography>
                            <ChartWrapper
                                style={{ margin: '0' }}
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
            <Grid2 size={{ xs: 12, md: 6 }}>
                {
                    props?.user?.data?.averageRateChangeSpread ?
                        <Paper elevation={3} sx={{ height: 250, p: 1 }}>
                            <Typography variant='h6'>Rate change spread</Typography>
                            <ChartWrapper
                                height='80%'
                                style={{ margin: '0' }}
                                options={{
                                    chart: {
                                        id: "rate-change-spread",
                                    },
                                }}
                                series={[
                                    {
                                        name: 'Rate change',
                                        data: props.user.data.averageRateChangeSpread.map((obj, i) => {
                                            const rate = obj.rate;
                                            const value = obj.count;
                                            return {
                                                x: `x${rate}`,
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
                                        <ScoreRow key={index} data={{
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