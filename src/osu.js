import axios from "axios";
import config from "./config.json";
import { mods } from "./helper";

export function getBonusPerformance(clears){
    return 416.6667 * (1-Math.pow(0.9994, clears));
}

export async function getUser(id) {
    let _user = null;
    try {
        const res = await axios.get(`${(!process.env.NODE_ENV || process.env.NODE_ENV === 'development') ? config.OSU_TEST_API : config.OSU_API}users/${id}`, { headers: { "Access-Control-Allow-Origin": "*" } });
        _user = res.data;
        if (_user.error !== undefined) {
            throw Error('Unable to get user at this time');
        }
    } catch (err) {
        return null;
    }

    try {
        let _scoreRank = await fetch(`${config.SCORE_API}${id}`).then((res) => res.json());
        if (_scoreRank !== undefined) {
            _user.scoreRank = _scoreRank[0].rank;
        }
    } catch (err) {
        return null;
    }

    return _user;
}

export async function getBeatmapCount() {
    let bmCount;
    try {
        bmCount = await axios.get(`${(!process.env.NODE_ENV || process.env.NODE_ENV === 'development') ? config.OSU_TEST_API : config.OSU_API}beatmaps/monthly`, { headers: { "Access-Control-Allow-Origin": "*" } });
    } catch (err) {
        return null;
    }

    return bmCount;
}

export async function getBeatmap(beatmap_id) {
    let beatmap;
    try {
        beatmap = await axios.get(`${(!process.env.NODE_ENV || process.env.NODE_ENV === 'development') ? config.OSU_TEST_API : config.OSU_API}beatmaps/${beatmap_id}`, { headers: { "Access-Control-Allow-Origin": "*" } });
    } catch (err) {
        return null;
    }
    if (beatmap === undefined || beatmap.length === 0) {
        throw Error('Beatmap not found');
    }
    return beatmap[0];
}

export async function getBeatmapMaxscore(beatmap_id) {
    let beatmap;
    try {
        const url = `${(!process.env.NODE_ENV || process.env.NODE_ENV === 'development') ? config.OSU_TEST_API : config.OSU_API}beatmaps/${beatmap_id}/maxscore`;
        beatmap = await axios.get(url, { headers: { "Access-Control-Allow-Origin": "*" } });
    } catch (err) {
        return null;
    }
    if (beatmap === undefined || beatmap.data === undefined || beatmap.data.length === 0) {
        throw Error('Beatmap not found');
    }
    return beatmap.data;
}

export function isScoreRealistic(score) {
    const maxMissCount = (score.enabled_mods & mods.NF) ? 15 : 30; //max 15 misses on NF, max 30 on no NF
    const minCombo = score.maxcombo / 100 * 80; //80% combo
    const minAcc = (score.enabled_mods & mods.NF) ? 90 : 80; //90% acc required for NF, 80% for no NF

    if (score.countmiss <= maxMissCount || score.combo > minCombo || score.accuracy > minAcc) {
        return true;
    }

    return false;
}

export function getLazerScore(score){
    const mul = getModMultiplier(score.enabled_mods);
    return (((((50 * score.count50 + 100 * score.count100 + 300 * score.count300) / (300 * score.count50 + 300 * score.count100 + 300 * score.count300 + 300 * score.countmiss))* 300000) + ((score.combo / score.maxcombo) * 700000)) * mul);
}

export function getGrade(score) {
    var grade = 'D';

    const totalhits = score.count300 + score.count100 + score.count50 + score.countmiss;

    const perc300 = 100 / totalhits * score.count300;
    const perc50 = 100 / totalhits * score.count50;


    if (score.accuracy === 100) {
        grade = "X";
    } else if (perc300 > 90 && perc50 <= 1 && score.countmiss === 0) {
        grade = "S";
    } else if (perc300 > 80 && (score.countmiss === 0 || perc300 > 90)) {
        grade = "A";
    } else if (perc300 > 70 && (score.countmiss === 0 || perc300 > 80)) {
        grade = "B";
    } else if (perc300 > 60) {
        grade = "C";
    } else {
        grade = "D";
    }

    if (grade === "X" || grade === "S") {
        if (score.enabled_mods & mods.HD || score.enabled_mods & mods.FL) {
            grade += "H";
        }
    }
    return grade;
}

export function getModMultiplier(enabled_mods){
    let multiplier = 1.0;
    if (enabled_mods & mods.HD) {
        multiplier *= 1.06;
    }
    if (enabled_mods & mods.FL) {
        multiplier *= 1.12;
    }
    if (enabled_mods & mods.EZ) {
        multiplier *= 0.50;
    }
    if (enabled_mods & mods.NF) {
        multiplier *= 0.90;
    }
    if (enabled_mods & mods.HT) {
        multiplier *= 0.30;
    }
    if (enabled_mods & mods.HR) {
        multiplier *= 1.12;
    }
    if (enabled_mods & mods.DT || enabled_mods & mods.NC) {
        multiplier *= 1.06;
    }
    return multiplier;
}