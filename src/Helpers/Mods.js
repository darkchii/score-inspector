import { Box, Tooltip, Typography } from "@mui/material";
import { getModString, mods } from "./Osu";
import { getModIcon, PNG_MOD_EXTENDER } from "./Assets";
import ModData from "../Data/ModData";
import { isEmpty } from "lodash";
import { formatNumber, getHueRotate, ImageWithColor } from "./Misc";
import Color from "color";

let _MOD_ICON_CACHE = {};

class Mods {
    constructor(mods_enum, modern_mods = null) {
        this.mods_enum = mods_enum;
        this.mods_data = [];
        this.modern_mods = modern_mods;

        this.speed = 0;

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
            this.speed = mod.settings?.speed_change || 1.5;
        }

        if (Mods.hasMod(this, "HT")) {
            const mod = Mods.getMod(this, "HT");
            this.speed = mod.settings?.speed_change || 0.75;
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
    }

    static hasMod(mods, mod) {
        return mods.mods_data.find(m => m.acronym === mod) !== undefined;
    }

    static getMod(mods, mod) {
        return mods.mods_data.find(m => m.acronym === mod);
    }

    static containsSettings(mods) {
        return mods.mods_data.some(m => m.settings !== undefined);
    }

    static containsSetting(mods, setting) {
        return mods.mods_data.some(m => m.settings !== undefined && m.settings[setting] !== undefined);
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
        return ModData[0].Mods.find(m => m.Acronym === acronym);
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

        console.log(`[Mods.getModOriginalValue] Beatmap: ${beatmap} Acronym: ${acronym} Setting: ${setting}, Original Value: ${originalValue}, Invert Skill Handler: ${invertSkillHandler}`);
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

    static getModElements(mods, height = 20, style = {}, show_extra_mod_info = false, gap = 5) {
        // return Mods.valueOf(mods).map((mod, i) => Mods.getModElement(mod, height, i === 0 ? { marginLeft: 0 } : {}));
        return Mods.valueOf(mods).map((mod, i) => Mods.getModElement(mod, height, {
            marginLeft: i === 0 ? 0 : gap,
            ...style
        }, show_extra_mod_info));
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

    static getModElement(mod, height = 24, style = {}, show_extra_mod_info = false) {
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

        // console.log(`Mod: ${mod.acronym} Icon: ${mod_icon}`);

        let tooltip_extra_data = null;

        if (mod.settings !== undefined) {
            let str = [];
            for (const setting in mod.settings) {
                let data = Mods.getModSettingsData(mod.acronym, setting);
                //str += `${data.Name}: ${mod.settings[setting]}\n`;
                str.push(`${data.Label}: ${mod.settings[setting]}`);
            }
            tooltip_extra_data = str.join(", ");
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
        console.log(`[Mods.getModElement] Mod: ${mod.acronym} Data: ${extra_data_string}`);

        return (
            <Tooltip title={
                <Box>
                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        {mod.data.Name} {tooltip_extra_data !== null ? `(${tooltip_extra_data})` : ''}
                    </Box>
                </Box>
            }>
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
                        <>
                            <Box sx={{
                                position: 'absolute',
                                top: 0,
                                bottom: 0,
                                height: '100%',
                                left: '1.45em',
                            }}>
                                <ImageWithColor
                                    src={PNG_MOD_EXTENDER}
                                    height='100%'
                                    // color={'#ff0000'}
                                    color={Color(Mods.getModTypeColor(mod)).darken(0.9).hex()}
                                />
                            </Box>
                            <Box sx={{
                                position: 'absolute',
                                top: 0,
                                left: '1.5em',
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                height: '100%',
                                width: width - height,
                            }}>
                                <Typography sx={{
                                    fontSize: '0.65em',
                                    fontWeight: 'bold',
                                    color: Color(Mods.getModTypeColor(mod)).lighten(0.1).hex(),
                                }}>{extra_data_string}</Typography>
                            </Box>
                        </>
                        // <Box sx={{
                        //     display: 'flex',
                        //     justifyContent: 'center',
                        //     alignItems: 'center',
                        //     height: '100%',
                        //     width: '100%',

                        // }}>
                        //     <Typography sx={{ fontSize: '0.8em' }}>{extra_data_string}</Typography>
                        // </Box>
                        : null}
                </Box>
            </Tooltip>
        )
    }
}

export default Mods;