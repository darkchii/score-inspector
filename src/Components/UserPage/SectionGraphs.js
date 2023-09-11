import { Box, Button, Grid, Paper, Skeleton, Table, TableBody, TableCell, TableRow, Tooltip, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import LineChart from "../../Helpers/Charts/LineChart";

function SectionGraphs(props) {
    const [timeGraphValue, setTimeGraphValue] = useState(null);
    const [graphData, setGraphData] = useState(null);
    const [graphVerticalData, setGraphVerticalData] = useState(null);
    const [graphHorizontalData, setGraphHorizontalData] = useState(null);

    const _setGraphData = (data) => {
        setGraphData(data);
        setGraphVerticalData(data.labels);
        setGraphHorizontalData(data.data);
    }

    useEffect(() => {
        if (props.dataset !== undefined && props.dataset.graphs !== null) {
            // setTimeGraphValue(props.dataset.graphs[0].graphObjects[0].id);
            _setGraphData(props.dataset.graphs[0].graphObjects[0]);
        }
    }, [props.dataset]);

    useEffect(() => {
        //force a re-render
        setTimeGraphValue(null);
        setTimeGraphValue(graphData?.id);
    }, [graphData])

    return (
        (props.dataset !== undefined && graphData !== null && graphVerticalData !== null && graphHorizontalData !== null) ?
            <>
                <Grid container spacing={3}>
                    <Grid item xs={12} md={12} lg={12}>
                        <Paper elevation={5}>
                            <Grid sx={{
                                height: 300
                            }}>
                                <LineChart
                                    key={graphData.id}
                                    xAxis={[{ scaleType: 'time', data: graphVerticalData }]}
                                    series={graphHorizontalData}
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