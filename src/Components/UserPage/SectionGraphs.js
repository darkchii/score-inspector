import { Box, Button, ButtonGroup, Divider, Grid, Paper, Skeleton, Table, TableBody, TableCell, TableRow, Tooltip, Typography, useTheme } from "@mui/material";
import { useEffect, useState } from "react";
import ChartWrapper from "../../Helpers/ChartWrapper.js";
import ApexCharts from 'apexcharts';
import { capitalizeFirstLetter } from "../../Helpers/Misc.js";

function SectionGraphs(props) {
    const theme = useTheme();
    const [selectedGraphIndex, setSelectedGraphIndex] = useState(0);
    const [categorizedButtonIds, setCategorizedButtonIds] = useState(null);
    const [period, setPeriod] = useState('m');

    useEffect(() => {
        console.log(props.dataset);
        const _categorizedButtonIds = [];
        props.dataset[period].forEach((dataset, i) => {
            const category = dataset.category;
            if (_categorizedButtonIds[category] === undefined) {
                _categorizedButtonIds[category] = [];
            }

            _categorizedButtonIds[category].push(i);
        });
        setCategorizedButtonIds(_categorizedButtonIds);
    }, [props.dataset]);

    if (categorizedButtonIds === null) {
        return <Skeleton variant='rectangular' sx={{ height: 400 }} />
    }

    return <>
        <Box sx={{
            height: 400
        }}>
            <ChartWrapper
                options={{
                    chart: {
                        id: `chart-${selectedGraphIndex}-${props.dataset[period][selectedGraphIndex].id}`,
                    },
                    xaxis: {
                        type: 'datetime',
                        labels: {
                            datetimeUTC: false,
                            format: props.dataset[period][selectedGraphIndex].period_format,
                        },
                    },
                    yaxis: {
                        labels: {
                            formatter: (value) => {
                                return props.dataset[period][selectedGraphIndex].formatter ? props.dataset[period][selectedGraphIndex].formatter(value) : value.toLocaleString();
                            }
                        },
                        reversed: props.dataset[period][selectedGraphIndex].reversed ?? false,
                    },
                    tooltip: {
                        x: {
                            format: props.dataset[period][selectedGraphIndex].period_format,
                        },
                    },
                    dataLabels: {
                        enabled: false
                    },
                    stroke: {
                        curve: 'straight'
                    }
                }}
                series={
                    props.dataset[period][selectedGraphIndex].data.map((data, i) => {
                        let _graphData = data.graph_data;
                        if(props.dataset[period][selectedGraphIndex].filterNull){
                            _graphData = _graphData.filter((data) => {
                                return !isNaN(data[1]);
                            });

                            _graphData = _graphData.filter((data) => {
                                return data[1] !== null;
                            });
                        }
                        console.log(_graphData);
                        return {
                            name: data.name,
                            data: _graphData,
                            color: data.color ?? theme.palette.primary.main
                        }
                    })
                }
                type={'line'}
            />
        </Box>
        <Box sx={{ mt: 1 }}>
            {
                //props.dataset, is array of objects, each object has a category. split by that

                Object.keys(categorizedButtonIds).map((category, i) => {
                    return (
                        <>
                            <Box>
                                <Typography variant='h6'>{capitalizeFirstLetter(category)}</Typography>
                                <ButtonGroup variant='outlined' size='small' color='primary'>
                                    {
                                        categorizedButtonIds[category].map((index, j) => {
                                            return <Button
                                                variant={selectedGraphIndex === index ? 'contained' : 'outlined'}
                                                onClick={() => setSelectedGraphIndex(index)}
                                                disabled={props.dataset[period][index].disabled ?? false}
                                            >
                                                {props.dataset[period][index].name}
                                            </Button>
                                        })
                                    }
                                </ButtonGroup>
                            </Box>
                            <Divider sx={{ mb: 1, mt: 1 }} />
                        </>
                    )
                })
            }
        </Box>
        <Box sx={{ mt: 1 }}>
            <Typography variant='h6'>Periodic Increments</Typography>
            <ButtonGroup variant='outlined' size='small' color="primary">
                <Button variant={period === 'y' ? 'contained' : 'outlined'} onClick={() => setPeriod('y')}>Yearly</Button>
                <Button variant={period === 'm' ? 'contained' : 'outlined'} onClick={() => setPeriod('m')}>Monthly</Button>
                <Button variant={period === 'd' ? 'contained' : 'outlined'} onClick={() => setPeriod('d')}>Daily</Button>
            </ButtonGroup>
        </Box>
    </>
}

export default SectionGraphs;