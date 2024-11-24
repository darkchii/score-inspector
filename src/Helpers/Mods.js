import { Box, Tooltip, Typography } from "@mui/material";
import { getModString, mods } from "./Osu";
import { getModIcon } from "./Assets";
import ModData from "../Data/ModData";
import { isEmpty } from "lodash";

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
        }else if(acronym === "FL"){
            if(setting === 'size_multiplier'){ originalValue = 1; invertSkillHandler = true; }
        }else if(acronym === "DT" || acronym === "NC"){
            if(setting === 'speed_change'){ originalValue = 1.5; }
        }else if(acronym === "HT"){
            if(setting === 'speed_change'){ originalValue = 0.75; }
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

    static getModElements(mods, height = 20, style = {}) {
        return Mods.valueOf(mods).map((mod, i) => Mods.getModElement(mod, height, i === 0 ? { marginLeft: 0 } : {}));
    }

    static getModElement(mod, height = 24, style = {}) {
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

        const settings = mod.settings;

        return (
            <Tooltip title={
                <Box>
                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        {mod.data.Name} {tooltip_extra_data !== null ? `(${tooltip_extra_data})` : ''}
                    </Box>
                </Box>
            }>
                <Box style={{
                    ...style,
                    '--mod-height': `${height}px`,
                }} className={`mod ${superimpose_acronym ? '' : 'mod-img'}`} data-acronym={mod.acronym} key={mod.acronym}>
                    <img src={mod_icon} alt={mod.acronym} height={height} />
                </Box>
            </Tooltip>
        )
    }
}

export default Mods;