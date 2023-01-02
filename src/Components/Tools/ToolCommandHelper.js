import { Alert, Box, Button, Checkbox, FormControl, FormControlLabel, Grid, InputLabel, MenuItem, Paper, Select, Stack, TextField, Tooltip, Typography } from "@mui/material";
import { DesktopDatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { useEffect, useState } from "react";
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import moment from "moment";
import TriCheckbox from "../UI/TriCheckbox";

const COMMANDS = [
    {
        cmd: 'clears',
        desc: 'The default query command, returns the top leaderboard of users ordered by clears.',
        exportCmd: '!q'
    },
    {
        cmd: 'completion',
        desc: '% of completion of plays',
        exportCmd: '!q -o %'
    },
    {
        cmd: 'score',
        desc: 'Total score summed up of all plays',
        exportCmd: '!q -o scoer'
    },
    {
        cmd: 'total pp',
        desc: 'Get a leaderboard of total PP',
        exportCmd: '!totalpp'
    },
    {
        cmd: 'top pp',
        desc: 'Get a leaderboard of highest pp plays by users',
        exportCmd: '!toppp'
    },
    {
        cmd: 'fc pp',
        desc: 'Total PP but only FC scores',
        exportCmd: '!fcpp'
    },
    {
        cmd: 'length',
        desc: 'Total length summed up of all plays',
        exportCmd: '!q -o length'
    }
];

const ARGUMENTS = [
    {
        name: 'User',
        desc: 'User to show in the leaderboard even outside of range. This can be a user ID or a username.',
        arg: '-u',
        compatibleWith: ['clears', 'total pp', 'top pp', 'fc pp'],
        type: 'string',
        default: undefined,
    },
    {
        name: 'Artist',
        desc: 'Filter the plays by beatmap song artist',
        arg: '-artist',
        compatibleWith: ['clears', 'total pp', 'top pp', 'fc pp'],
        type: 'string',
        default: undefined,
    },
    {
        name: 'Title',
        desc: 'Filter the plays by beatmap song title',
        arg: '-title',
        compatibleWith: ['clears', 'total pp', 'top pp', 'fc pp'],
        type: 'string',
        default: undefined,
    },
    {
        name: 'Tags',
        desc: 'Filter the plays by beatmap tags',
        arg: '-tags',
        compatibleWith: ['clears', 'total pp', 'top pp', 'fc pp'],
        type: 'string',
        seperated_string: true,
        default: undefined,
    },
    {
        name: 'Mods',
        desc: 'Mods to filter the leaderboard by. Use the mod abbreviation (e.g. HDHR).',
        arg: '-m',
        compatibleWith: ['clears', 'total pp', 'top pp', 'fc pp'],
        type: 'dropdown',
        seperator: '',
        values: ['NM', 'NF', 'EZ', 'TD', 'HD', 'HR', 'SD', 'DT', 'HT', 'NC', 'FL', 'SO', 'PF'],
        default: undefined,
    },
    {
        name: 'Grades',
        desc: 'Filter the plays by grades',
        arg: '-letters',
        compatibleWith: ['clears', 'total pp', 'top pp', 'fc pp'],
        type: 'dropdown',
        seperator: ',',
        values: ['XH', 'X', 'SH', 'S', 'A', 'B', 'C', 'D'],
        default: undefined,
    },
    {
        name: 'Loved',
        desc: 'Whether to include loved maps in the leaderboard.',
        arg: '-loved',
        width: 2,
        compatibleWith: ['clears', 'total pp', 'top pp'],
        type: 'triboolean',
        default: null,
    },
    {
        name: 'Is SS',
        desc: 'Include or exclude any of these flags',
        arg: '-is_ss',
        width: 2,
        compatibleWith: ['clears', 'total pp', 'top pp'],
        type: 'triboolean',
        default: null,
    },
    {
        name: 'Is FC',
        desc: 'Include or exclude any of these flags',
        arg: '-is_fc',
        width: 2,
        compatibleWith: ['clears', 'total pp', 'top pp'],
        type: 'triboolean',
        default: null,
    },
    {
        name: 'Played After',
        desc: 'Only include plays after this date.',
        arg: '-played-start',
        compatibleWith: ['clears', 'total pp', 'top pp'],
        type: 'datepicker',
        default: null,
    },
    {
        name: 'Played Before',
        desc: 'Only include plays before this date.',
        arg: '-played-end',
        compatibleWith: ['clears', 'total pp', 'top pp'],
        type: 'datepicker',
        default: null,
    },
    {
        name: 'Ranked After',
        desc: 'Only include plays on maps ranked after set date.',
        arg: '-start',
        compatibleWith: ['clears', 'total pp', 'top pp'],
        type: 'datepicker',
        default: null,
    },
    {
        name: 'Ranked Before',
        desc: 'Only include plays on maps ranked before set date.',
        arg: '-end',
        compatibleWith: ['clears', 'total pp', 'top pp'],
        type: 'datepicker',
        default: null,
    },
    {
        name: 'Min PP',
        desc: 'Only include plays with PP greater than or equal to this value.',
        arg: '-pp-min',
        compatibleWith: ['clears', 'total pp', 'top pp'],
        type: 'string',
        numeric: true,
        default: null,
        width: 1.5,
    },
    {
        name: 'Max PP',
        desc: 'Only include plays with PP less than this value.',
        arg: '-pp-max',
        compatibleWith: ['clears', 'total pp', 'top pp'],
        type: 'string',
        numeric: true,
        default: null,
        width: 1.5,
    },
    {
        name: 'Min Length',
        desc: 'Only include plays with a length more than this value. (in seconds)',
        arg: '-length-min',
        compatibleWith: ['clears', 'total pp', 'top pp'],
        type: 'string',
        numeric: true,
        default: null,
        width: 1.5,
    },
    {
        name: 'Max Length',
        desc: 'Only include plays with a length less than this value. (in seconds)',
        arg: '-length-max',
        compatibleWith: ['clears', 'total pp', 'top pp'],
        type: 'string',
        numeric: true,
        default: null,
        width: 1.5,
    },
    {
        name: 'Min Combo',
        desc: 'Only include plays with a combo more than this value.',
        arg: '-combo-min',
        compatibleWith: ['clears', 'total pp', 'top pp'],
        type: 'string',
        numeric: true,
        default: null,
        width: 1.5,
    },
    {
        name: 'Max Combo',
        desc: 'Only include plays with a combo less than this value.',
        arg: '-combo-max',
        compatibleWith: ['clears', 'total pp', 'top pp'],
        type: 'string',
        numeric: true,
        default: null,
        width: 1.5,
    },
    {
        name: 'Min Score',
        desc: 'Only include plays with a score more than this value.',
        arg: '-score-min',
        compatibleWith: ['clears', 'total pp', 'top pp'],
        type: 'string',
        numeric: true,
        default: null,
        width: 1.5,
    },
    {
        name: 'Max Score',
        desc: 'Only include plays with a score less than this value.',
        arg: '-score-max',
        compatibleWith: ['clears', 'total pp', 'top pp'],
        type: 'string',
        numeric: true,
        default: null,
        width: 1.5,
    }
]

function ToolCommandHelper() {
    const [selectedCommand, setSelectedCommand] = useState(null);
    const [argumentData, setArgumentData] = useState({});
    const [resultingCommand, setResultingCommand] = useState(null);

    useEffect(() => {
        const argData = {};
        ARGUMENTS.forEach((argument) => {
            argData[argument.name] = argument.default;
        });
    }, []);

    const updateArgumentData = (name, value) => {
        setArgumentData((prev) => {
            return {
                ...prev,
                [name]: value,
            }
        });
    };

    const resetArgumentData = () => {
        setArgumentData({});
    };

    useEffect(() => {
        if (selectedCommand) {
            let command = selectedCommand.exportCmd;
            ARGUMENTS.forEach((argument) => {
                if (argumentData[argument.name] !== undefined) {
                    switch (argument.type) {
                        case 'string':
                            if (argumentData[argument.name]?.length > 0) {
                                let val;
                                if (argument.seperated_string) {
                                    val = `%${argumentData[argument.name].replace(/ /g, "+")}%`;
                                } else {
                                    val = argumentData[argument.name].replace(/ /g, "+");
                                }
                                command += ` ${argument.arg} ${val}`;
                            }
                            break;
                        case 'dropdown':
                            if (argumentData[argument.name]?.length > 0) {
                                command += ` ${argument.arg} ${argumentData[argument.name].join(argument.seperator)}`;
                            }
                            break;
                        case 'boolean':
                            command += ` ${argument.arg} ${argumentData[argument.name] ? 'true' : 'false'}`;
                            break;
                        case 'triboolean':
                            if (argumentData[argument.name] === null) break;
                            command += ` ${argument.arg} ${argumentData[argument.name] ? 'true' : 'false'}`;
                            break;
                        case 'datepicker':
                            if (argumentData[argument.name]) {
                                const val = argumentData[argument.name].isSame(moment(), 'day') ? 'today' : argumentData[argument.name].format('YYYY/MM/DD');
                                command += ` ${argument.arg} ${val}`;
                            }
                            break;
                        default:
                            break;
                    }
                }
            });
            setResultingCommand(command);
        }
    }, [argumentData, selectedCommand]);

    return (
        <>

            <Stack direction='column' spacing={2}>
                <Alert severity="info">
                    This tool is to help you generate commands for use with the osu!alternative Discord bot. Hover the buttons for more information.
                </Alert>
                <Paper elevation={2} sx={{ p: 1 }}>
                    <Typography component='p' variant='title'>Leaderboard type</Typography>
                    {/* <ButtonGroup> */}
                    {
                        COMMANDS.map((command, index) => {
                            return (
                                <Tooltip title={command.desc}>
                                    <Button sx={{ m: 0.5 }} variant={selectedCommand?.cmd === command.cmd ? 'contained' : 'outlined'} onClick={() => { setSelectedCommand(command); resetArgumentData(); }}>{command.cmd}</Button>
                                </Tooltip>
                            )
                        })
                    }
                    {/* </ButtonGroup> */}
                </Paper>
                <Paper elevation={2} sx={{ p: 1 }}>
                    <Typography component='p' variant='title'>Arguments</Typography>
                    <Grid container spacing={2}>
                        {
                            ARGUMENTS.map((argument, index) => {
                                // const compatible = argument.compatibleWith.includes(selectedCommand?.cmd);
                                const compatible = true;
                                return (
                                    <Grid item xs={argument.width ?? 3}>
                                        <Tooltip title={argument.desc}>
                                            <Box>
                                                <>
                                                    {
                                                        {
                                                            'string':
                                                                <>
                                                                    <TextField
                                                                        disabled={!compatible}
                                                                        size='small'
                                                                        onChange={e => updateArgumentData(argument.name, e.target.value)}
                                                                        value={argumentData[argument.name] ?? null}
                                                                        label={argument.name}
                                                                        type={argument.numeric ? 'number' : 'text'}
                                                                        variant="standard" />
                                                                </>,
                                                            'dropdown':
                                                                <>
                                                                    {
                                                                        argument.values &&
                                                                        <FormControl sx={{ width: '100%' }}>
                                                                            <InputLabel size='small' id={`dropdown_label_${argument.name}`}>{argument.name}</InputLabel>
                                                                            <Select
                                                                                disabled={!compatible}
                                                                                size='small'
                                                                                multiple
                                                                                value={argumentData[argument.name] ?? []}
                                                                                onChange={e => updateArgumentData(argument.name, e.target.value)}
                                                                                labelId={`dropdown_label_${argument.name}`}
                                                                                label={argument.name}
                                                                            // renderValue={(selected) => (
                                                                            //     <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                                                            //         {selected.map((value) => (
                                                                            //             <Chip key={value} label={value} />
                                                                            //         ))}
                                                                            //     </Box>
                                                                            // )}
                                                                            >
                                                                                {
                                                                                    argument.values.map((value) => {
                                                                                        return (
                                                                                            <MenuItem key={value} value={value}>
                                                                                                {value}
                                                                                            </MenuItem>
                                                                                        )
                                                                                    })
                                                                                }
                                                                            </Select>
                                                                        </FormControl>
                                                                    }
                                                                </>,
                                                            'boolean':
                                                                <>
                                                                    <FormControlLabel
                                                                        disabled={!compatible}
                                                                        control={
                                                                            <Checkbox
                                                                                checked={argumentData[argument.name] !== undefined ? argumentData[argument.name] : argument.default}
                                                                                onChange={e => updateArgumentData(argument.name, e.target.checked)} />
                                                                        }
                                                                        label={argument.name} />
                                                                </>,
                                                            'triboolean':
                                                                <>
                                                                    <FormControlLabel
                                                                        disabled={!compatible}
                                                                        control={
                                                                            <TriCheckbox
                                                                                checked={argumentData[argument.name] !== undefined ? argumentData[argument.name] : argument.default}
                                                                                onChange={val => updateArgumentData(argument.name, val)} />
                                                                        }
                                                                        label={argument.name} />
                                                                </>,
                                                            'datepicker':
                                                                <>
                                                                    <LocalizationProvider dateAdapter={AdapterMoment}>
                                                                        <DesktopDatePicker
                                                                            disabled={!compatible}
                                                                            inputFormat='YYYY/MM/DD'
                                                                            label={argument.name}
                                                                            value={argumentData[argument.name] ?? null}
                                                                            defaultValue={argument.default ?? null}
                                                                            onChange={val => updateArgumentData(argument.name, val)}
                                                                            renderInput={(params) => <TextField size='small' {...params} />}
                                                                        />
                                                                    </LocalizationProvider>
                                                                </>,
                                                        }[argument.type]
                                                    }
                                                </>
                                            </Box>
                                        </Tooltip>
                                    </Grid>
                                )
                            })
                        }
                    </Grid>
                </Paper>

                <TextField InputProps={{ readOnly: true }} value={resultingCommand} defaultValue={'Select a command'} label="Result" variant="standard" />
            </Stack>
        </>
    );
}

export default ToolCommandHelper;