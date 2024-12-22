import { Box, Table, TableCell, TableContainer, TableRow, Typography } from "@mui/material";
import { mods } from "./Osu";
import { getModIcon, PNG_MOD_EXTENDER } from "./Assets";
import ModData from "../Data/ModData";
import { isEmpty } from "lodash";
import { formatNumber, ImageWithColor } from "./Misc";
import Color from "color";
import OsuTooltip from "../Components/OsuTooltip";

let _MOD_ICON_CACHE = {};

class Mods {
    constructor(mods_enum, modern_mods = null) {
        this.mods_enum = mods_enum;
        this.mods_data = [];
        this.modern_mods = modern_mods;

        this.speed = 1;

        if (modern_mods === null || modern_mods === undefined) {
            this.mods_data.push({
                acronym: "CL"
            });

            for (const mod in mods) {
                //if the mod is enabled
                if (mods_enum & mods[mod]) {
                    //push the mod to the array
                    let _mod = {
                        acronym: mod,
                        value: mods[mod]
                    }

                    if (mod & mods.NC || mod & mods.DT) {
                        _mod.speed_change = 1.5;
                    }

                    if (mod & mods.HT) {
                        _mod.speed_change = 0.75;

                    }

                    this.mods_data.push(_mod);
                }
            }
        } else {
            this.mods_data = modern_mods;
        }

        if (Mods.hasMod(this, "DT") || Mods.hasMod(this, "NC")) {
            const mod = Mods.getMod(this, "DT") || Mods.getMod(this, "NC");
            this.speed = mod?.settings?.speed_change || 1.5;
        }

        if (Mods.hasMod(this, "HT") || Mods.hasMod(this, "DC")) {
            const mod = Mods.getMod(this, "HT") || Mods.getMod(this, "DC");
            this.speed = mod?.settings?.speed_change || 0.75;
        }


        this.mods_data.forEach(mod => {
            const data = Mods.getModData(mod.acronym);
            mod.data = data || {};
        });

        if (this.mods_data.length === 0) {
            this.mods_data.push({
                acronym: "NM",
                data: {
                    Acronym: "NM",
                    Name: "No mods",
                    Description: "No mods were selected"
                },
            });
        }

        for (const mod of this.mods_data) {
            mod.scoreMultiplier = 1;
            if (mod.data.ScoreMultiplier !== undefined) {
                // multiplier *= mod.data.ScoreMultiplier;
                mod.scoreMultiplier = mod.data.ScoreMultiplier;
            } else {
                //if the mod has a speed change setting
                if (mod.data.Settings !== undefined && mod.data.Settings.find(s => s.Name === 'speed_change') !== undefined) {
                    mod.scoreMultiplier = Mods.calculateRateChangeScoreModifier(mod.settings?.speed_change ?? Mods.getDefaultSpeedChange(mod));
                }
            }
        }

        this.scoreMultiplier = Mods.getMultiplier(this);
    }

    static isNoMod(mods) {
        return mods.mods_data.length === 1 && mods.mods_data[0].acronym === "NM";
    }

    static hasMod(mods, mod) {
        return mods.mods_data.find(m => m.acronym === mod) !== undefined;
    }

    static hasMods(mods, acronyms) {
        //return true if all the mods are present
        return acronyms.every(acronym => mods.mods_data.find(m => m.acronym === acronym) !== undefined);
    }

    static getMod(mods, mod) {
        return mods.mods_data.find(m => m.acronym === mod);
    }

    static getMods(mods) {
        return mods.mods_data;
    }

    static hasExactMods(mods, acronyms) {
        //return true if the mods are exactly the same
        if (mods.mods_data.length !== acronyms.length) return false;
        return mods.mods_data.every(m => acronyms.includes(m.acronym));
    }

    static containsSettings(mods) {
        return mods.mods_data.some(m => m.settings !== undefined);
    }

    static containsSetting(mods, setting) {
        return mods.mods_data.some(m => m.settings !== undefined && m.settings[setting] !== undefined);
    }

    static getSetting(mods, setting) {
        return mods.mods_data.find(m => m.settings !== undefined && m.settings[setting] !== undefined);
    }

    static getModSetting(mods, mod, setting) {
        if (!Mods.hasMod(mods, mod)) return null;
        return Mods.getMod(mods, mod).settings[setting] || null;
    }

    //overload to return this.mods_data if this object is called without function
    static valueOf(mods) {
        return mods.mods_data;
    }

    static isEmpty(mods) {
        //return true if the array is empty or NM is the only mod
        return isEmpty(mods.mods_data) || (mods.mods_data.length === 1 && mods.mods_data[0].acronym === "NM");
    }

    static getModData(acronym) {
        return ModData[0].Mods.find(m => m.Acronym === acronym.toUpperCase());
    }

    static getMultiplier(mods) {
        let multiplier = 1;

        for (const mod of mods.mods_data) {
            multiplier *= mod.scoreMultiplier;
        }

        return multiplier;
    }

    static calculateRateChangeScoreModifier(speed_change) {
        //round to 1 decimal place
        let value = Math.floor(speed_change * 10) / 10;

        value -= 1;

        if (speed_change >= 1) {
            return 1 + value / 5;
        } else {
            return 0.6 + value;
        }
    }

    static getModOriginalValue(beatmap, acronym, setting) {

        let originalValue;
        let invertSkillHandler = false;

        if (acronym === "DA") {
            if (setting === 'approach_rate') { originalValue = parseFloat(beatmap.ar); }
            if (setting === 'circle_size') { originalValue = parseFloat(beatmap.cs); }
            if (setting === 'drain_rate') { originalValue = parseFloat(beatmap.hp); }
            if (setting === 'overall_difficulty') { originalValue = parseFloat(beatmap.od); }
        } else if (acronym === "FL") {
            if (setting === 'size_multiplier') { originalValue = 1; invertSkillHandler = true; }
        } else if (acronym === "DT" || acronym === "NC") {
            if (setting === 'speed_change') { originalValue = 1.5; }
        } else if (acronym === "HT") {
            if (setting === 'speed_change') { originalValue = 0.75; }
        }

        return [originalValue, invertSkillHandler];
    }

    static getModSettingsData(acronym, setting) {
        const data = Mods.getModData(acronym);
        return data.Settings.find(s => s.Name === setting);
    }

    static getModsWithSettings(mods) {
        return mods.mods_data.filter(m => m.settings !== undefined);
    }

    static isModSpeedChange(mod) {
        return mod.acronym === "DT" || mod.acronym === "NC" || mod.acronym === "HT" || mod.acronym === "DC";
    }

    static getDefaultSpeedChange(mod) {
        if (mod.acronym === "DT" || mod.acronym === "NC") {
            return 1.5;
        } else if (mod.acronym === "HT" || mod.acronym === "DC") {
            return 0.75;
        } else {
            return 1;
        }
    }

    static getModElements(mods, height = 20, style = {}, show_extra_mod_info = false, gap = 5, showIncompatible = true) {
        // return Mods.valueOf(mods).map((mod, i) => Mods.getModElement(mod, height, i === 0 ? { marginLeft: 0 } : {}));
        return Mods.valueOf(mods).map((mod, i) => Mods.getModElement(mod, height, {
            marginLeft: i === 0 ? 0 : gap,
            ...style
        }, show_extra_mod_info, showIncompatible));
    }

    static getModTypeColor(mod) {
        switch (mod.data.Type) {
            case "Automation": return "#66ccff";
            case "DifficultyIncrease": return "#ff6666";
            case "DifficultyReduction": return "#b2ff66";
            case "Conversion": return "#8c66ff";
            case "Fun": return "#ff66ab";
            case "System": return "#ffcc22";
            default: return "#ffffff";
        }
    }

    static getIncompatibleMods(mod) {
        //return as a new Mods object
        let _modern_mods = [];
        if (mod.data.IncompatibleMods !== undefined) {
            _modern_mods = mod.data.IncompatibleMods.map(acronym => {
                return {
                    acronym: acronym,
                    data: Mods.getModData(acronym)
                }
            });
        }

        return new Mods(0, _modern_mods);
    }

    static getModSettingValue(mod, setting) {
        if (mod.settings === undefined) return null;
        let data = Mods.getModSettingsData(mod.acronym, setting);

        let value = mod.settings[setting];
        switch (data.Type) {
            default:
            case "number":
                value = formatNumber(value, 2);
                break;
            case "string":
                value = mod.settings[setting];
                break;
            case "boolean":
                value = mod.settings[setting] ? "Yes" : "No";
                break;
        }

        return value;
    }

    static getTooltipContent(mod, display_settings = false, showIncompatible = true) {
        return (
            mod.acronym !== "NM" ?
                <Box>
                    <Box>
                        <Typography variant='h6'>{mod.data.Name}</Typography>
                        <Typography variant='body2'>{mod.data.Description}</Typography>
                        <Typography variant='subtitle2'>Multiplier: {formatNumber(mod.scoreMultiplier, 2)}x</Typography>
                        {/* {tooltip_extra_data !== null ? `(${tooltip_extra_data})` : ''} */}
                        {
                            display_settings ? <>
                                <TableContainer>
                                    <Table size='small'>
                                        {
                                            mod.settings !== undefined ? Object.keys(mod.settings).map(setting => {
                                                let data = Mods.getModSettingsData(mod.acronym, setting);
                                                return (
                                                    <TableRow key={setting}>
                                                        <TableCell>{data.Label}</TableCell>
                                                        {/* <TableCell>{mod.settings[setting]}</TableCell> */}
                                                        <TableCell>{Mods.getModSettingValue(mod, setting)}</TableCell>
                                                    </TableRow>
                                                )
                                            }) : null
                                            // for (const setting in mod.settings) {
                                            //     let data = Mods.getModSettingsData(mod.acronym, setting);
                                            //     //str += `${data.Name}: ${mod.settings[setting]}\n`;
                                            //     str.push(`${data.Label}: ${mod.settings[setting]}`);
                                            // }
                                        }
                                    </Table>
                                </TableContainer>
                            </> : null
                        }
                    </Box>
                    {
                        showIncompatible ? <Box sx={{ mt: 2 }}>
                            <Box>Incompatible with:</Box>
                            <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
                                {
                                    mod.data.IncompatibleMods !== undefined && mod.data.IncompatibleMods.length > 0 ?
                                        <>{
                                            Mods.getModElements(Mods.getIncompatibleMods(mod), 25, { marginRight: 5 }, false, 0, false)
                                        }</>
                                        : <Typography sx={{ color: 'gray' }}>
                                            Compatible with all mods
                                        </Typography>
                                }
                            </Box>
                        </Box> : null
                    }
                </Box>
                : "No mod"
        )
    }

    static getModElement(mod, height = 24, style = {}, show_extra_mod_info = false, showIncompatible = true) {
        if (mod.data === undefined) {
            console.error(`Mod ${mod.acronym} does not have data`);
            return null;
        }

        if (_MOD_ICON_CACHE[mod.acronym]) {
            return _MOD_ICON_CACHE[mod.acronym];
        }

        let mod_icon = getModIcon(mod.acronym);
        let superimpose_acronym = false;
        if (mod_icon === null && mod.data.Type !== undefined) {
            mod_icon = getModIcon(mod.data.Type, true);
            superimpose_acronym = true;
        }

        // let width = undefined;
        //   width: calc($height * unit(@mod-width) / unit(@mod-height));
        let width = undefined;

        let extra_data_string = undefined;

        if (show_extra_mod_info) {
            // if (mod.acronym === "DT" || mod.acronym === "NC" || mod.acronym === "HT" || mod.acronym === "DC") {
            if (Mods.isModSpeedChange(mod)) {
                extra_data_string = `${formatNumber(mod.settings?.speed_change ?? Mods.getDefaultSpeedChange(mod), 2)}x`;
            }
        }

        if (extra_data_string !== undefined) {
            width = height * 3;
        }

        const color = Color(Mods.getModTypeColor(mod));
        return (
            <OsuTooltip title={Mods.getTooltipContent(mod, true, showIncompatible)}>
                <Box sx={{
                    display: 'flex',
                    position: 'relative',
                }}>
                    <Box style={{
                        ...style,
                        '--mod-height': `${height}px`,
                        ...(width !== undefined && extra_data_string !== undefined ? { '--mod-width': `${width}px` } : {}),
                    }} className={`mod ${superimpose_acronym ? '' : 'mod-img'}`} data-acronym={mod.acronym} key={mod.acronym}>
                        <img src={mod_icon} alt={mod.acronym} height={height} />
                    </Box>
                    {show_extra_mod_info !== undefined && extra_data_string !== undefined ?
                        (
                            <>
                                <Box sx={{
                                    position: 'absolute',
                                    top: 0,
                                    bottom: 0,
                                    height: '100%',
                                    left: `${1.45 + (
                                        //convert style.marginLeft to em (from px)
                                        style.marginLeft !== undefined ? (style.marginLeft / 16 - (22 - height) * 0.1) : 0
                                    )}em`
                                }}>
                                    <ImageWithColor
                                        src={PNG_MOD_EXTENDER}
                                        height='100%'
                                        // color={'#ff0000'}
                                        color={color.darken(0.9).hex()}
                                    />
                                </Box>
                                <Box sx={{
                                    position: 'absolute',
                                    top: 0,
                                    // left: '1.5em',
                                    left: `${1.5 + (
                                        //convert style.marginLeft to em (from px)
                                        style.marginLeft !== undefined ? (style.marginLeft / 16 - (22 - height) * 0.1) : 0
                                    )}em`,
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    height: '100%',
                                    width: width - height,
                                }}>
                                    <Typography sx={{
                                        fontSize: '0.65em',
                                        fontWeight: 'bold',
                                        color: color.lighten(0.1).hex(),
                                    }}>{extra_data_string}</Typography>
                                </Box>
                            </>)
                        : null}
                </Box>
            </OsuTooltip>
        )
    }

    static getAllMods() {
        // return ModData[0].Mods.filter(m => m.UserPlayable);
        const playable = ModData[0].Mods.filter(m => m.UserPlayable);
        const mod_objects = playable.map(m => {
            return {
                acronym: m.Acronym,
                data: m
            }
        });

        return new Mods(0, mod_objects);
    }
}

export default Mods;