import { Button, Divider, Grid, Paper, Table, TableBody, TableCell, TableContainer, TableRow, Typography, useTheme } from "@mui/material";
import { useEffect, useState } from "react";
import { capitalize } from "../../Helpers/Misc";
import { Chart, registerables } from 'chart.js'
import { Bar } from "react-chartjs-2";
import ChartDataLabels from 'chartjs-plugin-datalabels';
Chart.register(...registerables, ChartDataLabels)

function SectionCompletion(props) {
    const theme = useTheme();
    const [graphs, setGraphs] = useState({});
    const [selectedGraph, setSelectedGraph] = useState('stars');
    const config = {
        type: 'bar',
        data: {},
        plugins: {
            datalabels: {
                color: 'white',
                backgroundColor: '#00000088',
                borderRadius: 5,
                formatter: ((_, context) => {
                    //console.log(context);
                    const { dataset, dataIndex } = context;
                    const value = dataset.data[dataIndex];
                    return `${value.item.scores}/${value.item.beatmaps}`;
                }),
                font: {
                    family: "Roboto"
                },
            },
            tooltip: {
                callbacks: {
                    label: (context) => {
                        const { dataset, dataIndex } = context;
                        const value = dataset.data[dataIndex];
                        return `${Math.round(value.item.completion * 100) / 100}% (${value.item.scores}/${value.item.beatmaps})`;
                    }
                }
            }
        },
        scales: {
            y: {
                min: 0,
                max: 100,
            }
        }
    }

    useEffect(() => {
        if (props.user == null) return;
        if (!props.user.data.completion) return;

        const _graphs = {};
        Object.keys(props.user.data.completion).forEach((key, index) => {
            const data = props.user.data.completion[key];
            const labels = data.map((item, index) => item.range);
            const values = data.map((item, index) => {
                return {
                    x: item.range,
                    val: (Math.round(item.completion * 100) / 100),
                    item: item
                }
            });
            const stylizedKey = key.length === 2 ? key.toUpperCase() : capitalize(key);
            const _data = {
                labels: labels,
                datasets: [{
                    label: stylizedKey + ' Completion',
                    data: values,
                    backgroundColor: `${theme.palette.primary.main}dd`,
                    borderRadius: 10,
                    parsing: {
                        yAxisKey: 'val'
                    }

                }],
            }
            _graphs[key] = _data;
        });
        setGraphs(_graphs);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.user]);

    if (props.user == null) return (<></>);
    if (!props.user.data.completion) return (<></>);
    return (
        <>
            {
                graphs && graphs[selectedGraph] ? <>
                    <Bar height={'80px'} data={graphs[selectedGraph]} options={config} />
                    {
                        Object.keys(graphs).map((key, index) => {
                            const stylizedKey = key.length === 2 ? key.toUpperCase() : capitalize(key);
                            return (
                                <Button variant={selectedGraph === key ? 'contained' : 'outlined'} sx={{ cursor: 'pointer', display: 'inline-block', mr: 1 }} onClick={() => setSelectedGraph(key)}>{stylizedKey}</Button>
                                //<Typography variant='subtitle1' sx={{ cursor: 'pointer', display: 'inline-block', mr: 1 }} onClick={() => setSelectedGraph(key)}>{stylizedKey}</Typography>
                            )
                        })
                    }
                    <Divider sx={{ mt: 1, mb: 1 }} />
                </> : <></>
            }
            <Grid container spacing={0.5}>
                {
                    Object.keys(props.user.data.completion).map((key, index) => {
                        const stylizedKey = key.length === 2 ? key.toUpperCase() : capitalize(key);
                        return (
                            <Grid item xs={3}>
                                <Paper sx={{ p: 0.5 }}>
                                    <Typography variant='title' sx={{ fontSize: '0.85em' }}>{stylizedKey} completion</Typography>
                                    <TableContainer>
                                        <Table size='small'>
                                            <TableBody>
                                                {
                                                    props.user.data.completion[key].map((item, index) => {

                                                        return (
                                                            <TableRow>
                                                                <TableCell sx={{ fontWeight: 'bold' }}>{item.range}</TableCell>
                                                                <TableCell>{Math.round(item.completion * 10) / 10}%</TableCell>
                                                                <TableCell>{item.scores}/{item.beatmaps}</TableCell>
                                                            </TableRow>
                                                        )
                                                    })
                                                }
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                </Paper>
                            </Grid>
                        )
                    })
                }
            </Grid>
        </>
    )
}

export default SectionCompletion;