import { Box, useTheme } from "@mui/material";
import { useEffect } from "react";
import { useState } from "react";
import ChartWrapper from "../Helpers/ChartWrapper";
import moment from "moment";
import { formatNumberAsSize } from "../Helpers/Misc";
import { getModString } from "../Helpers/Osu";

function PerformanceRecordsChart(props) {
    const theme = useTheme();
    const [data, setData] = useState([]);

    useEffect(() => {
        setData([]);
        if (props.data) {
            const _data = props.data.map((item) => {
                return {
                    x: moment(item.date_played).unix() * 1000,
                    y: item.pp,
                    data: item,
                    image: {
                        path: `https://a.ppy.sh/${item.user_id}`,
                        offsetY: -30,
                        width: 26,
                        height: 26,
                    }
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
                <ChartWrapper
                    options={{
                        chart: {
                            id: 'pp-records-chart',
                            toolbar: {
                                show: true,
                            },
                            zoom: {
                                enabled: true,
                            },
                        },
                        xaxis: {
                            type: 'datetime',
                            labels: {
                                datetimeUTC: false,
                                format: 'MMM dd yyyy',
                            },
                        },
                        yaxis: {
                            labels: {
                                formatter: (value) => {
                                    return `${formatNumberAsSize(value)} pp`;
                                }
                            }
                        },
                        stroke: {
                            curve: 'stepline',
                        },
                        annotations: {
                            points: (data.data ?? []).map((item) => {
                                return {
                                    x: item.x,
                                    y: item.y,
                                    image: item.image,
                                }
                            }),
                        },
                        tooltip: {
                            custom: function ({ seriesIndex, dataPointIndex, w }) {
                                var data = w.globals.initialSeries[seriesIndex].data[dataPointIndex];
                                const score = data.data.score;
                                const beatmap = score.beatmap;
                                const user = data.data.user.osu;
                                const pp = data.y;
                                return `
                                <ul>
                                    <li>${Math.round(pp)}pp &bull; ${user.username}</li>
                                    <li>${beatmap.artist} - ${beatmap.title} [${beatmap.diffname}]</li>
                                    <li>${Math.round(beatmap.difficulty.star_rating * 10) / 10}* +${getModString(parseInt(score.enabled_mods))}</li>
                                </ul>`
                            }
                            // y: {
                            //     formatter: (value) => {
                            //         return `${value.toFixed(2)}pp`;
                            //     }
                            // }
                        },
                        markers: {
                            size: 4
                        },
                        dataLabels: {
                            offsetY: -8
                        }
                    }}
                    series={[{
                        name: 'PP',
                        data: data.data,
                        color: theme.palette.primary.main,
                    }]}
                    type={'line'}
                />
            </Box>
        </Box>
    </>
}

export default PerformanceRecordsChart;