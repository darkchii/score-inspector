import { getModString, mods } from "./Osu";

class Mods {
    constructor(mods_enum){
        this.mods_enum = mods_enum;
        this.mods_data = [];
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
    }

    hasMod(mod){
        const has_mod = (this.mods_enum & mod) !== 0;
        return has_mod;
    }
}

export default Mods;