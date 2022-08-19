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

    const percMiss = 100 / (score.totalhits) * score.countmiss;

    if (score.countmiss <= maxMissCount || score.combo > minCombo || score.accuracy > minAcc) {
        return true;
    }

    return false;
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

export function getPerformance(data) {
    const score = data.score;
    data.count300 = data.count300 ?? score.count300;
    data.count100 = data.count100 ?? score.count100;
    data.count50 = data.count50 ?? score.count50;
    data.countmiss = data.countmiss ?? score.countmiss;
    data.combo = data.combo ?? score.maxcombo;
    data.totalhits = data.count300 + data.count100 + data.count50 + data.countmiss;
    data.accuracy = getAccuracy(data);

    data.effectiveMissCount = getEffectiveMissCount(data);
    data.aim = getAimValue(data);
    data.speed = getSpeedValue(data);
    data.acc = getAccuracyValue(data);
    data.flashlight = getFlashlightValue(data);
    data.total = getTotalValue(data);

    data.score = undefined;

    return data;
}

function getTotalValue(data) {
    if (data.score.enabled_mods & mods.RX || data.score.enabled_mods & mods.AP) {
        return 0;
    }

    var mul = 1.12;

    if ((data.score.enabled_mods & mods.NF) !== 0) {
        mul *= Math.max(0.9, 1.0 - 0.02 * data.effectiveMissCount);
    }

    if ((data.score.enabled_mods & mods.SO) !== 0) {
        mul *= 1.0 - Math.pow(data.score.spinners / data.totalhits, 0.85);
    }

    var total = Math.pow(
        Math.pow(data.aim, 1.1) + Math.pow(data.speed, 1.1) +
        Math.pow(data.acc, 1.1) + Math.pow(data.flashlight, 1.1),
        1.0 / 1.1
    ) * mul;

    return total;
}

function getAimValue(data) {
    var raw_aim = data.score.aim_diff;

    if ((data.score.enabled_mods & mods.TD) !== 0) {
        raw_aim = Math.pow(raw_aim, 0.8);
    }

    var aimValue = Math.pow(5.0 * Math.max(1.0, raw_aim / 0.0675) - 4.0, 3.0) / 100000.0;

    var lengthBonus = 0.95 + 0.4 * Math.min(1, data.totalhits / 2000.0) +
        (data.totalhits > 2000 ? (Math.log10(data.totalhits / 2000.0) * 0.5) : 0.0);

    aimValue *= lengthBonus;

    if (data.effectiveMissCount > 0) {
        aimValue *= 0.97 * Math.pow(1.0 - Math.pow(data.effectiveMissCount / data.totalhits, 0.775), data.effectiveMissCount);
    }

    aimValue *= getComboScalingFactor(data.combo, data.score.maxcombo);

    var approachRateFactor = 0.0;
    if (data.score.modded_ar > 10.33) {
        approachRateFactor = 0.3 * (data.score.modded_ar - 10.33);
    } else if (data.score.modded_ar < 8) {
        approachRateFactor = 0.1 * (8.0 - data.score.modded_ar);
    }

    aimValue *= 1.0 + approachRateFactor * lengthBonus;

    if (data.score.enabled_mods & mods.HD) {
        aimValue *= 1.0 + 0.04 * (12.0 - data.score.modded_ar);
    }

    var estimateDifficultSliders = data.score.sliders * 0.15;

    if (data.score.sliders > 0) {
        var estimateSliderEndsDropped = Math.min(Math.max(Math.min(data.count100 + data.count50 + data.countmiss, data.score.maxcombo - data.combo), 0.0), estimateDifficultSliders);
        var sliderNerfFactor = (1.0 - data.score.slider_factor) * Math.pow(1.0 - estimateSliderEndsDropped / estimateDifficultSliders, 3) + data.score.slider_factor;
        aimValue *= sliderNerfFactor;
    }

    aimValue *= getAccuracy(data);

    aimValue *= 0.98 + (Math.pow(data.score.modded_od, 2) / 2500.0);
    return aimValue;
}

function getSpeedValue(data) {
    var speedValue = Math.pow(5.0 * Math.max(1.0, data.score.speed_diff / 0.0675) - 4.0, 3.0) / 100000.0;
    // console.log("TEST SPEED: "+speedValue);

    var lengthBonus = 0.95 + 0.4 * Math.min(1, data.totalhits / 2000.0) +
        (data.totalhits > 2000 ? (Math.log10(data.totalhits / 2000.0) * 0.5) : 0.0);

    speedValue *= lengthBonus;
    // console.log("TEST SPEED LENGTH: "+speedValue);

    if (data.effectiveMissCount > 0) {
        speedValue *= 0.97 * Math.pow(1.0 - Math.pow(data.effectiveMissCount / data.totalhits, 0.775), Math.pow(data.effectiveMissCount, 0.875));
    }
    // console.log("TEST SPEED MISS: "+speedValue);

    speedValue *= getComboScalingFactor(data.combo, data.score.maxcombo);
    // console.log("TEST SPEED COMBO: "+speedValue);

    var approachRateFactor = 0.0;
    if (data.score.modded_ar > 10.33) {
        approachRateFactor = 0.3 * (data.score.modded_ar - 10.33);
    }
    speedValue *= 1.0 + approachRateFactor * lengthBonus;
    // console.log("TEST SPEED AR: "+speedValue);

    if ((data.score.enabled_mods & mods.HD) !== 0) {
        speedValue *= (1.0 + 0.04 * (12 - data.score.modded_ar));
    }
    // console.log("TEST SPEED HD: "+speedValue);

    speedValue *= (0.95 + Math.pow(data.score.modded_od, 2) / 750) * Math.pow(getAccuracy(data), (14.5 - Math.max(data.score.modded_od, 8.0)) / 2);
    // console.log("TEST SPEED OD: "+speedValue);
    speedValue *= Math.pow(0.98, (data.count50 < data.totalhits / 500) ? 0.0 : (data.count50 - data.totalhits / 500));
    // console.log("TEST SPEED #50: "+speedValue);

    return speedValue;
}

function getAccuracyValue(data) {
    var betterAccuracyPercentage = 0.0;

    var numHitObjectsWithAccuracy = 0.0;

    if (data.score.enabled_mods & mods.SV2) {
        numHitObjectsWithAccuracy = data.totalhits;
        betterAccuracyPercentage = getAccuracy(data.combo, data.score.maxcombo);
    } else {
        numHitObjectsWithAccuracy = data.score.circles;
        if (numHitObjectsWithAccuracy > 0) {
            betterAccuracyPercentage = ((data.count300 - (data.totalhits - numHitObjectsWithAccuracy)) * 6 + data.count100 * 2 + data.count50) / (numHitObjectsWithAccuracy * 6);
        }

        if (betterAccuracyPercentage < 0) { betterAccuracyPercentage = 0; }
    }

    var accValue = Math.pow(1.52163, data.score.modded_od) * Math.pow(betterAccuracyPercentage, 24) * 2.83;
    accValue *= Math.min(1.15, Math.pow(numHitObjectsWithAccuracy / 1000.0, 0.3));

    if ((data.score.enabled_mods & mods.HD) !== 0) {
        accValue *= 1.08;
    }

    if ((data.score.enabled_mods & mods.FL) !== 0) {
        accValue *= 1.02;
    }

    return accValue;
}

function getFlashlightValue(data) {
    var flashlightValue = 0;

    if ((data.score.enabled_mods & mods.FL) !== 0) {
        var rawFlashlight = data.score.fl_diff;

        if ((data.score.enabled_mods & mods.TD) !== 0) {
            rawFlashlight = Math.pow(rawFlashlight, 0.8);
        }

        flashlightValue = Math.pow(rawFlashlight, 2.0) * 25.0;

        if (data.effectiveMissCount > 0) {
            flashlightValue *= 0.97 * Math.pow(1 - Math.pow(data.effectiveMissCount / data.totalhits, 0.775), Math.pow(data.effectiveMissCount, 0.875));
        }

        flashlightValue *= getComboScalingFactor(data.combo, data.score.maxcombo);

        flashlightValue *= 0.7 + 0.1 * Math.min(1.0, data.totalhits / 200) +
            (data.totalhits > 200 ? (0.2 * Math.min(1.0, (data.totalhits - 200) / 200)) : 0.0);

        flashlightValue *= (0.5 + getAccuracy(data) / 2.0);
        flashlightValue *= 0.98 + Math.pow(data.score.modded_od, 2.0) / 2500.0;
    }

    return flashlightValue;
}

function getEffectiveMissCount(data) {
    var comboBasedMissCount = 0.0;

    if (data.score.sliders > 0) {
        var fullComboThreshold = data.score.maxcombo - 0.1 * data.score.sliders;
        if (data.combo < fullComboThreshold) {
            comboBasedMissCount = fullComboThreshold / Math.max(1, data.score.maxcombo);
        }
    }

    comboBasedMissCount = Math.min(comboBasedMissCount, data.totalhits);
    return Math.max(data.countmiss, comboBasedMissCount);
}

function getAccuracy(data) {

    if (data.totalhits === 0) {
        return 0;
    }

    if (data.accuracy !== undefined) {
        return data.accuracy;
    }

    return Math.min(Math.max((data.count50 * 50 + data.count100 * 100 + data.count300 * 300) / (data.totalhits * 300), 0.0), 1.0);
}

function getComboScalingFactor(score_combo, beatmap_combo) {
    if (beatmap_combo > 0) {
        return Math.min(Math.pow(score_combo, 0.8) / Math.pow(beatmap_combo, 0.8), 1.0);
    }
    return 1.0;
}