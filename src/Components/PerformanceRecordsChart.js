import { Box, useTheme } from "@mui/material";
import { useEffect } from "react";
import { useState } from "react";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    TimeScale
} from 'chart.js';
import zoomPlugin from 'chartjs-plugin-zoom';
import { Line } from 'react-chartjs-2';
import 'chartjs-adapter-moment';
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    TimeScale,
    zoomPlugin
);

function PerformanceRecordsChart(props) {
    const theme = useTheme();
    const [data, setData] = useState([]);

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        transitions: {
            zoom: {
                animation: {
                    duration: 1000,
                    easing: 'easeOutCubic'
                }
            }
        },
        plugins: {
            legend: {
                display: false
            },
            tooltip: {
                callbacks: {
                    label: function (context) {
                        // return `
                        //     ${context.raw.data.user.username}\n
                        //     ${context.raw.data.beatmap.artist} - ${context.raw.data.beatmap.title} [${context.raw.data.beatmap.version}]\n
                        //     ${context.raw.y}pp
                        //     `
                        return [
                            `${context.raw.data.user.osu.username}`,
                            `${context.raw.data.score.beatmap.artist} - ${context.raw.data.score.beatmap.title} [${context.raw.data.score.beatmap.diffname}]`,
                            `${context.raw.y}pp`
                        ]
                    }
                }
            },
            zoom: {
                limits: {
                    x: {
                        min: 'original',
                        max: 'original',
                        minRange: 1000 * 60 * 60 * 24 * 7,
                        maxRange: 1000 * 60 * 60 * 24 * 7
                    },
                    y: {
                        min: 'original',
                        max: 'original',
                        minRange: 100,
                        maxRange: 100
                    }
                },
                zoom: {
                    wheel: {
                        enabled: true,
                    },
                    pinch: {
                        enabled: true,
                    },
                    mode: 'xy',
                },
                pan: {
                    enabled: true,
                    mode: 'xy',
                }
            }
        },
        scales: {
            x: {
                type: 'time',
                time: {
                    unit: 'day',
                    tooltipFormat: 'MMM DD YYYY',
                    displayFormats: {
                        day: 'MMM DD YYYY'
                    }
                },
                gridLines: {
                    display: false
                },
                grace: '10%'
            },
            y: {
                grace: '10%'
            }
        },
        layout: {
            padding: 16
        }
    }

    useEffect(() => {
        setData([]);
        if (props.data) {
            const _data = props.data.map((item) => {
                return {
                    x: item.date_played,
                    y: item.pp,
                    data: item
                }
            });

            const _pointData = props.data.map((item) => {
                const img = new Image(26, 26);
                img.src = `https://a.ppy.sh/${item.user_id}`;
                img.style.borderRadius = '50%';
                return img;
            });

            setData({ data: _data, pointData: _pointData });
        }
    }, [props.data]);

    return <>
        <Box sx={{
            height: props.height || "100px",
            width: '100%'
        }}>
            <Box sx={{ width: '100%', height: '100%', p: 2 }}>
                <Line
                    options={chartOptions}
                    data={{
                        datasets: [{
                            data: data.data,
                            fill: false,
                            borderColor: theme.palette.primary.main,
                            tension: 0.1,
                            borderWidth: 2,
                            pointRadius: 16,
                            pointStyle: data.pointData
                        }]
                    }} />
            </Box>
        </Box>
    </>
}

export default PerformanceRecordsChart;