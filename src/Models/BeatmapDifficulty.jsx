import Mods from "../Helpers/Mods";
import SerializableObject from "./SerializableObject";

const ar_ms_step1 = 120;
const ar_ms_step2 = 150;

const ar0_ms = 1800;
const ar5_ms = 1200;

const od_ms_step = 6;
const od0_ms = 79.5;
const od10_ms = 19.5;

class BeatmapDifficulty extends SerializableObject {
    constructor(beatmap, data, mods = null) {
        super();
        this.BeatmapID = data.beatmap_id;

        this.star_rating = parseFloat(data.star_rating ?? 0);
        this.aim_difficulty = parseFloat(data.aim_difficulty ?? data.aim_diff ?? 0);
        this.speed_difficulty = parseFloat(data.speed_difficulty ?? data.speed_diff ?? 0);
        this.flashlight_difficulty = parseFloat(data.flashlight_difficulty ?? data.fl_diff ?? 0);

        this.speed_note_count = parseFloat(data.speed_note_count ?? 0);

        this.aim_difficult_slider_count = parseFloat(data.aim_difficult_slider_count ?? 0);
        this.aim_difficult_strain_count = parseFloat(data.aim_difficult_strain_count ?? 0);
        this.speed_difficult_strain_count = parseFloat(data.speed_difficult_strain_count ?? 0);

        this.slider_factor = parseFloat(data.slider_factor ?? 0);

        this.recalc = data.recalc ?? false;
        this.IsLegacy = false;

        BeatmapDifficulty.applyMods(this, beatmap, mods);
    }

    static fromLegacy(beatmap, data, mods = null) {
        const diff = new BeatmapDifficulty(beatmap, data, mods);
        diff.IsLegacy = true;
        return diff;
    }

    static applyMods(beatmapDifficulty, beatmap, mods) {
        let speed = mods.speed;

        if (!beatmapDifficulty.approach_rate) {
            let ar_multiplier = 1;
            let ar;
            let ar_ms;

            if (Mods.hasMod(mods, "HR")) {
                ar_multiplier = 1.4;
            } else if (Mods.hasMod(mods, "EZ")) {
                ar_multiplier = 0.5;
            }

            let original_ar = beatmap.ar;
            if (Mods.hasMod(mods, "DA") && Mods.containsSetting(mods, "approach_rate")) {
                original_ar = Mods.getModSetting(mods, "DA", "approach_rate");
            }
            original_ar = Number(original_ar);

            ar = original_ar * ar_multiplier;

            if (ar <= 5)
                ar_ms = ar0_ms - ar_ms_step1 * ar;
            else
                ar_ms = ar5_ms - ar_ms_step2 * (ar - 5);

            ar_ms /= speed;

            if (ar <= 5)
                ar = (ar0_ms - ar_ms) / ar_ms_step1;
            else
                ar = 5 + (ar5_ms - ar_ms) / ar_ms_step2;

            beatmapDifficulty.approach_rate = ar;
        }

        if (!beatmapDifficulty.circle_size) {
            let cs = 1;
            let cs_multiplier = 1;

            if (Mods.hasMod(mods, "HR")) {
                cs_multiplier = 1.3;
            } else if (Mods.hasMod(mods, "EZ")) {
                cs_multiplier = 0.5;
            }

            let original_cs = beatmap.cs;
            if (Mods.hasMod(mods, "DA") && Mods.containsSetting(mods, "circle_size")) {
                original_cs = Mods.getModSetting(mods, "DA", "circle_size");
            }
            original_cs = Number(original_cs);

            cs = original_cs * cs_multiplier;

            if (cs > 10) cs = 10;

            beatmapDifficulty.circle_size = cs;
        }

        if (!beatmapDifficulty.overall_difficulty) {
            let od = 1;
            let odms = 1;
            let od_multiplier = 1;

            if (Mods.hasMod(mods, "HR")) {
                od_multiplier = 1.4;
            } else if (Mods.hasMod(mods, "EZ")) {
                od_multiplier = 0.5;
            }

            let original_od = beatmap.od;
            if (Mods.hasMod(mods, "DA") && Mods.containsSetting(mods, "overall_difficulty")) {
                original_od = Mods.getModSetting(mods, "DA", "overall_difficulty");
            }
            original_od = Number(original_od);

            od = original_od * od_multiplier;
            odms = od0_ms - Math.ceil(od_ms_step * od);
            odms = Math.min(od0_ms, Math.max(od10_ms, odms));

            odms /= speed;

            od = (od0_ms - odms) / od_ms_step;

            beatmapDifficulty.overall_difficulty = od;
        }

        if (!beatmapDifficulty.drain_rate) {
            let hp = 1;
            let hp_multiplier = 1;

            if (Mods.hasMod(mods, "HR")) {
                hp_multiplier = 1.4;
            } else if (Mods.hasMod(mods, "EZ")) {
                hp_multiplier = 0.5;
            }

            let original_hp = beatmap.hp;
            if (Mods.hasMod(mods, "DA") && Mods.containsSetting(mods, "drain_rate")) {
                original_hp = Mods.getModSetting(mods, "DA", "drain_rate");
            }
            original_hp = Number(original_hp);

            hp = original_hp * hp_multiplier;

            if (hp > 10) hp = 10;

            beatmapDifficulty.drain_rate = hp;
        }
    }
}

export default BeatmapDifficulty;