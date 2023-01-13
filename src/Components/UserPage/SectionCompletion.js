import { Grid, Paper, Table, TableBody, TableCell, TableContainer, TableRow, Typography } from "@mui/material";
import { useEffect } from "react";
import { capitalize } from "../../Helpers/Misc";

function SectionCompletion(props) {
    if (props.user == null) return (<></>);
    if (!props.user.data.completion) return (<></>);
    return (
        <>
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
                                                                <TableCell sx={{fontWeight: 'bold'}}>{item.range}</TableCell>
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