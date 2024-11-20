import { getModString, mods } from "./Osu";

class Mods {
    constructor(mods_enum, modern_mods = null){
        this.mods_enum = mods_enum;
        this.mods_data = [];
        this.modern_mods = modern_mods;

        if(!modern_mods){
            for (const mod in mods) {
                //if the mod is enabled
                if (mods_enum & mods[mod]) {
                    //push the mod to the array
                    this.mods_data.push({
                        acronym: mod,
                        value: mods[mod]
                    });
                }
            }

            this.mods_data.push({
                acronym: mods.CL
            })
        }else{
            this.mods_data = modern_mods;
        }
    }

    hasMod(mod){
        return this.mods_data.find(m => m.acronym === mod) !== undefined;

        // const has_mod = (this.mods_enum & mod) !== 0;
        // return has_mod;
    }
}

export default Mods;