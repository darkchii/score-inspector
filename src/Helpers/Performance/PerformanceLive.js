import { mods } from "../Osu";

export function getPerformanceLive(data, debug = false) {
    const sr_model = 'live';
    const score = data.score;
    data.count300 = data.count300 ?? score.count300;
    data.count100 = data.count100 ?? score.count100;
    data.count50 = data.count50 ?? score.count50;
    data.countmiss = data.countmiss ?? score.countmiss;
    data.combo = data.combo ?? score.combo;
    data.totalhits = data.count300 + data.count100 + data.count50 + data.countmiss;
    data.accuracy = getAccuracy(data);

    data.modded_sr = score.beatmap.modded_sr;
    data.lengthBonus = 0.95 + 0.4 * Math.min(1, data.totalhits / 2000.0) + (data.totalhits > 2000 ? (Math.log10(data.totalhits / 2000.0) * 0.5) : 0.0);
    data.comboScalingFactor = getComboScalingFactor(data.combo, data.score.beatmap.maxcombo);
    data.effectiveMissCount = getEffectiveMissCount(data);
    data.aim = getAimValue(data);
    data.speed = getSpeedValue(data);
    data.acc = getAccuracyValue(data);
    data.flashlight = getFlashlightValue(data);
    data.total = getTotalValue(data);

    data.score = undefined;

    const output = {
        aim: data.aim,
        speed: data.speed,
        acc: data.acc,
        flashlight: data.flashlight,
        total: data.total,
        version: 'live',
        model: sr_model,
        accuracy: data.accuracy,
        count300: data.count300,
        count100: data.count100,
        count50: data.count50,
        countmiss: data.countmiss,
    }

    return output;
}

function getTotalValue(data) {
    if (data.score.enabled_mods & mods.RX || data.score.enabled_mods & mods.AP) {
        return 0;
    }

    var mul = 1.14;

    if ((data.score.enabled_mods & mods.NF) !== 0) {
        mul *= Math.max(0.9, 1.0 - 0.02 * data.effectiveMissCount);
    }

    if ((data.score.enabled_mods & mods.SO) !== 0) {
        mul *= 1.0 - Math.pow(data.score.spinners / data.totalhits, 0.85);
    }

    var total = Math.pow(
        Math.pow(data.aim, 1.1) + Math.pow(data.speed, 1.1) +
        Math.pow(data.acc, 1.1) + Math.pow(data.flashlight, 1.1),
        0.90909090909 // 1.0 / 1.1
    ) * mul;

    return total;
}

function getAimValue(data) {
    var raw_aim = data.modded_sr.aim_diff;

    var aimValue = Math.pow(5.0 * Math.max(1.0, raw_aim * 14.8148148148) - 4.0, 3.0) * 0.00001;

    aimValue *= data.lengthBonus;

    if (data.effectiveMissCount > 0) {
        aimValue *= 0.97 * Math.pow(1.0 - Math.pow(data.effectiveMissCount / data.totalhits, 0.775), data.effectiveMissCount);
    }

    aimValue *= data.comboScalingFactor;

    var approachRateFactor = 0.0;
    if (data.modded_sr.modded_ar > 10.33) {
        approachRateFactor = 0.3 * (data.modded_sr.modded_ar - 10.33);
    } else if (data.modded_sr.modded_ar < 8) {
        approachRateFactor = 0.05 * (8.0 - data.modded_sr.modded_ar);
    }

    aimValue *= 1.0 + approachRateFactor * data.lengthBonus;

    if (data.score.enabled_mods & mods.HD) {
        aimValue *= 1.0 + 0.04 * (12.0 - data.modded_sr.modded_ar);
    }

    var estimateDifficultSliders = data.score.beatmap.sliders * 0.15;

    if (data.score.beatmap.sliders > 0) {
        var estimateSliderEndsDropped = Math.min(Math.max(Math.min(data.count100 + data.count50 + data.countmiss, data.score.beatmap.maxcombo - data.combo), 0.0), estimateDifficultSliders);
        var sliderNerfFactor = (1.0 - data.modded_sr.slider_factor) * Math.pow(1.0 - estimateSliderEndsDropped / estimateDifficultSliders, 3) + data.modded_sr.slider_factor;
        aimValue *= sliderNerfFactor;
    }

    aimValue *= data.accuracy;

    aimValue *= 0.98 + ((data.modded_sr.modded_od * data.modded_sr.modded_od) * 0.0004);
    return aimValue;
}

function getSpeedValue(data) {
    var speedValue = Math.pow(5.0 * Math.max(1.0, data.modded_sr.speed_diff / 0.0675) - 4.0, 3.0) / 100000.0;

    speedValue *= data.lengthBonus;

    if (data.effectiveMissCount > 0) {
        speedValue *= 0.97 * Math.pow(1.0 - Math.pow(data.effectiveMissCount / data.totalhits, 0.775), Math.pow(data.effectiveMissCount, 0.875));
    }

    speedValue *= data.comboScalingFactor;

    var approachRateFactor = 0.0;
    if (data.modded_sr.modded_ar > 10.33) {
        approachRateFactor = 0.3 * (data.modded_sr.modded_ar - 10.33);
    }
    speedValue *= 1.0 + approachRateFactor * data.lengthBonus;

    if ((data.score.enabled_mods & mods.HD) !== 0) {
        speedValue *= (1.0 + 0.04 * (12.0 - data.modded_sr.modded_ar));
    }

    let relevantTotalDiff = data.totalhits - data.modded_sr.speed_note_count;
    let relevantCount300 = Math.max(0.0, data.count300 - relevantTotalDiff);
    let relevantCount100 = Math.max(0.0, data.count100 - Math.max(0.0, relevantTotalDiff - data.count300));
    let relevantCount50 = Math.max(0.0, data.count50 - Math.max(0.0, relevantTotalDiff - data.count300 - data.count100));
    let relevantAccuracy = data.modded_sr.speed_note_count === 0.0 ? 0.0 : (
        (relevantCount300 * 6.0 + relevantCount100 * 2.0 + relevantCount50) / (data.modded_sr.speed_note_count * 6.0)
    )
    speedValue *= (0.95 + (data.modded_sr.modded_od * data.modded_sr.modded_od) / 750.0) * Math.pow((data.accuracy + relevantAccuracy) / 2.0, (14.5 - Math.max(data.modded_sr.modded_od, 8.0)) * 0.5);
    speedValue *= Math.pow(0.99, (data.count50 < data.totalhits * 0.002) ? 0.0 : (data.count50 - data.totalhits * 0.002));

    return speedValue;
}

function getAccuracyValue(data) {
    var betterAccuracyPercentage = 0.0;

    var numHitObjectsWithAccuracy = 0.0;

    if (data.score.enabled_mods & mods.SV2) {
        numHitObjectsWithAccuracy = data.totalhits;
        betterAccuracyPercentage = getAccuracy(data.combo, data.score.beatmap.maxcombo);
    } else {
        numHitObjectsWithAccuracy = data.score.beatmap.circles;
        if (numHitObjectsWithAccuracy > 0) {
            betterAccuracyPercentage = ((data.count300 - (data.totalhits - numHitObjectsWithAccuracy)) * 6 + data.count100 * 2 + data.count50) / (numHitObjectsWithAccuracy * 6);
        }

        if (betterAccuracyPercentage < 0) { betterAccuracyPercentage = 0; }
    }

    var accValue = Math.pow(1.52163, data.modded_sr.modded_od) * Math.pow(betterAccuracyPercentage, 24) * 2.83;
    accValue *= Math.min(1.15, Math.pow(numHitObjectsWithAccuracy * 0.001, 0.3));

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
        var rawFlashlight = data.modded_sr.fl_diff;

        flashlightValue = (rawFlashlight * rawFlashlight) * 25.0;

        if (data.effectiveMissCount > 0) {
            flashlightValue *= 0.97 * Math.pow(1 - Math.pow(data.effectiveMissCount / data.totalhits, 0.775), Math.pow(data.effectiveMissCount, 0.875));
        }

        flashlightValue *= data.comboScalingFactor;

        flashlightValue *= 0.7 + 0.1 * Math.min(1.0, data.totalhits * 0.005) +
            (data.totalhits > 200 ? (0.2 * Math.min(1.0, (data.totalhits - 200) * 0.005)) : 0.0);

        flashlightValue *= (0.5 + data.accuracy / 0.5);
        flashlightValue *= 0.98 + (data.modded_sr.modded_od * data.modded_sr.modded_od) * 0.0004;
    }

    return flashlightValue;
}

function getEffectiveMissCount(data) {
    var comboBasedMissCount = 0.0;

    if (data.score.sliders > 0) {
        var fullComboThreshold = data.score.beatmap.maxcombo - 0.1 * data.score.beatmap.sliders;
        if (data.combo < fullComboThreshold) {
            comboBasedMissCount = fullComboThreshold / Math.max(1, data.score.beatmap.maxcombo);
        }
    }

    comboBasedMissCount = Math.min(comboBasedMissCount, data.count100 + data.count50 + data.countmiss);
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