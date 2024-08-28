/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from "react";
import { getPopulation } from "../Helpers/OsuAlt";
import { useState } from "react";
import { Chart } from "react-chartjs-2";
import * as ChartGeo from "chartjs-chart-geo";
import {
    Chart as ChartJS,
    CategoryScale,
    Tooltip,
    Title,
    Legend
} from "chart.js";
import WorldAtlas from '../Assets/countries-110m.json';
import Countries from '../Assets/countries.json';
import { lerpColor, linearToLogarithmic } from "../Helpers/Misc";
import { Box, Button, Grid, Paper, Table, TableBody, TableCell, TableContainer, TableRow, Tooltip as MUITooltip, Typography, TableHead, Container, useTheme } from "@mui/material";
import ReactCountryFlag from "react-country-flag";
import Loader from "../Components/UI/Loader";
import { Helmet } from 'react-helmet';
import config from "../config.json";

ChartJS.register(
    Title,
    Tooltip,
    Legend,
    CategoryScale,
    ChartGeo.ChoroplethController,
    ChartGeo.ProjectionScale,
    ChartGeo.ColorScale,
    ChartGeo.GeoFeature
);

function Population() {
    const theme = useTheme();
    const [population, setPopulation] = useState(null);
    const [chartData, setChartData] = useState(null);
    const [activeChartType, setActiveChartType] = useState('active_users');
    const [orderedCountries, setOrderedCountries] = useState(null);
    const [totalValue, setTotalValue] = useState(null);

    useEffect(() => {
        (async () => {
            const pop = await getPopulation();
            setPopulation(pop);
        })()
    }, []);

    useEffect(() => {
        updateChart(activeChartType);
    }, [population, activeChartType])

    const updateChart = (valueType = "active_users") => {
        if (!population || !Array.isArray(population)) return;
        const countries = ChartGeo.topojson.feature(WorldAtlas, WorldAtlas.objects["map.geo"]).features.filter((f) => f.properties["A3"] !== 'ATA');

        //set all features to value 0
        countries.forEach((c) => {
            c.value = undefined;
        });

        let totalSumValue = 0;
        let invalidCountries = 0;
        population.forEach((p) => {
            totalSumValue += p[valueType] ?? 0;
            if (p[valueType] === undefined) {
                invalidCountries++;
            }
        });

        //if share, set total value
        if (chartTypes.find((t) => t.value === activeChartType).showShare !== false) {
            setTotalValue(totalSumValue);
        } else {
            //average
            setTotalValue(totalSumValue / (population.length - invalidCountries));
        }

        let fixed_countries = [];

        countries.forEach((c) => {
            let _c = JSON.parse(JSON.stringify(c));
            let cc = c.properties["A3"].toLowerCase();
            let country = Countries.find((c) => c["alpha-3"].toLowerCase() === cc.toLowerCase());
            if (country) {
                _c.code = country["alpha-2"].toLowerCase();
                _c.name = country.name;
                _c.value = 0;
                _c.valuePercent = 0;
            } else {
                console.warn(c.properties["A3"] + ' not found');
            }
            fixed_countries.push(_c);
        });

        population.forEach((p) => {
            let cc = p.code;
            if(!cc){
                console.warn(fixed_countries);
                console.warn(p);
            }
            let feature = fixed_countries.find((c) => c.code?.toLowerCase() === cc.toLowerCase());
            if (feature) {
                feature.value = p[valueType] ?? 0;

                //percentage of total value
                feature.valuePercent = (feature.value ?? 0) / totalSumValue;

                if (isNaN(feature.valuePercent)) feature.valuePercent = 0;
            } else {
                // console.warn(country.name+' not found');
            }
        });

        fixed_countries.sort((a, b) => {
            if (a.value === undefined) return 1;
            if (b.value === undefined) return -1;

            return b.value - a.value;
        });

        setOrderedCountries(fixed_countries);

        const chartData = {
            type: 'choropleth',
            data: {
                labels: fixed_countries.map((d) => d.name),
                datasets: [{
                    label: 'Countries',
                    outline: fixed_countries,
                    data: fixed_countries.map((d) => ({ feature: d, value: Number(d.value) ?? NaN })),
                }]
            },
            options: {
                showOutline: true,
                showGraticule: false,
                plugins: {
                    legend: {
                        display: false
                    },
                    datalabels: {
                        display: false,
                    },
                    tooltip: {
                        callbacks: {
                            label: function (context) {
                                let value = chartTypes.find((t) => t.value === activeChartType).output ? chartTypes.find((t) => t.value === activeChartType).output(context.raw.feature.value ?? 0) : context.raw.feature.value;
                                return `${context.raw.feature.name}: ${value}`;
                            }
                        }
                    },
                },
                scales: {
                    projection: {
                        axis: 'x',
                        projection: 'mercator',
                    },
                    color: {
                        axis: 'x',
                        // interpolate: (v) => (v < 0.5 ? 'green' : 'red'),
                        interpolate: (v) => lerpColor('#ffffff', theme.palette.primary.main, linearToLogarithmic(v), 0.2, 1),
                        legend: {
                            position: 'bottom-right',
                            align: 'right',
                        },
                    }
                }
            }
        };

        setChartData(chartData);
    }

    const chartTypes = [
        {
            name: 'Active Users',
            value: 'active_users',
            output: (v) => v.toLocaleString(),
            description: 'Active osu! users according to official statistics'
        },
        {
            name: 'Alt Users',
            value: 'alt_players',
            output: (v) => v.toLocaleString(),
            description: 'osu! users present in osu!alternative dataset'
        },
        {
            name: 'Performance',
            value: 'performance',
            output: (v) => (Math.round(v * 100) / 100).toLocaleString() + 'pp',
            description: 'Total raw pp'
        },
        {
            name: 'Playcount',
            value: 'play_count',
            output: (v) => v.toLocaleString(),
            description: 'Total playcount'
        },
        {
            name: 'Playtime',
            value: 'playtime',
            output: (v) => Math.round(v / 60 / 60).toLocaleString() + ' hours',
            description: 'Total playtime'
        },
        {
            name: 'Total Hits',
            value: 'total_hits',
            output: (v) => v.toLocaleString(),
            description: 'Total hits'
        },
        {
            name: 'Replays Watched',
            value: 'replays_watched',
            output: (v) => v.toLocaleString(),
            description: 'Total replays watched'
        },
        {
            name: 'Average Accuracy',
            value: 'avg_acc',
            output: (v) => `${v.toLocaleString()}%`,
            description: 'Average accuracy',
            showShare: false
        },
        {
            name: 'Ranked Score',
            value: 'total_score',
            output: (v) => `${v.toLocaleString()}`,
            description: 'Total ranked score'
        },
        {
            name: 'National Top Score',
            value: 'max_score',
            output: (v) => `${v.toLocaleString()}`,
            description: 'Sum of all national #1 scores'
        },
        {
            name: 'Average PP',
            value: 'avg_pp',
            output: (v) => (Math.round(v * 100) / 100).toLocaleString() + 'pp',
            description: 'Average pp',
            showShare: false
        },
        {
            name: 'Total SS',
            value: 'ss_total_count',
            output: (v) => v.toLocaleString(),
            description: 'Total SS grades'
        },
        {
            name: 'Silver SS',
            value: 'ssh_count',
            output: (v) => v.toLocaleString(),
            description: 'Total Silver SS grades'
        },
        {
            name: 'Gold SS',
            value: 'ss_count',
            output: (v) => v.toLocaleString(),
            description: 'Total Gold SS grades'
        },
        {
            name: 'Total S',
            value: 's_total_count',
            output: (v) => v.toLocaleString(),
            description: 'Total S grades'
        },
        {
            name: 'Silver S',
            value: 'sh_count',
            output: (v) => v.toLocaleString(),
            description: 'Total Silver S grades'
        },
        {
            name: 'Gold S',
            value: 's_count',
            output: (v) => v.toLocaleString(),
            description: 'Total Gold S grades'
        },
        {
            name: 'A',
            value: 'a_count',
            output: (v) => v.toLocaleString(),
            description: 'Total A grades'
        },
        {
            name: 'B',
            value: 'b_count',
            output: (v) => v.toLocaleString(),
            description: 'Total B grades'
        },
        {
            name: 'C',
            value: 'c_count',
            output: (v) => v.toLocaleString(),
            description: 'Total C grades'
        },
        {
            name: 'D',
            value: 'd_count',
            output: (v) => v.toLocaleString(),
            description: 'Total D grades'
        },
        {
            name: 'Alt Relative',
            value: 'perc_on_alt',
            output: (v) => (v).toFixed(2) + '%',
            description: 'Percentage of osu! users that are present in osu!alternative dataset',
            showShare: false
        }
    ]

    if (!population || !Array.isArray(population)) return <Loader />;

    return (
        <Box sx={{
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
        }}>
            <Helmet>
                <title>Countries - {config.APP_NAME}</title>
            </Helmet>
            {
                chartData ?
                    <>
                        <Box sx={{ width: '100%', height: '100%', p: 2 }}>
                            <Container size={'md'}>
                                <Chart
                                    type={chartData.type}
                                    data={chartData.data}
                                    options={chartData.options}
                                ></Chart>
                            </Container>
                        </Box>
                        <Grid sx={{ display: 'inline-block' }}>
                            {
                                chartTypes.map((t) => (
                                    <Button sx={{
                                        m: 0.3
                                    }} onClick={() => {
                                        setActiveChartType(t.value);
                                    }} variant={
                                        activeChartType === t.value ? 'contained' : 'outlined'
                                    }>{t.name}</Button>
                                ))
                            }
                        </Grid>
                        <Typography sx={{ mt: 2, mb: 1 }} variant='subtitle1'>
                            {chartTypes.find((t) => t.value === activeChartType).description}
                            {totalValue !== null ? ` (${chartTypes.find((t) => t.value === activeChartType).output(totalValue)})` : ''}</Typography>
                    </> : <Loader />
            }
            {
                orderedCountries &&
                <>
                    <TableContainer component={Paper} elevation={4} sx={{ mt: 2, maxWidth: 900 }}>
                        <Table size="small">
                            <TableHead>
                                <TableRow>
                                    <TableCell></TableCell>
                                    <TableCell>Country</TableCell>
                                    <TableCell align="right">{chartTypes.find((t) => t.value === activeChartType).name}</TableCell>
                                    {
                                        chartTypes.find((t) => t.value === activeChartType).showShare !== false &&
                                        (
                                            <TableCell align="right">Share</TableCell>
                                        )
                                    }
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {
                                    orderedCountries.map((c) => {
                                        let value = chartTypes.find((t) => t.value === activeChartType).output ? chartTypes.find((t) => t.value === activeChartType).output(c.value ?? 0) : c.value;
                                        return (
                                            <TableRow>
                                                <TableCell>
                                                    <ReactCountryFlag
                                                        svg
                                                        style={{
                                                            fontSize: '1.6em',
                                                            borderRadius: '5px',
                                                        }}
                                                        cdnUrl="https://flagicons.lipis.dev/flags/4x3/"
                                                        countryCode={c.code ?? 'xx'}
                                                    />
                                                </TableCell>
                                                <TableCell>{c.name}</TableCell>
                                                <TableCell align="right">{value}</TableCell>
                                                {
                                                    chartTypes.find((t) => t.value === activeChartType).showShare !== false &&
                                                    <TableCell align="right" sx={{ fontStyle: 'italic' }}>
                                                        <MUITooltip title={`Share of total value`} arrow>
                                                            {Math.round((c.valuePercent ?? 0) * 100 * 100) / 100}%
                                                        </MUITooltip>
                                                    </TableCell>
                                                }
                                            </TableRow>
                                        )
                                    })
                                }
                            </TableBody>
                        </Table>
                    </TableContainer>
                </>
            }
        </Box>
    );
}

export default Population;