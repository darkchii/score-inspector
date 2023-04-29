import { Box, Button, Checkbox, FormControl, FormControlLabel, Grid, Radio, RadioGroup, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Tooltip, Typography } from "@mui/material";
import moment from "moment";
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { DesktopDatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { useState } from "react";
import { useEffect } from "react";

const FILTER_FIELD_SIZE = 12 / 7;
const MIN_DATE = moment('6 Oct 2007');
const MAX_DATE = moment();

function BeatmapFilter(props) {
    //-1 in range values are simply ignored and no limit is set
    //null is ignored too
    const [minStars, setMinStars] = useState(null);
    const [maxStars, setMaxStars] = useState(null);
    const [minApprovedDate, setMinApprovedDate] = useState(MIN_DATE);
    const [maxApprovedDate, setMaxApprovedDate] = useState(MAX_DATE);

    const [columns, setColumns] = useState(null);

    useEffect(() => {
        setColumns(props.columns);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, props.columns);

    const onApply = () => {
        props.onApply(columns, {
            starsRange: [minStars, maxStars],
            approvedDateRange: [minApprovedDate, maxApprovedDate],
        });
    }

    const updateColumn = (column, checked) => {
        const _c = columns;
        _c.forEach(c => {
            if (c.field === column.field) {
                c.hide = !checked;
            }
        });
        setColumns(_c);
        console.log(_c);
    };

    return (
        <>
            <Grid sx={{ m: 1 }}>
                <Grid container sx={{ pt: 2, '& > *': { pl: 1 } }}>
                    <Grid item xs={6} md={FILTER_FIELD_SIZE} lg={FILTER_FIELD_SIZE}>
                        <TextField sx={{ width: '100%' }} label="Min Stars" onChange={(e) => setMinStars(e.target.value)} value={minStars} variant="standard" size="small" />
                        <TextField sx={{ width: '100%' }} label="Max Stars" onChange={(e) => setMaxStars(e.target.value)} value={maxStars} variant="standard" size="small" />
                    </Grid>
                    <Grid item xs={6} md={FILTER_FIELD_SIZE} lg={FILTER_FIELD_SIZE}>
                        <LocalizationProvider dateAdapter={AdapterMoment}>
                            <DesktopDatePicker minDate={MIN_DATE} maxDate={MAX_DATE} label="Min Ranked Date" inputFormat="MM/DD/YYYY" value={minApprovedDate} onChange={setMinApprovedDate} renderInput={(params) => <TextField variant="standard" size="small" {...params} />} />
                            <DesktopDatePicker minDate={MIN_DATE} maxDate={MAX_DATE} label="Max Ranked Date" inputFormat="MM/DD/YYYY" value={maxApprovedDate} onChange={setMaxApprovedDate} renderInput={(params) => <TextField variant="standard" size="small" {...params} />} />
                        </LocalizationProvider>
                    </Grid>
                </Grid>
                <Grid container sx={{ py: 1 }}>
                    <TableContainer>
                        <Table size="small">
                            <TableHead>
                                <TableRow>
                                    {
                                        columns && columns.map((column) => (
                                            <>
                                                <TableCell align="center"><Typography variant="subtitles1" sx={{ fontSize: '0.9em' }}>{column.headerName}</Typography></TableCell>
                                            </>
                                        ))
                                    }
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                <TableRow>
                                    {
                                        columns && columns.map((column) => (
                                            <>
                                                <TableCell align="center"><Checkbox size='small' onChange={(e) => { updateColumn(column, e.target.checked); }} defaultChecked={!column.hide} /></TableCell>
                                            </>
                                        ))
                                    }
                                </TableRow>
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Grid>
                <Grid sx={{ alignContent: 'center' }}>
                    <Button sx={{ my: 1 }} onClick={onApply} variant="contained">Apply</Button>
                    <Typography variant='subtitle2'>Enter -1 to ignore a filter</Typography>
                </Grid>
            </Grid>
        </>
    );
}
export default BeatmapFilter;