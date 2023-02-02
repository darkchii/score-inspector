import { Button, ButtonGroup, Grid, Paper, Skeleton, Table, TableBody, TableCell, TableRow, Tooltip, Typography } from "@mui/material";
import { useState } from "react";

function SectionGraphs(props) {
    const [timeGraphValue, setTimeGraphValue] = useState("clearsPerSection");

    const graphButtons = [
        {
            title: `Periodic`, buttons: [
                { id: "clearsPerSection", title: "Clears" },
                { id: "totalscorePerSection", title: "Ranked Score" },
                { id: "totaltotalScorePerSection", title: "Total Score", isDailyApi: true },
                { id: "totalSSscorePerSection", title: "SS Score" },
                { id: "gradesPerSection", title: "Grades" },
                { id: "ppPerSection", title: "PP" },
                { id: "lengthPerSection", title: "Length" },
                { id: "totalhitsPerSection", title: "Hits" },
                { id: "totalAverageAcc", title: "Accuracy" },
                { id: "gainedLevel", title: "Level", isDailyApi: true },
            ]
        },
        {
            title: "Cumulative", buttons: [
                { id: "cumulativeClears", title: "Clears" },
                { id: "cumulativeScore", title: "Ranked Score" },
                { id: "cumulativeTotalScore", title: "Total Score", isDailyApi: true },
                { id: "cumulativeSSScore", title: "SS Score" },
                { id: "cumulativeGrades", title: "Grades" },
                { id: "cumulativePP", title: "PP" },
                { id: "cumulativeLength", title: "Length" },
                { id: "cumulativeHits", title: "Hits" },
                { id: "cumulativeAcc", title: "Accuracy" },
                { id: "cumulativeLevel", title: "Level", isDailyApi: true },
            ]
        },
        {
            title: "Other", buttons: [
                { id: "srPerPlay", title: "Average SR" },
                { id: "highestSr", title: "Highest SR" },
                { id: "scorePerPlay", title: "Average Score" },
                { id: "lengthPerPlay", title: "Average Length" },
                { id: "ppPerPlay", title: "Average PP" },
                //{ id: "accPerPlay", title: "Average Accuracy" },
                { id: "highestPPPlay", title: "Highest PP" },
                { id: "rawPP", title: "Raw PP", isDailyApi: true },
                { id: "globalRank", title: "World Rank", isDailyApi: true },
                { id: "countryRank", title: "Country Rank", isDailyApi: true },
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
                                                    {
                                                        group.buttons.map((button, j) => {
                                                            const disableButton = button.isDailyApi ? (props.user.daily === null || props.user.daily === undefined || props.user.daily.error !== undefined) : false;

                                                            return (
                                                                <>
                                                                    <Tooltip title={disableButton ? 'No data available from osu!daily api for this user' : ''}>
                                                                        <Button sx={{m:0.2}} size='small' disabled={disableButton} variant={timeGraphValue === button.id ? 'contained' : 'outlined'} key={j} onClick={() => { setTimeGraphValue(button.id); }}>{button.title}</Button>
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