import { Alert, Box, Grid2, Paper, Typography, useTheme } from "@mui/material";
import ChartWrapper from "../../Helpers/ChartWrapper";
import _ from "lodash";
import { formatNumber } from "../../Helpers/Misc";
import Mods from "../../Helpers/Mods";

function SectionDetailedGraphs(props) {
    if (props.user == null) return (<></>);
    return (
        <>
            <Alert severity="info" sx={{ mb: 2 }}>
                These graphs go very in-depth and may be hard to read and/or comprehend. <br />
                This is primarily meant for players who like to play with the lazer mod settings etc. and for graphs that don&apos;t fit the criteria for the other graph section.
            </Alert>
            {/* <Stack direction='column' spacing={2} sx={{
                    width: '100%',
                }}>
                    <Typography variant='h5'>Rate change spread</Typography>
                    <Box sx={{ height: 200 }}>
                        <SectionDetailedGraphsRateChangeSpread rateChangeSpread={props.user.data.ultra_detailed.rate_change_spread} />
                    </Box>
                    <Divider />
                    <Typography variant='h5'>Session time spread</Typography>
                    <Box sx={{ height: 200 }}>
                        <SectionDetailedGraphsSessionTimeSpread sessionTimeSpread={props.user.data.ultra_detailed.session_time_spread} />
                    </Box>
                    <Divider />
                    <Typography variant='h5'>Average rate change per star rating</Typography>
                    <Box sx={{ height: 200 }}>
                        <SectionDetailedGraphsRateChangeStarsSpread rate_change_to_stars_spread={props.user.data.ultra_detailed.rate_change_to_stars_spread} />
                    </Box>
                    <Divider />
                    <Typography variant='h5'>Mod spread</Typography>
                    <Box sx={{ height: 200 }}>
                        <SectionDetailedGraphsModSpread modSpread={props.user.data.ultra_detailed.mod_spread} />
                    </Box>
                </Stack> */}
            <Box sx={{
                m: 1,
            }}>
                <Grid2 container spacing={2}>
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
                            <Box sx={{ height: 200 }}>
                                <SectionDetailedGraphsModSpread modSpread={props.user.data.ultra_detailed.mod_spread} />
                            </Box>
                        </Paper>
                    </Grid2>
                </Grid2>
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