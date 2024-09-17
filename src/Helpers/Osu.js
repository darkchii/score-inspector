import axios from "axios";
import { GetAPI } from "./Misc";
import { getCalculator } from "./Performance/Performance.js";
import moment from "moment";
import BADGE_COMPLETIONIST_STANDARD from "../Assets/Completionists/standard.png";
import BADGE_COMPLETIONIST_TAIKO from "../Assets/Completionists/taiko.png";
import BADGE_COMPLETIONIST_CATCH from "../Assets/Completionists/catch.png";
import BADGE_COMPLETIONIST_MANIA from "../Assets/Completionists/mania.png";
import { OsuCatchIcon, OsuManiaIcon, OsuStandardIcon, OsuTaikoIcon } from "../Components/Icons.js";

export const approval_state = {
    '-2': 'Graveyard',
    '-1': 'WIP',
    '0': 'Pending',
    '1': 'Ranked',
    '2': 'Approved',
    '3': 'Qualified',
    '4': 'Loved'
}

export const osu_modes = [
    {
        id: 0,
        name: 'osu!standard',
        completion_badge: BADGE_COMPLETIONIST_STANDARD
    }, {
        id: 1,
        name: 'osu!taiko',
        completion_badge: BADGE_COMPLETIONIST_TAIKO
    }, {
        id: 2,
        name: 'osu!catch',
        completion_badge: BADGE_COMPLETIONIST_CATCH
    }, {
        id: 3,
        name: 'osu!mania',
        completion_badge: BADGE_COMPLETIONIST_MANIA
    }
]

export const PP_SYSTEM_NAMES = {
    'live': { title: 'Live', description: 'The current PP system' },
    'ss': { title: 'PP if SS', description: 'PP if player SS\'d every realistic map (basically that are chokes now)' },
    'fc': { title: 'PP if FC', description: 'PP if player FC\'d every realistic map (basically that are chokes now)' },
    'v1': { title: 'ppv1', description: 'Precursor to current pp system. Depends on map age, playcount, passcount, relative playcount, ss ratio, accuracy and mods' },
    '2014may': { title: 'ppv2 (May 2014)', description: 'First release of ppv2' },
    '2014july': { title: 'ppv2 (July 2014)', description: '1.5x star difficulty, aim nerfed, acc and length buffed' },
    '2015february': { title: 'ppv2 (Feb 2015)', description: 'High CS buff, FL depends on length, high ar is now 10.33' },
    '2015april': { title: 'ppv2 (April 2015)', description: 'Slight high cs nerf' },
    '2018': { title: 'ppv2 (2018)', description: 'HD adjustment' },
    '2019': { title: 'ppv2 (2019)', description: 'Angles, speed, spaced streams' },
    '2021january': { title: 'ppv2 (Jan 2021)', description: 'High AR nerf, NF & SO buff, speed and acc adjustment' },
    '2021july': { title: 'ppv2 (July 2021)', description: 'Diff spike nerf, AR buff, FL-AR adjust' },
    '2021november': { title: 'ppv2 (Nov 2021)', description: 'Rhythm buff, slider buff, FL skill' },
    '2023xexxarProposal': { title: 'length bonus removal', description: 'A PP change proposal to nerf length bonus' },
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

export function getDedicationLevel(a, b, c, d, xp) {
    let l = 0;
    let fl = a * l * l * l + b * l * l + c * l + d - xp;
    let i = 0;
    while (Math.abs(fl) > 0.001 && i < 50) {
        let dfl = 3 * a * l * l + 2 * b * l + c;
        l = l - fl / dfl;
        fl = a * l * l * l + b * l * l + c * l + d - xp;
        i++;
    }
    return l;
}

export async function getFullUser(user_ids = [], skipped = {}, force_array = false, signal = null, force_alt_data = false) {
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
        const _user = await axios.get(`${GetAPI()}users/full/${id_string}?force_array=${force_array}&${skipQuery}&force_alt_data=${force_alt_data ? 'true' : 'false'}`, { signal: signal });
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

export function getDifficultyColor(rating) {
    if (rating < 0.1) return '#AAAAAA';
    if (rating >= 9) return '#000000';

    //get the color based on a gradient from the hex map
    const colors = ['#4290FB', '#4FC0FF', '#4FFFD5', '#7CFF4F', '#F6F05C', '#FF8068', '#FF4E6F', '#C645B8', '#6563DE', '#18158E', '#000000'];
    const ratingMap = [0.1, 1.25, 2, 2.5, 3.3, 4.2, 4.9, 5.8, 6.7, 7.7, 9];
    let color = '#000000';

    for (let i = 0; i < ratingMap.length; i++) {
        if (rating < ratingMap[i]) {
            color = colors[i];
            break;
        }
    }

    return color;
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

    if (isNaN(value)) {
        return data;
    }

    value = parseInt(value);

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

const STANDARDISED_ACCURACY_PORTION = 0.5;
const STANDARDISED_COMBO_PORTION = 0.5;
export function getLazerScore(score, classic = true) {
    const legacyModMultiplier = getModMultiplier(score.enabled_mods);
    const mul = legacyModMultiplier * 0.96;

    const standardised_acc = (Math.pow((50 * score.count50 + 100 * score.count100 + 300 * score.count300) / (300 * score.count50 + 300 * score.count100 + 300 * score.count300 + 300 * score.countmiss), 5) * 1000000 * STANDARDISED_ACCURACY_PORTION);
    const standardised_combo = (Math.pow(score.combo / score.beatmap.maxcombo, 0.75) * 1000000 * STANDARDISED_COMBO_PORTION);
    const standardised = (standardised_acc + standardised_combo) * mul;

    if (!classic)
        return standardised ?? 0;

    // const lazerscore = Math.round((score.beatmap.objects * score.beatmap.objects) * 36 + 100000 * standardised / (MAX_SCORE * mul))
    const lazerscore = Math.round(36 * Math.pow((standardised / 1000000) * score.beatmap.objects, 2))
    return lazerscore ?? 0;
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

export function calculatePP2020(scores) {
    scores.sort((a, b) => {
        return b.pp_2020.total - a.pp_2020.total;
    });

    var index = 0;
    scores.forEach(score => { if (!score.is_loved && !isNaN(score.pp_2020.total)) { score.pp_2020.weight = Math.pow(0.95, index); index++; } else { score.pp_2020.weight = 0 } });

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
    if (score.beatmap.approved !== 1 && score.beatmap.approved !== 2) {
        return false;
    }

    const maxMissCount = (score.enabled_mods & mods.NF) ? 15 : 30;
    const minCombo = score.beatmap.maxcombo * 0.8;
    const minAcc = (score.enabled_mods & mods.NF) ? 96 : 90;

    if (score.countmiss <= maxMissCount && score.combo > minCombo && score.accuracy > minAcc) {
        return true;
    }

    return false;
}

export function getBonusPerformance(clears) {
    // return 416.6667 * (1 - Math.pow(0.9994, clears));
    return 416.6667 * (1 - Math.pow(0.995, Math.min(1000, clears)));
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

export async function getBeatmap(beatmap_id, mods_enum = null) {
    let beatmap;
    try {
        beatmap = await axios.get(`${GetAPI()}beatmaps/${beatmap_id}${mods_enum && `?mods=${mods_enum}`}`, { headers: { "Access-Control-Allow-Origin": "*" } });
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

export const GRADE_ORDER = ['XH', 'X', 'SH', 'S', 'A', 'B', 'C', 'D'];

export function getGradeColor(grade) {
    switch (grade) {
        default:
            return '#ffffff';
        case 'XH':
            return '#C0C0C0';
        case 'X':
            return '#E8BF3F';
        case 'SH':
            return '#C0C0C0';
        case 'S':
            return '#E8BF3F';
        case 'A':
            return '#72B75D';
        case 'B':
            return '#384699';
        case 'C':
            return '#50367a';
        case 'D':
            return '#7a1f1f';
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

export async function MassCalculatePerformance(scores) {
    // scores.forEach(score => {
    let uniqueSystems = [];
    for await (const score of scores) {
        const recalcs = await Promise.all([
            {
                name: 'live',
                calc: getCalculator('live', { score: score })
            },
            {
                name: 'ss',
                checkRealism: true,
                calc: getCalculator('live', { count300: score.count300 + score.countmiss + score.count100 + score.count50, count100: 0, count50: 0, countmiss: 0, combo: score.beatmap.maxcombo, score: score })
            },
            {
                name: 'fc',
                checkRealism: true,
                calc: getCalculator('live', { count300: score.count300 + score.countmiss, count100: score.count100, count50: score.count50, countmiss: 0, combo: score.beatmap.maxcombo, score: score })
            },
        ]);

        score.recalc = {};
        recalcs.forEach(recalc => {
            score.recalc[recalc.name] = recalc.calc;
            if (!uniqueSystems.includes(recalc.name)) {
                uniqueSystems.push(recalc.name);
            }
        });
    }

    //calculate pp weights
    uniqueSystems.forEach(system => {
        scores.sort((a, b) => {
            return b.recalc[system]?.total - a.recalc[system]?.total;
        });

        let index = 0;
        scores.forEach(score => {
            let valid = true;

            if (system === 'ss' || system === 'fc') { valid = isScoreRealistic(score); }
            valid = valid && (isNaN(score.recalc[system]?.total) ? false : valid);
            valid = valid && (score.beatmap.approved === 1 || score.beatmap.approved === 2);

            if (valid) {
                score.recalc[system].weight = Math.pow(0.95, index);
                index++;
            } else {
                score.recalc[system].weight = 0;
            }
        });
    });

    scores.sort((a, b) => {
        return b.pp - a.pp;
    });
    scores.forEach((score, index) => { score.weight = Math.pow(0.95, index); });

    let data = {};
    data.weighted = {};

    const bonus_pp = getBonusPerformance(scores.length);
    uniqueSystems.forEach(system => {
        data.weighted[system] = 0;
        if (system === 'v1') return;

        scores.forEach(score => {
            if (score.recalc[system].weight && score.recalc[system].total) {
                data.weighted[system] += score.recalc[system].weight * (score.recalc[system].total ?? 0);
            }
        });

        if (system !== 'lazer') {
            data.weighted[system] += bonus_pp;
        }
    });

    //special cases
    return [scores, data];
}

export function FilterScores(full_scores, filter) {
    var scores = [];

    //approved status
    scores = full_scores.filter(score => {
        return filter.approved.includes(score.beatmap.approved);
    });

    //mods
    if (filter.enabled_mods > 0 || filter.enabledMods) {
        scores = scores.filter(score => {
            if (filter.modsUsage === 'any') {
                if (score.enabled_mods === 0 && filter.enabledNomod) {
                    return true;
                }
                return (filter.enabledMods & score.enabled_mods) !== 0;
            }
            if (filter.enabledNomod) {
                return score.enabled_mods === 0;
            }
            return filter.enabledMods === score.enabled_mods;
        });
    }

    //grades
    scores = scores.filter(score => {
        return filter.enabledGrades.includes(score.rank);
    });

    if (filter.minScore !== null && filter.minScore !== '' && filter.minScore >= 0) { scores = scores.filter(score => score.score >= filter.minScore); }
    if (filter.maxScore !== null && filter.maxScore !== '' && filter.maxScore >= 0) { scores = scores.filter(score => score.score <= filter.maxScore); }

    if (filter.minStars !== null && filter.minStars !== '' && filter.minStars >= 0) { scores = scores.filter(score => score.beatmap.modded_sr.star_rating >= filter.minStars); }
    if (filter.maxStars !== null && filter.maxStars !== '' && filter.maxStars >= 0) { scores = scores.filter(score => score.beatmap.modded_sr.star_rating <= filter.maxStars); }

    if (filter.minPP !== null && filter.minPP !== '' && filter.minPP >= 0) { scores = scores.filter(score => score.pp >= filter.minPP); }
    if (filter.maxPP !== null && filter.maxPP !== '' && filter.maxPP >= 0) { scores = scores.filter(score => score.pp <= filter.maxPP); }

    if (filter.minAcc !== null && filter.minAcc !== '' && filter.minAcc >= 0) { scores = scores.filter(score => score.accuracy >= filter.minAcc); }
    if (filter.maxAcc !== null && filter.maxAcc !== '' && filter.maxAcc >= 0) { scores = scores.filter(score => score.accuracy <= filter.maxAcc); }

    if (filter.minCombo !== null && filter.minCombo !== '' && filter.minCombo >= 0) { scores = scores.filter(score => score.combo >= filter.minCombo); }
    if (filter.maxCombo !== null && filter.maxCombo !== '' && filter.maxCombo >= 0) { scores = scores.filter(score => score.combo <= filter.maxCombo); }

    if (filter.minAR !== null && filter.minAR !== '' && filter.minAR >= 0) { scores = scores.filter(score => score.beatmap.modded_sr.modded_ar >= filter.minAR); }
    if (filter.maxAR !== null && filter.maxAR !== '' && filter.maxAR >= 0) { scores = scores.filter(score => score.beatmap.modded_sr.modded_ar <= filter.maxAR); }

    if (filter.minOD !== null && filter.minOD !== '' && filter.minOD >= 0) { scores = scores.filter(score => score.beatmap.modded_sr.modded_od >= filter.minOD); }
    if (filter.maxOD !== null && filter.maxOD !== '' && filter.maxOD >= 0) { scores = scores.filter(score => score.beatmap.modded_sr.modded_od <= filter.maxOD); }

    if (filter.minCS !== null && filter.minCS !== '' && filter.minCS >= 0) { scores = scores.filter(score => score.beatmap.modded_sr.modded_cs >= filter.minCS); }
    if (filter.maxCS !== null && filter.maxCS !== '' && filter.maxCS >= 0) { scores = scores.filter(score => score.beatmap.modded_sr.modded_cs <= filter.maxCS); }

    if (filter.minHP !== null && filter.minHP !== '' && filter.minHP >= 0) { scores = scores.filter(score => score.beatmap.modded_sr.modded_hp >= filter.minHP); }
    if (filter.maxHP !== null && filter.maxHP !== '' && filter.maxHP >= 0) { scores = scores.filter(score => score.beatmap.modded_sr.modded_hp <= filter.maxHP); }

    if (filter.minLength !== null && filter.minLength !== '' && filter.minLength >= 0) { scores = scores.filter(score => score.beatmap.modded_length >= filter.minLength); }
    if (filter.maxLength !== null && filter.maxLength !== '' && filter.maxLength >= 0) { scores = scores.filter(score => score.beatmap.modded_length <= filter.maxLength); }

    scores = scores.filter(score => {
        return moment(score.beatmap.approved_date).isBetween(filter.minApprovedDate, filter.maxApprovedDate, undefined, '[]');
    });

    scores = scores.filter(score => {
        return moment(score.date_played).isBetween(filter.minPlayedDate, filter.maxPlayedDate, undefined, '[]');
    });

    scores.sort(filter._sorter.sort);
    if (filter._sorter.reverse) {
        scores.reverse();
    }

    return {
        scores: scores,
        filter: filter
    }
}