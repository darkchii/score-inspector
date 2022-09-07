import { Box, Button, FormControl, FormControlLabel, Grid, Radio, RadioGroup, TextField, Tooltip, Typography } from "@mui/material";
import moment from "moment";
import React, { useEffect } from "react";
import { getModIcon, getPossibleMods, IMG_SVG_GRADE_A, IMG_SVG_GRADE_B, IMG_SVG_GRADE_C, IMG_SVG_GRADE_D, IMG_SVG_GRADE_S, IMG_SVG_GRADE_SH, IMG_SVG_GRADE_X, IMG_SVG_GRADE_XH } from "../Assets";
import { mods, mod_strings_long } from "../helper";
import ImageToggle from "./ImageToggle";
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { DesktopDatePicker, LocalizationProvider } from "@mui/x-date-pickers";

const FILTER_FIELD_SIZE = 1.71428571429;
const MIN_DATE = moment('6 Oct 2007');
const MAX_DATE = moment();

function BeatmapFilter(props) {
    //-1 in range values are simply ignored and no limit is set
    //null is ignored too
    const [enabledMods, setEnabledMods] = React.useState(0);
    const [enabledNomod, setNomodEnabled] = React.useState(true);
    const [enabledGrades, setEnabledGrades] = React.useState(['XH', 'X', 'SH', 'S', 'A', 'B', 'C', 'D']);
    const [modsState, setModsState] = React.useState('any');
    const [minScore, setMinScore] = React.useState(null);
    const [maxScore, setMaxScore] = React.useState(null);
    const [minStars, setMinStars] = React.useState(null);
    const [maxStars, setMaxStars] = React.useState(null);
    const [minPP, setMinPP] = React.useState(null);
    const [maxPP, setMaxPP] = React.useState(null);
    const [minAcc, setMinAcc] = React.useState(null);
    const [maxAcc, setMaxAcc] = React.useState(null);
    const [minCombo, setMinCombo] = React.useState(null);
    const [maxCombo, setMaxCombo] = React.useState(null);
    const [minApprovedDate, setMinApprovedDate] = React.useState(MIN_DATE);
    const [maxApprovedDate, setMaxApprovedDate] = React.useState(MAX_DATE);
    const [minPlayedDate, setMinPlayedDate] = React.useState(MIN_DATE);
    const [maxPlayedDate, setMaxPlayedDate] = React.useState(MAX_DATE);

    console.log('approved min: ' + minApprovedDate);

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

    const onApply = () => {
        props.onApply({
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
            playedDateRange: [minPlayedDate, maxPlayedDate]
        });
    }

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
                                            <ImageToggle checkedDefault={true} onClick={(checked) => toggleMod(mod, checked)} sx={{ pr: 0.5 }} height="38px" src={getModIcon(mod)} alt={mod} />
                                        </Box>
                                    </Tooltip>
                                </>
                            ))
                        }
                        <FormControl sx={{ ml: 2 }}>
                            <RadioGroup onChange={handleModStateChange} value={modsState} row>
                                <FormControlLabel control={<Radio />} value='any' label='Any' />
                                <FormControlLabel control={<Radio />} value='all' label='All' />
                            </RadioGroup>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} md={4} lg={4}>
                        <Grid container>
                            <Tooltip title='Silver SS' arrow>
                                <Box display="inline">
                                    <ImageToggle checkedDefault={true} onClick={(checked) => toggleGrade('XH', checked)} sx={{ pr: 0.5 }} height="30px" src={IMG_SVG_GRADE_XH} />
                                </Box>
                            </Tooltip>
                            <Tooltip title='Silver S' arrow>
                                <Box display="inline">
                                    <ImageToggle checkedDefault={true} onClick={(checked) => toggleGrade('SH', checked)} sx={{ pr: 0.5 }} height="30px" src={IMG_SVG_GRADE_SH} />
                                </Box>
                            </Tooltip>
                            <Tooltip title='Gold SS' arrow>
                                <Box display="inline">
                                    <ImageToggle checkedDefault={true} onClick={(checked) => toggleGrade('X', checked)} sx={{ pr: 0.5 }} height="30px" src={IMG_SVG_GRADE_X} />
                                </Box>
                            </Tooltip>
                            <Tooltip title='Gold S' arrow>
                                <Box display="inline">
                                    <ImageToggle checkedDefault={true} onClick={(checked) => toggleGrade('S', checked)} sx={{ pr: 0.5 }} height="30px" src={IMG_SVG_GRADE_S} />
                                </Box>
                            </Tooltip>
                            <Tooltip title='A' arrow>
                                <Box display="inline">
                                    <ImageToggle checkedDefault={true} onClick={(checked) => toggleGrade('A', checked)} sx={{ pr: 0.5 }} height="30px" src={IMG_SVG_GRADE_A} />
                                </Box>
                            </Tooltip>
                            <Tooltip title='B' arrow>
                                <Box display="inline">
                                    <ImageToggle checkedDefault={true} onClick={(checked) => toggleGrade('B', checked)} sx={{ pr: 0.5 }} height="30px" src={IMG_SVG_GRADE_B} />
                                </Box>
                            </Tooltip>
                            <Tooltip title='C' arrow>
                                <Box display="inline">
                                    <ImageToggle checkedDefault={true} onClick={(checked) => toggleGrade('C', checked)} sx={{ pr: 0.5 }} height="30px" src={IMG_SVG_GRADE_C} />
                                </Box>
                            </Tooltip>
                            <Tooltip title='D' arrow>
                                <Box display="inline">
                                    <ImageToggle checkedDefault={true} onClick={(checked) => toggleGrade('D', checked)} sx={{ pr: 0.5 }} height="30px" src={IMG_SVG_GRADE_D} />
                                </Box>
                            </Tooltip>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid container sx={{ mt: 2 }}>
                    <Grid item xs={6} md={FILTER_FIELD_SIZE} lg={FILTER_FIELD_SIZE} sx={{ px: 1 }}>
                        <TextField sx={{ width: '100%' }} label="Min Score" onChange={(e) => setMinScore(e.target.value)} value={minScore} variant="standard" size="small" />
                        <TextField sx={{ width: '100%' }} label="Max Score" onChange={(e) => setMaxScore(e.target.value)} value={maxScore} variant="standard" size="small" />
                    </Grid>
                    <Grid item xs={6} md={FILTER_FIELD_SIZE} lg={FILTER_FIELD_SIZE} sx={{ px: 1 }}>
                        <TextField sx={{ width: '100%' }} label="Min Stars" onChange={(e) => setMinStars(e.target.value)} value={minStars} variant="standard" size="small" />
                        <TextField sx={{ width: '100%' }} label="Max Stars" onChange={(e) => setMaxStars(e.target.value)} value={maxStars} variant="standard" size="small" />
                    </Grid>
                    <Grid item xs={6} md={FILTER_FIELD_SIZE} lg={FILTER_FIELD_SIZE} sx={{ px: 1 }}>
                        <TextField sx={{ width: '100%' }} label="Min PP" onChange={(e) => setMinPP(e.target.value)} value={minPP} variant="standard" size="small" />
                        <TextField sx={{ width: '100%' }} label="Max PP" onChange={(e) => setMaxPP(e.target.value)} value={maxPP} variant="standard" size="small" />
                    </Grid>
                    <Grid item xs={6} md={FILTER_FIELD_SIZE} lg={FILTER_FIELD_SIZE} sx={{ px: 1 }}>
                        <TextField sx={{ width: '100%' }} label="Min Acc" onChange={(e) => setMinAcc(e.target.value)} value={minAcc} variant="standard" size="small" />
                        <TextField sx={{ width: '100%' }} label="Max Acc" onChange={(e) => setMaxAcc(e.target.value)} value={maxAcc} variant="standard" size="small" />
                    </Grid>
                    <Grid item xs={6} md={FILTER_FIELD_SIZE} lg={FILTER_FIELD_SIZE} sx={{ px: 1 }}>
                        <TextField sx={{ width: '100%' }} label="Min Combo" onChange={(e) => setMinCombo(e.target.value)} value={minCombo} variant="standard" size="small" />
                        <TextField sx={{ width: '100%' }} label="Max Combo" onChange={(e) => setMaxCombo(e.target.value)} value={maxCombo} variant="standard" size="small" />
                    </Grid>
                    <Grid item xs={6} md={FILTER_FIELD_SIZE} lg={FILTER_FIELD_SIZE} sx={{ px: 1 }}>
                        <LocalizationProvider dateAdapter={AdapterMoment}>
                            <DesktopDatePicker minDate={MIN_DATE} maxDate={MAX_DATE} label="Min Ranked Date" inputFormat="MM/DD/YYYY" value={minApprovedDate} onChange={setMinApprovedDate} renderInput={(params) => <TextField variant="standard" size="small" {...params} />} />
                            <DesktopDatePicker minDate={MIN_DATE} maxDate={MAX_DATE} label="Max Ranked Date" inputFormat="MM/DD/YYYY" value={maxApprovedDate} onChange={setMaxApprovedDate} renderInput={(params) => <TextField variant="standard" size="small" {...params} />} />
                        </LocalizationProvider>
                    </Grid>
                    <Grid item xs={6} md={FILTER_FIELD_SIZE} lg={FILTER_FIELD_SIZE} sx={{ px: 1 }}>
                        <LocalizationProvider dateAdapter={AdapterMoment}>
                            <DesktopDatePicker minDate={MIN_DATE} maxDate={MAX_DATE} label="Min Played Date" inputFormat="MM/DD/YYYY" value={minPlayedDate} onChange={setMinPlayedDate} renderInput={(params) => <TextField variant="standard" size="small" {...params} />} />
                            <DesktopDatePicker minDate={MIN_DATE} maxDate={MAX_DATE} label="Max Played Date" inputFormat="MM/DD/YYYY" value={maxPlayedDate} onChange={setMaxPlayedDate} renderInput={(params) => <TextField variant="standard" size="small" {...params} />} />
                        </LocalizationProvider>
                    </Grid>
                </Grid>
                <Grid sx={{ alignContent: 'center', minWidth: '100%' }}>
                    <Button sx={{ my: 1 }} onClick={onApply} variant="contained">Apply</Button>
                    <Typography variant='subtitle2'>Enter -1 to ignore a filter</Typography>
                </Grid>
            </Grid>
        </>
    );
}
export default BeatmapFilter;