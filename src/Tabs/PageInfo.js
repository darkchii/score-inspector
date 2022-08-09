import { Card, CardContent, Grid, Paper, TableContainer, Typography, Table, TableBody, TableRow, TableCell } from "@mui/material";
import GitHubIcon from '@mui/icons-material/GitHub';
import TwitterIcon from '@mui/icons-material/Twitter';

function PageInfo(props) {
    return (
        <>
            <Grid container spacing={3}>
                <Grid item xs={12} sm={6} md={6}>
                    <Card>
                        <CardContent>
                            <Typography gutterBottom variant="h5" component="div">
                                How to
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                If this is your first time here and osu!alt, fetching scores requires a bit of your patience
                            </Typography>
                            <TableContainer>
                                <Table>
                                    <TableBody>
                                        <TableRow>
                                            <TableCell>1</TableCell>
                                            <TableCell>Join the osu!alt discord</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell>2</TableCell>
                                            <TableCell>Head to #info and "fetching scores" section and follow that</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell>3</TableCell>
                                            <TableCell>Wait for the above to finish</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell>4</TableCell>
                                            <TableCell>Go into #bot-commands and run <code>!getfile -type scores</code></TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell>5</TableCell>
                                            <TableCell>Upload the given scores.csv here</TableCell>
                                        </TableRow>
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={6}>
                    <Card>
                        <CardContent>
                            <Typography gutterBottom variant="h5" component="div">
                                About, socials and links
                            </Typography>
                            <TableContainer>
                                <Table>
                                    <TableBody>
                                        <TableRow>
                                            <TableCell><GitHubIcon /></TableCell>
                                            <TableCell><a href="https://github.com/EngineerMark/score-inspector" target="_blank" rel="noreferrer">score-inspector</a></TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell><TwitterIcon /></TableCell>
                                            <TableCell><a href="https://twitter.com/id2amayakase" target="_blank" rel="noreferrer">Amayakase</a></TableCell>
                                        </TableRow>
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </>
    );
}
export default PageInfo;