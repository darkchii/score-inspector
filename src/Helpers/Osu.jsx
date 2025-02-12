/* eslint-disable react-refresh/only-export-components */
// ^^^^ the async functions somehow trigger this eslint rule, so I disabled it for this file

import axios from "axios";
import { GetAPI } from "./Misc";
import { getCalculator } from "./Performance/Performance";
import moment from "moment";
import BADGE_COMPLETIONIST_STANDARD from "../Assets/Completionists/standard.png";
import BADGE_COMPLETIONIST_TAIKO from "../Assets/Completionists/taiko.png";
import BADGE_COMPLETIONIST_CATCH from "../Assets/Completionists/catch.png";
import BADGE_COMPLETIONIST_MANIA from "../Assets/Completionists/mania.png";
import * as d3 from "d3";
import Mods from "./Mods";

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
    } catch (e) {
        console.warn(e);
    }

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
        console.warn(e);
    }

    return user;
}

export async function getUsers(user_ids) {
    let users = [];
    try {
        const _users = await axios.get(`${GetAPI()}users/osu/ids?id[]=${user_ids.join('&id[]=')}`);
        users = _users.data;
    } catch (e) {
        console.warn(e);
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
        console.warn(err);
        return null;
    }
    if (beatmap === undefined || beatmap.data === undefined || beatmap.data.length === 0) {
        throw Error('Beatmap not found');
    }
    return beatmap.data;
}

const STANDARDISED_ACCURACY_PORTION = 0.3;
export function getLazerScore(score) {
    if (Mods.hasMod(score.mods, "CL")) {
        const mul = score.mods.scoreMultiplier;
        if (score.statistics) {
            let accuracyScore = 0;
            Object.keys(score.statistics).forEach(key => { if (affectsAccuracy(key)) { accuracyScore += score.statistics[key] * numericScoreFor(key); } });

            let accuracyScoreMax = 0;
            Object.keys(score.maximum_statistics).forEach(key => { if (affectsAccuracy(key)) { accuracyScoreMax += score.maximum_statistics[key] * numericScoreFor(key); } });
            accuracyScore = accuracyScore / accuracyScoreMax;

            let comboScore = 0;
            Object.keys(score.maximum_statistics).forEach(key => { if (affectsCombo(key)) { comboScore += score.maximum_statistics[key]; } });
            comboScore = score.combo / comboScore;

            let bonusScore = 0;
            Object.keys(score.statistics).forEach(key => { if (isBonus(key)) { bonusScore += score.maximum_statistics[key] * numericScoreFor(key); } });

            return Math.round((1000000 * (STANDARDISED_ACCURACY_PORTION * accuracyScore + (1 - STANDARDISED_ACCURACY_PORTION) * comboScore) + bonusScore) * mul);
        } else {
            const standardised_acc = (Math.pow((50 * score.count50 + 100 * score.count100 + 300 * score.count300) / (300 * score.count50 + 300 * score.count100 + 300 * score.count300 + 300 * score.countmiss), 5) * 1000000 * STANDARDISED_ACCURACY_PORTION);
            const standardised_combo = (Math.pow(score.combo / score.beatmap.maxcombo, 0.75) * 1000000 * (1 - STANDARDISED_ACCURACY_PORTION));
            const standardised = (standardised_acc + standardised_combo) * mul;
            return standardised;
        }

    } else {
        let classic = score.score;
        let objects = score.beatmap.objects;
        let standardised = 1000000 * (classic / (32.57 * (0.1 + Math.pow(objects, 2))));
        return standardised;
    }
}

export function convertToClassic(standardised, objects) {
    return 32.57 * (standardised / 1000000) * (0.1 + Math.pow(objects, 2));
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
    2097152: "RD",
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
    RD: 2097152,
    CI: 4194304,
    TG: 8388608,
    SV2: 536870912,
    MR: 1073741824,
    //THESE ARE NONSENSE FOR NOW, NOT IMPLEMENTED, BUT HERE SO PP CALC IS READY FOR THEM
    //BLINDS
    BL: 16777216,
    //TRACEABLE
    TR: 33554432,
    CL: 67108864,
}

export function isScoreRealistic(score) {
    if (score.beatmap.approved !== 1 && score.beatmap.approved !== 2) {
        return false;
    }

    const maxMissCount = (Mods.hasMod(score.mods, "NF")) ? 15 : 30;
    const minCombo = score.beatmap.maxcombo * 0.8;
    const minAcc = (Mods.hasMod(score.mods, "NF")) ? 96 : 90;

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
        console.warn(err);
        return null;
    }

    return beatmaps;
}

export async function getBeatmap(beatmap_id, mods_enum = null) {
    let beatmap;
    try {
        beatmap = await axios.get(`${GetAPI()}beatmaps/${beatmap_id}${mods_enum && `?mods=${mods_enum}`}`, { headers: { "Access-Control-Allow-Origin": "*" } });
    } catch (err) {
        console.warn(err);
        return null;
    }

    return beatmap?.data;
}

export async function getBeatmapPacks() {
    let beatmapPacks;
    try {
        beatmapPacks = await axios.get(`${GetAPI()}beatmaps/packs`, { headers: { "Access-Control-Allow-Origin": "*" } });
    } catch (err) {
        console.warn(err);
        return null;
    }

    return beatmapPacks?.data;
}

export async function getBeatmapPackDetails() {
    let beatmapPackDetails;
    try {
        beatmapPackDetails = await axios.get(`${GetAPI()}beatmaps/pack_details`, { headers: { "Access-Control-Allow-Origin": "*" } });
    } catch (err) {
        console.warn(err);
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

const difficultyColourSpectrum = d3.scaleLinear()
    .domain([0.1, 1.25, 2, 2.5, 3.3, 4.2, 4.9, 5.8, 6.7, 7.7, 9])
    .clamp(true)
    .range(['#4290FB', '#4FC0FF', '#4FFFD5', '#7CFF4F', '#F6F05C', '#FF8068', '#FF4E6F', '#C645B8', '#6563DE', '#18158E', '#000000'])
    .interpolate(d3.interpolateRgb.gamma(2.2));

export function getDiffColor(rating) {
    if (rating < 0.1) return '#AAAAAA';
    if (rating >= 9) return '#000000';
    return difficultyColourSpectrum(rating);
}

export function computeAccuracy(score) {
    let baseScore = 0;
    Object.keys(score.statistics).forEach(key => {
        if (affectsAccuracy(key)) {
            baseScore += score.statistics[key] * GetBaseScoreForResult(key);
        }
    });
    let maxBaseScore = 0;
    Object.keys(score.maximum_statistics).forEach(key => {
        if (affectsAccuracy(key)) {
            maxBaseScore += score.maximum_statistics[key] * GetBaseScoreForResult(key);
        }
    });

    return maxBaseScore === 0 ? 1 : baseScore / maxBaseScore;
}

function GetBaseScoreForResult(result) {
    switch (result) {
        default:
            return 0;
        case 'small_tick_hit':
            return 10;
        case 'large_tick_hit':
            return 30;
        case 'slider_tail_hit':
            return 150;
        case 'meh':
            return 50;
        case 'ok':
            return 100;
        case 'good':
            return 200;
        case 'great':
        case 'perfect':
            return 300;
        case 'small_bonus':
            return 10;
        case 'large_bonus':
            return 50;
    }
}

function affectsAccuracy(result) {
    switch (result) {
        case "legacy_combo_increase":
            return false;
        case "combo_break":
            return false;
        default:
            return isScorable(result) && !isBonus(result);
    }
}

function affectsCombo(result) {
    switch (result) {
        default:
            return false;
        case "miss":
        case "meh":
        case "ok":
        case "good":
        case "great":
        case "perfect":
        case "large_tick_hit":
        case "small_tick_hit":
        case "legacy_combo_increase":
        case "combo_break":
        case "slider_tail_hit":
            return true;
    }
}

function numericScoreFor(result) {
    switch (result) {
        default:
            return 0;
        case 'small_tick_hit':
            return 10;
        case 'large_tick_hit':
            return 30;
        case 'meh':
            return 50;
        case 'ok':
            return 100;
        case 'good':
            return 200;
        case 'great':
            return 300;
        case 'perfect':
            return 315;
        case 'small_bonus':
            return 10;
        case 'large_bonus':
            return 50;
    }
}

function isBonus(result) {
    switch (result) {
        case "small_bonus":
        case "large_bonus":
            return true;

        default:
            return false;
    }
}

function isScorable(result) {
    switch (result) {
        case "legacy_combo_increase":
            return true;
        case "combo_break":
            return true;
        case "slider_tail_hit":
            return true;
        default:
            return result !== "none" && result !== "ignore_miss";
    }
}

export function getRankFromAccuracy(score, accuracy) {
    if (accuracy === 1) { return isHiddenRank(score.mods) ? 'XH' : 'X'; }
    if (accuracy > 0.95 && score.countmiss === 0) { return isHiddenRank(score.mods) ? 'SH' : 'S'; }
    if (accuracy > 0.90) { return 'A'; }
    if (accuracy > 0.80) { return 'B'; }
    if (accuracy > 0.70) { return 'C'; }
    return 'D';
}

export function isHiddenRank(mods) {
    return Mods.hasMod(mods, "HD") || Mods.hasMod(mods, "FL") || Mods.hasMod(mods, "FI");
}

export function rankCutoffs(is_legacy) {
    let absoluteCutoffs;
    if (is_legacy) {
        absoluteCutoffs = [0, 0.6, 0.8, 0.867, 0.933, 0.99, 1];
    } else {
        absoluteCutoffs = [0, 0.7, 0.8, 0.9, 0.95, 0.99, 1];
    }

    return differenceBetweenConsecutiveElements(absoluteCutoffs);
}

function differenceBetweenConsecutiveElements(arr) {
    const result = [];

    for (let i = 1; i < arr.length; i++) {
        result.push(arr[i] - arr[i - 1]);
    }

    return result;
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
                name: 'live_no_csr',
                calc: getCalculator('no_csr', { score: score })
            },
            {
                name: 'ss',
                checkRealism: true,
                calc: getCalculator('live', {
                    count300: score.count300 + score.countmiss + score.count100 + score.count50,
                    count100: 0,
                    count50: 0,
                    countmiss: 0,
                    combo: score.beatmap.maxcombo,
                    score: score,
                    statistics: score.maximum_statistics ?? null
                })
            },
            {
                name: 'ss_no_csr',
                checkRealism: true,
                calc: getCalculator('no_csr', {
                    count300: score.count300 + score.countmiss + score.count100 + score.count50,
                    count100: 0,
                    count50: 0,
                    countmiss: 0,
                    combo: score.beatmap.maxcombo,
                    score: score,
                    statistics: score.maximum_statistics ?? null
                })
            },
            {
                name: 'fc',
                checkRealism: true,
                calc: getCalculator('live', {
                    count300: score.count300 + score.countmiss,
                    count100: score.count100,
                    count50: score.count50,
                    countmiss: 0,
                    combo: score.beatmap.maxcombo,
                    score: score,
                    statistics: score.maximum_statistics ?? null,
                })
            },
            {
                name: 'fc_no_csr',
                checkRealism: true,
                calc: getCalculator('no_csr', {
                    count300: score.count300 + score.countmiss,
                    count100: score.count100,
                    count50: score.count50,
                    countmiss: 0,
                    combo: score.beatmap.maxcombo,
                    score: score,
                    statistics: score.maximum_statistics ?? null,
                })
            }
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

        data.weighted[system] += bonus_pp;
    });

    //special cases
    return [scores, data];
}

export function FilterScores(full_scores, filter) {
    var scores = [];

    scores = full_scores.filter(score => {
        //do all the filtering here instead of chaining
        if (!filter.approved.includes(score.beatmap.approved)) return false;

        if (filter.enabledMods.length > 0) {
            if (filter.modsUsage === 'any') {
                if (!Mods.hasMods(score.mods, filter.enabledMods)) return false;
            } else {
                if (!Mods.hasExactMods(score.mods, filter.enabledMods)) return false;
            }
        } else {
            if (filter.modsUsage === 'all') {
                if (!Mods.isNoMod(score.mods)) return false;
            }
        }

        if (!filter.enabledGrades.includes(score.rank)) return false;

        if (filter.minScore !== null && filter.minScore !== '' && filter.minScore >= 0) { if (score.score < filter.minScore) return false; }
        if (filter.maxScore !== null && filter.maxScore !== '' && filter.maxScore >= 0) { if (score.score > filter.maxScore) return false; }

        if (filter.minStars !== null && filter.minStars !== '' && filter.minStars >= 0) { if (score.beatmap.difficulty_data.star_rating < filter.minStars) return false; }
        if (filter.maxStars !== null && filter.maxStars !== '' && filter.maxStars >= 0) { if (score.beatmap.difficulty_data.star_rating > filter.maxStars) return false; }

        if (filter.minPP !== null && filter.minPP !== '' && filter.minPP >= 0) { if (score.pp < filter.minPP) return false; }
        if (filter.maxPP !== null && filter.maxPP !== '' && filter.maxPP >= 0) { if (score.pp > filter.maxPP) return false; }

        if (filter.minAcc !== null && filter.minAcc !== '' && filter.minAcc >= 0) { if (score.accuracy < filter.minAcc) return false; }
        if (filter.maxAcc !== null && filter.maxAcc !== '' && filter.maxAcc >= 0) { if (score.accuracy > filter.maxAcc) return false; }

        if (filter.minCombo !== null && filter.minCombo !== '' && filter.minCombo >= 0) { if (score.combo < filter.minCombo) return false; }
        if (filter.maxCombo !== null && filter.maxCombo !== '' && filter.maxCombo >= 0) { if (score.combo > filter.maxCombo) return false; }

        if (filter.minAR !== null && filter.minAR !== '' && filter.minAR >= 0) { if (score.beatmap.difficulty_data.modded_ar < filter.minAR) return false; }
        if (filter.maxAR !== null && filter.maxAR !== '' && filter.maxAR >= 0) { if (score.beatmap.difficulty_data.modded_ar > filter.maxAR) return false; }

        if (filter.minOD !== null && filter.minOD !== '' && filter.minOD >= 0) { if (score.beatmap.difficulty_data.modded_od < filter.minOD) return false; }
        if (filter.maxOD !== null && filter.maxOD !== '' && filter.maxOD >= 0) { if (score.beatmap.difficulty_data.modded_od > filter.maxOD) return false; }

        if (filter.minCS !== null && filter.minCS !== '' && filter.minCS >= 0) { if (score.beatmap.difficulty_data.modded_cs < filter.minCS) return false; }
        if (filter.maxCS !== null && filter.maxCS !== '' && filter.maxCS >= 0) { if (score.beatmap.difficulty_data.modded_cs > filter.maxCS) return false; }

        if (filter.minHP !== null && filter.minHP !== '' && filter.minHP >= 0) { if (score.beatmap.difficulty_data.modded_hp < filter.minHP) return false; }
        if (filter.maxHP !== null && filter.maxHP !== '' && filter.maxHP >= 0) { if (score.beatmap.difficulty_data.modded_hp > filter.maxHP) return false; }

        if (filter.minLength !== null && filter.minLength !== '' && filter.minLength >= 0) { if (score.beatmap.modded_length < filter.minLength) return false; }
        if (filter.maxLength !== null && filter.maxLength !== '' && filter.maxLength >= 0) { if (score.beatmap.modded_length > filter.maxLength) return false; }

        //approved date
        if (filter.minApprovedDate !== null && filter.minApprovedDate !== '' && filter.minApprovedDate >= 0) { if (moment(score.beatmap.approved_date).isBefore(filter.minApprovedDate)) return false; }
        if (filter.maxApprovedDate !== null && filter.maxApprovedDate !== '' && filter.maxApprovedDate >= 0) { if (moment(score.beatmap.approved_date).isAfter(filter.maxApprovedDate)) return false; }

        //played date
        if (filter.minPlayedDate !== null && filter.minPlayedDate !== '' && filter.minPlayedDate >= 0) { if (moment(score.date_played).isBefore(filter.minPlayedDate)) return false; }
        if (filter.maxPlayedDate !== null && filter.maxPlayedDate !== '' && filter.maxPlayedDate >= 0) { if (moment(score.date_played).isAfter(filter.maxPlayedDate)) return false; }

        return true;
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

const XP_POINTS_DISTRIBUTION = {
    SS: 200,
    S: 100,
    A: 50,
    RANKED_SCORE_BILLION: 0.000008,
    TOTAL_SCORE_BILLION: 0.000004,
    MEDAL: 20000,
    PLAYTIME_HOUR: 300
}
export function CalculateNewXP(user, scores) {
    let xp = 0;

    for (const score of scores) {
        if (score.rank === 'X' || score.rank === 'XH') {
            xp += XP_POINTS_DISTRIBUTION.SS;
        } else if (score.rank === 'S' || score.rank === 'SH') {
            xp += XP_POINTS_DISTRIBUTION.S;
        } else if (score.rank === 'A') {
            xp += XP_POINTS_DISTRIBUTION.A;
        }
    }

    xp += user.osu.statistics.ranked_score * XP_POINTS_DISTRIBUTION.RANKED_SCORE_BILLION;
    xp += user.osu.statistics.total_score * XP_POINTS_DISTRIBUTION.TOTAL_SCORE_BILLION;
    xp += (user.alt.medals?.length ?? 0) * XP_POINTS_DISTRIBUTION.MEDAL;
    xp += (user.osu?.statistics.play_time / 3600) * XP_POINTS_DISTRIBUTION.PLAYTIME_HOUR;

    return xp;
}

export function CalculateNewXPLevel(xp) {
    let varA = 5;
    let varB = 80;
    let varC = 225;
    let varD = varC - varB - varA;

    //xp = ax^3+bx^2+cx+d
    //solve for x
    let level = getDedicationLevel(varA, varB, varC, varD, xp);
    return level;
}