import { Card, CardContent, Typography, Grid, TableContainer, Table, TableBody, TableRow, TableCell, Link } from '@mui/material';

function GeneralCardLeaderboardStats(props) {
    return (
        <>
            <Card sx={{ height: "100%" }}>
                <CardContent>
                    <Grid container spacing={3} sx={{ justifyContent: 'space-between' }}>
                        <Grid item sx={{ width: '100%' }}>
                            <Typography color="textPrimary">leaderboard scores</Typography>
                            {
                                props.data.user.leaderboard_stats !== null ? <>
                                    <Grid>
                                        <TableContainer>
                                            <Table>
                                                <TableBody>
                                                    <TableRow>
                                                        <TableCell>Top 1s</TableCell>
                                                        <TableCell>{props.data.user.leaderboard_stats.top1s.toLocaleString('en-US')}</TableCell>
                                                        <TableCell>{props.data.user.leaderboard_stats.top1s_rank !== null ? `#${props.data.user.leaderboard_stats.top1s_rank.toLocaleString('en-US')}` : '-'}</TableCell>
                                                    </TableRow>
                                                    <TableRow>
                                                        <TableCell>Top 8s</TableCell>
                                                        <TableCell>{props.data.user.leaderboard_stats.top8s.toLocaleString('en-US')}</TableCell>
                                                        <TableCell>{props.data.user.leaderboard_stats.top8s_rank !== null ? `#${props.data.user.leaderboard_stats.top8s_rank.toLocaleString('en-US')}` : '-'}</TableCell>
                                                    </TableRow>
                                                    <TableRow>
                                                        <TableCell>Top 15s</TableCell>
                                                        <TableCell>{props.data.user.leaderboard_stats.top15s.toLocaleString('en-US')}</TableCell>
                                                        <TableCell>{props.data.user.leaderboard_stats.top15s_rank !== null ? `#${props.data.user.leaderboard_stats.top15s_rank.toLocaleString('en-US')}` : '-'}</TableCell>
                                                    </TableRow>
                                                    <TableRow>
                                                        <TableCell>Top 25s</TableCell>
                                                        <TableCell>{props.data.user.leaderboard_stats.top25s.toLocaleString('en-US')}</TableCell>
                                                        <TableCell>{props.data.user.leaderboard_stats.top25s_rank !== null ? `#${props.data.user.leaderboard_stats.top25s_rank.toLocaleString('en-US')}` : '-'}</TableCell>
                                                    </TableRow>
                                                    <TableRow>
                                                        <TableCell>Top 50s</TableCell>
                                                        <TableCell>{props.data.user.leaderboard_stats.top50s.toLocaleString('en-US')}</TableCell>
                                                        <TableCell>{props.data.user.leaderboard_stats.top50s_rank !== null ? `#${props.data.user.leaderboard_stats.top50s_rank.toLocaleString('en-US')}` : '-'}</TableCell>
                                                    </TableRow>
                                                </TableBody>
                                            </Table>
                                        </TableContainer>
                                        <br />
                                        <Typography color="textSecondary" variant="subtitle2">Data provided by <Link target='_blank' href='https://github.com/respektive/osustats'>Respektive</Link></Typography>
                                    </Grid>
                                </> : <>
                                    <Typography color="textSecondary">no leaderboard scores available right now</Typography>
                                </>
                            }
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>
        </>
    );
}
export default GeneralCardLeaderboardStats;