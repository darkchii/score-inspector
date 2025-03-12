import { clamp } from "lodash";
import Mods from "../Mods";
import OsuHitWindows from "./Standard/OsuHitWindows";
import HitResult from "./HitResult";
import BeatmapDifficultyInfo from "./BeatmapDifficultyInfo";
import { erf } from "mathjs";
import DifficultyCalculationUtils from "./DifficultyCalculationUtils";

const PERFORMANCE_BASE_MULTIPLIER = 1.15;

export function getPerformanceLive(data, combo_scaling_removal = true) {
    const sr_model = 'live';
    const score = data.score;
    data.statistics = data.statistics ?? score.statistics;
    data.maximum_statistics = data.maximum_statistics ?? score.maximum_statistics;
    // data.usingClassicSliderAccuracy = Mods.hasMod(data.score.mods, "CL");
    data.usingClassicSliderAccuracy = false;
    if (Mods.hasMod(data.score.mods, "CL")) {
        if (!Mods.containsSetting(data.score.mods, 'no_slider_head_accuracy') || Mods.getSetting(data.score.mods, 'no_slider_head_accuracy') === false)
            data.usingClassicSliderAccuracy = true;
    }
    data.countGreat = data.count300 ?? score.count300;
    data.countOk = data.count100 ?? score.count100;
    data.countMeh = data.count50 ?? score.count50;
    data.countMiss = data.countmiss ?? score.countmiss;
    data.combo = data.combo ?? score.combo;
    data.maxCombo = score.beatmap.maxcombo;
    data.sliderCount = score.beatmap.sliders;
    data.totalHits = data.countGreat + data.countOk + data.countMeh + data.countMiss;
    data.accuracy = score.accuracy * 0.01;
    data.effectiveMissCount = data.countMiss;
    data.totalImperfectHits = data.countOk + data.countMeh + data.countMiss;
    data.totalSuccessFullHits = data.countGreat + data.countOk + data.countMeh;
    data.difficulty_data = score.beatmap.difficulty;

    data.countSliderEndsDropped = 0;
    data.countSliderTickMiss = 0;

    if (data.statistics) {
        // data.countSliderEndsDropped = (data.beatmaps.slider - data.statistics.slider_tail_hit) ?? 0;
        data.countSliderEndsDropped = data.statistics.slider_tail_hit ? (data.sliderCount - data.statistics.slider_tail_hit) : 0;
        data.countSliderTickMiss = (data.statistics.large_tick_miss ?? 0);
    }

    if (data.difficulty_data) {
        let clockRate = Mods.getClockRate(data.score.mods);
        data.hitWindows = new OsuHitWindows();
        data.hitWindows.SetDifficulty(data.difficulty_data.overall_difficulty);

        data.greatHitWindow = data.hitWindows.WindowFor(HitResult.Great) / clockRate;
        data.okHitWindow = data.hitWindows.WindowFor(HitResult.Ok) / clockRate;
        data.mehHitWindow = data.hitWindows.WindowFor(HitResult.Meh) / clockRate;

        let preempt = BeatmapDifficultyInfo.DifficultyRange(data.difficulty_data.approach_rate, 1800, 1200, 450) / clockRate;

        data.overallDifficulty = (80 - data.greatHitWindow) / 6;
        data.approachRate = preempt > 1200 ? (1800 - preempt) / 120 : (1200 - preempt) / 150 + 5;

        if (data.sliderCount > 0) {
            if (data.usingClassicSliderAccuracy) {
                let fullComboThreshold = data.maxCombo - 0.1 * data.sliderCount;
                if (data.combo < fullComboThreshold)
                    data.effectiveMissCount = fullComboThreshold / Math.max(1, data.combo);
                data.effectiveMissCount = Math.min(data.effectiveMissCount, data.totalImperfectHits);
            } else {
                let fullComboThreshold = data.maxCombo - data.countSliderEndsDropped;
                if (data.combo < fullComboThreshold)
                    data.effectiveMissCount = fullComboThreshold / Math.max(1, data.combo);
                data.effectiveMissCount = Math.min(data.effectiveMissCount, data.countSliderTickMiss + data.countMiss);
            }
        }
        data.effectiveMissCount = Math.max(data.countMiss, data.effectiveMissCount);
        data.effectiveMissCount = Math.min(data.totalHits, data.effectiveMissCount);


        data.multiplier = PERFORMANCE_BASE_MULTIPLIER;

        if (Mods.hasMod(data.score.mods, "NF")) {
            data.multiplier *= Math.max(0.9, 1.0 - 0.02 * data.effectiveMissCount);
        }

        if (Mods.hasMod(data.score.mods, "SO") && data.totalHits > 0) {
            data.multiplier *= 1.0 - Math.pow(data.score.beatmap.spinners / data.totalHits, 0.85);
        }

        if (Mods.hasMod(data.score.mods, "RX")) {
            let okMultiplier = Math.max(0.0, data.overallDifficulty > 0 ? 1 - Math.pow(data.overallDifficulty / 13.33, 1.8) : 1);
            let mehMultiplier = Math.max(0.0, data.overallDifficulty > 0 ? 1 - Math.pow(data.overallDifficulty / 13.33, 5) : 1);

            data.effectiveMissCount = Math.min(data.effectiveMissCount + data.countOk * okMultiplier + data.countMeh * mehMultiplier, data.totalHits);
        }

        data.speedDeviation = calculateSpeedDeviation(data);

        data.aim = getAimValue(data, combo_scaling_removal);
        data.speed = getSpeedValue(data, combo_scaling_removal);
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
        hitWindows: data.hitWindows,
        greatHitWindow: data.greatHitWindow,
        okHitWindow: data.okHitWindow,
        mehHitWindow: data.mehHitWindow,
        speedDeviation: data.speedDeviation,
        usingClassicSliderAccuracy: data.usingClassicSliderAccuracy,
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

function getAimValue(data, combo_scaling_removal = true) {
    if (Mods.hasMod(data.score.mods, "AP")) {
        return 0;
    }

    let aimDifficulty = data.difficulty_data.aim_difficulty;

    let aim_difficult_slider_count = data.difficulty_data.aim_difficult_slider_count;
    if(!data.difficulty_data.aim_difficult_slider_count){
        aim_difficult_slider_count = data.sliderCount * 0.15;
    }

    if (data.sliderCount > 0 && aim_difficult_slider_count > 0) {
        let estimateImproperlyFollowedDifficultSliders;

        if (data.usingClassicSliderAccuracy) {
            let maximumPossibleDroppedSliders = data.totalImperfectHits;
            estimateImproperlyFollowedDifficultSliders = clamp(Math.min(maximumPossibleDroppedSliders, data.maxCombo - data.combo), 0, aim_difficult_slider_count);
        } else {
            estimateImproperlyFollowedDifficultSliders = clamp(data.countSliderEndsDropped + data.countSliderTickMiss, 0, aim_difficult_slider_count);
        }

        let sliderNerfFactor = (1 - data.difficulty_data.slider_factor) * Math.pow(1 - estimateImproperlyFollowedDifficultSliders / aim_difficult_slider_count, 3) + data.difficulty_data.slider_factor;
        aimDifficulty *= sliderNerfFactor;
    }

    let aimValue = difficultyToPerformance(aimDifficulty);

    let lengthBonus = 0.95 + 0.4 * Math.min(1, data.totalHits / 2000.0) +
        (data.totalHits > 2000 ? Math.log10(data.totalHits / 2000.0) * 0.5 : 0.0);

    aimValue *= lengthBonus;

    if (data.effectiveMissCount > 0) {
        if (combo_scaling_removal)
            aimValue *= calculateMissPenalty(data.effectiveMissCount, data.difficulty_data.aim_difficult_strain_count);
        else
            aimValue *= 0.97 * Math.pow(1 - Math.pow(data.effectiveMissCount / data.totalHits, 0.775), data.effectiveMissCount);
    }

    if (!combo_scaling_removal) {
        aimValue *= getComboScalingFactor(data);
    }

    let approachRateFactor = 0.0;
    if (data.approachRate > 10.33)
        approachRateFactor = 0.3 * (data.approachRate - 10.33);
    else if (data.approachRate < 8.0)
        approachRateFactor = 0.05 * (8.0 - data.approachRate);

    if (Mods.hasMod(data.score.mods, "RX"))
        approachRateFactor = 0.0;

    aimValue *= 1.0 + approachRateFactor * lengthBonus;

    if (Mods.hasMod(data.score.mods, "BL"))
        aimValue *= 1.3 + (data.totalHits * (0.0016 / (1 + 2 * data.effectiveMissCount)) * Math.pow(data.accuracy, 16)) * (1 - 0.003 * data.difficulty_data.drain_rate * data.difficulty_data.drain_rate);
    else if (Mods.hasMod(data.score.mods, "HD") || Mods.hasMod(data.score.mods, "TC"))
        aimValue *= 1.0 + 0.04 * (12.0 - data.approachRate);

    aimValue *= data.accuracy;
    aimValue *= 0.98 + Math.pow(data.overallDifficulty, 2) / 2500;

    return aimValue;
}

function getSpeedValue(data, combo_scaling_removal = true) {
    if (Mods.hasMod(data.score.mods, "RX") || data.speedDeviation === null) {
        return 0;
    }

    let speedValue = difficultyToPerformance(data.difficulty_data.speed_difficulty);
    let lengthBonus = 0.95 + 0.4 * Math.min(1, data.totalHits / 2000.0) + (data.totalHits > 2000 ? Math.log10(data.totalHits / 2000.0) * 0.5 : 0.0);
    speedValue *= lengthBonus;

    if (data.effectiveMissCount > 0) {
        if (combo_scaling_removal)
            speedValue *= calculateMissPenalty(data.effectiveMissCount, data.difficulty_data.speed_difficult_strain_count);
        else
            speedValue *= 0.97 * Math.pow(1 - Math.pow(data.effectiveMissCount / data.totalHits, 0.775), Math.pow(data.effectiveMissCount, 0.875));
    }

    if (!combo_scaling_removal) {
        speedValue *= getComboScalingFactor(data);
    }

    let approachRateFactor = 0.0;
    if (data.approachRate > 10.33)
        approachRateFactor = 0.3 * (data.approachRate - 10.33);

    speedValue *= 1.0 + approachRateFactor * lengthBonus;

    if (Mods.hasMod(data.score.mods, "BL"))
        speedValue *= 1.12;
    else if (Mods.hasMod(data.score.mods, "HD") || Mods.hasMod(data.score.mods, "TC"))
        speedValue *= 1.0 + 0.04 * (12.0 - data.approachRate);

    let speedHighDeviationMultiplier = calculateSpeedHighDeviationNerf(data);
    speedValue *= speedHighDeviationMultiplier;

    let relevantTotalDiff = data.totalHits - data.difficulty_data.speed_note_count;
    let relevantCountGreat = Math.max(0.0, data.countGreat - relevantTotalDiff);
    let relevantCountOk = Math.max(0.0, data.countOk - Math.max(0.0, relevantTotalDiff - data.countGreat));
    let relevantCountMeh = Math.max(0.0, data.countMeh - Math.max(0.0, relevantTotalDiff - data.countGreat - data.countOk));
    let relevantAccuracy = data.difficulty_data.speed_note_count === 0.0 ? 0.0 : (
        (relevantCountGreat * 6.0 + relevantCountOk * 2.0 + relevantCountMeh) / (data.difficulty_data.speed_note_count * 6.0)
    );

    speedValue *= (0.95 + Math.pow(data.overallDifficulty, 2) / 750.0) * Math.pow((data.accuracy + relevantAccuracy) / 2.0, (14.5 - data.difficulty_data.overall_difficulty) * 0.5);

    return speedValue;
}

function getAccuracyValue(data) {
    if (Mods.hasMod(data.score.mods, "RX")) {
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

    let accuracyValue = Math.pow(1.52163, data.overallDifficulty) * Math.pow(betterAccuracyPercentage, 24) * 2.83;
    accuracyValue *= Math.min(1.15, Math.pow(amountHitObjectsWithAccuracy * 0.001, 0.3));

    if (Mods.hasMod(data.score.mods, "BL"))
        accuracyValue *= 1.14;
    else if (Mods.hasMod(data.score.mods, "HD") || Mods.hasMod(data.score.mods, "TC"))
        accuracyValue *= 1.08;

    if (Mods.hasMod(data.score.mods, "FL"))
        accuracyValue *= 1.02;

    return accuracyValue;
}

function getFlashlightValue(data) {
    if (!Mods.hasMod(data.score.mods, "FL")) {
        return 0;
    }

    let flashlightValue = (25 * Math.pow(data.difficulty_data.flashlight_difficulty ?? 0, 2));

    if (data.effectiveMissCount > 0)
        flashlightValue *= 0.97 * Math.pow(1 - Math.pow(data.effectiveMissCount / data.totalHits, 0.775), Math.pow(data.effectiveMissCount, 0.875));

    flashlightValue *= getComboScalingFactor(data);

    flashlightValue *= 0.7 + 0.1 * Math.min(1.0, data.totalHits / 200) + (data.totalHits > 200 ? 0.2 * Math.min(1.0, (data.totalHits - 200) / 200) : 0.0);

    flashlightValue *= 0.5 + data.accuracy / 2.0;
    flashlightValue *= 0.98 + Math.pow(data.overallDifficulty, 2) / 2500;

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

function calculateSpeedHighDeviationNerf(data) {
    if (data.speedDeviation === null)
        return 0.0;

    let speedValue = difficultyToPerformance(data.difficulty_data.speed_difficulty);

    let excessSpeedDifficultyCutoff = 100 + 220 * Math.pow(22 / data.speedDeviation, 6.5);

    if(speedValue <= excessSpeedDifficultyCutoff)
        return 1.0;

    const scale = 50;
    let adjustedSpeedValue = scale * (Math.log((speedValue - excessSpeedDifficultyCutoff) / scale + 1) + excessSpeedDifficultyCutoff / scale);

    let lerp = 1 - DifficultyCalculationUtils.ReverseLerp(data.speedDeviation, 22.0, 27.0);
    adjustedSpeedValue = DifficultyCalculationUtils.Lerp(adjustedSpeedValue, speedValue, lerp);

    return adjustedSpeedValue / speedValue;
}

function calculateSpeedDeviation(data) {
    if (data.totalSuccessFullHits === 0)
        return null;

    let speedNoteCount = data.difficulty_data.speed_note_count;
    speedNoteCount += (data.totalHits - data.difficulty_data.speed_note_count) * 0.1;

    let relevantCountMiss = Math.min(data.countMiss, speedNoteCount);
    let relevantCountMeh = Math.min(data.countMeh, speedNoteCount - relevantCountMiss);
    let relevantCountOk = Math.min(data.countOk, speedNoteCount - relevantCountMiss - relevantCountMeh);
    let relevantCountGreat = Math.min(data.countGreat, speedNoteCount - relevantCountMiss - relevantCountMeh - relevantCountOk);

    return calculateDeviation(data, relevantCountGreat, relevantCountOk, relevantCountMeh, relevantCountMiss);
}

function calculateDeviation(data, relevantCountGreat, relevantCountOk, relevantCountMeh, relevantCountMiss) {
    if (relevantCountGreat + relevantCountOk + relevantCountMeh <= 0)
        return null;

    let objectCount = relevantCountGreat + relevantCountOk + relevantCountMeh + relevantCountMiss;

    let n = Math.max(1, objectCount - relevantCountMiss - relevantCountMeh);
    const z = 2.32634787404;

    let p = relevantCountGreat / n;

    let pLowerBound = (n * p + z * z / 2) / (n + z * z) - z / (n + z * z) * Math.sqrt(n * p * (1 - p) + z * z / 4);

    let deviation = data.greatHitWindow / (Math.sqrt(2) * DifficultyCalculationUtils.ErfInv(2 * pLowerBound - 1));

    let randomValue = Math.sqrt(2 / Math.PI) * data.okHitWindow * Math.exp(-0.5 * Math.pow(data.okHitWindow / deviation, 2)) / (deviation * erf(data.okHitWindow / (Math.sqrt(2) * deviation)));

    deviation *= Math.sqrt(1 - randomValue);

    let limitValue = data.okHitWindow / Math.sqrt(3);

    if (pLowerBound === 0 || randomValue >= 1 || deviation > limitValue)
        return limitValue;

    let mehVariance = (data.mehHitWindow * data.mehHitWindow + data.okHitWindow * data.mehHitWindow + data.okHitWindow * data.okHitWindow) / 3;

    deviation = Math.sqrt(((relevantCountGreat + relevantCountOk) * Math.pow(deviation, 2) + relevantCountMeh * mehVariance) / (relevantCountGreat + relevantCountGreat + relevantCountMeh));

    return deviation;
}
