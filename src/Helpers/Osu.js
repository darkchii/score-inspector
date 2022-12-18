import axios from "axios";
import config from "../config.json";

export function getAPIURL() {
    return (config.USE_DEV_API) ? config.OSU_TEST_API : config.OSU_API;
}

export async function getUser(user_id) {
    let user = null;
    try {
        const _user = await axios.get(`${getAPIURL()}users/${user_id}`);
        user = _user.data;
    } catch (e) {
    }

    try {
        let _scoreRank = await fetch(`${config.SCORE_API}${user.id}`).then((res) => res.json());
        if (_scoreRank !== undefined) {
            user.scoreRank = _scoreRank[0].rank;
        }
    } catch (err) {
        return null;
    }

    try {
        let _dailyUser = await axios.get(`${getAPIURL()}daily/${user.id}`, { headers: { "Access-Control-Allow-Origin": "*" } });
        if (_dailyUser !== undefined && _dailyUser.data.error === undefined) {
            user.daily = _dailyUser.data;
        }
    } catch (err) {
        user.daily = null;
    }


    return user;
}

const osustats_api = 'https://osustats.respektive.pw/counts/';
export async function getUserLeaderboardStats(id) {
    let _stats = null;
    try {
        const url = `${osustats_api}${id}`;
        const res = await axios.get(url, { headers: { "Access-Control-Allow-Origin": "*" } });
        _stats = res.data;
    } catch (err) {
        return null;
    }
    return _stats;
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
        const url = `${getAPIURL()}beatmaps/${beatmap_id}/maxscore`;
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
        300000) + ((score.combo / score.maxcombo) * 700000)) * mul);

    if (classic) {
        val = Math.pow(((val / MAX_SCORE) * score.objects), 2) * 36;
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