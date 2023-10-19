import { mods } from "../Osu";

export function getPerformance2021November(data, debug = false) {
    const sr_model = '2019';
    const score = data.score;
    data.count300 = data.count300 ?? score.count300;
    data.count100 = data.count100 ?? score.count100;
    data.count50 = data.count50 ?? score.count50;
    data.countmiss = data.countmiss ?? score.countmiss;
    data.combo = data.combo ?? score.combo;
    data.totalhits = data.count300 + data.count100 + data.count50 + data.countmiss;
    data.accuracy = getAccuracy(data);

    data.modded_sr = score.beatmap.modded_sr[sr_model] ?? score.beatmap.modded_sr;
    data.modded_sr.slider_factor = score.beatmap.modded_sr['live'].slider_factor;
    data.modded_sr.fl_diff = score.beatmap.modded_sr['live'].fl_diff;
    data.effectiveMissCount = getEffectiveMissCount(data);

    if (score.beatmap.modded_sr[sr_model]) {
        data.aim = getAimValue(data);
        data.speed = getSpeedValue(data);
        data.acc = getAccuracyValue(data);
        data.flashlight = getFlashlightValue(data);
        data.total = getTotalValue(data);
    } else {
        data.aim = 0;
        data.speed = 0;
        data.acc = 0;
        data.total = 0;
    }

    data.score = undefined;

    const output = {
        aim: data.aim,
        speed: data.speed,
        acc: data.acc,
        flashlight: data.flashlight,
        total: data.total,
        version: '2021november',
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

    let mul = 1.12;

    if (data.score.enabled_mods & mods.NF) {
        mul *= 0.90;
    }

    if (data.score.enabled_mods & mods.SO) {
        mul *= 0.95;
    }

    const total = Math.pow(
        Math.pow(data.aim, 1.1) +
        Math.pow(data.speed, 1.1) +
        Math.pow(data.acc, 1.1) +
        Math.pow(data.flashlight, 1.1), 1.0 / 1.1
    ) * mul;

    return total;
}

function getAimValue(data) {
    let raw_aim = data.modded_sr.aim;

    if (data.score.enabled_mods & mods.TD) {
        raw_aim = Math.pow(raw_aim, 0.8);
    }

    let aim = Math.pow(5.0 * Math.max(1.0, raw_aim / 0.0675) - 4.0, 3.0) / 100000.0;

    const amountTotalHits = data.totalhits;

    let lengthBonus = 0.95 + 0.4 * Math.min(1.0, amountTotalHits / 2000.0) +
        (amountTotalHits > 2000 ? (Math.log10(amountTotalHits / 2000.0) * 0.5) : 0.0);

    aim *= lengthBonus;

    if (data.effectiveMissCount > 0) {
        aim *= 0.97 * Math.pow(1 - Math.pow(data.effectiveMissCount / amountTotalHits, 0.775), data.effectiveMissCount);
    }

    let maxCombo = data.score.beatmap.maxcombo;
    if (maxCombo > 0) {
        aim *= Math.min(Math.pow(data.combo, 0.8) / Math.pow(maxCombo, 0.8), 1.0);
    }

    let ar = data.modded_sr.modded_ar;
    let approachRateFactor = 0.0;
    if (ar > 10.33) {
        approachRateFactor = 0.3 * (ar - 10.33);
    } else if (ar < 8) {
        approachRateFactor = 0.1 * (8.0 - ar);
    }

    aim *= 1.0 + approachRateFactor * lengthBonus;

    if (data.score.enabled_mods & mods.HD) {
        aim *= 1.0 + 0.04 * (12.0 - ar);
    }

    let estimateDifficultSliders = data.sliders * 0.15;

    if (data.sliders > 0) {
        let estimateSliderEndsDropped = Math.min(Math.max(Math.min(data.count100 + data.count50 + data.countmiss, data.beatmap.maxcombo - data.maxcombo), 0.0), estimateDifficultSliders);
        let sliderFactor = data.modded_sr.slider_factor;
        let sliderNerfFactor = (1.0 - sliderFactor) * Math.pow(1.0 - estimateSliderEndsDropped / estimateDifficultSliders, 3) + sliderFactor;
        aim *= sliderNerfFactor;
    }

    aim *= 0.5 + getAccuracy(data) / 2.0;

    aim *= 0.98 + ((data.modded_sr.modded_od * data.modded_sr.modded_od) / 2500);

    return aim;
}

function getSpeedValue(data) {
    let speed = Math.pow(5.0 * Math.max(1.0, data.modded_sr.speed / 0.0675) - 4.0, 3.0) / 100000.0;

    const amountTotalHits = data.totalhits;

    let lengthBonus = 0.95 + 0.4 * Math.min(1.0, amountTotalHits / 2000.0) +
        (amountTotalHits > 2000 ? (Math.log10(amountTotalHits / 2000.0) * 0.5) : 0.0);

    speed *= lengthBonus;

    if (data.effectiveMissCount > 0) {
        speed *= 0.97 * Math.pow(1 - Math.pow(data.effectiveMissCount / amountTotalHits, 0.775), Math.pow(data.effectiveMissCount, 0.875));
    }

    let maxCombo = data.score.beatmap.maxcombo;
    if (maxCombo > 0) {
        speed *= Math.min(Math.pow(data.combo, 0.8) / Math.pow(maxCombo, 0.8), 1.0);
    }

    let ar = data.modded_sr.modded_ar;
    let approachRateFactor = 0.0;
    if (ar > 10.33) {
        approachRateFactor = 0.3 * (ar - 10.33);
    }

    speed *= 1.0 + approachRateFactor * lengthBonus;

    if (data.score.enabled_mods & mods.HD) {
        speed *= 1.0 + 0.04 * (12.0 - ar);
    }

    let od = data.modded_sr.modded_od;
    speed *= (0.95 + ((od * od) / 750) * Math.pow(getAccuracy(data), (14.5 - Math.max(od, 8.0)) / 2.0));

    speed *= Math.pow(0.98, data.count50 < amountTotalHits * 0.5 ? 0 : data.count50 - amountTotalHits / 500);

    return speed;
}

function getFlashlightValue(data) {
    if (data.score.enabled_mods & mods.FL) {
        return 0;
    }

    let flash = data.modded_sr.fl;

    if (data.score.enabled_mods & mods.TD) {
        flash = Math.pow(flash, 0.8);
    }

    flash = Math.pow(flash, 2.0) * 25;

    if (data.score.enabled_mods & mods.HD) {
        flash *= 1.3;
    }

    let amountTotalHits = data.totalhits;

    if (data.effectiveMissCount > 0) {
        flash *= 0.97 * Math.pow(1 - Math.pow(data.effectiveMissCount / amountTotalHits, 0.775), Math.pow(data.effectiveMissCount, 0.875));
    }

    let maxCombo = data.score.beatmap.maxcombo;
    if (maxCombo > 0) {
        flash *= Math.min(Math.pow(data.combo, 0.8) / Math.pow(maxCombo, 0.8), 1.0);
    }

    flash *= 0.7 + 0.1 * Math.min(1.0, amountTotalHits / 200.0) +
        ((amountTotalHits > 200 ? 1 : 0) * (0.2 * Math.min(1.0, (amountTotalHits - 200) / 300.0)));

    flash *= 0.5 + getAccuracy(data) / 2.0;
    flash *= 0.98 + ((data.modded_sr.modded_od * data.modded_sr.modded_od) / 2500);

    return flash;
}

function getAccuracyValue(data) {
    let betterAccuracyPercentage = 0;

    let numHitObjectsWithAccuracy = data.score.beatmap.circles;

    if (numHitObjectsWithAccuracy > 0) {
        betterAccuracyPercentage = ((data.count300 - (data.totalhits - numHitObjectsWithAccuracy)) * 6 + data.count100 * 2 + data.count50) / (numHitObjectsWithAccuracy * 6);
    } else {
        betterAccuracyPercentage = 0;
    }

    if (betterAccuracyPercentage < 0) { betterAccuracyPercentage = 0; }

    let acc = Math.pow(1.52163, data.modded_sr.modded_od) * Math.pow(betterAccuracyPercentage, 24) * 2.83;

    acc *= Math.min(1.15, Math.pow(numHitObjectsWithAccuracy / 1000.0, 0.3));

    if (data.score.enabled_mods & mods.HD) {
        acc *= 1.08;
    }

    if (data.score.enabled_mods & mods.FL) {
        acc *= 1.02;
    }

    return acc;
}

function getAccuracy(data) {

    if (data.totalhits === 0) {
        return 0;
    }

    return Math.min(Math.max((data.count50 * 50 + data.count100 * 100 + data.count300 * 300) / (data.totalhits * 300), 0.0), 1.0);
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