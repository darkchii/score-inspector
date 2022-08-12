import { Avatar, Card, CardContent, Typography, Grid, Paper } from '@mui/material';
import { useEffect } from 'react';
import NumberFormat from 'react-number-format';
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip as ChartTooltip, Legend } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
ChartJS.register(ArcElement, ChartTooltip, Legend, ChartDataLabels);

function GeneralCardGradeSpread(props) {
    return (
        <>
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
                                                return (value !== undefined ? (`${context.chart.data.labels[context.dataIndex]}: ${value.toLocaleString("en-US")} (${(100 / props.data.scores.length * value).toFixed(2)}%)`) : "");
                                            }
                                        }
                                    }
                                }} />
                            </Grid>
                        </Grid>
                    </CardContent>
                </Card>
            </Paper>
        </>
    );
}
export default GeneralCardGradeSpread;