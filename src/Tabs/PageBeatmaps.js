import { Accordion, AccordionDetails, AccordionSummary, Card, CardContent, Chip, Grid, Link, List, ListItem, Slider, Table, TableBody, TableCell, TableContainer, TableRow, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { getBeatmapStats } from "../osu";

function PageBeatmaps(props) {
    const [beatmapStats, setBeatmapStats] = useState(null);

    useEffect(() => {
        (async () => {
            const info = await getBeatmapStats();
            setBeatmapStats(info);
        })();
    }, []);

    return (
        <>
            {
                beatmapStats === null ? <>Loading...</> :
                    <>
                        <Card>
                            <CardContent>
                                <Typography variant="h5">Beatmap statistics</Typography>
                                <Grid container spacing={2}>
                                    <Grid item xs={12} md={2}></Grid>
                                    <Grid item xs={12} md={2}>
                                        <Grid spacing={5}>
                                            <Card>
                                                <CardContent>
                                                    <Typography variant="h6">Ranked beatmaps</Typography>
                                                    <Typography variant="h4">{beatmapStats.misc.ranked}</Typography>
                                                </CardContent>
                                            </Card>
                                            <Card sx={{ mt: 2 }}>
                                                <CardContent>
                                                    <Typography variant="h6">Loved beatmaps</Typography>
                                                    <Typography variant="h4">{beatmapStats.misc.loved}</Typography>
                                                </CardContent>
                                            </Card>
                                        </Grid>
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <Card>
                                            <CardContent>
                                                <Typography variant="h6">Misc stats</Typography>
                                                <Typography variant="subtitle2">This data represents the minimum, maximum and average values of certain beatmap info (only ranked)</Typography>
                                                <TableContainer sx={{pt: 3}}>
                                                    <Table size='small'>
                                                        <TableBody>
                                                            {
                                                                Object.keys(beatmapStats.minmax).map(function (key) {
                                                                    const rounding = beatmapStats.minmax[key].rounding;
                                                                    const min = beatmapStats.minmax[key].min.toFixed(rounding);
                                                                    const max = beatmapStats.minmax[key].max.toFixed(rounding);
                                                                    const avg = beatmapStats.minmax[key].avg.toFixed(rounding);
                                                                    return (
                                                                        <TableRow>
                                                                            <TableCell>{beatmapStats.minmax[key].name}</TableCell>
                                                                            <TableCell sx={{pt:3}} width='70%'>
                                                                                <Slider
                                                                                    InputProps={{ readOnly: true }}
                                                                                    size="small"
                                                                                    min={beatmapStats.minmax[key].min}
                                                                                    max={beatmapStats.minmax[key].max}
                                                                                    marks={
                                                                                        [
                                                                                            {
                                                                                                value: beatmapStats.minmax[key].min,
                                                                                                label: min
                                                                                            },
                                                                                            {
                                                                                                value: beatmapStats.minmax[key].max,
                                                                                                label: max
                                                                                            }
                                                                                        ]}
                                                                                    value={beatmapStats.minmax[key].avg}
                                                                                    valueLabelDisplay="on"
                                                                                    valueLabelFormat={(value) => `Average: ${avg}`}
                                                                                >

                                                                                </Slider>
                                                                            </TableCell>
                                                                            <TableCell width='5%'></TableCell>
                                                                        </TableRow>
                                                                    );
                                                                })
                                                            }
                                                        </TableBody>
                                                    </Table>
                                                </TableContainer>
                                            </CardContent>
                                        </Card>
                                    </Grid>
                                    <Grid item xs={12} md={2}></Grid>
                                </Grid>
                            </CardContent>
                        </Card>
                    </>
            }
        </>
    );
}
export default PageBeatmaps;