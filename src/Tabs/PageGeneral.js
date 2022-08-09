import { Avatar, BottomNavigation, BottomNavigationAction, Box, Card, CardContent, Grid, Paper, Stack, Table, TableBody, TableCell, TableContainer, TableRow, Tooltip, Typography } from "@mui/material";
import React, { useEffect } from "react";
import NumberFormat from "react-number-format";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip as ChartTooltip, Legend } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { getModString, mods, mod_strings_long } from "../helper";
import { getModIcon } from "../Assets";
import moment from "moment";
ChartJS.register(ArcElement, ChartTooltip, Legend, ChartDataLabels);

function PageGeneral(props) {
    return (
        <>
            <Grid container spacing={3}>
                <Grid item xs={12} sm={6} md={3}>
                    <Card>
                        <CardContent>
                            <Grid container spacing={3} sx={{ justifyContent: 'space-between' }}>
                                <Grid item>
                                    <Typography color="textPrimary" variant="h4">{props.data.user.username}</Typography>
                                    <Typography color="textSecondary"><NumberFormat displayType={'text'} thousandSeparator={true} value={props.data.user.statistics.pp} />pp #<NumberFormat displayType={'text'} thousandSeparator={true} value={props.data.user.statistics.global_rank} /> ({props.data.user.country_code}#<NumberFormat displayType={'text'} thousandSeparator={true} value={props.data.user.statistics.country_rank} />)</Typography>
                                </Grid>
                                <Grid item>
                                    <Avatar src={props.data.user.avatar_url} sx={{ width: 56, height: 56 }} />
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <Card>
                        <CardContent>
                            <Grid container spacing={3} sx={{ justifyContent: 'space-between' }}>
                                <Grid item>
                                    <Typography color="textPrimary" variant="h4"><NumberFormat displayType={'text'} thousandSeparator={true} value={props.data.processed.scoreCount} /></Typography>
                                    <Typography color="textSecondary">scores</Typography>
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <Card>
                        <CardContent>
                            <Grid container spacing={3} sx={{ justifyContent: 'space-between' }}>
                                <Grid item>
                                    <Typography color="textPrimary" variant="h4"><NumberFormat displayType={'text'} thousandSeparator={true} value={props.data.processed.total_pp.toFixed(0)} /></Typography>
                                    <Typography color="textSecondary">total pp</Typography>
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <Card>
                        <CardContent>
                            <Grid container spacing={3} sx={{ justifyContent: 'space-between' }}>
                                <Grid item>
                                    <Typography color="textPrimary" variant="h4"><NumberFormat displayType={'text'} thousandSeparator={true} value={props.data.processed.average_pp.toFixed(2)} /></Typography>
                                    <Typography color="textSecondary">average pp</Typography>
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <Card>
                        <CardContent>
                            <Grid container spacing={3} sx={{ justifyContent: 'space-between' }}>
                                <Grid item>
                                    <Typography color="textPrimary" variant="h4"><NumberFormat displayType={'text'} thousandSeparator={true} value={props.data.processed.average_sr.toFixed(2)} />*</Typography>
                                    <Typography color="textSecondary">average star rating</Typography>
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <Card>
                        <CardContent>
                            <Grid container spacing={3} sx={{ justifyContent: 'space-between' }}>
                                <Grid item>
                                    <Typography color="textPrimary" variant="h4"><NumberFormat displayType={'text'} thousandSeparator={true} value={props.data.processed.highest_sr.toFixed(2)} />*</Typography>
                                    <Typography color="textSecondary">highest star rating pass</Typography>
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <Card>
                        <CardContent>
                            <Grid container spacing={3} sx={{ justifyContent: 'space-between' }}>
                                <Grid item>
                                    <Typography color="textPrimary" variant="h4"><NumberFormat displayType={'text'} thousandSeparator={true} value={props.data.processed.average_score.toFixed(0)} /></Typography>
                                    <Typography color="textSecondary">ranked score per play</Typography>
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <Card>
                        <CardContent>
                            <Grid container spacing={3} sx={{ justifyContent: 'space-between' }}>
                                <Grid item>
                                    <Typography color="textPrimary" variant="h4"><NumberFormat displayType={'text'} thousandSeparator={true} value={props.data.processed.fc_rate.toFixed(0)} />%</Typography>
                                    <Typography color="textSecondary">of scores are full combo</Typography>
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
            <Grid container spacing={3} sx={{ mt: 1 }}>
                <Grid item xs={12} sm={3} md={3}>
                    <Grid container spacing={3}>
                        <Grid item xs={12} sm={12} md={12}>
                            <Card>
                                <CardContent>
                                    <Grid container spacing={3} sx={{ justifyContent: 'space-between' }}>
                                        <Grid item>
                                            <Typography color="textPrimary" variant="h4">
                                                {props.data.user.scoreRank !== undefined && props.data.user.scoreRank > 0 ?
                                                    <>#<NumberFormat displayType={'text'} thousandSeparator={true} value={props.data.user.scoreRank.toLocaleString("en-US")} /></>
                                                    : <>&gt;#10,000</>}
                                            </Typography>
                                            <Typography color="textSecondary">score rank</Typography>
                                        </Grid>
                                    </Grid>
                                </CardContent>
                            </Card>
                        </Grid>
                        <Grid item xs={12} sm={12} md={12}>
                            <Card>
                                <CardContent>
                                    <Grid container spacing={3} sx={{ justifyContent: 'space-between' }}>
                                        <Grid item>
                                            <Typography color="textPrimary" variant="h4">{(props.data.processed.total_length/60/60).toFixed(1)} hours</Typography>
                                            <Typography color="textSecondary">total length</Typography>
                                        </Grid>
                                    </Grid>
                                </CardContent>
                            </Card>
                        </Grid>
                        <Grid item xs={12} sm={12} md={12}>
                            <Card>
                                <CardContent>
                                    <Grid container spacing={3} sx={{ justifyContent: 'space-between' }}>
                                        <Grid item>
                                            <Typography color="textPrimary" variant="h4">{moment.utc(moment.duration(props.data.processed.average_length, "seconds").asMilliseconds()).format("mm:ss")} minutes</Typography>
                                            <Typography color="textSecondary">average length</Typography>
                                        </Grid>
                                    </Grid>
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item xs={12} sm={3} md={3}>
                    <Card sx={{ height: "100%" }}>
                        <CardContent>
                            <Grid container spacing={3} sx={{ justifyContent: 'space-between' }}>
                                <Grid item sx={{width:'100%'}}>
                                    <Typography color="textPrimary">tag occurances ({props.data.processed.usedTags.length.toLocaleString("en-US")} total)</Typography>
                                    <TableContainer>
                                        <Table size="small">
                                            <TableBody>
                                                {
                                                    props.data.processed.usedTags.slice(0, 9).map((row) => (
                                                        <TableRow>
                                                            <TableCell component="th" scope="row">
                                                                {row.tag}
                                                            </TableCell>
                                                            <TableCell component="th" scope="row">
                                                                {row.value.toLocaleString("en-US")}
                                                            </TableCell>
                                                        </TableRow>
                                                    ))
                                                }
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <Paper elevation={10} sx={{ height: "100%" }}>
                        <Card sx={{ height: "100%" }}>
                            <CardContent>
                                <Typography color="textPrimary">grades</Typography>
                                <Grid container spacing={3} sx={{ justifyContent: 'center' }}>
                                    <Grid item>
                                        <Pie data={{
                                            labels: ["Silver SS", "SS", "Silver S", "S", "A", "B", "C", "D"],
                                            datasets: [
                                                {
                                                    data: props.data.processed.rankCounts,
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
                                                    borderWidth: 1,
                                                }
                                            ]
                                        }} options={{
                                            plugins: {
                                                legend: {
                                                    display: false
                                                },
                                                datalabels: {
                                                    display: 'auto',
                                                    color: 'white',
                                                    font: {
                                                        family: "Roboto"
                                                    },
                                                    backgroundColor: '#00000088',
                                                    formatter: function (value, context) {
                                                        return (value!==undefined?(`${context.chart.data.labels[context.dataIndex]}: ${value.toLocaleString("en-US")} (${(100 / props.data.scores.length * value).toFixed(2)}%)`):"");
                                                    }
                                                }
                                            }
                                        }} />
                                    </Grid>
                                </Grid>
                            </CardContent>
                        </Card>
                    </Paper>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <Card sx={{ height: "100%" }}>
                        <CardContent>
                            <Grid container spacing={3} sx={{ justifyContent: 'space-between' }}>
                                <Grid item sx={{width:'100%'}}>
                                    <Typography color="textPrimary">most used mod combinations</Typography>
                                    <TableContainer>
                                        <Table size="small">
                                            <TableBody>
                                                {
                                                    props.data.processed.usedMods.slice(0, 8).map((row) => (
                                                        <TableRow>
                                                            <TableCell component="th" scope="row">
                                                                {row.mods.length > 0 ? row.mods.split(",").map(mod => (
                                                                    <>
                                                                        <Tooltip title={mod_strings_long[mods[mod]]}>
                                                                            <img height="20px" src={getModIcon(mod)} alt={mod} />
                                                                        </Tooltip>
                                                                    </>
                                                                )) : "None"}
                                                            </TableCell>
                                                            <TableCell component="th" scope="row">
                                                                {row.value.toLocaleString("en-US")}
                                                            </TableCell>
                                                        </TableRow>
                                                    ))
                                                }
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </>
    );
}
export default PageGeneral;