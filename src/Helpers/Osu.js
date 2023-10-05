import axios from "axios";
import { GetAPI } from "./Misc";

export const approval_state = {
    '-2': 'Graveyard',
    '-1': 'WIP',
    '0': 'Pending',
    '1': 'Ranked',
    '2': 'Approved',
    '3': 'Qualified',
    '4': 'Loved'
}

export function getScoreForLevel(level) {
    if (level <= 100) {
        if (level > 1) {
            return Math.floor(5000 / 3 * (4 * Math.pow(level, 3) - 3 * Math.pow(level, 2) - level) + Math.floor(1.25 * Math.pow(1.8, level - 60)));
        }
        return 1;
    }
    return Math.floor(26931190829 + 100000000000 * (level - 100));
}

export function getLevelForScore(score) {
    if (isNaN(score) || score < 0) {
        return 0;
    }

    if (score > 10000000000000000) {
        return 0;
    }

    const baseLevel = getLevel(score);
    const baseLevelScore = getScoreForLevel(baseLevel);
    const scoreProgress = score - baseLevelScore;
    const scoreLevelDifference = getScoreForLevel(baseLevel + 1) - baseLevelScore;
    const res = scoreProgress / scoreLevelDifference + baseLevel;
    if (!isFinite(res)) {
        return 0;
    }
    return res;
}

function getLevel(score) {
    let i = 1;
    for (; ;) {
        var lScore = getScoreForLevel(i);
        if (score < lScore) {
            return i - 1;
        }
        i++;
    }
}

export async function getFullUser(user_ids = [], skipped = {}, force_array = false) {
    let _ids = user_ids;

    if (!Array.isArray(user_ids)) {
        _ids = [user_ids];
    }

    if (_ids.length === 0 || _ids === undefined || _ids === null) {
        return [];
    }
    const id_string = _ids.join(',');
    const skipQuery = Object.keys(skipped).map(key => `${key}=${skipped[key]}`).join('&');
    let user = null;
    try {
        const _user = await axios.get(`${GetAPI()}users/full/${id_string}?force_array=${force_array}&${skipQuery}`);
        user = _user.data;
    } catch (e) { }

    if (user === null || user === undefined || user.error !== undefined) {
        return null;
    }

    return user;
}

export async function getUser(user_id) {
    let user = null;
    try {
        const _user = await axios.get(`${GetAPI()}users/osu/id/${user_id}`);
        user = _user.data;
    } catch (e) {
    }

    return user;
}

export async function getUsers(user_ids) {
    let users = [];
    try {
        const _users = await axios.get(`${GetAPI()}users/osu/ids?id[]=${user_ids.join('&id[]=')}`);
        users = _users.data;
    } catch (e) {
        return null;
    }
    return users;
}

export function getHitsFromAccuracy(acc, nobjects, nmiss = 0) {
    let n300 = 0, n100 = 0, n50 = 0
    const max300 = nobjects - nmiss
    n100 = Math.round(
        -3.0 * ((acc * 0.01 - 1.0) * nobjects + nmiss) * 0.5
    )

    if (n100 > max300) {
        // acc lower than all 100s, use 50s
        n100 = 0;
        n50 = Math.round(
            -6.0 * ((acc * 0.01 - 1.0) * nobjects + nmiss) * 0.5
        );
        n50 = Math.min(max300, n50);
    }

    n300 = nobjects - n100 - n50 - nmiss;

    return {
        count300: n300,
        count100: n100,
        count50: n50,
        countmiss: nmiss
    }
}

export function getModString(value) {
    var data = [];

    if (value & mods.NC) {
        value &= ~mods.DT;
    }

    if (value & mods.PF) {
        value &= ~mods.SD;
    }

    for (const modVal in mod_strings) {
        if (value & modVal) {
            data.push(mod_strings[modVal]);
            continue;
        }
    }
    return data;
}

export async function getBeatmapMaxscore(beatmap_id) {
    let beatmap;
    try {
        const url = `${GetAPI()}beatmaps/${beatmap_id}/maxscore`;
        beatmap = await axios.get(url, { headers: { "Access-Control-Allow-Origin": "*" } });
    } catch (err) {
        return null;
    }
    if (beatmap === undefined || beatmap.data === undefined || beatmap.data.length === 0) {
        throw Error('Beatmap not found');
    }
    return beatmap.data;
}

const MAX_SCORE = 1000000;
export function getLazerScore(score, classic = true) {
    const mul = getModMultiplier(score.enabled_mods);
    let val = ((((
        (50 * score.count50 + 100 * score.count100 + 300 * score.count300) / (300 * score.count50 + 300 * score.count100 + 300 * score.count300 + 300 * score.countmiss)) *
        300000) + ((score.combo / score.beatmap.maxcombo) * 700000)) * mul);

    if (classic) {
        val = Math.pow(((val / MAX_SCORE) * score.beatmap.objects), 2) * 36;
    }
    return val;
}

export function getModMultiplier(enabled_mods) {
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

export const mod_strings = {
    1: "NF",
    2: "EZ",
    4: "TD",
    8: "HD",
    16: "HR",
    32: "SD",
    64: "DT",
    128: "RX",
    256: "HT",
    512: "NC",
    1024: "FL",
    2048: "AP",
    4096: "SO",
    16384: "PF",
    1048576: "FI",
    2097152: "RN",
    4194304: "CN",
    8388608: "TG",
    536870912: "SV2",
    1073741824: "MR"
}

export const mods = {
    None: 0,
    NF: 1,
    EZ: 2,
    TD: 4,
    HD: 8,
    HR: 16,
    SD: 32,
    DT: 64,
    RX: 128,
    HT: 256,
    NC: 512, // Only set along with DoubleTime. i.e: NC only gives 576
    FL: 1024,
    AP: 2048,
    SO: 4096,
    PF: 16384, // Only set along with SuddenDeath. i.e: PF only gives 16416  
    FI: 1048576,
    RN: 2097152,
    CI: 4194304,
    TG: 8388608,
    SV2: 536870912,
    MR: 1073741824
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

export const mod_strings_long = {
    0: "Nomod",
    1: "NoFail",
    2: "Easy",
    4: "Touch Device",
    8: "Hidden",
    16: "Hardrock",
    32: "Sudden Death",
    64: "Double Time",
    128: "Relax",
    256: "Half Time",
    512: "Nightcore",
    1024: "Flashlight",
    2048: "Autoplay",
    4096: "Spin-out",
    16384: "Perfect",
    1048576: "Fade In",
    2097152: "Random",
    4194304: "Cinema",
    8388608: "Target Practice",
    536870912: "Score V2",
    1073741824: "Mirror"
}

export function calculatePPifFC(scores) {
    scores.sort((a, b) => {
        return b.pp_fc.total - a.pp_fc.total;
    });

    var index = 0;
    scores.forEach(score => { if (!score.is_loved && isScoreRealistic(score) && !isNaN(score.pp_fc.total)) { score.pp_fc.weight = Math.pow(0.95, index); index++; } else { score.pp_fc.weight = 0 } });

    return scores;
}

export function calculatePPifSS(scores) {
    scores.sort((a, b) => {
        return b.pp_ss.total - a.pp_ss.total;
    });

    var index = 0;
    scores.forEach(score => { if (!score.is_loved && isScoreRealistic(score) && !isNaN(score.pp_ss.total)) { score.pp_ss.weight = Math.pow(0.95, index); index++; } else { score.pp_ss.weight = 0 } });

    return scores;
}

export function calculatePP2016(scores) {
    scores.sort((a, b) => {
        return b.pp_2016.total - a.pp_2016.total;
    });

    var index = 0;
    scores.forEach(score => { if (!score.is_loved && !isNaN(score.pp_2016.total)) { score.pp_2016.weight = Math.pow(0.95, index); index++; } else { score.pp_2016.weight = 0 } });

    return scores;
}

export function calculatePP2014(scores) {
    scores.sort((a, b) => {
        return b.pp_2014.total - a.pp_2014.total;
    });

    var index = 0;
    scores.forEach(score => { if (!score.is_loved && !isNaN(score.pp_2014.total)) { score.pp_2014.weight = Math.pow(0.95, index); index++; } else { score.pp_2014.weight = 0 } });

    return scores;
}

export function calculatePPLazer(scores) {
    scores.sort((a, b) => {
        return b.pp_lazer.total - a.pp_lazer.total;
    });

    var index = 0;
    scores.forEach(score => { if (!score.is_loved && !isNaN(score.pp_lazer.total)) { score.pp_lazer.weight = Math.pow(0.95, index); index++; } else { score.pp_lazer.weight = 0 } });

    return scores;
}

export function isScoreRealistic(score) {
    const maxMissCount = (score.enabled_mods & mods.NF) ? 15 : 30; //max 15 misses on NF, max 30 on no NF
    const minCombo = score.beatmap.maxcombo * 0.8; //80% combo
    const minAcc = (score.enabled_mods & mods.NF) ? 90 : 80; //90% acc required for NF, 80% for no NF

    if (score.countmiss <= maxMissCount || score.combo > minCombo || score.accuracy > minAcc) {
        return true;
    }

    return false;
}

export function getBonusPerformance(clears) {
    return 416.6667 * (1 - Math.pow(0.9994, clears));
}

export async function getBeatmapCount(loved = true) {
    let bmCount;
    try {
        bmCount = await axios.get(`${GetAPI()}beatmaps/monthly?include_loved=${loved ? 'true' : 'false'}`, { headers: { "Access-Control-Allow-Origin": "*" } });
    } catch (err) {
        return null;
    }

    return bmCount;
}

export async function getBeatmaps(urlCfg = {}) {
    let beatmaps;
    try {
        //beatmaps = await axios.get(`${GetAPI()}beatmaps/all?include_loved=${loved ? 'true' : 'false'}`, { headers: { "Access-Control-Allow-Origin": "*" } });
        let stringConfig = new URLSearchParams(urlCfg).toString();
        beatmaps = await axios.get(`${GetAPI()}beatmaps/all?${stringConfig}`, { headers: { "Access-Control-Allow-Origin": "*" } });
    } catch (err) {
        return null;
    }

    return beatmaps;
}

export async function getBeatmap(beatmap_id) {
    let beatmap;
    try {
        beatmap = await axios.get(`${GetAPI()}beatmaps/${beatmap_id}`, { headers: { "Access-Control-Allow-Origin": "*" } });
    } catch (err) {
        return null;
    }

    return beatmap?.data;
}

export async function getBeatmapPacks() {
    let beatmapPacks;
    try {
        beatmapPacks = await axios.get(`${GetAPI()}beatmaps/packs`, { headers: { "Access-Control-Allow-Origin": "*" } });
    } catch (err) {
        return null;
    }

    return beatmapPacks?.data;
}

export async function getBeatmapPackDetails() {
    let beatmapPackDetails;
    try {
        beatmapPackDetails = await axios.get(`${GetAPI()}beatmaps/pack_details`, { headers: { "Access-Control-Allow-Origin": "*" } });
    } catch (err) {
        return null;
    }

    return beatmapPackDetails?.data;
}

export async function getMedals() {
    let medals;
    try {
        medals = await axios.get(`${GetAPI()}medals/get/`, { headers: { "Access-Control-Allow-Origin": "*" } });
    }
    catch (err) {
        return null;
    }

    return medals?.data;
}

export function getGradeColor(grade) {
    switch (grade) {
        default:
            return '#ffffff';
        case 'XH':
            return '#C0C0C0';
        case 'X':
            return '#C0C0C0';
        case 'SH':
            return '#E8BF3F';
        case 'S':
            return '#E8BF3F';
        case 'A':
            return '#72B75D';
        case 'B':
            return '#8B6996';
        case 'C':
            return '#8B6996';
        case 'D':
            return '#8B6996';
    }
}

const excluded_mods = [
    1, //NF
    8, //HD
    32, //SD
    128, //RX
    512, //NC
    2048, //AP
    4096, //SO
    16384, //PF
];

export function FilterStarratingArray(sr_arr, mods_enum) {
    mods_enum = parseInt(mods_enum);
    mods_enum &= ~excluded_mods.reduce((a, b) => a | b, 0);
    return sr_arr.filter(sr => sr.mods_enum === mods_enum)?.[0];
}