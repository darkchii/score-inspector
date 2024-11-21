import { clamp } from "lodash";
import { mods } from "../Osu";

const PERFORMANCE_BASE_MULTIPLIER = 1.15;

export function getPerformanceLive(data, debug = false) {
    const sr_model = 'live';
    const score = data.score;
    data.usingClassicSliderAccuracy = true; //osualt only has classic scores for now
    data.countGreat = data.count300 ?? score.count300;
    data.countOk = data.count100 ?? score.count100;
    data.countMeh = data.count50 ?? score.count50;
    data.countMiss = data.countmiss ?? score.countmiss;
    data.countSliderEndsDropped = 0; //osualt only has classic scores for now
    data.countSliderTickMiss = 0; //osualt only has classic scores for now
    data.combo = data.combo ?? score.combo;
    data.maxCombo = score.beatmap.maxcombo;
    data.totalHits = data.countGreat + data.countOk + data.countMeh + data.countMiss;
    data.accuracy = score.accuracy * 0.01;
    data.sliderCount = score.beatmap.sliders;
    data.effectiveMissCount = 0;
    data.totalImperfectHits = data.countOk + data.countMeh + data.countMiss;
    data.difficulty_data = score.beatmap.difficulty_data;

    if (data.difficulty_data) {
        if (data.sliderCount > 0) {
            if (data.usingClassicSliderAccuracy) {
                let fullComboThreshold = data.maxCombo - 0.1 * data.sliderCount;
                if (data.combo < fullComboThreshold)
                    data.effectiveMissCount = fullComboThreshold / Math.max(1, data.combo);
                data.effectiveMissCount = Math.min(data.effectiveMissCount, data.totalImperfectHits);
            } else {
                let fullComboThreshold = data.maxCombo - data.countSliderEndsDropped;
                if (data.combo < fullComboThreshold)
                    data.effectiveMissCount = data.maxCombo - data.countSliderEndsDropped;
                data.effectiveMissCount = Math.min(data.effectiveMissCount, data.countSliderTickMiss + data.countMiss);
            }
        }
        data.effectiveMissCount = Math.max(data.countMiss, data.effectiveMissCount);
        data.effectiveMissCount = Math.min(data.totalHits, data.effectiveMissCount);

        data.multiplier = PERFORMANCE_BASE_MULTIPLIER;

        if (data.score.mods.hasMod(mods.NF)) {
            data.multiplier *= Math.max(0.9, 1.0 - 0.02 * data.effectiveMissCount);
        }

        if (data.score.mods.hasMod(mods.SO) && data.totalHits > 0) {
            data.multiplier *= 1.0 - Math.pow(data.score.beatmap.spinners / data.totalHits, 0.85);
        }

        if (data.score.mods.hasMod(mods.RX)) {
            let okMultiplier = Math.max(0.0, data.difficulty_data.od > 0 ? 1 - Math.pow(data.difficulty_data.od / 13.33, 1.8) : 1);
            let mehMultiplier = Math.max(0.0, data.difficulty_data.od > 0 ? 1 - Math.pow(data.difficulty_data.od / 13.33, 5) : 1);

            data.effectiveMissCount = Math.min(data.effectiveMissCount + data.countOk * okMultiplier + data.countMeh * mehMultiplier, data.totalHits);
        }

        data.aim = getAimValue(data);
        data.speed = getSpeedValue(data);
        data.acc = getAccuracyValue(data);
        data.flashlight = getFlashlightValue(data);
        data.total = getTotalValue(data);
    }

    data.score = undefined;

    const output = {
        aim: data.aim ?? 0,
        speed: data.speed ?? 0,
        acc: data.acc ?? 0,
        flashlight: data.flashlight ?? 0,
        total: data.total ?? 0,
        version: 'live',
        model: sr_model,
        accuracy: data.accuracy,
        count300: data.countGreat,
        count100: data.countOk,
        count50: data.countMeh,
        countmiss: data.countMiss,
    }

    return output;
}

function getTotalValue(data) {
    let totalValue =
        Math.pow(data.aim, 1.1) +
        Math.pow(data.speed, 1.1) +
        Math.pow(data.acc, 1.1) +
        Math.pow(data.flashlight, 1.1);

    totalValue = Math.pow(totalValue, 1 / 1.1);

    totalValue *= data.multiplier;

    return totalValue;
}

function getAimValue(data) {
    let aimValue = difficultyToPerformance(data.difficulty_data.diff_aim);

    let lengthBonus = 0.95 + 0.4 * Math.min(1, data.totalHits / 2000.0) + (data.totalHits > 2000 ? Math.log10(data.totalHits / 2000.0) * 0.5 : 0.0);

    aimValue *= lengthBonus;

    if (data.effectiveMissCount > 0)
        aimValue *= calculateMissPenalty(data.effectiveMissCount, data.difficulty_data.aim_difficult_strain_count);

    let approachRateFactor = 0.0;
    if (data.difficulty_data.ar > 10.33)
        approachRateFactor = 0.3 * (data.difficulty_data.ar - 10.33);
    else if (data.difficulty_data.ar < 8.0)
        approachRateFactor = 0.05 * (8.0 - data.difficulty_data.ar);

    if (data.score.mods.hasMod(mods.RX))
        approachRateFactor = 0.0;

    aimValue *= 1.0 + approachRateFactor * lengthBonus;

    if (data.score.mods.hasMod(mods.BL))
        aimValue *= 1.3 + (data.totalHits * (0.0016 / (1 + 2 * data.effectiveMissCount)) * Math.pow(data.accuracy, 16)) * (1 - 0.003 * data.difficulty_data.modded_hp * data.difficulty_data.modded_hp);
    else if (data.score.mods.hasMod(mods.HD) || data.score.mods.hasMod(mods.TR))
        aimValue *= 1.0 + 0.04 * (12.0 - data.difficulty_data.ar);

    let estimateDifficultSliders = data.sliderCount * 0.15;

    if (data.sliderCount > 0) {
        let estimateImproperlyFollowedDifficultSliders;

        if (data.usingClassicSliderAccuracy) {
            let maximumPossibleDroppedSliders = data.totalImperfectHits;
            estimateImproperlyFollowedDifficultSliders = clamp(Math.min(maximumPossibleDroppedSliders, data.maxCombo - data.combo), 0, estimateDifficultSliders);
        } else {
            estimateImproperlyFollowedDifficultSliders = clamp(data.countSliderEndsDropped + data.countSliderTickMiss, 0, estimateDifficultSliders);
        }

        let sliderNerfFactor = (1 - data.difficulty_data.slider_factor) * Math.pow(1 - estimateImproperlyFollowedDifficultSliders / estimateDifficultSliders, 3) + data.difficulty_data.slider_factor;
        aimValue *= sliderNerfFactor;
    }

    aimValue *= data.accuracy;
    aimValue *= 0.98 + Math.pow(data.difficulty_data.od, 2) * 0.0004;

    return aimValue;
}

function getSpeedValue(data) {
    if (data.score.mods.hasMod(mods.RX)) {
        return 0;
    }

    let speedValue = difficultyToPerformance(data.difficulty_data.diff_speed);
    let lengthBonus = 0.95 + 0.4 * Math.min(1, data.totalHits / 2000.0) + (data.totalHits > 2000 ? Math.log10(data.totalHits / 2000.0) * 0.5 : 0.0);
    speedValue *= lengthBonus;

    if (data.effectiveMissCount > 0) {
        speedValue *= calculateMissPenalty(data.effectiveMissCount, data.difficulty_data.speed_difficult_strain_count);
    }

    let approachRateFactor = 0.0;
    if (data.difficulty_data.ar > 10.33)
        approachRateFactor = 0.3 * (data.difficulty_data.ar - 10.33);

    speedValue *= 1.0 + approachRateFactor * lengthBonus;

    if (data.score.mods.hasMod(mods.BL))
        speedValue *= 1.12;
    else if (data.score.mods.hasMod(mods.HD) || data.score.mods.hasMod(mods.TR))
        speedValue *= 1.0 + 0.04 * (12.0 - data.difficulty_data.ar);

    let relevantTotalDiff = data.totalHits - data.difficulty_data.speed_note_count;
    let relevantCountGreat = Math.max(0.0, data.countGreat - relevantTotalDiff);
    let relevantCountOk = Math.max(0.0, data.countOk - Math.max(0.0, relevantTotalDiff - data.countGreat));
    let relevantCountMeh = Math.max(0.0, data.countMeh - Math.max(0.0, relevantTotalDiff - data.countGreat - data.countOk));
    let relevantAccuracy = data.difficulty_data.speed_note_count === 0.0 ? 0.0 : (
        (relevantCountGreat * 6.0 + relevantCountOk * 2.0 + relevantCountMeh) / (data.difficulty_data.speed_note_count * 6.0)
    );

    speedValue *= (0.95 + Math.pow(data.difficulty_data.od, 2) / 750.0) * Math.pow((data.accuracy + relevantAccuracy) / 2.0, (14.5 - data.difficulty_data.od) * 0.5);

    speedValue *= Math.pow(0.99, data.countMeh < data.totalHits / 500 ? 0.0 : data.countMeh - data.totalHits / 500);

    return speedValue;
}

function getAccuracyValue(data) {
    if (data.score.mods.hasMod(mods.RX)) {
        return 0;
    }

    let betterAccuracyPercentage;
    let amountHitObjectsWithAccuracy = data.score.beatmap.circles;
    if (!data.usingClassicSliderAccuracy)
        amountHitObjectsWithAccuracy += data.score.beatmap.sliders;

    if (amountHitObjectsWithAccuracy > 0)
        betterAccuracyPercentage = ((data.countGreat - (data.totalHits - amountHitObjectsWithAccuracy)) * 6 + data.countOk * 2 + data.countMeh) / (amountHitObjectsWithAccuracy * 6);
    else
        betterAccuracyPercentage = 0;

    if (betterAccuracyPercentage < 0)
        betterAccuracyPercentage = 0;

    let accuracyValue = Math.pow(1.52163, data.difficulty_data.od) * Math.pow(betterAccuracyPercentage, 24) * 2.83;
    accuracyValue *= Math.min(1.15, Math.pow(amountHitObjectsWithAccuracy * 0.001, 0.3));

    if (data.score.mods.hasMod(mods.BL))
        accuracyValue *= 1.14;
    else if (data.score.mods.hasMod(mods.HD) || data.score.mods.hasMod(mods.TR))
        accuracyValue *= 1.08;

    if (data.score.mods.hasMod(mods.FL))
        accuracyValue *= 1.02;

    return accuracyValue;
}

function getFlashlightValue(data) {
    if (!data.score.mods.hasMod(mods.FL))
        return 0;

    let flashlightValue = (25 * Math.pow(data.difficulty_data.flashlight_rating, 2));

    if (data.effectiveMissCount > 0)
        flashlightValue *= 0.97 * Math.pow(1 - Math.pow(data.effectiveMissCount / data.totalHits, 0.775), Math.pow(data.effectiveMissCount, 0.875));

    flashlightValue *= getComboScalingFactor(data);

    flashlightValue *= 0.7 + 0.1 * Math.min(1.0, data.totalHits / 200) + (data.totalHits > 200 ? 0.2 * Math.min(1.0, (data.totalHits - 200) / 200) : 0.0);

    flashlightValue *= 0.5 + data.accuracy / 2.0;
    flashlightValue *= 0.98 + Math.pow(data.difficulty_data.od, 2) / 2500;

    return flashlightValue;
}

function getComboScalingFactor(data) {
    return data.maxCombo <= 0 ? 1 : Math.min(1, Math.pow(data.combo, 0.8) / Math.pow(data.maxCombo, 0.8));
}

function difficultyToPerformance(difficulty) {
    return Math.pow(5 * Math.max(1, difficulty / 0.0675) - 4, 3) / 100000;
}

function calculateMissPenalty(missCount, difficultStrainCount) {
    return 0.96 / ((missCount / (4 * Math.pow(Math.log(difficultStrainCount), 0.94))) + 1);
}