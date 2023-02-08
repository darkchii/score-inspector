import { Card, CardContent, CardHeader, CircularProgress, Grid, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import moment from "moment";
import { useEffect, useState } from "react";
import { IMG_SVG_GRADE_A, IMG_SVG_GRADE_B, IMG_SVG_GRADE_C, IMG_SVG_GRADE_D, IMG_SVG_GRADE_S, IMG_SVG_GRADE_SH, IMG_SVG_GRADE_X, IMG_SVG_GRADE_XH } from "../Helpers/Assets";
import { getScoreStats } from "../Helpers/OsuAlt";

function Stats(props) {
    const [scoreStats, setScoreStats] = useState(undefined);

    useEffect(() => {
        (async () => {
            const data = await getScoreStats();
            setScoreStats(data);
        })();
    }, []);

    return (
        <>
            <Grid container spacing={2}>
                <Grid item xs={12} md={5}>
                    <Card>
                        <CardHeader title='Score Stats' />
                        <CardContent>
                            <TableContainer>
                                <Table size='small'>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell></TableCell>
                                            <TableCell align='right'>Last 24 hours</TableCell>
                                            <TableCell align='right'>All time</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        <TableRow>
                                            <TableCell>Clears</TableCell>
                                            <TableCell align='right'>{scoreStats ? parseInt(scoreStats?.['24h']?.scores).toLocaleString('en-US') : <CircularProgress size={15} />} </TableCell>
                                            <TableCell align='right'>{scoreStats ? parseInt(scoreStats?.['all']?.scores).toLocaleString('en-US') : <CircularProgress size={15} />} </TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell>Score</TableCell>
                                            <TableCell align='right'>{scoreStats ? parseInt(scoreStats?.['24h']?.total_score).toLocaleString('en-US') : <CircularProgress size={15} />} </TableCell>
                                            <TableCell align='right'>{scoreStats ? parseInt(scoreStats?.['all']?.total_score).toLocaleString('en-US') : <CircularProgress size={15} />} </TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell>Playtime</TableCell>
                                            <TableCell align='right'>{scoreStats ? Math.round(moment.duration(parseInt(scoreStats?.['24h']?.total_length), 'second').asHours()).toLocaleString('en-US')+' hours' : <CircularProgress size={15} />} </TableCell>
                                            <TableCell align='right'>{scoreStats ? Math.round(moment.duration(parseInt(scoreStats?.['all']?.total_length), 'second').asHours()).toLocaleString('en-US')+' hours' : <CircularProgress size={15} />} </TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell><img src={IMG_SVG_GRADE_XH} alt='XH' /></TableCell>
                                            <TableCell align='right'>{scoreStats ? parseInt(scoreStats?.['24h']?.scores_xh).toLocaleString('en-US') : <CircularProgress size={15} />} </TableCell>
                                            <TableCell align='right'>{scoreStats ? parseInt(scoreStats?.['all']?.scores_xh).toLocaleString('en-US') : <CircularProgress size={15} />} </TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell><img src={IMG_SVG_GRADE_X} alt='X' /></TableCell>
                                            <TableCell align='right'>{scoreStats ? parseInt(scoreStats?.['24h']?.scores_x).toLocaleString('en-US') : <CircularProgress size={15} />} </TableCell>
                                            <TableCell align='right'>{scoreStats ? parseInt(scoreStats?.['all']?.scores_x).toLocaleString('en-US') : <CircularProgress size={15} />} </TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell><img src={IMG_SVG_GRADE_SH} alt='SH' /></TableCell>
                                            <TableCell align='right'>{scoreStats ? parseInt(scoreStats?.['24h']?.scores_sh).toLocaleString('en-US') : <CircularProgress size={15} />} </TableCell>
                                            <TableCell align='right'>{scoreStats ? parseInt(scoreStats?.['all']?.scores_sh).toLocaleString('en-US') : <CircularProgress size={15} />} </TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell><img src={IMG_SVG_GRADE_S} alt='S' /></TableCell>
                                            <TableCell align='right'>{scoreStats ? parseInt(scoreStats?.['24h']?.scores_s).toLocaleString('en-US') : <CircularProgress size={15} />} </TableCell>
                                            <TableCell align='right'>{scoreStats ? parseInt(scoreStats?.['all']?.scores_s).toLocaleString('en-US') : <CircularProgress size={15} />} </TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell><img src={IMG_SVG_GRADE_A} alt='A' /></TableCell>
                                            <TableCell align='right'>{scoreStats ? parseInt(scoreStats?.['24h']?.scores_a).toLocaleString('en-US') : <CircularProgress size={15} />} </TableCell>
                                            <TableCell align='right'>{scoreStats ? parseInt(scoreStats?.['all']?.scores_a).toLocaleString('en-US') : <CircularProgress size={15} />} </TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell><img src={IMG_SVG_GRADE_B} alt='B' /></TableCell>
                                            <TableCell align='right'>{scoreStats ? parseInt(scoreStats?.['24h']?.scores_b).toLocaleString('en-US') : <CircularProgress size={15} />} </TableCell>
                                            <TableCell align='right'>{scoreStats ? parseInt(scoreStats?.['all']?.scores_b).toLocaleString('en-US') : <CircularProgress size={15} />} </TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell><img src={IMG_SVG_GRADE_C} alt='C' /></TableCell>
                                            <TableCell align='right'>{scoreStats ? parseInt(scoreStats?.['24h']?.scores_c).toLocaleString('en-US') : <CircularProgress size={15} />} </TableCell>
                                            <TableCell align='right'>{scoreStats ? parseInt(scoreStats?.['all']?.scores_c).toLocaleString('en-US') : <CircularProgress size={15} />} </TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell><img src={IMG_SVG_GRADE_D} alt='D' /></TableCell>
                                            <TableCell align='right'>{scoreStats ? parseInt(scoreStats?.['24h']?.scores_d).toLocaleString('en-US') : <CircularProgress size={15} />} </TableCell>
                                            <TableCell align='right'>{scoreStats ? parseInt(scoreStats?.['all']?.scores_d).toLocaleString('en-US') : <CircularProgress size={15} />} </TableCell>
                                        </TableRow>
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </>
    )
}

export default Stats;