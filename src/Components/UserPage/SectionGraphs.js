import { Box, Button, Grid, Paper, Skeleton, Table, TableBody, TableCell, TableRow, Tooltip, Typography, useTheme } from "@mui/material";
import { useEffect, useState } from "react";
import ChartWrapper from "../../Helpers/ChartWrapper.js";
import ApexCharts from 'apexcharts';

function SectionGraphs(props) {
    const theme = useTheme();
    const [graphData, setGraphData] = useState(null);
    const [graphContent, setGraphContent] = useState(null);

    const _setGraphData = (data) => {
        if (graphData !== null && graphData.id === data.id) return;
        if(graphData !== null){
            const _chart = ApexCharts.getChartByID('user-graphs');
            if(_chart){
                _chart.resetSeries();
            }
        }
        setGraphData(data);
        setGraphContent(null);

        const xy = [];
        data.data.forEach((dataset, i) => {
            xy[i] = {};
            xy[i].name = dataset.label;
            xy[i].data = [];
            dataset.data.forEach((dataPoint, j) => {
                xy[i].data.push([data.labels[j].getTime(), dataPoint]);
            });
            xy[i].color = dataset.color ?? theme.palette.primary.main;
        });

        setGraphContent(xy);
    }

    useEffect(() => {
        if (props.dataset !== undefined && props.dataset.graphs !== null) {
            _setGraphData(props.dataset.graphs[0].graphObjects[0]);
        }
    }, [props.dataset]);

    return (
        (props.dataset !== undefined && graphData !== null && graphContent !== null) ?
            <>
                <Grid container spacing={3}>
                    <Grid item xs={12} md={12} lg={12}>
                        <Paper elevation={5}>
                            <Grid sx={{
                                height: 300
                            }}>
                                <ChartWrapper
                                    options={{
                                        chart: {
                                            id: 'user-graphs'
                                        },
                                        xaxis: {
                                            type: 'datetime',
                                            labels: {
                                                datetimeUTC: false,
                                                format: 'MMM yyyy',
                                            },
                                        },
                                        yaxis: {
                                            labels: {
                                                formatter: (value) => {
                                                    if (!value) return value;
                                                    return value.toLocaleString('en-US');
                                                }
                                            },
                                            showForNullSeries: false,
                                        },
                                        tooltip: {
                                            x: {
                                                format: 'MMM yyyy'
                                            },
                                            y: {
                                                formatter: (value) => {
                                                    if (!value) return value;
                                                    return value.toLocaleString('en-US');
                                                }
                                            }
                                        },
                                        markers: {
                                            showNullDataPoints: false,
                                            size: 4
                                        },
                                        dataLabels: {
                                            enabled: false,
                                        }
                                    }}
                                    series={graphContent}
                                    type={'line'}
                                    style={{
                                        marginRight: '2rem',
                                    }}
                                />
                            </Grid>

                            <Table size='small'>
                                <TableBody>
                                    {
                                        props.dataset.graphs.map((group, i) => (
                                            <TableRow key={i}>
                                                <TableCell>
                                                    <Typography variant="body1">{group.title}</Typography>
                                                </TableCell>
                                                <TableCell>
                                                    {
                                                        group.graphObjects.map((button, j) => {
                                                            const disableButton = button.isDailyApi ? (props.user.daily === null || props.user.daily === undefined || props.user.daily.error !== undefined) : false;

                                                            return (
                                                                <>
                                                                    <Tooltip title={disableButton ? 'No data available from osu!daily api for this user' : ''}>
                                                                        <Box sx={{ display: 'inline-block' }}>
                                                                            <Button sx={{ m: 0.2 }} size='small' disabled={disableButton} variant={graphData.id === button.id ? 'contained' : 'outlined'} key={j} onClick={() => { _setGraphData(button); }}>{button.title}</Button>
                                                                        </Box>
                                                                    </Tooltip>
                                                                </>
                                                            )
                                                        }
                                                        )
                                                    }
                                                </TableCell>
                                            </TableRow>
                                        )
                                        )
                                    }
                                </TableBody>
                            </Table>
                        </Paper>
                    </Grid>
                </Grid>
            </> : <>
                <Skeleton
                    sx={{ bgcolor: 'grey.900' }}
                    variant="rectangular"
                    animation="wave"
                    height={600}
                />
            </>
    );
}

export default SectionGraphs;