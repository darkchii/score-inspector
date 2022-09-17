import { Button, Card, CardContent, CardMedia, Chip, Grid, Link, List, ListItem, ListItemIcon, ListItemText, Stack, Table, TableCell, TableContainer, TableRow, Typography } from "@mui/material";
import POINTING_KIRINO from '../Assets/Other/pointing_kirino.jpg';

function PageLanding(props) {
    return (
        <>
            <Grid container spacing={2}>
                <Grid item xs={12} md={3}>
                    <Card>
                        <CardContent>
                            <Stack spacing={1}>
                                <Typography variant='h5'>What does it do</Typography>
                                <Typography variant='body2'>This website takes the dump of all your scores, and generates statistics and graphs from it.</Typography>
                                <Typography variant='body2'>All of your scores means every TOP score on a beatmap, so not plays that are overridden or set with different mods.</Typography>
                                <Typography variant='body2'>Because of this, stats like periodic activity can be off due to missing scores, if they were overridden later in time.</Typography>
                                <Typography variant='h5'>Can I see other users</Typography>
                                <Typography variant='body2'>Every user that has fetched their scores can be viewed here. The user in question has to fetch them themselves, others cannot do that.</Typography>
                                <Typography variant='h5'>Where can I recommend changes</Typography>
                                <Typography variant='body2'>The following two places are fine: </Typography>
                                <Typography variant='body2'>- The <code>#feature-ideas</code> channel in the osu!alt discord (make sure to tag Amayakase#9198)</Typography>
                                <Typography variant='body2'>- Opening an issue on the <Link href="https://github.com/darkchii/score-inspector" target="_blank">GitHub</Link></Typography>
                            </Stack>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} md={3}>
                    <Card>
                        <CardContent>
                            <Typography variant='h5'>How to view your scores</Typography>
                            <Typography>If you already ran the score fetcher, you can skip to step 4</Typography>
                            <TableContainer>
                                <Table size='small'>
                                    <TableRow><TableCell>1.</TableCell><TableCell>Join the <Button href='https://discord.gg/VZWRZZXcW4' target="_blank" variant="contained" size='small'>osu!alternative</Button> discord</TableCell></TableRow>
                                    <TableRow><TableCell>2.</TableCell><TableCell>Follow the guide to fetch your scores (<i>#info</i> channel)</TableCell></TableRow>
                                    <TableRow><TableCell>3.</TableCell><TableCell>Wait a few hours. When done, you generally don't need to run it anymore</TableCell></TableRow>
                                    <TableRow><TableCell>4.</TableCell><TableCell>Run the following command: <code>!getfile -type scores -u username</code></TableCell></TableRow>
                                    <TableRow><TableCell>5.</TableCell><TableCell>Upload the resulting file above</TableCell></TableRow>
                                </Table>
                            </TableContainer>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} md={6}>
                    <Card>
                        <CardContent>
                            <Typography variant='h5'>Remember to enjoy game!</Typography>
                        </CardContent>
                        <CardMedia component="img" height="450" image={POINTING_KIRINO} />
                    </Card>
                </Grid>
            </Grid>
        </>
    );
}
export default PageLanding;