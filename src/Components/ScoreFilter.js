import { Box, Button, FormControl, FormControlLabel, Grid, InputLabel, ListItemIcon, ListItemText, MenuItem, Radio, RadioGroup, Select, TextField, Tooltip } from "@mui/material";
import moment from "moment";
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { DesktopDatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { useState } from "react";
import { mods, mod_strings_long } from "../Helpers/Osu";
import { useEffect } from "react";
import { getFlagIcon, getModIcon, getPossibleMods, IMG_SVG_GRADE_A, IMG_SVG_GRADE_B, IMG_SVG_GRADE_C, IMG_SVG_GRADE_D, IMG_SVG_GRADE_S, IMG_SVG_GRADE_SH, IMG_SVG_GRADE_X, IMG_SVG_GRADE_XH } from "../Helpers/Assets";
import ImageToggle from "./ImageToggle";
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import { countries } from 'countries-list';

const FILTER_FIELD_SIZE = 12 / 5;
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
            return b.beatmap.modded_sr.star_rating - a.beatmap.modded_sr.star_rating;
        },
        internalName: 'star_rating'
    }
]

const defaultFilterData = {
    enabledMods: 0,
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
    country: ['world'],
    sorter: 'PP_desc',
    _sorter: sorters[0],
    query: ''
}

function ScoreFilter(props) {
    //-1 in range values are simply ignored and no limit is set
    //null is ignored too
    const [filterData, setFilterData] = useState(null);
    const [countryList, setCountryList] = useState([]);


    const setFilterValue = (key, value) => {
        var newFilterData = { ...filterData };
        newFilterData[key] = value;

        if (key === 'sorter') {
            newFilterData._sorter = sorters.find(sorter => sorter.name === value.split('_')[0]);
            newFilterData._sorter.reverse = value.split('_')[1] === 'asc';
        }
        setFilterData(newFilterData);
    }

    const handleModStateChange = (event) => {
        // setModsState(event.target.value);
        setFilterValue('modsUsage', event.target.value);
    };

    const toggleMod = (mod, checked) => {
        if (mod === 'None') {
            setFilterValue('enabledNomod', checked);
        } else {
            var updatedMods = filterData.enabledMods;
            if (checked) {
                updatedMods += mods[mod];
            } else {
                updatedMods -= mods[mod];
            }
            setFilterValue('enabledMods', updatedMods);
        }
    }

    const toggleGrade = (grade, checked) => {
        // const updatedMods = enabledMods + mods[mod] * (checked ? 1 : -1);
        // setEnabledMods(updatedMods);
        var updatedGrades = filterData.enabledGrades;
        if (checked) {
            if (!updatedGrades.includes(grade)) {
                updatedGrades.push(grade);
            }
        } else {
            if (updatedGrades.includes(grade)) {
                updatedGrades.splice(updatedGrades.indexOf(grade), 1);
            }
        }
        setFilterValue('enabledGrades', updatedGrades);
    }

    const generateQuery = () => {
        let query = '';

        if (filterData.enabledMods !== 0) {
            if (filterData.modsUsage === 'any') {

            } else {
                query += `-m ${filterData.enabledMods} `;
            }
        }

        if (filterData.enabledGrades.length < 8) {
            query += `-letter `;
            query += filterData.enabledGrades.join(',');
            query += ' ';
        }

        if (filterData.minScore !== null && filterData.minScore !== '' && filterData.minScore >= 0) { query += `-score-min ${filterData.minScore} `; }
        if (filterData.maxScore !== null && filterData.maxScore !== '' && filterData.maxScore >= 0) { query += `-score-max ${filterData.maxScore} `; }

        if (filterData.minStars !== null && filterData.minStars !== '' && filterData.minStars >= 0) { query += `-min ${filterData.minStars} `; }
        if (filterData.maxStars !== null && filterData.maxStars !== '' && filterData.maxStars >= 0) { query += `-max ${filterData.maxStars} `; }

        if (filterData.minPP !== null && filterData.minPP !== '' && filterData.minPP >= 0) { query += `-pp-min ${filterData.minPP} `; }
        if (filterData.maxPP !== null && filterData.maxPP !== '' && filterData.maxPP >= 0) { query += `-pp-max ${filterData.maxPP} `; }

        if (filterData.minAcc !== null && filterData.minAcc !== '' && filterData.minAcc >= 0) { query += `-acc-min ${filterData.minAcc} `; }
        if (filterData.maxAcc !== null && filterData.maxAcc !== '' && filterData.maxAcc >= 0) { query += `-acc-max ${filterData.maxAcc} `; }

        if (filterData.minCombo !== null && filterData.minCombo !== '' && filterData.minCombo >= 0) { query += `-combo-min ${filterData.minCombo} `; }
        if (filterData.maxCombo !== null && filterData.maxCombo !== '' && filterData.maxCombo >= 0) { query += `-combo-max ${filterData.maxCombo} `; }

        if (filterData.minAR !== null && filterData.minAR !== '' && filterData.minAR >= 0) { query += `-ar-min ${filterData.minAR} `; }
        if (filterData.maxAR !== null && filterData.maxAR !== '' && filterData.maxAR >= 0) { query += `-ar-max ${filterData.maxAR} `; }

        if (filterData.minOD !== null && filterData.minOD !== '' && filterData.minOD >= 0) { query += `-od-min ${filterData.minOD} `; }
        if (filterData.maxOD !== null && filterData.maxOD !== '' && filterData.maxOD >= 0) { query += `-od-max ${filterData.maxOD} `; }

        if (filterData.minCS !== null && filterData.minCS !== '' && filterData.minCS >= 0) { query += `-cs-min ${filterData.minCS} `; }
        if (filterData.maxCS !== null && filterData.maxCS !== '' && filterData.maxCS >= 0) { query += `-cs-max ${filterData.maxCS} `; }

        if (filterData.minHP !== null && filterData.minHP !== '' && filterData.minHP >= 0) { query += `-hp-min ${filterData.minHP} `; }
        if (filterData.maxHP !== null && filterData.maxHP !== '' && filterData.maxHP >= 0) { query += `-hp-max ${filterData.maxHP} `; }

        if (filterData.minLength !== null && filterData.minLength !== '' && filterData.minLength >= 0) { query += `-length-min ${filterData.minLength} `; }
        if (filterData.maxLength !== null && filterData.maxLength !== '' && filterData.maxLength >= 0) { query += `-length-max ${filterData.maxLength} `; }

        query += `-start ${moment(filterData.minApprovedDate).format('YYYY-MM-DD')} `;
        query += `-end ${moment(filterData.maxApprovedDate).format('YYYY-MM-DD')} `;

        query += `-played-start ${moment(filterData.minPlayedDate).format('YYYY-MM-DD')} `;
        query += `-played-end ${moment(filterData.maxPlayedDate).format('YYYY-MM-DD')} `;

        query += `-order ${filterData._sorter.internalName.toLowerCase()} -dir ${filterData._sorter.reverse ? 'asc' : 'desc'} `;

        query += '-modded true';
        return query;
    }

    useEffect(() => {
        const _c = [];
        for (const key in countries) {
            _c.push({ code: key.toLowerCase(), name: countries[key].name });
        }
        setCountryList([{ code: 'world', name: 'Worldwide' }, ..._c]);

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
        _filterData.query = generateQuery();
        props.onApply(_filterData);
    }

    if (filterData === null) {
        return <></>;
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
                                            <ImageToggle
                                                checkedDefault={mod === 'None' ? filterData.enabledNomod : (filterData.enabledMods & mods[mod]) === mods[mod]}
                                                onClick={(checked) => toggleMod(mod, checked)}
                                                sx={{ pr: 0.5 }}
                                                height="34px"
                                                src={getModIcon(mod)}
                                                alt={mod} />
                                        </Box>
                                    </Tooltip>
                                </>
                            ))
                        }
                        <FormControl sx={{ ml: 2 }}>
                            <RadioGroup onChange={handleModStateChange} value={filterData.modsUsage} row>
                                <FormControlLabel control={<Radio size='small' />} value='any' label='Any' />
                                <FormControlLabel control={<Radio size='small' />} value='all' label='All' />
                            </RadioGroup>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} md={4} lg={4}>
                        <Grid container>
                            <Tooltip title='Silver SS' arrow>
                                <Box display="inline">
                                    <ImageToggle checkedDefault={filterData.enabledGrades.includes('XH')} onClick={(checked) => toggleGrade('XH', checked)} sx={{ pr: 0.5 }} height="26px" src={IMG_SVG_GRADE_XH} />
                                </Box>
                            </Tooltip>
                            <Tooltip title='Silver S' arrow>
                                <Box display="inline">
                                    <ImageToggle checkedDefault={filterData.enabledGrades.includes('SH')} onClick={(checked) => toggleGrade('SH', checked)} sx={{ pr: 0.5 }} height="26px" src={IMG_SVG_GRADE_SH} />
                                </Box>
                            </Tooltip>
                            <Tooltip title='Gold SS' arrow>
                                <Box display="inline">
                                    <ImageToggle checkedDefault={filterData.enabledGrades.includes('X')} onClick={(checked) => toggleGrade('X', checked)} sx={{ pr: 0.5 }} height="26px" src={IMG_SVG_GRADE_X} />
                                </Box>
                            </Tooltip>
                            <Tooltip title='Gold S' arrow>
                                <Box display="inline">
                                    <ImageToggle checkedDefault={filterData.enabledGrades.includes('S')} onClick={(checked) => toggleGrade('S', checked)} sx={{ pr: 0.5 }} height="26px" src={IMG_SVG_GRADE_S} />
                                </Box>
                            </Tooltip>
                            <Tooltip title='A' arrow>
                                <Box display="inline">
                                    <ImageToggle checkedDefault={filterData.enabledGrades.includes('A')} onClick={(checked) => toggleGrade('A', checked)} sx={{ pr: 0.5 }} height="26px" src={IMG_SVG_GRADE_A} />
                                </Box>
                            </Tooltip>
                            <Tooltip title='B' arrow>
                                <Box display="inline">
                                    <ImageToggle checkedDefault={filterData.enabledGrades.includes('B')} onClick={(checked) => toggleGrade('B', checked)} sx={{ pr: 0.5 }} height="26px" src={IMG_SVG_GRADE_B} />
                                </Box>
                            </Tooltip>
                            <Tooltip title='C' arrow>
                                <Box display="inline">
                                    <ImageToggle checkedDefault={filterData.enabledGrades.includes('C')} onClick={(checked) => toggleGrade('C', checked)} sx={{ pr: 0.5 }} height="26px" src={IMG_SVG_GRADE_C} />
                                </Box>
                            </Tooltip>
                            <Tooltip title='D' arrow>
                                <Box display="inline">
                                    <ImageToggle checkedDefault={filterData.enabledGrades.includes('D')} onClick={(checked) => toggleGrade('D', checked)} sx={{ pr: 0.5 }} height="26px" src={IMG_SVG_GRADE_D} />
                                </Box>
                            </Tooltip>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid container>
                    <Grid item xs={12} md={8} lg={8} sx={{ pr: 1 }}>
                        <Grid container sx={{ pt: 2, '& > *': { pl: 1 } }}>
                            {/* inline */}
                            <Grid item xs={6} md={FILTER_FIELD_SIZE} lg={FILTER_FIELD_SIZE} sx={{ display: 'flex', }}>
                                <TextField sx={{ width: '100%' }} label="Min Score" type='number' onChange={(e) => setFilterValue('minScore', e.target.value)} value={filterData.minScore} variant="standard" size="small" />
                                <TextField sx={{ width: '100%' }} label="Max Score" type='number' onChange={(e) => setFilterValue('maxScore', e.target.value)} value={filterData.maxScore} variant="standard" size="small" />
                            </Grid>
                            <Grid item xs={6} md={FILTER_FIELD_SIZE} lg={FILTER_FIELD_SIZE} sx={{ display: 'flex', }}>
                                <TextField sx={{ width: '100%' }} label="Min Stars" type='number' onChange={(e) => setFilterValue('minStars', e.target.value)} value={filterData.minStars} variant="standard" size="small" />
                                <TextField sx={{ width: '100%' }} label="Max Stars" type='number' onChange={(e) => setFilterValue('maxStars', e.target.value)} value={filterData.maxStars} variant="standard" size="small" />
                            </Grid>
                            <Grid item xs={6} md={FILTER_FIELD_SIZE} lg={FILTER_FIELD_SIZE} sx={{ display: 'flex', }}>
                                <TextField sx={{ width: '100%' }} label="Min PP" type='number' onChange={(e) => setFilterValue('minPP', e.target.value)} value={filterData.minPP} variant="standard" size="small" />
                                <TextField sx={{ width: '100%' }} label="Max PP" type='number' onChange={(e) => setFilterValue('maxPP', e.target.value)} value={filterData.maxPP} variant="standard" size="small" />
                            </Grid>
                            <Grid item xs={6} md={FILTER_FIELD_SIZE} lg={FILTER_FIELD_SIZE} sx={{ display: 'flex', }}>
                                <TextField sx={{ width: '100%' }} label="Min Acc" type='number' onChange={(e) => setFilterValue('minAcc', e.target.value)} value={filterData.minAcc} variant="standard" size="small" />
                                <TextField sx={{ width: '100%' }} label="Max Acc" type='number' onChange={(e) => setFilterValue('maxAcc', e.target.value)} value={filterData.maxAcc} variant="standard" size="small" />
                            </Grid>
                            <Grid item xs={6} md={FILTER_FIELD_SIZE} lg={FILTER_FIELD_SIZE} sx={{ display: 'flex', }}>
                                <TextField sx={{ width: '100%' }} label="Min Combo" type='number' onChange={(e) => setFilterValue('minCombo', e.target.value)} value={filterData.minCombo} variant="standard" size="small" />
                                <TextField sx={{ width: '100%' }} label="Max Combo" type='number' onChange={(e) => setFilterValue('maxCombo', e.target.value)} value={filterData.maxCombo} variant="standard" size="small" />
                            </Grid>
                            <Grid item xs={6} md={FILTER_FIELD_SIZE} lg={FILTER_FIELD_SIZE} sx={{ display: 'flex', }}>
                                <TextField sx={{ width: '100%' }} label="Min AR" type='number' onChange={(e) => setFilterValue('minAR', e.target.value)} value={filterData.minAR} variant="standard" size="small" />
                                <TextField sx={{ width: '100%' }} label="Max AR" type='number' onChange={(e) => setFilterValue('maxAR', e.target.value)} value={filterData.maxAR} variant="standard" size="small" />
                            </Grid>
                            <Grid item xs={6} md={FILTER_FIELD_SIZE} lg={FILTER_FIELD_SIZE} sx={{ display: 'flex', }}>
                                <TextField sx={{ width: '100%' }} label="Min CS" type='number' onChange={(e) => setFilterValue('minCS', e.target.value)} value={filterData.minCS} variant="standard" size="small" />
                                <TextField sx={{ width: '100%' }} label="Max CS" type='number' onChange={(e) => setFilterValue('maxCS', e.target.value)} value={filterData.maxCS} variant="standard" size="small" />
                            </Grid>
                            <Grid item xs={6} md={FILTER_FIELD_SIZE} lg={FILTER_FIELD_SIZE} sx={{ display: 'flex', }}>
                                <TextField sx={{ width: '100%' }} label="Min OD" type='number' onChange={(e) => setFilterValue('minOD', e.target.value)} value={filterData.minOD} variant="standard" size="small" />
                                <TextField sx={{ width: '100%' }} label="Max OD" type='number' onChange={(e) => setFilterValue('maxOD', e.target.value)} value={filterData.maxOD} variant="standard" size="small" />
                            </Grid>
                            <Grid item xs={6} md={FILTER_FIELD_SIZE} lg={FILTER_FIELD_SIZE} sx={{ display: 'flex', }}>
                                <TextField sx={{ width: '100%' }} label="Min HP" type='number' onChange={(e) => setFilterValue('minHP', e.target.value)} value={filterData.minHP} variant="standard" size="small" />
                                <TextField sx={{ width: '100%' }} label="Max HP" type='number' onChange={(e) => setFilterValue('maxHP', e.target.value)} value={filterData.maxHP} variant="standard" size="small" />
                            </Grid>
                            <Grid item xs={6} md={FILTER_FIELD_SIZE} lg={FILTER_FIELD_SIZE} sx={{ display: 'flex', }}>
                                <TextField sx={{ width: '100%' }} label="Min Length" type='number' onChange={(e) => setFilterValue('minLength', e.target.value)} value={filterData.minLength} variant="standard" size="small" />
                                <TextField sx={{ width: '100%' }} label="Max Length" type='number' onChange={(e) => setFilterValue('maxLength', e.target.value)} value={filterData.maxLength} variant="standard" size="small" />
                            </Grid>
                            {
                                props.extended ? <>
                                    <Grid item xs={6} md={FILTER_FIELD_SIZE} lg={FILTER_FIELD_SIZE} sx={{ display: 'flex', }}>
                                        <TextField sx={{ width: '100%' }} label="Min User Rank" type='number' onChange={(e) => setFilterValue('minRank', e.target.value)} value={filterData.minRank} variant="standard" size="small" />
                                        <TextField sx={{ width: '100%' }} label="Max User Rank" type='number' onChange={(e) => setFilterValue('maxRank', e.target.value)} value={filterData.maxRank} variant="standard" size="small" />
                                    </Grid>
                                </> : <></>
                            }
                        </Grid>
                    </Grid>
                    <Grid item xs={12} md={4} lg={4}>
                        <Grid container>
                            <Grid item xs={12}>
                                <LocalizationProvider dateAdapter={AdapterMoment}>
                                    <DesktopDatePicker minDate={MIN_DATE} maxDate={MAX_DATE} label="Min Ranked Date" inputFormat="MM/DD/YYYY" value={filterData.minApprovedDate} onChange={(e) => setFilterValue('minApprovedDate', e)} renderInput={(params) => <TextField variant="standard" size="small" {...params} />} />
                                    <DesktopDatePicker minDate={MIN_DATE} maxDate={MAX_DATE} label="Max Ranked Date" inputFormat="MM/DD/YYYY" value={filterData.maxApprovedDate} onChange={(e) => setFilterValue('maxApprovedDate', e)} renderInput={(params) => <TextField variant="standard" size="small" {...params} />} />
                                </LocalizationProvider>
                            </Grid>
                            <Grid item xs={12}>
                                <LocalizationProvider dateAdapter={AdapterMoment}>
                                    <DesktopDatePicker minDate={MIN_DATE} maxDate={MAX_DATE} label="Min Played Date" inputFormat="MM/DD/YYYY" value={filterData.minPlayedDate} onChange={(e) => setFilterValue('minPlayedDate', e)} renderInput={(params) => <TextField variant="standard" size="small" {...params} />} />
                                    <DesktopDatePicker minDate={MIN_DATE} maxDate={MAX_DATE} label="Max Played Date" inputFormat="MM/DD/YYYY" value={filterData.maxPlayedDate} onChange={(e) => setFilterValue('maxPlayedDate', e)} renderInput={(params) => <TextField variant="standard" size="small" {...params} />} />
                                </LocalizationProvider>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid container sx={{ pt: 2, '& > *': { pl: 1 } }}>
                    <Grid item xs={6} md={FILTER_FIELD_SIZE} lg={FILTER_FIELD_SIZE}>
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
                                    sorters.map(sorter => {
                                        return [
                                            <MenuItem value={`${sorter.name}_desc`}>
                                                <ListItemIcon>
                                                    <ArrowDownwardIcon fontSize="small" />
                                                </ListItemIcon >
                                                <ListItemText primary={sorter.name} />
                                            </MenuItem>,
                                            <MenuItem value={`${sorter.name}_asc`}>
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
                    </Grid>
                    <Grid item xs={6} md={FILTER_FIELD_SIZE} lg={FILTER_FIELD_SIZE}>
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
                    </Grid>
                    <Grid item xs={6} md={FILTER_FIELD_SIZE} lg={FILTER_FIELD_SIZE}>
                        {
                            countryList.length > 0 ?
                                <FormControl variant="standard" sx={{ width: '100%' }} size='small'>
                                    <InputLabel size='small' id={`country_dropdown_label`}>Country</InputLabel>
                                    <Select
                                        size='small'
                                        value={filterData.country}
                                        // onChange={e => setCountry(e.target.value)}
                                        onChange={e => setFilterValue('country', e.target.value)}
                                        labelId={`country_dropdown_label`}
                                        label='Country'
                                        multiple
                                    >
                                        {
                                            countryList.map((value) => {
                                                return (
                                                    <MenuItem key={value.code} value={value.code}>
                                                        {
                                                            value.code !== 'world' ?
                                                                <img src={getFlagIcon(value.code)} alt={value.code} style={{ height: '1em', borderRadius: '5px', marginRight: '0.4em' }} />
                                                                : <></>
                                                        }
                                                        &nbsp;{value.name}
                                                    </MenuItem>
                                                )
                                            })
                                        }
                                    </Select>
                                </FormControl>
                                : <></>
                        }
                    </Grid>
                </Grid>
                <Grid sx={{ alignContent: 'center' }}>
                    <Button sx={{ my: 1 }} onClick={onApply} variant="contained">Apply</Button>
                </Grid>
            </Grid>
        </>
    );
}
export default ScoreFilter;