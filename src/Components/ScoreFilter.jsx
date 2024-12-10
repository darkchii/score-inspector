import { Box, Button, FormControl, FormControlLabel, Grid2, InputLabel, ListItemIcon, ListItemText, MenuItem, Radio, RadioGroup, Select, TextField } from "@mui/material";
import moment from "moment";
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { DesktopDatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { useState } from "react";
import { useEffect } from "react";
import { getModIcon, IMG_SVG_GRADE_A, IMG_SVG_GRADE_B, IMG_SVG_GRADE_C, IMG_SVG_GRADE_D, IMG_SVG_GRADE_S, IMG_SVG_GRADE_SH, IMG_SVG_GRADE_X, IMG_SVG_GRADE_XH } from "../Helpers/Assets";
import ImageToggle from "./ImageToggle";
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import Mods from "../Helpers/Mods";
import OsuTooltip from "./OsuTooltip";
import { produce } from "immer";

const FILTER_FIELD_SIZE = 12 / 3;
const MIN_DATE = moment('6 Oct 2007');
const MAX_DATE = moment();

const sorters = [
    {
        name: 'PP',
        sort: (a, b) => {
            let a_pp = a.pp > 0 ? a.pp : a.estimated_pp;
            let b_pp = b.pp > 0 ? b.pp : b.estimated_pp;
            return b_pp - a_pp;
        },
        internalName: 'pp'
    },
    {
        name: 'Score',
        sort: (a, b) => {
            return b.score - a.score;
        },
        internalName: 'score'
    },
    {
        name: 'Date Played',
        sort: (a, b) => {
            return moment(b.date_played).unix() - moment(a.date_played).unix();
        },
        internalName: 'date_played'
    },
    {
        name: 'Date Ranked',
        sort: (a, b) => {
            return moment(b.beatmap.approved_date).unix() - moment(a.beatmap.approved_date).unix();
        },
        internalName: 'approved_date'
    },
    {
        name: 'Accuracy',
        sort: (a, b) => {
            return b.accuracy - a.accuracy;
        },
        internalName: 'accuracy'
    },
    {
        name: 'Combo',
        sort: (a, b) => {
            return b.combo - a.combo;
        },
        internalName: 'combo'
    },
    {
        name: 'Stars',
        sort: (a, b) => {
            return b.beatmap.difficulty_data.star_rating - a.beatmap.difficulty_data.star_rating;
        },
        internalName: 'star_rating'
    },
    {
        name: 'PP if FC',
        sort: (a, b) => {
            let a_pp = !a.is_fc && a.recalc['fc']?.total > 0 ? a.recalc['fc']?.total : (a.pp > 0 ? a.pp : a.estimated_pp);
            let b_pp = !b.is_fc && b.recalc['fc']?.total > 0 ? b.recalc['fc']?.total : (b.pp > 0 ? b.pp : b.estimated_pp);
            return b_pp - a_pp;
        },
        internalName: 'pp_fc'
    }
]

const defaultFilterData = {
    enabledMods: [],
    enabledNomod: false,
    modsUsage: 'any',
    enabledGrades: ['XH', 'X', 'SH', 'S', 'A', 'B', 'C', 'D'],
    minScore: null,
    maxScore: null,
    minStars: null,
    maxStars: null,
    minPP: null,
    maxPP: null,
    minAcc: null,
    maxAcc: null,
    minCombo: null,
    maxCombo: null,
    minAR: null,
    maxAR: null,
    minOD: null,
    maxOD: null,
    minCS: null,
    maxCS: null,
    minHP: null,
    maxHP: null,
    minLength: null,
    maxLength: null,
    minRank: null,
    maxRank: null,
    approved: [1, 2],
    minApprovedDate: MIN_DATE,
    maxApprovedDate: MAX_DATE,
    minPlayedDate: MIN_DATE,
    maxPlayedDate: MAX_DATE,
    sorter: 'PP_desc',
    _sorter: sorters[0]
}

function ScoreFilter(props) {
    const [filterData, setFilterData] = useState(null);

    const setFilterValue = (key, value) => {
        setFilterData(produce((draft) => {
            draft[key] = value;

            if (key === 'sorter') {
                draft._sorter = sorters.find(sorter => sorter.name === value.split('_')[0]);
                draft._sorter.reverse = value.split('_')[1] === 'asc';
            }
        }));
    }

    const handleModStateChange = (event) => {
        setFilterData(produce((draft) => {
            draft.modsUsage = event.target.value;
            draft.enabledMods = [];
        }));
    };

    const toggleMod = (mod, checked) => {
        setFilterData(produce((draft) => {
            if (checked) {
                draft.enabledMods.push(mod);
            } else {
                draft.enabledMods.splice(draft.enabledMods.indexOf(mod), 1);
            }
        }));
    }

    const toggleGrade = (grade, checked) => {
        setFilterData(produce((draft) => {
            if (checked) {
                if (!draft.enabledGrades.includes(grade)) {
                    draft.enabledGrades.push(grade);
                }
            } else {
                if (draft.enabledGrades.includes(grade)) {
                    draft.enabledGrades.splice(draft.enabledGrades.indexOf(grade), 1);
                }
            }
        }));
    }

    useEffect(() => {
        let _filterData = null;
        if (props.filterData !== null) {
            _filterData = props.filterData;
            //check for missing keys
            Object.keys(defaultFilterData).forEach(key => {
                if (_filterData[key] === undefined) {
                    _filterData[key] = filterData[key];
                }
            });
        } else {
            _filterData = defaultFilterData;
        }
        setFilterData(_filterData);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const onApply = () => {
        let _filterData = { ...filterData };
        _filterData.order = filterData._sorter.internalName.toLowerCase();
        props.onApply(_filterData);
    }

    if (filterData === null) {
        return <></>;
    }

    return (
        <>
            <Box sx={{ m: 1 }}>
                <Grid2 container>
                    <Grid2 size={{ xs: 12, md: 8, lg: 8 }}>
                        {
                            Mods.getAllMods().mods_data.map(mod => (
                                <>
                                    <OsuTooltip title={Mods.getTooltipContent(mod, null, true)}>
                                        <Box display="inline">
                                            <ImageToggle
                                                // checkedDefault={mod === 'None' ? filterData.enabledNomod : (filterData.enabledMods & mods[mod]) === mods[mod]}
                                                checkedDefault={filterData.enabledMods.includes(mod.acronym)}
                                                onClick={(checked) => toggleMod(mod.acronym, checked)}
                                                sx={{ pr: 0.5 }}
                                                height="34px"
                                                src={getModIcon(mod.acronym)}
                                                alt={mod}

                                                //if any of the enabled mods is in the current mod.IncompatibleMods, disable the button (ignore if IncompatibleMods is contains its own acronym for some reason)
                                                disabled={filterData.modsUsage === 'all' ?
                                                    (filterData.enabledMods.some(enabledMod => mod.data.IncompatibleMods.includes(enabledMod) && enabledMod !== mod.acronym)
                                                        || mod.data.IncompatibleMods.some(incompatibleMod => filterData.enabledMods.includes(incompatibleMod) && incompatibleMod !== mod.acronym)
                                                    ) : false}
                                            />
                                        </Box>
                                    </OsuTooltip>
                                </>
                            ))
                        }
                        <FormControl sx={{ ml: 2 }}>
                            <RadioGroup onChange={handleModStateChange} value={filterData.modsUsage} row>
                                <FormControlLabel control={<Radio size='small' />} value='any' label='Any' />
                                <FormControlLabel control={<Radio size='small' />} value='all' label='Equals' />
                            </RadioGroup>
                        </FormControl>
                    </Grid2>
                    <Grid2 size={{ xs: 12, md: 4, lg: 4 }}>
                        <Grid2>
                            <Box display="inline">
                                <ImageToggle checkedDefault={filterData.enabledGrades.includes('XH')} onClick={(checked) => toggleGrade('XH', checked)} sx={{ pr: 0.5 }} height="26px" src={IMG_SVG_GRADE_XH} />
                            </Box>
                            <Box display="inline">
                                <ImageToggle checkedDefault={filterData.enabledGrades.includes('SH')} onClick={(checked) => toggleGrade('SH', checked)} sx={{ pr: 0.5 }} height="26px" src={IMG_SVG_GRADE_SH} />
                            </Box>
                            <Box display="inline">
                                <ImageToggle checkedDefault={filterData.enabledGrades.includes('X')} onClick={(checked) => toggleGrade('X', checked)} sx={{ pr: 0.5 }} height="26px" src={IMG_SVG_GRADE_X} />
                            </Box>
                            <Box display="inline">
                                <ImageToggle checkedDefault={filterData.enabledGrades.includes('S')} onClick={(checked) => toggleGrade('S', checked)} sx={{ pr: 0.5 }} height="26px" src={IMG_SVG_GRADE_S} />
                            </Box>
                            <Box display="inline">
                                <ImageToggle checkedDefault={filterData.enabledGrades.includes('A')} onClick={(checked) => toggleGrade('A', checked)} sx={{ pr: 0.5 }} height="26px" src={IMG_SVG_GRADE_A} />
                            </Box>
                            <Box display="inline">
                                <ImageToggle checkedDefault={filterData.enabledGrades.includes('B')} onClick={(checked) => toggleGrade('B', checked)} sx={{ pr: 0.5 }} height="26px" src={IMG_SVG_GRADE_B} />
                            </Box>
                            <Box display="inline">
                                <ImageToggle checkedDefault={filterData.enabledGrades.includes('C')} onClick={(checked) => toggleGrade('C', checked)} sx={{ pr: 0.5 }} height="26px" src={IMG_SVG_GRADE_C} />
                            </Box>
                            <Box display="inline">
                                <ImageToggle checkedDefault={filterData.enabledGrades.includes('D')} onClick={(checked) => toggleGrade('D', checked)} sx={{ pr: 0.5 }} height="26px" src={IMG_SVG_GRADE_D} />
                            </Box>
                        </Grid2>
                    </Grid2>
                </Grid2>
                <Grid2 container spacing={1}>
                    <Grid2 size={9}>
                        <div>
                            <Grid2 container spacing={1}>
                                {/* inline */}
                                <Grid2 size={{ xs: 6, md: FILTER_FIELD_SIZE, lg: FILTER_FIELD_SIZE }} sx={{ display: 'flex', }}>
                                    <TextField sx={{ width: '100%' }} label="Min Score" type='number' onChange={(e) => setFilterValue('minScore', e.target.value)} value={filterData.minScore} variant="standard" size="small" />
                                    <TextField sx={{ width: '100%' }} label="Max Score" type='number' onChange={(e) => setFilterValue('maxScore', e.target.value)} value={filterData.maxScore} variant="standard" size="small" />
                                </Grid2>
                                <Grid2 size={{ xs: 6, md: FILTER_FIELD_SIZE, lg: FILTER_FIELD_SIZE }} sx={{ display: 'flex', }}>
                                    <TextField sx={{ width: '100%' }} label="Min Stars" type='number' onChange={(e) => setFilterValue('minStars', e.target.value)} value={filterData.minStars} variant="standard" size="small" />
                                    <TextField sx={{ width: '100%' }} label="Max Stars" type='number' onChange={(e) => setFilterValue('maxStars', e.target.value)} value={filterData.maxStars} variant="standard" size="small" />
                                </Grid2>
                                <Grid2 size={{ xs: 6, md: FILTER_FIELD_SIZE, lg: FILTER_FIELD_SIZE }} sx={{ display: 'flex', }}>
                                    <TextField sx={{ width: '100%' }} label="Min PP" type='number' onChange={(e) => setFilterValue('minPP', e.target.value)} value={filterData.minPP} variant="standard" size="small" />
                                    <TextField sx={{ width: '100%' }} label="Max PP" type='number' onChange={(e) => setFilterValue('maxPP', e.target.value)} value={filterData.maxPP} variant="standard" size="small" />
                                </Grid2>
                                <Grid2 size={{ xs: 6, md: FILTER_FIELD_SIZE, lg: FILTER_FIELD_SIZE }} sx={{ display: 'flex', }}>
                                    <TextField sx={{ width: '100%' }} label="Min Acc" type='number' onChange={(e) => setFilterValue('minAcc', e.target.value)} value={filterData.minAcc} variant="standard" size="small" />
                                    <TextField sx={{ width: '100%' }} label="Max Acc" type='number' onChange={(e) => setFilterValue('maxAcc', e.target.value)} value={filterData.maxAcc} variant="standard" size="small" />
                                </Grid2>
                                <Grid2 size={{ xs: 6, md: FILTER_FIELD_SIZE, lg: FILTER_FIELD_SIZE }} sx={{ display: 'flex', }}>
                                    <TextField sx={{ width: '100%' }} label="Min Combo" type='number' onChange={(e) => setFilterValue('minCombo', e.target.value)} value={filterData.minCombo} variant="standard" size="small" />
                                    <TextField sx={{ width: '100%' }} label="Max Combo" type='number' onChange={(e) => setFilterValue('maxCombo', e.target.value)} value={filterData.maxCombo} variant="standard" size="small" />
                                </Grid2>
                                <Grid2 size={{ xs: 6, md: FILTER_FIELD_SIZE, lg: FILTER_FIELD_SIZE }} sx={{ display: 'flex', }}>
                                    <TextField sx={{ width: '100%' }} label="Min AR" type='number' onChange={(e) => setFilterValue('minAR', e.target.value)} value={filterData.minAR} variant="standard" size="small" />
                                    <TextField sx={{ width: '100%' }} label="Max AR" type='number' onChange={(e) => setFilterValue('maxAR', e.target.value)} value={filterData.maxAR} variant="standard" size="small" />
                                </Grid2>
                                <Grid2 size={{ xs: 6, md: FILTER_FIELD_SIZE, lg: FILTER_FIELD_SIZE }} sx={{ display: 'flex', }}>
                                    <TextField sx={{ width: '100%' }} label="Min CS" type='number' onChange={(e) => setFilterValue('minCS', e.target.value)} value={filterData.minCS} variant="standard" size="small" />
                                    <TextField sx={{ width: '100%' }} label="Max CS" type='number' onChange={(e) => setFilterValue('maxCS', e.target.value)} value={filterData.maxCS} variant="standard" size="small" />
                                </Grid2>
                                <Grid2 size={{ xs: 6, md: FILTER_FIELD_SIZE, lg: FILTER_FIELD_SIZE }} sx={{ display: 'flex', }}>
                                    <TextField sx={{ width: '100%' }} label="Min OD" type='number' onChange={(e) => setFilterValue('minOD', e.target.value)} value={filterData.minOD} variant="standard" size="small" />
                                    <TextField sx={{ width: '100%' }} label="Max OD" type='number' onChange={(e) => setFilterValue('maxOD', e.target.value)} value={filterData.maxOD} variant="standard" size="small" />
                                </Grid2>
                                <Grid2 size={{ xs: 6, md: FILTER_FIELD_SIZE, lg: FILTER_FIELD_SIZE }} sx={{ display: 'flex', }}>
                                    <TextField sx={{ width: '100%' }} label="Min HP" type='number' onChange={(e) => setFilterValue('minHP', e.target.value)} value={filterData.minHP} variant="standard" size="small" />
                                    <TextField sx={{ width: '100%' }} label="Max HP" type='number' onChange={(e) => setFilterValue('maxHP', e.target.value)} value={filterData.maxHP} variant="standard" size="small" />
                                </Grid2>
                                <Grid2 size={{ xs: 6, md: FILTER_FIELD_SIZE, lg: FILTER_FIELD_SIZE }} sx={{ display: 'flex', }}>
                                    <TextField sx={{ width: '100%' }} label="Min Length" type='number' onChange={(e) => setFilterValue('minLength', e.target.value)} value={filterData.minLength} variant="standard" size="small" />
                                    <TextField sx={{ width: '100%' }} label="Max Length" type='number' onChange={(e) => setFilterValue('maxLength', e.target.value)} value={filterData.maxLength} variant="standard" size="small" />
                                </Grid2>
                                {
                                    props.extended ? <>
                                        <Grid2 size={{ xs: 6, md: FILTER_FIELD_SIZE, lg: FILTER_FIELD_SIZE }} sx={{ display: 'flex', }}>
                                            <TextField sx={{ width: '100%' }} label="Min User Rank" type='number' onChange={(e) => setFilterValue('minRank', e.target.value)} value={filterData.minRank} variant="standard" size="small" />
                                            <TextField sx={{ width: '100%' }} label="Max User Rank" type='number' onChange={(e) => setFilterValue('maxRank', e.target.value)} value={filterData.maxRank} variant="standard" size="small" />
                                        </Grid2>
                                    </> : <></>
                                }
                            </Grid2>
                        </div>
                    </Grid2>
                    <Grid2 size={3}>
                        <div>
                            <Grid2 container spacing={1}>
                                <Grid2 size={12}>
                                    <LocalizationProvider dateAdapter={AdapterMoment}>
                                        <DesktopDatePicker minDate={MIN_DATE} maxDate={MAX_DATE} label="Min Ranked Date" inputFormat="MM/DD/YYYY" value={filterData.minApprovedDate} onChange={(e) => setFilterValue('minApprovedDate', e)} renderInput={(params) => <TextField variant="standard" size="small" {...params} />} />
                                        <DesktopDatePicker minDate={MIN_DATE} maxDate={MAX_DATE} label="Max Ranked Date" inputFormat="MM/DD/YYYY" value={filterData.maxApprovedDate} onChange={(e) => setFilterValue('maxApprovedDate', e)} renderInput={(params) => <TextField variant="standard" size="small" {...params} />} />
                                    </LocalizationProvider>
                                </Grid2>
                                <Grid2 size={12}>
                                    <LocalizationProvider dateAdapter={AdapterMoment}>
                                        <DesktopDatePicker minDate={MIN_DATE} maxDate={MAX_DATE} label="Min Played Date" inputFormat="MM/DD/YYYY" value={filterData.minPlayedDate} onChange={(e) => setFilterValue('minPlayedDate', e)} renderInput={(params) => <TextField variant="standard" size="small" {...params} />} />
                                        <DesktopDatePicker minDate={MIN_DATE} maxDate={MAX_DATE} label="Max Played Date" inputFormat="MM/DD/YYYY" value={filterData.maxPlayedDate} onChange={(e) => setFilterValue('maxPlayedDate', e)} renderInput={(params) => <TextField variant="standard" size="small" {...params} />} />
                                    </LocalizationProvider>
                                </Grid2>
                            </Grid2>
                        </div>
                    </Grid2>
                </Grid2>
                <Grid2 container sx={{ pt: 2, '& > *': { pl: 1 } }}>
                    <Grid2 size={{ xs: 6, md: FILTER_FIELD_SIZE, lg: FILTER_FIELD_SIZE }}>
                        <FormControl variant="standard" sx={{ width: '100%' }} size='small'>
                            <InputLabel id="sort-select-label">Sort</InputLabel>
                            <Select
                                labelId="sort-select-label"
                                id="sort-select"
                                value={filterData.sorter}
                                onChange={(e) => setFilterValue('sorter', e.target.value)}
                                label="Sort"
                                SelectDisplayProps={{
                                    style: { display: 'flex', alignItems: 'center' },
                                }}
                            >
                                {
                                    sorters.map((sorter, index) => {
                                        return [
                                            <MenuItem key={index * 2} value={`${sorter.name}_desc`}>
                                                <ListItemIcon>
                                                    <ArrowDownwardIcon fontSize="small" />
                                                </ListItemIcon >
                                                <ListItemText primary={sorter.name} />
                                            </MenuItem>,
                                            <MenuItem key={(index * 2) + 1} value={`${sorter.name}_asc`}>
                                                <ListItemIcon>
                                                    <ArrowUpwardIcon fontSize="small" />
                                                </ListItemIcon>
                                                <ListItemText primary={sorter.name} />
                                            </MenuItem>
                                        ]
                                    })
                                }
                            </Select>
                        </FormControl>
                    </Grid2>
                    <Grid2 size={{ xs: 6, md: FILTER_FIELD_SIZE, lg: FILTER_FIELD_SIZE }}>
                        <FormControl variant="standard" sx={{ width: '100%' }} size='small'>
                            <InputLabel id="sort-select-label">Approved</InputLabel>
                            <Select
                                labelId="sort-select-label"
                                id="sort-select"
                                value={filterData.approved}
                                onChange={(e) => setFilterValue('approved', e.target.value)}
                                label="Approved"
                                multiple
                            >
                                <MenuItem value={1}>Ranked</MenuItem>
                                <MenuItem value={2}>Approved</MenuItem>
                                <MenuItem value={4}>Loved</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid2>
                </Grid2>
                <Grid2 sx={{ alignContent: 'center' }}>
                    <Button sx={{ my: 1 }} onClick={onApply} variant="contained">Apply</Button>
                </Grid2>
            </Box>
        </>
    );
}
export default ScoreFilter;