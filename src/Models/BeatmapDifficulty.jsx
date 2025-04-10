import Mods from "../Helpers/Mods";
import BeatmapDifficultyInfo from "../Helpers/Performance/BeatmapDifficultyInfo";
import HitResult from "../Helpers/Performance/HitResult";
import OsuHitWindows from "../Helpers/Performance/Standard/OsuHitWindows";
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

        this.relative_aim_difficulty = this.aim_difficulty;
        this.relative_speed_difficulty = this.speed_difficulty;

        this.flashlight_difficulty = parseFloat(data.flashlight_difficulty ?? data.fl_diff ?? 0);

        this.speed_note_count = parseFloat(data.speed_note_count ?? 0);

        this.aim_difficult_slider_count = parseFloat(data.aim_difficult_slider_count ?? 0);
        this.aim_difficult_strain_count = parseFloat(data.aim_difficult_strain_count ?? 0);
        this.speed_difficult_strain_count = parseFloat(data.speed_difficult_strain_count ?? 0);

        this.slider_factor = parseFloat(data.slider_factor ?? 0);

        this.recalc = data.recalc ?? false;
        this.is_legacy = data.is_legacy ?? false;

        BeatmapDifficulty.applyMods(this, beatmap, mods);
    }

    static fromLegacy(beatmap, data, mods = null) {
        const diff = new BeatmapDifficulty(beatmap, data, mods);
        diff.IsLegacy = true;
        return diff;
    }

    static applyMods(beatmapDifficulty, beatmap, mods) {
        let od = 1;
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
        
        if (Mods.hasMod(mods, "HR")) {
            if (od > 10) od = 10;
        }
        
        beatmapDifficulty.clockRate = Mods.getClockRate(mods);
        beatmapDifficulty.hitWindows = new OsuHitWindows();
        beatmapDifficulty.hitWindows.SetDifficulty(od);

        beatmapDifficulty.greatHitWindow = beatmapDifficulty.hitWindows.WindowFor(HitResult.Great) / beatmapDifficulty.clockRate;
        beatmapDifficulty.okHitWindow = beatmapDifficulty.hitWindows.WindowFor(HitResult.Ok) / beatmapDifficulty.clockRate;
        beatmapDifficulty.mehHitWindow = beatmapDifficulty.hitWindows.WindowFor(HitResult.Meh) / beatmapDifficulty.clockRate;

        beatmapDifficulty.overall_difficulty = (80 - beatmapDifficulty.greatHitWindow) / 6;

        let ar_multiplier = 1;
        let ar;

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

        if (Mods.hasMod(mods, "HR")) {
            if (ar > 10) ar = 10;
        }
        beatmapDifficulty.approach_rate_before_rate_change = ar;

        let preempt = BeatmapDifficultyInfo.DifficultyRange(ar, 1800, 1200, 450) / beatmapDifficulty.clockRate;
        beatmapDifficulty.preempt = preempt;

        beatmapDifficulty.approach_rate = preempt > 1200 ? (1800 - preempt) / 120 : (1200 - preempt) / 150 + 5;

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

export default BeatmapDifficulty;