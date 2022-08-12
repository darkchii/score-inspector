import { Avatar, Card, CardContent, Typography, Grid, TableContainer, Table, TableBody, TableRow, TableCell } from '@mui/material';
import { useEffect } from 'react';
import NumberFormat from 'react-number-format';

function GeneralCardTagOccurances(props) {
    return (
        <>
            <Card sx={{ height: "100%" }}>
                <CardContent>
                    <Grid container spacing={3} sx={{ justifyContent: 'space-between' }}>
                        <Grid item sx={{ width: '100%' }}>
                            <Typography color="textPrimary">tag occurances ({props.data.processed.usedTags.length.toLocaleString("en-US")} total)</Typography>
                            <TableContainer>
                                <Table size="small">
                                    <TableBody>
                                        {
                                            props.data.processed.usedTags.slice(0, 9).map((row) => (
                                                <TableRow>
                                                    <TableCell component="th" scope="row">
                                                        {row.tag}
                                                    </TableCell>
                                                    <TableCell component="th" scope="row">
                                                        {row.value.toLocaleString("en-US")}
                                                    </TableCell>
                                                </TableRow>
                                            ))
                                        }
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>
        </>
    );
}
export default GeneralCardTagOccurances;