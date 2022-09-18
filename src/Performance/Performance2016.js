import { mods } from "../helper";

export function getPerformance2016(data) {
    const score = data.score;
    data.count300 = data.count300 ?? score.count300;
    data.count100 = data.count100 ?? score.count100;
    data.count50 = data.count50 ?? score.count50;
    data.countmiss = data.countmiss ?? score.countmiss;
    data.combo = data.combo ?? score.combo;
    data.totalhits = data.count300 + data.count100 + data.count50 + data.countmiss;
    data.accuracy = getAccuracy(data);

    data.aim = getAimValue(data);
    data.speed = getSpeedValue(data);
    data.acc = getAccuracyValue(data);
    data.total = getTotalValue(data);

    data.score = undefined;

    return data;
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
        Math.pow(data.acc, 1.1), 1.0 / 1.1
    )*mul;

    return total;
}

function getAimValue(data) {
    const raw_aim = data.score.aim_diff;

    let aim = Math.pow(5.0 * Math.max(1.0, raw_aim / 0.0675) - 4.0, 3.0) / 100000.0;

    const amountTotalHits = data.totalhits;

    const lengthBonus = 0.95 + 0.4 * Math.min(1, amountTotalHits / 2000.0) +
        (amountTotalHits > 2000 ? (Math.log10(amountTotalHits / 2000.0) * 0.5) : 0.0);

    aim *= lengthBonus;

    aim *= Math.pow(0.97, data.countmiss);

    if (data.score.maxcombo > 0) {
        aim *= Math.min(Math.pow(data.combo, 0.8) / Math.pow(data.score.maxcombo, 0.8), 1.0);
    }

    let approachRateFactor = 1.0;
    if (data.score.modded_ar > 10.33) {
        approachRateFactor += 0.45 * (data.score.modded_ar - 10.33);
    } else if (data.score.modded_ar < 8.0) {
        if (data.score.enabled_mods & mods.HD) {
            approachRateFactor += 0.02 * (8.0 - data.score.modded_ar);
        } else {
            approachRateFactor += 0.01 * (8.0 - data.score.modded_ar);
        }
    }

    aim *= approachRateFactor;

    if (data.score.enabled_mods & mods.HD) {
        aim *= 1.18;
    }

    if (data.score.enabled_mods & mods.FL) {
        aim *= 1.45 * lengthBonus;
    }

    aim *= 0.5 + getAccuracy(data) * 0.5;

    aim *= 0.98 + ((data.score.modded_od * data.score.modded_od) / 2500);

    return aim;
}

function getSpeedValue(data) {
    let speed = Math.pow(5.0 * Math.max(1.0, data.score.speed_diff / 0.0675) - 4.0, 3.0) / 100000.0;

    const amountTotalHits = data.totalhits;

    speed *= 0.95 + 0.4 * Math.min(1.0, amountTotalHits / 2000.0) +
        (amountTotalHits > 2000 ? (Math.log10(amountTotalHits / 2000.0) * 0.5) : 0.0);

    speed *= Math.pow(0.97, data.countmiss);

    if (data.score.maxcombo > 0) {
        speed *= Math.min(Math.pow(data.combo, 0.8) / Math.pow(data.score.maxcombo, 0.8), 1.0);
    }

    speed *= 0.5 + getAccuracy(data) * 0.5;
    speed *= 0.98 + ((data.score.modded_od * data.score.modded_od) / 2500);
    return speed;
}

function getAccuracyValue(data) {
    let betterAccuracyPercentage = 0;

    const amountHitObjectsWithAccuracy = data.score.circles;
    if(amountHitObjectsWithAccuracy>0){
        betterAccuracyPercentage = ((data.count300 - (data.totalhits-amountHitObjectsWithAccuracy)) * 6 + data.count100 * 2 + data.count50) / (amountHitObjectsWithAccuracy * 6);
    }else{
        betterAccuracyPercentage = 0;
    }

    if(betterAccuracyPercentage<0){
        betterAccuracyPercentage = 0;
    }

    let acc = Math.pow(1.52163, data.score.modded_od) * Math.pow(betterAccuracyPercentage, 24.0) * 2.83;

    acc *= Math.min(1.15, Math.pow(amountHitObjectsWithAccuracy / 1000.0, 0.3));

    if(data.score.enabled_mods & mods.HD){
        acc *= 1.02;
    }

    if(data.score.enabled_mods & mods.FL){
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