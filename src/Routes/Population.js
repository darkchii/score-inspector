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
import { useTheme } from "@mui/styles";
import { Box, Button, ButtonGroup, Grid } from "@mui/material";

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
        if (!population) return;
        const countries = ChartGeo.topojson.feature(WorldAtlas, WorldAtlas.objects.countries).features.filter((f) => f.properties.name !== 'Antarctica');

        //set all features to value 0
        countries.forEach((c) => {
            c.value = undefined;
        });

        population.forEach((p) => {
            let cc = p.code;
            let country = Countries.find((c) => c.alpha2 === cc.toLowerCase());
            if (country) {
                let feature = countries.find((c) => Number(c.id) === country.id);
                if (feature) {
                    feature.value = p[valueType] ?? undefined;
                } else {
                    //console.log(country.id+' not found');
                }
            } else {
                console.log(cc + ' not found');
            }
        });

        countries.sort((a, b) => {
            if (a.value === undefined) return 1;
            if (b.value === undefined) return -1;

            return b.value - a.value;
        });

        setOrderedCountries(countries);

        const chartData = {
            type: 'choropleth',
            data: {
                labels: countries.map((d) => d.properties.name),
                datasets: [{
                    label: 'Countries',
                    outline: countries,
                    data: countries.map((d) => ({ feature: d, value: Number(d.value) ?? NaN })),
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
                                return `${context.raw.feature.properties.name}: ${value}`;
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
                        interpolate: (v) => lerpColor('#ffffff', theme.palette.primary.main, linearToLogarithmic(v), (v === 0 ? 0 : 0.2), 1),
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
            output: (v) => v.toLocaleString()
        },
        {
            name: 'Alt Users',
            value: 'alt_players',
            output: (v) => v.toLocaleString()
        },
        {
            name: 'Performance',
            value: 'performance',
            output: (v) => v.toLocaleString()
        },
        {
            name: 'Playcount',
            value: 'play_count',
            output: (v) => v.toLocaleString()
        },
        {
            name: 'Playtime',
            value: 'playtime',
            output: (v) => Math.round(v/60/60).toLocaleString() + ' hours'
        },
        {
            name: 'Total Hits',
            value: 'total_hits',
            output: (v) => v.toLocaleString()
        },
        {
            name: 'Replays Watched',
            value: 'replays_watched',
            output: (v) => v.toLocaleString()
        },
        {
            name: 'Average Accuracy',
            value: 'avg_acc',
            output: (v) => v.toLocaleString()
        },
        {
            name: 'Average PP',
            value: 'avg_pp',
            output: (v) => v.toLocaleString()
        },
        {
            name: 'Silver SS',
            value: 'ssh_count',
            output: (v) => v.toLocaleString()
        },
        {
            name: 'Gold SS',
            value: 'ss_count',
            output: (v) => v.toLocaleString()
        }, {
            name: 'Silver S',
            value: 'sh_count',
            output: (v) => v.toLocaleString()
        },
        {
            name: 'Gold S',
            value: 's_count',
            output: (v) => v.toLocaleString()
        }, 
        {
            name: 'A',
            value: 'a_count',
            output: (v) => v.toLocaleString()
        }, 
        {
            name: 'B',
            value: 'b_count',
            output: (v) => v.toLocaleString()
        },
        {
            name: 'C',
            value: 'c_count',
            output: (v) => v.toLocaleString()
        },
        {
            name: 'D',
            value: 'd_count',
            output: (v) => v.toLocaleString()
        },
        {
            name: 'Alt Relative',
            value: 'perc_on_alt',
            output: (v) => (v).toFixed(2) + '%'
        }
    ]

    return (
        <>
            {
                chartData &&
                <>
                    <Box sx={{ width: '100%', height: '100%', p: 2 }}>
                        <Chart
                            type={chartData.type}
                            data={chartData.data}
                            options={chartData.options}
                        ></Chart>
                    </Box>
                    <Grid sx={{display: 'inline-block'}}>
                        {
                            chartTypes.map((t) => (
                                <Button sx={{
                                    m: 0.3
                                }} onClick={()=>{
                                    setActiveChartType(t.value);
                                }} variant={
                                    activeChartType === t.value ? 'contained' : 'outlined'
                                }>{t.name}</Button>
                            ))
                        }
                    </Grid>
                </>
            }
        </>
    );
}

export default Population;