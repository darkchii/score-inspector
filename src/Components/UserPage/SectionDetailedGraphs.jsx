import { Alert, Box, Button, Grid2, Paper, Typography, useTheme } from "@mui/material";
import ChartWrapper from "../../Helpers/ChartWrapper";
import _ from "lodash";
import { formatNumber, range } from "../../Helpers/Misc";
import Mods from "../../Helpers/Mods";
import { useEffect, useState } from "react";
import Loader from "../UI/Loader";

function SectionDetailedGraphs(props) {
    if (props.user == null) return (<></>);
    return (
        <>
            <Alert severity="info" sx={{ mb: 2 }}>
                These graphs go very in-depth and may be hard to read and/or comprehend. <br />
                This is primarily meant for players who like to play with the lazer mod settings etc. and for graphs that don&apos;t fit the criteria for the other graph section.
            </Alert>
            <Box sx={{
                m: 1,
            }}>
                <Grid2 container spacing={2}>
                    <Grid2 item size={{ xs: 12 }}>
                        <Paper sx={{ p: 2 }}>
                            <Typography variant='h5'>Top plays</Typography>
                            <Box sx={{ height: 250, width: '100%' }}>
                                <SectionDetailedGraphsTopPlays scores={props.user.scores} />
                            </Box>
                        </Paper>
                    </Grid2>
                    <Grid2 item size={{ xs: 12 }}>
                        <Paper sx={{ p: 2 }}>
                            <Typography variant='h5'>Rate change spread</Typography>
                            <Box sx={{ height: 200, width: '100%' }}>
                                <SectionDetailedGraphsRateChangeSpread rateChangeSpread={props.user.data.ultra_detailed.rate_change_spread} />
                            </Box>
                        </Paper>
                    </Grid2>
                    <Grid2 item size={{ xs: 12, md: 6 }}>
                        <Paper sx={{ p: 2 }}>
                            <Typography variant='h5'>Session time spread</Typography>
                            <Box sx={{ height: 200 }}>
                                <SectionDetailedGraphsSessionTimeSpread sessionTimeSpread={props.user.data.ultra_detailed.session_time_spread} />
                            </Box>
                        </Paper>
                    </Grid2>
                    <Grid2 item size={{ xs: 12, md: 6 }}>
                        <Paper sx={{ p: 2 }}>
                            <Typography variant='h5'>Average rate change per star rating</Typography>
                            <Box sx={{ height: 200 }}>
                                <SectionDetailedGraphsRateChangeStarsSpread rate_change_to_stars_spread={props.user.data.ultra_detailed.rate_change_to_stars_spread} />
                            </Box>
                        </Paper>
                    </Grid2>
                    <Grid2 item size={{ xs: 12 }}>
                        <Paper sx={{ p: 2 }}>
                            <Typography variant='h5'>Mod spread</Typography>
                            <Box>
                                <SectionDetailedGraphsModSpread modSpread={props.user.data.ultra_detailed.mod_spread} />
                            </Box>
                        </Paper>
                    </Grid2>
                </Grid2>
            </Box>
        </>
    )
}

const TOP_PLAY_GRAPH_DATA = [
    {
        name: 'Performance',
        data_points: [
            {
                name: 'Performance',
                path: 'pp',
                size: 4
            },
            {
                name: 'Performance (if FC)',
                // path: 'recalc['fc']?.total',
                path: 'recalc.fc.total',
                size: 1
            }
        ],
        formatter: (value) => `${formatNumber(value)}pp`
    },
    {
        name: 'Score',
        data_points: [
            {
                name: 'Score',
                path: 'score',
                size: 4
            }
        ],
        formatter: (value) => `${formatNumber(value)}`
    },
    {
        name: 'Difficulty',
        data_points: [
            {
                name: 'Starrating',
                path: 'beatmap.difficulty.star_rating',
                size: 4
            },
            {
                name: 'Aim',
                path: 'beatmap.difficulty.aim_difficulty',
                size: 1
            }, {
                name: 'Speed',
                path: 'beatmap.difficulty.speed_difficulty',
                size: 1
            }, {
                name: 'Flashlight',
                path: 'beatmap.difficulty.flashlight_difficulty',
                size: 1
            }
        ],
        formatter: (value) => `${value.toFixed(2)}*`
    },
    {
        name: 'Unmodded Difficulty',
        data_points: [
            {
                name: 'Starrating',
                path: 'beatmap.stars',
                size: 4
            },
            {
                name: 'Aim',
                path: 'beatmap.diff_aim',
                size: 1
            }, {
                name: 'Speed',
                path: 'beatmap.diff_speed',
                size: 1
            },
        ],
        formatter: (value) => `${value.toFixed(2)}*`
    },
    {
        name: 'Attributes',
        data_points: [
            {
                name: 'CS',
                path: 'beatmap.difficulty.circle_size',
                size: 1
            },
            {
                name: 'OD',
                path: 'beatmap.difficulty.overall_difficulty',
                size: 1
            }, {
                name: 'HP',
                path: 'beatmap.difficulty.drain_rate',
                size: 1
            }, {
                name: 'AR',
                path: 'beatmap.difficulty.approach_rate',
                size: 1
            }
        ],
        formatter: (value) => `${value.toFixed(2)}`
    },
    {
        name: 'Strain',
        data_points: [
            {
                name: 'Aim',
                path: 'beatmap.difficulty.aim_difficult_strain_count',
                size: 1
            }, {
                name: 'Speed',
                path: 'beatmap.difficulty.speed_difficult_strain_count',
                size: 1
            }
        ],
        formatter: (value) => `${value.toFixed(2)}`
    },
    {
        name: 'Slider Factor',
        data_points: [
            {
                name: 'Slider Factor',
                path: 'beatmap.difficulty.slider_factor',
                size: 1
            }
        ],
        formatter: (value) => `${value.toFixed(2)}`
    },
    {
        name: 'Accuracy',
        data_points: [
            {
                name: 'Accuracy',
                path: 'accuracy',
            }
        ],
        formatter: (value) => `${value.toFixed(2)}%`
    },
    {
        name: 'Length',
        data_points: [
            {
                name: 'Length',
                path: 'beatmap.modded_length',
            }
        ],
        formatter: (value) => `${value.toFixed(0)}s`
    }
]
const TOP_PLAYS_COUNT = 200;
function SectionDetailedGraphsTopPlays(props) {
    const [activeGraph, setActiveGraph] = useState(0);
    const [graphData, setGraphData] = useState(null);
    const [scoresSubset, setScoresSubset] = useState(null);

    useEffect(() => {
        if (props.scores) {
            //if loved, assume 0 pp
            props.scores.sort((a, b) => b.pp - a.pp);
            let topScores = props.scores.slice(0, TOP_PLAYS_COUNT);
            setScoresSubset(topScores);
        }
    }, [])

    useEffect(() => {
        if (!scoresSubset) return;

        let graph = TOP_PLAY_GRAPH_DATA[activeGraph];
        let data_points = graph.data_points;

        let series = [];

        for (let i = 0; i < data_points.length; i++) {
            series[i] = {
                name: data_points[i].name,
                data: [],
            }
        }

        for (let i = 0; i < scoresSubset.length; i++) {
            let score = scoresSubset[i];
            for (let j = 0; j < graph.data_points.length; j++) {
                let data_point = graph.data_points[j];
                let value = _.get(score, data_point.path) || 0;

                series[j].data.push(value);
            }
        }
        setGraphData(series);
        console.log(series);
    }, [activeGraph, scoresSubset]);

    if (!graphData) return <Loader />;

    return (
        <>
            <ChartWrapper
                height='200px'
                style={{ margin: '0' }}
                options={{
                    chart: {
                        id: "top-plays",
                    },
                    xaxis: {
                        labels: {
                            rotate: -90,
                            style: {
                                fontSize: '9px'
                            }
                        },
                        categories: range(TOP_PLAYS_COUNT, 1).map((i) => `#${i}`)
                    },
                    dataLabels: {
                        //rotate the labels
                        enabled: false,
                        formatter: TOP_PLAY_GRAPH_DATA[activeGraph].formatter || null
                    },
                    yaxis: {
                        labels: {
                            formatter: TOP_PLAY_GRAPH_DATA[activeGraph].formatter || null
                        }
                    },
                    stroke: {
                        width: TOP_PLAY_GRAPH_DATA[activeGraph].data_points.map((obj) => obj.size || 4)
                    },
                    tooltip: {
                        //along with the default, show the score title
                        custom: function ({ series, seriesIndex, dataPointIndex, w }) {
                            let score = scoresSubset[dataPointIndex];
                            let artist = score.beatmap.artist;
                            let title = score.beatmap.title;
                            let version = score.beatmap.diffname;
                            
                            let tooltip = `<div class="apexcharts-tooltip-title">${artist} - ${title} [${version}]</div>`;

                            tooltip += '<div style="padding-bottom:5px" class="apexcharts-tooltip-series-group.apexcharts-active">';
                            for (let i = 0; i < series.length; i++) {
                                let data_point = TOP_PLAY_GRAPH_DATA[activeGraph].data_points[i];
                                let value = series[i][dataPointIndex];
                                let color = w.globals.colors[i];

                                tooltip += `<div><div style='color:#${color}' class='apexcharts-tooltip-marker apexcharts-tooltip-marker[shape="circle"]'></div>${data_point.name}: ${TOP_PLAY_GRAPH_DATA[activeGraph].formatter(value)}</div>`;
                            }
                            tooltip += '</div>';
                            return tooltip;
                        }
                    }
                }}
                series={graphData}
            />
            <Box>
                {
                    TOP_PLAY_GRAPH_DATA.map((graph, i) => {
                        return <Button
                            key={i}
                            onClick={() => setActiveGraph(i)}
                            variant={i === activeGraph ? 'contained' : 'outlined'}
                            sx={{ m: 0.5 }}
                            size='small'
                        >{graph.name}</Button>
                    })
                }
            </Box>
        </>
    )
}

function SectionDetailedGraphsRateChangeSpread(props) {
    const theme = useTheme();
    return (
        <ChartWrapper
            height='100%'
            style={{ margin: '0' }}
            options={{
                chart: {
                    id: "rate-change-spread",
                },
                xaxis: {
                    labels: {
                        rotate: -90
                    }
                },
                dataLabels: {
                    //rotate the labels
                    enabled: false
                }
            }}
            series={[
                {
                    name: 'Rate change',
                    data: props.rateChangeSpread.map((obj) => {
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
    )
}

function SectionDetailedGraphsSessionTimeSpread(props) {
    const theme = useTheme();
    return (
        <ChartWrapper
            height='100%'
            style={{ margin: '0' }}
            options={{
                chart: {
                    id: "session-length-spread",
                },
                xaxis: {
                    labels: {
                        rotate: -45,
                        style: {
                            fontSize: '10px'
                        }
                    }
                },
            }}
            series={[
                {
                    name: 'Sessions',
                    data: props.sessionTimeSpread.map((obj) => {
                        let hour = parseInt(obj.hour);
                        const h_low = hour;
                        const h_high = hour + 1;
                        const value = obj.count;
                        let x = `${h_low}-${h_high}h`;
                        if (h_low === 24) x = '24h+';
                        return {
                            x: x,
                            y: value
                        }
                    }),
                    color: theme.palette.primary.main,
                }
            ]}
            type={'bar'}
        />
    )
}

function SectionDetailedGraphsRateChangeStarsSpread(props) {
    const theme = useTheme();
    return (
        <ChartWrapper
            height='100%'
            style={{ margin: '0' }}
            options={{
                chart: {
                    id: "rate-change-stars-spread",
                },
                xaxis: {
                    labels: {
                        rotate: -45,
                        //smaller font size
                        style: {
                            fontSize: '10px'
                        }
                    },
                    // categories: ['0*', '1*', '2*', '3*', '4*', '5*', '6*', '7*', '8*', '9*', '10*+']
                    // categories: ['0-1*', '1-2*', '2-3*', '3-4*', '4-5*', '5-6*', '6-7*', '7-8*', '8-9*', '9-10*', '10*+']
                    categories: props.rate_change_to_stars_spread.map((obj) => {
                        let stars_low = obj.stars;
                        let stars_high = obj.stars + 1;
                        let count = obj.count;

                        let _x = `${stars_low}-${stars_high}*`;
                        if (stars_high === 11) _x = '10*+';

                        return `${_x} (${formatNumber(count)})`;
                    })
                },
                yaxis: {
                    labels: {
                        formatter: function (value) {
                            return `x${value.toFixed(2)}`;
                        }
                    }
                },
                dataLabels: {
                    enabled: true,
                    formatter: function (value) {
                        return `x${value.toFixed(2)}`;
                    }
                },
            }}
            series={[
                {
                    name: 'Average rate change',
                    //simple make an array of rate change values
                    data: props.rate_change_to_stars_spread.map((obj) => {
                        const value = _.round(obj.rate, 2);
                        return value;
                    }),
                    color: theme.palette.primary.main,

                }, {
                    name: 'Lowest rate change',
                    data: props.rate_change_to_stars_spread.map((obj) => {
                        const value = _.round(obj.lowest, 2);
                        return value;
                    }),
                    color: theme.palette.warning.main,
                },
                {
                    name: 'Highest rate change',
                    data: props.rate_change_to_stars_spread.map((obj) => {
                        const value = _.round(obj.highest, 2);
                        return value;
                    }),
                    color: theme.palette.error.main,
                }
            ]}
            type={'bar'}
        />
    )
}

function SectionDetailedGraphsModSpread(props) {
    return <>
        <Box sx={{
            display: 'flex',
            flexDirection: 'row',
            width: '100%',
            flexWrap: 'wrap',
            justifyContent: 'space-around',
        }}>
            {
                props.modSpread.map((obj, i) => {
                    return <Box key={i} sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                    }}>
                        {Mods.getModElement(obj.mod)}
                        <Typography>{formatNumber(obj.count)}</Typography>
                    </Box>
                })
            }
        </Box>
    </>
}

export default SectionDetailedGraphs;