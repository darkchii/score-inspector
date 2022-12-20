import { Button, ButtonGroup, Grid, Paper, Skeleton, Table, TableBody, TableCell, TableRow, Typography } from "@mui/material";
import { useState } from "react";

function SectionGraphs(props) {
    const [timeGraphValue, setTimeGraphValue] = useState("clearsPerSection");

    const graphButtons = [
        {
            title: `Periodic`, buttons: [
                { id: "clearsPerSection", title: "Clears" },
                { id: "totalscorePerSection", title: "Score" },
                { id: "totalSSscorePerSection", title: "SS Score" },
                { id: "gradesPerSection", title: "Grades" },
                { id: "ppPerSection", title: "PP" },
                { id: "lengthPerSection", title: "Length" },
                { id: "totalhitsPerSection", title: "Hits" },
                { id: "totalAverageAcc", title: "Accuracy" },
            ]
        },
        {
            title: "Cumulative", buttons: [
                { id: "cumulativeClears", title: "Clears" },
                { id: "cumulativeScore", title: "Score" },
                { id: "cumulativeSSScore", title: "SS Score" },
                { id: "cumulativeGrades", title: "Grades" },
                { id: "cumulativePP", title: "PP" },
                { id: "cumulativeLength", title: "Length" },
                { id: "cumulativeHits", title: "Hits" },
                { id: "cumulativeAcc", title: "Accuracy" },
            ]
        },
        {
            title: "Other", buttons: [
                { id: "srPerPlay", title: "Average SR" },
                { id: "scorePerPlay", title: "Average Score" },
                { id: "lengthPerPlay", title: "Average Length" },
                { id: "ppPerPlay", title: "Average PP" },
                //{ id: "accPerPlay", title: "Average Accuracy" },
                { id: "highestPPPlay", title: "Highest PP" },
                { id: "rawPP", title: "Raw PP" },
                { id: "globalRank", title: "Rank" },
                { id: "completion", title: "Completion" },
            ]
        }
    ];

    return (
        (props.dataset !== undefined) ?
            <>
                <Grid container spacing={3}>
                    <Grid item xs={12} md={12} lg={12}>
                        <Paper elevation={5}>
                            <Grid>
                                {
                                    props.dataset.graphs !== null ?
                                        (props.dataset.graphs[timeGraphValue]) : <></>
                                }
                            </Grid>

                            <Table size='small'>
                                <TableBody>
                                    {
                                        graphButtons.map((group, i) => (
                                            <TableRow key={i}>
                                                <TableCell>
                                                    <Typography variant="body1">{group.title}</Typography>
                                                </TableCell>
                                                <TableCell>
                                                    <ButtonGroup size='small'>
                                                        {
                                                            group.buttons.map((button, j) => (
                                                                <Button variant={timeGraphValue === button.id ? 'contained' : 'outlined'} key={j} onClick={() => { setTimeGraphValue(button.id); }}>{button.title}</Button>
                                                            )
                                                            )
                                                        }
                                                    </ButtonGroup>
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