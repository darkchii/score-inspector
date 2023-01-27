import { Box, Button, Checkbox, FormControl, FormControlLabel, Grid, Radio, RadioGroup, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Tooltip, Typography } from "@mui/material";
import moment from "moment";
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { DesktopDatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { useState } from "react";
import { mods, mod_strings_long } from "../Helpers/Osu";
import { useEffect } from "react";
import { getModIcon, getPossibleMods, IMG_SVG_GRADE_A, IMG_SVG_GRADE_B, IMG_SVG_GRADE_C, IMG_SVG_GRADE_D, IMG_SVG_GRADE_S, IMG_SVG_GRADE_SH, IMG_SVG_GRADE_X, IMG_SVG_GRADE_XH } from "../Helpers/Assets";
import ImageToggle from "./ImageToggle";

const FILTER_FIELD_SIZE = 12 / 7;
const MIN_DATE = moment('6 Oct 2007');
const MAX_DATE = moment();

function BeatmapFilter(props) {
    //-1 in range values are simply ignored and no limit is set
    //null is ignored too
    const [enabledMods, setEnabledMods] = useState(0);
    const [enabledNomod, setNomodEnabled] = useState(true);
    const [enabledGrades, setEnabledGrades] = useState(['XH', 'X', 'SH', 'S', 'A', 'B', 'C', 'D']);
    const [modsState, setModsState] = useState('any');
    const [minScore, setMinScore] = useState(null);
    const [maxScore, setMaxScore] = useState(null);
    const [minStars, setMinStars] = useState(null);
    const [maxStars, setMaxStars] = useState(null);
    const [minPP, setMinPP] = useState(null);
    const [maxPP, setMaxPP] = useState(null);
    const [minAcc, setMinAcc] = useState(null);
    const [maxAcc, setMaxAcc] = useState(null);
    const [minCombo, setMinCombo] = useState(null);
    const [maxCombo, setMaxCombo] = useState(null);
    const [minApprovedDate, setMinApprovedDate] = useState(MIN_DATE);
    const [maxApprovedDate, setMaxApprovedDate] = useState(MAX_DATE);
    const [minPlayedDate, setMinPlayedDate] = useState(MIN_DATE);
    const [maxPlayedDate, setMaxPlayedDate] = useState(MAX_DATE);
    const [checkUniqueSS, setCheckUniqueSS] = useState(false);
    const [checkUniqueFC, setCheckUniqueFC] = useState(false);
    const [checkUniqueDTFC, setCheckUniqueDTFC] = useState(false);

    const [columns, setColumns] = useState(null);

    const handleModStateChange = (event) => {
        setModsState(event.target.value);
    };

    const toggleMod = (mod, checked) => {
        const updatedMods = enabledMods + mods[mod] * (checked ? 1 : -1);
        if (mod === 'None') {
            setNomodEnabled(checked);
        }
        setEnabledMods(updatedMods);
    }

    const toggleGrade = (grade, checked) => {
        // const updatedMods = enabledMods + mods[mod] * (checked ? 1 : -1);
        // setEnabledMods(updatedMods);
        var updatedGrades = enabledGrades;
        if (checked) {
            if (!updatedGrades.includes(grade)) {
                updatedGrades.push(grade);
            }
        } else {
            if (updatedGrades.includes(grade)) {
                updatedGrades.splice(updatedGrades.indexOf(grade), 1);
            }
        }
        setEnabledGrades(updatedGrades);
    }

    useEffect(() => {
        var m = 0;
        getPossibleMods().forEach(mod => {
            m += mods[mod];
        });
        setEnabledMods(m);
    }, []);

    useEffect(() => {
        setColumns(props.columns);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, props.columns);

    const onApply = () => {
        props.onApply(columns, {
            enabledMods: enabledMods,
            enabledNomod: enabledNomod,
            modsUsage: modsState,
            enabledGrades: enabledGrades,
            scoreRange: [minScore, maxScore],
            starsRange: [minStars, maxStars],
            ppRange: [minPP, maxPP],
            accRange: [minAcc, maxAcc],
            comboRange: [minCombo, maxCombo],
            approvedDateRange: [minApprovedDate, maxApprovedDate],
            playedDateRange: [minPlayedDate, maxPlayedDate],
            flags: { checkUniqueSS, checkUniqueFC, checkUniqueDTFC }
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
                <Grid container>
                    <Grid item xs={12} md={8} lg={8}>
                        {
                            getPossibleMods().map(mod => (
                                <>

                                    <Tooltip title={mod_strings_long[mods[mod]]} arrow>
                                        <Box display="inline">
                                            <ImageToggle checkedDefault={true} onClick={(checked) => toggleMod(mod, checked)} sx={{ pr: 0.5 }} height="34px" src={getModIcon(mod)} alt={mod} />
                                        </Box>
                                    </Tooltip>
                                </>
                            ))
                        }
                        <FormControl sx={{ ml: 2 }}>
                            <RadioGroup onChange={handleModStateChange} value={modsState} row>
                                <FormControlLabel control={<Radio size='small' />} value='any' label='Any' />
                                <FormControlLabel control={<Radio size='small' />} value='all' label='All' />
                            </RadioGroup>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} md={4} lg={4}>
                        <Grid container>
                            <Tooltip title='Silver SS' arrow>
                                <Box display="inline">
                                    <ImageToggle checkedDefault={true} onClick={(checked) => toggleGrade('XH', checked)} sx={{ pr: 0.5 }} height="26px" src={IMG_SVG_GRADE_XH} />
                                </Box>
                            </Tooltip>
                            <Tooltip title='Silver S' arrow>
                                <Box display="inline">
                                    <ImageToggle checkedDefault={true} onClick={(checked) => toggleGrade('SH', checked)} sx={{ pr: 0.5 }} height="26px" src={IMG_SVG_GRADE_SH} />
                                </Box>
                            </Tooltip>
                            <Tooltip title='Gold SS' arrow>
                                <Box display="inline">
                                    <ImageToggle checkedDefault={true} onClick={(checked) => toggleGrade('X', checked)} sx={{ pr: 0.5 }} height="26px" src={IMG_SVG_GRADE_X} />
                                </Box>
                            </Tooltip>
                            <Tooltip title='Gold S' arrow>
                                <Box display="inline">
                                    <ImageToggle checkedDefault={true} onClick={(checked) => toggleGrade('S', checked)} sx={{ pr: 0.5 }} height="26px" src={IMG_SVG_GRADE_S} />
                                </Box>
                            </Tooltip>
                            <Tooltip title='A' arrow>
                                <Box display="inline">
                                    <ImageToggle checkedDefault={true} onClick={(checked) => toggleGrade('A', checked)} sx={{ pr: 0.5 }} height="26px" src={IMG_SVG_GRADE_A} />
                                </Box>
                            </Tooltip>
                            <Tooltip title='B' arrow>
                                <Box display="inline">
                                    <ImageToggle checkedDefault={true} onClick={(checked) => toggleGrade('B', checked)} sx={{ pr: 0.5 }} height="26px" src={IMG_SVG_GRADE_B} />
                                </Box>
                            </Tooltip>
                            <Tooltip title='C' arrow>
                                <Box display="inline">
                                    <ImageToggle checkedDefault={true} onClick={(checked) => toggleGrade('C', checked)} sx={{ pr: 0.5 }} height="26px" src={IMG_SVG_GRADE_C} />
                                </Box>
                            </Tooltip>
                            <Tooltip title='D' arrow>
                                <Box display="inline">
                                    <ImageToggle checkedDefault={true} onClick={(checked) => toggleGrade('D', checked)} sx={{ pr: 0.5 }} height="26px" src={IMG_SVG_GRADE_D} />
                                </Box>
                            </Tooltip>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid container sx={{ pt: 2, '& > *': { pl: 1 } }}>
                    <Grid item xs={6} md={FILTER_FIELD_SIZE} lg={FILTER_FIELD_SIZE}>
                        <TextField sx={{ width: '100%' }} label="Min Score" onChange={(e) => setMinScore(e.target.value)} value={minScore} variant="standard" size="small" />
                        <TextField sx={{ width: '100%' }} label="Max Score" onChange={(e) => setMaxScore(e.target.value)} value={maxScore} variant="standard" size="small" />
                    </Grid>
                    <Grid item xs={6} md={FILTER_FIELD_SIZE} lg={FILTER_FIELD_SIZE}>
                        <TextField sx={{ width: '100%' }} label="Min Stars" onChange={(e) => setMinStars(e.target.value)} value={minStars} variant="standard" size="small" />
                        <TextField sx={{ width: '100%' }} label="Max Stars" onChange={(e) => setMaxStars(e.target.value)} value={maxStars} variant="standard" size="small" />
                    </Grid>
                    <Grid item xs={6} md={FILTER_FIELD_SIZE} lg={FILTER_FIELD_SIZE}>
                        <TextField sx={{ width: '100%' }} label="Min PP" onChange={(e) => setMinPP(e.target.value)} value={minPP} variant="standard" size="small" />
                        <TextField sx={{ width: '100%' }} label="Max PP" onChange={(e) => setMaxPP(e.target.value)} value={maxPP} variant="standard" size="small" />
                    </Grid>
                    <Grid item xs={6} md={FILTER_FIELD_SIZE} lg={FILTER_FIELD_SIZE}>
                        <TextField sx={{ width: '100%' }} label="Min Acc" onChange={(e) => setMinAcc(e.target.value)} value={minAcc} variant="standard" size="small" />
                        <TextField sx={{ width: '100%' }} label="Max Acc" onChange={(e) => setMaxAcc(e.target.value)} value={maxAcc} variant="standard" size="small" />
                    </Grid>
                    <Grid item xs={6} md={FILTER_FIELD_SIZE} lg={FILTER_FIELD_SIZE}>
                        <TextField sx={{ width: '100%' }} label="Min Combo" onChange={(e) => setMinCombo(e.target.value)} value={minCombo} variant="standard" size="small" />
                        <TextField sx={{ width: '100%' }} label="Max Combo" onChange={(e) => setMaxCombo(e.target.value)} value={maxCombo} variant="standard" size="small" />
                    </Grid>
                    <Grid item xs={6} md={FILTER_FIELD_SIZE} lg={FILTER_FIELD_SIZE}>
                        <LocalizationProvider dateAdapter={AdapterMoment}>
                            <DesktopDatePicker minDate={MIN_DATE} maxDate={MAX_DATE} label="Min Ranked Date" inputFormat="MM/DD/YYYY" value={minApprovedDate} onChange={setMinApprovedDate} renderInput={(params) => <TextField variant="standard" size="small" {...params} />} />
                            <DesktopDatePicker minDate={MIN_DATE} maxDate={MAX_DATE} label="Max Ranked Date" inputFormat="MM/DD/YYYY" value={maxApprovedDate} onChange={setMaxApprovedDate} renderInput={(params) => <TextField variant="standard" size="small" {...params} />} />
                        </LocalizationProvider>
                    </Grid>
                    <Grid item xs={6} md={FILTER_FIELD_SIZE} lg={FILTER_FIELD_SIZE}>
                        <LocalizationProvider dateAdapter={AdapterMoment}>
                            <DesktopDatePicker minDate={MIN_DATE} maxDate={MAX_DATE} label="Min Played Date" inputFormat="MM/DD/YYYY" value={minPlayedDate} onChange={setMinPlayedDate} renderInput={(params) => <TextField variant="standard" size="small" {...params} />} />
                            <DesktopDatePicker minDate={MIN_DATE} maxDate={MAX_DATE} label="Max Played Date" inputFormat="MM/DD/YYYY" value={maxPlayedDate} onChange={setMaxPlayedDate} renderInput={(params) => <TextField variant="standard" size="small" {...params} />} />
                        </LocalizationProvider>
                    </Grid>
                </Grid>
                <Grid>
                    <Stack direction="row" spacing={2} sx={{ pt: 2 }}>
                        <FormControlLabel label='Is unique SS' control={<Checkbox size='small' onChange={e => setCheckUniqueSS(e.target.checked)} defaultChecked={checkUniqueSS} />} />
                        <FormControlLabel label='Is unique FC' control={<Checkbox size='small' onChange={e => setCheckUniqueFC(e.target.checked)} defaultChecked={checkUniqueFC} />} />
                        <FormControlLabel label='Is unique DT FC' control={<Checkbox size='small' onChange={e => setCheckUniqueDTFC(e.target.checked)} defaultChecked={checkUniqueDTFC} />} />
                    </Stack>
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