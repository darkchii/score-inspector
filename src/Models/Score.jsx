import moment from "moment";
import Mods from "../Helpers/Mods";
import Beatmap from "./Beatmap";
import { computeAccuracy, getLazerScore, getRankFromAccuracy } from "../Helpers/Osu";
import { getCalculator } from "../Helpers/Performance/Performance";
import SerializableObject from "./SerializableObject";

class Score extends SerializableObject {
    constructor(data, user = null) {
        super();
        this.user = user;
        this.user_id = data.user_id;
        this.beatmap_id = data.beatmap_id;
        this.score = data.score;
        this.count300 = data.count300;
        this.count100 = data.count100;
        this.count50 = data.count50;
        this.countmiss = data.countmiss;
        this.totalHits = this.count300 + this.count100 + this.count50;
        this.combo = data.combo;
        this.perfect = data.perfect;
        this.pp = Math.max(0, parseFloat(data.pp));
        this.date_played = data.date_played;
        this.date_played_moment = moment(this.date_played).local();
        this.replay_available = data.replay_available;
        this.rank = data.rank;

        if (user?.alt) {
            this.is_unique_ss = user.alt.unique_ss?.includes(this.beatmap_id);
            this.is_unique_fc = user.alt.unique_fc?.includes(this.beatmap_id);
            this.is_unique_dt_fc = user.alt.unique_dt_fc?.includes(this.beatmap_id);
        }

        this.accuracy = parseFloat(data.accuracy);
        this.mods = new Mods(parseInt(data.enabled_mods), data.mods);
        this.statistics = data.statistics;
        this.maximum_statistics = data.maximum_statistics;

        if (this.statistics && this.maximum_statistics) {
            this.accuracy = computeAccuracy(this) * 100; //for some reason, osualt sometimes has wrong accuracy values
            this.rank = getRankFromAccuracy(this, this.accuracy / 100);
        }

        this.beatmap = new Beatmap(data.beatmap, this.mods);
        this.is_fc = Score.isScoreFullCombo(this);
        this.is_pfc = this.beatmap.maxcombo - this.combo === 0;
        this.is_loved = this.beatmap.approved === 4;
        this.scoreLazerStandardised = Math.floor(getLazerScore(this));

        this.estimated_pp = getCalculator('live', {
            score: this,
        }).total;
    }

    static isScoreFullCombo(score) {
        return (score.countMiss === 0 && ((score.beatmap.maxcombo - score.combo) <= score.count100)) || score.perfect === 1 || score.rank === 'X' || score.rank === 'XH';
    }
}

export default Score;