import { Avatar, Card, CardContent, Typography, Grid, TableContainer, Table, TableBody, TableRow, TableCell, Tooltip } from '@mui/material';
import { useEffect } from 'react';
import NumberFormat from 'react-number-format';
import { getModIcon } from '../../Assets';
import { mods, mod_strings_long } from '../../helper';

function GeneralCardUsedModCombos(props) {
    return (
        <>
            <Card sx={{ height: "100%" }}>
                <CardContent>
                    <Grid container spacing={3} sx={{ justifyContent: 'space-between' }}>
                        <Grid item sx={{ width: '100%' }}>
                            <Typography color="textPrimary">most used mod combinations</Typography>
                            <TableContainer>
                                <Table size="small">
                                    <TableBody>
                                        {
                                            props.data.processed.usedMods.slice(0, 8).map((row) => (
                                                <TableRow>
                                                    <TableCell component="th" scope="row">
                                                        {row.mods.length > 0 ? row.mods.split(",").map(mod => (
                                                            <>
                                                                <Tooltip title={mod_strings_long[mods[mod]]}>
                                                                    <img height="20px" src={getModIcon(mod)} alt={mod} />
                                                                </Tooltip>
                                                            </>
                                                        )) : "None"}
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
export default GeneralCardUsedModCombos;