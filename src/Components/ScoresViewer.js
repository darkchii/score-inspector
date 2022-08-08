import { Avatar, BottomNavigation, BottomNavigationAction, Box, Card, CardContent, Grid, Paper, Typography } from "@mui/material";
import React from "react";
import NumberFormat from "react-number-format";
import TimeGraph from "./TimeGraph";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
ChartJS.register(ArcElement, Tooltip, Legend);

function ScoresViewer(props) {
    const [timeGraphValue, setTimeGraphValue] = React.useState(0);

    var scores = props.scores;
    var user = props.user;
    var processedData = props.processedData;

    return (
        <>
            <Grid container spacing={3}>
                <Grid item xs={4} sm={4} md={4}>
                    <Card sx={{ height: '100%' }}>
                        <CardContent>
                            <Grid container spacing={3} sx={{ justifyContent: 'space-between' }}>
                                <Grid item>
                                    <Typography color="textPrimary" variant="h4">{user.username}</Typography>
                                    <Typography color="textSecondary"><NumberFormat displayType={'text'} thousandSeparator={true} value={user.statistics.pp} />pp #<NumberFormat displayType={'text'} thousandSeparator={true} value={user.statistics.global_rank} /> ({user.country_code}#<NumberFormat displayType={'text'} thousandSeparator={true} value={user.statistics.country_rank} />)</Typography>
                                </Grid>
                                <Grid item>
                                    <Avatar src={user.avatar_url} sx={{ width: 56, height: 56 }} />
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={4} sm={4} md={4}>
                    <Card sx={{ height: '100%' }}>
                        <CardContent>
                            <Grid container spacing={3} sx={{ justifyContent: 'space-between' }}>
                                <Grid item>
                                    <Typography color="textPrimary" variant="h4"><NumberFormat displayType={'text'} thousandSeparator={true} value={processedData.scoreCount} /></Typography>
                                    <Typography color="textSecondary">scores</Typography>
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={4} sm={4} md={4}>
                    <Card sx={{ height: '100%' }}>
                        <CardContent>
                            <Grid container spacing={3} sx={{ justifyContent: 'space-between' }}>
                                <Grid item>
                                    <Typography color="textPrimary" variant="h4"><NumberFormat displayType={'text'} thousandSeparator={true} value={processedData.total_pp} /></Typography>
                                    <Typography color="textSecondary">total pp</Typography>
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={3} sm={3} md={3}>
                    <Paper elevation={10}>
                        <Card sx={{ height: '100%' }}>
                            <CardContent>
                                <Grid container spacing={3} sx={{ justifyContent: 'space-between' }}>
                                    <Grid item>
                                        <Typography color="textPrimary">Grades</Typography>
                                        <Pie data={{
                                            labels: ["Silver SS", "SS", "Silver S", "S", "A", "B", "C", "D"],
                                            datasets: [
                                                {
                                                    data: processedData.rankCounts,
                                                    backgroundColor: [
                                                        '#C5C5C5',
                                                        '#FFBA0E',
                                                        '#A3A3A3',
                                                        '#FF940B',
                                                        '#85D61C',
                                                        '#E8B73A',
                                                        '#F78B5C',
                                                        '#F3575A',
                                                    ],
                                                    borderWidth: 0,
                                                }
                                            ]
                                        }} options={{
                                            plugins: {
                                                legend: {
                                                    display: false
                                                }
                                            }
                                        }} />
                                    </Grid>
                                </Grid>
                            </CardContent>
                        </Card>
                    </Paper>
                </Grid>
                <Grid item xs={12} md={12} lg={12}>
                    <Paper elevation={5}>
                        <Grid>
                            {
                                {
                                    0: <TimeGraph name="Scores set per day" labels={processedData.scoresPerDay.map(x => x.date)} data={processedData.scoresPerDay.map(x => x.count_scores)} />,
                                    1: <TimeGraph name="Total score per day" labels={processedData.scoresPerDay.map(x => x.date)} data={processedData.scoresPerDay.map(x => x.total_score)} />,
                                    2: <TimeGraph name="Average PP per play" labels={processedData.scoresPerDay.map(x => x.date)} data={processedData.scoresPerDay.map(x => x.average_pp)} />,
                                }[timeGraphValue]
                            }
                        </Grid>
                        <BottomNavigation showLabels value={timeGraphValue} onChange={(event, newValue) => { setTimeGraphValue(newValue); }}>
                            <BottomNavigationAction label="Plays per day" />
                            <BottomNavigationAction label="Score per day" />
                            <BottomNavigationAction label="PP per play" />
                        </BottomNavigation>
                    </Paper>
                </Grid>
            </Grid>
        </>
    );
}
export default ScoresViewer;