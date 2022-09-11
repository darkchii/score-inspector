import axios from "axios";
import { isScoreRealistic } from "./osu";
import config from "./config.json";

export async function getUserTrackerStatus(user_id) {
    const currentlyTracking = await axios.get(`${(!process.env.NODE_ENV || process.env.NODE_ENV === 'development') ? config.OSU_TEST_API : config.OSU_API}proxy/aHR0cHM6Ly9vc3VhbHQucmVzcGVrdGl2ZS5wdy9hcGkvY3VycmVudA==`, { headers: { "Access-Control-Allow-Origin": "*" } });

    if (currentlyTracking.data === undefined || currentlyTracking.data.length === 0) {
        return false;
    }

    const existing = currentlyTracking.data.filter(user => parseInt(user.user_id) === parseInt(user_id));
    if (existing.length > 0) {
        return existing[0];
    }

    return false;
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

export function numToMod(num) {
    let number = parseInt(num)
    let mod_list = []

    if (number & 1 << 0) mod_list.push('NF')
    if (number & 1 << 1) mod_list.push('EZ')
    if (number & 1 << 3) mod_list.push('HD')
    if (number & 1 << 4) mod_list.push('HR')
    if (number & 1 << 5) mod_list.push('SD')
    if (number & 1 << 9) mod_list.push('NC')
    else if (number & 1 << 6) mod_list.push('DT')
    if (number & 1 << 7) mod_list.push('RX')
    if (number & 1 << 8) mod_list.push('HT')
    if (number & 1 << 10) mod_list.push('FL')
    if (number & 1 << 12) mod_list.push('SO')
    if (number & 1 << 14) mod_list.push('PF')
    if (number & 1 << 15) mod_list.push('4 KEY')
    if (number & 1 << 16) mod_list.push('5 KEY')
    if (number & 1 << 17) mod_list.push('6 KEY')
    if (number & 1 << 18) mod_list.push('7 KEY')
    if (number & 1 << 19) mod_list.push('8 KEY')
    if (number & 1 << 20) mod_list.push('FI')
    if (number & 1 << 24) mod_list.push('9 KEY')
    if (number & 1 << 25) mod_list.push('10 KEY')
    if (number & 1 << 26) mod_list.push('1 KEY')
    if (number & 1 << 27) mod_list.push('3 KEY')
    if (number & 1 << 28) mod_list.push('2 KEY')

    return mod_list
}

export function calculatePPifFC(scores) {
    scores.sort((a, b) => {
        if (a.pp_fc.total > b.pp_fc.total) { return -1; }
        if (a.pp_fc.total < b.pp_fc.total) { return 1; }
        return 0;
    });

    var index = 0;
    scores.forEach(score => { if (isScoreRealistic(score) && !isNaN(score.pp_fc.total)) { score.pp_fc.weight = Math.pow(0.95, index); index++; } else { score.pp_fc.weight = 0 } });

    return scores;
}

export function calculatePPifSS(scores) {
    scores.sort((a, b) => {
        if (a.pp_ss.total > b.pp_ss.total) { return -1; }
        if (a.pp_ss.total < b.pp_ss.total) { return 1; }
        return 0;
    });

    var index = 0;
    scores.forEach(score => { if (isScoreRealistic(score) && !isNaN(score.pp_ss.total)) { score.pp_ss.weight = Math.pow(0.95, index); index++; } else { score.pp_ss.weight = 0 } });

    return scores;
}

export function calculatePP2016(scores){
    scores.sort((a, b) => {
        if (a.pp_2016.total > b.pp_2016.total) { return -1; }
        if (a.pp_2016.total < b.pp_2016.total) { return 1; }
        return 0;
    });

    var index = 0;
    scores.forEach(score => { if (!isNaN(score.pp_2016.total)) { score.pp_2016.weight = Math.pow(0.95, index); index++; } else { score.pp_2016.weight = 0 } });
    console.log(scores.slice(0, 100));

    return scores;
}