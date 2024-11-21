import { Box, Tooltip } from "@mui/material";
import { getModString, mods } from "./Osu";
import { getModIcon } from "./Assets";
import ModData from "../Data/ModData";

let _MOD_ICON_CACHE = {};

class Mods {
    constructor(mods_enum, modern_mods = null) {
        this.mods_enum = mods_enum;
        this.mods_data = [];
        this.modern_mods = modern_mods;

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

        this.mods_data.forEach(mod => {
            const data = Mods.getModData(mod.acronym);
            mod.data = data || {};
        });
    }

    hasMod(mod) {
        return this.mods_data.find(m => m.acronym === mod) !== undefined;
    }

    getMod(mod) {
        return this.mods_data.find(m => m.acronym === mod);
    }

    //overload to return this.mods_data if this object is called without function
    valueOf() {
        return this.mods_data;
    }

    static getModData(acronym) {
        return ModData[0].Mods.find(m => m.Acronym === acronym);
    }

    static getModSettingsData(acronym, setting) {
        const data = Mods.getModData(acronym);
        return data.Settings.find(s => s.Name === setting);
    }

    static getModElement(mod, height = 24) {
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

        if(mod.settings !== undefined){
            let str = [];
            for(const setting in mod.settings){
                let data = Mods.getModSettingsData(mod.acronym, setting);
                //str += `${data.Name}: ${mod.settings[setting]}\n`;
                str.push(`${data.Label}: ${mod.settings[setting]}`);
            }
            tooltip_extra_data = str.join(", ");
        }


        return (
            <Tooltip title={
                <Box>
                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        {mod.data.Name} {tooltip_extra_data !== null ? `(${tooltip_extra_data})` : ''}
                    </Box>
                </Box>
            }>
                <Box className={`mod ${superimpose_acronym ? '' : 'mod-img'}`} data-acronym={mod.acronym} key={mod.acronym}>
                    <img src={mod_icon} alt={mod.acronym} height={height} />
                </Box>
            </Tooltip>
        )
    }
}

export default Mods;