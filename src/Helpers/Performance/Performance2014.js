import { mods } from "../Osu";

export function getPerformance2014(data, debug = false) {
    const score = data.score;
    data.objects = score.beatmap.objects;
    const count300 = data.count300 ?? score.count300;
    const count100 = data.count100 ?? score.count100;
    const count50 = data.count50 ?? score.count50;
    const countmiss = Math.min(data.countmiss ?? score.countmiss, data.objects);

    data.modded_sr = score.beatmap.modded_sr['2014'] ?? score.beatmap.modded_sr;

    data.count300 = count300;
    data.count100 = count100;
    data.count50 = count50;
    data.countmiss = countmiss;

    const max300 = data.objects - countmiss;

    data.accuracy = getAccuracy(count300, count100, count50, data.countmiss, data.objects);
    
    data.count50 = 0;
    data.count100 = Math.round(-3.0 * ((data.accuracy - 1.0) * data.objects + data.countmiss) / 2.0);
    
    if (data.count100 > data.objects - data.countmiss) {
        data.count100 = 0;
        data.count50 = Math.round(-6.0 * ((data.accuracy - 1.0) * data.objects + data.countmiss) * 0.2);
        data.count50 = Math.min(max300, data.count50);
    }else{
        data.count100 = Math.min(max300, data.count100);
    }
    
    data.combo = data.combo ?? score.combo;
    data.totalhits = data.count300 + data.count100 + data.count50 + data.countmiss;
    data.count300 = data.objects - data.count100 - data.count50 - data.countmiss;

    data.count50 = 0;

    if(score.beatmap.modded_sr['2014']){
        data.aim = getAimValue(data);
        data.speed = getSpeedValue(data);
        data.acc = getAccuracyValue(data);
        data.total = getTotalValue(data);
    }else{
        data.aim = 0;
        data.speed = 0;
        data.acc = 0;
        data.total = 0;
    }

    data.score = undefined;

    if (debug) {
        console.log(data);
    }

    const output = {
        aim: data.aim,
        speed: data.speed,
        acc: data.acc,
        total: data.total,
        version: '2014',
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

    let mul = 1.1;

    if (data.score.enabled_mods & mods.NF) {
        mul *= 0.90;
    }

    if (data.score.enabled_mods & mods.SO) {
        mul *= 0.95;
    }

    const total = Math.pow(
        Math.pow(data.aim, 1.1) +
        Math.pow(data.speed, 1.1) +
        Math.pow(data.acc, 1.1),
        1.0 / 1.1
    ) * mul;

    return total;
}

function getAimValue(data) {
    const raw_aim = data.modded_sr.aim_diff;
    let aim = Math.pow(5.0 * Math.max(1.0, raw_aim / 0.0675) - 4.0, 3.0) / 100000.0;

    aim *= 0.95 + 0.4 * Math.min(1.0, data.totalhits / 2000.0)
        + (data.totalhits > 2000 ? Math.log10(data.totalhits / 2000.0) * 0.5 : 0.0); //length bonus
    aim *= Math.pow(0.97, data.countmiss); // miss penalty

    if (data.score.beatmap.maxcombo > 0) {
        aim *= Math.min(Math.pow(data.combo / data.score.beatmap.maxcombo, 0.8), 1.0);
    }

    let approachRateFactor = 1.0;

    if (data.modded_sr.modded_ar > 10.0) {
        approachRateFactor += 0.3 * (data.modded_sr.modded_ar - 10.0);
    } else if (data.modded_sr.modded_ar < 8.0) {
        if ((data.score.enabled_mods & mods.HD) !== 0) {
            approachRateFactor += 0.02 * (8.0 - data.modded_sr.modded_ar);
        } else {
            approachRateFactor += 0.01 * (8.0 - data.modded_sr.modded_ar);
        }
    }

    aim *= approachRateFactor;

    if ((data.score.enabled_mods & mods.HD) !== 0) {
        aim *= 1.18;
    }

    if ((data.score.enabled_mods & mods.FL) !== 0) {
        aim *= 1.50;
    }

    aim *= 0.5 + data.accuracy * 0.5;

    aim *= 0.98 + (Math.pow(data.modded_sr.modded_od, 2) / 2500.0);

    return aim;
}

function getSpeedValue(data) {
    let speed = Math.pow(5.0 * Math.max(1.0, data.modded_sr.speed_diff / 0.0675) - 4.0, 3.0) / 100000.0;

    speed *= 0.95 + 0.4 * Math.min(1.0, data.totalhits / 2000.0) + (data.totalhits > 2000 ? Math.log10(data.totalhits / 2000.0) * 0.5 : 0.0); //length bonus
    speed *= Math.pow(0.97, data.countmiss); // miss penalty

    if (data.score.beatmap.maxcombo > 0) {
        speed *= Math.min(Math.pow(data.combo / data.score.beatmap.maxcombo, 0.8), 1.0);
    }

    speed *= 0.5 + data.accuracy * 0.5;
    speed *= 0.98 + (Math.pow(data.modded_sr.modded_od, 2) / 2500.0);

    return speed;
}

function getAccuracyValue(data) {
    let betterAccuracyPercentage = 0;

    if (data.score.beatmap.circles > 0) {
        betterAccuracyPercentage = ((data.count300 - (data.totalhits - data.score.beatmap.circles)) * 6 + data.count100 * 2 + data.count50) / (data.score.beatmap.circles * 6);
    }

    betterAccuracyPercentage = Math.max(0.0, betterAccuracyPercentage);

    //let acc = Math.pow(Math.pow(1.3, data.modded_sr.modded_od) * Math.pow(betterAccuracyPercentage, 15) / 2, 1.6) * 8.3;
    let acc = Math.pow(1.52163, data.modded_sr.modded_od) * Math.pow(betterAccuracyPercentage, 24.0) * 2.83;
    acc *= Math.min(1.15, Math.pow(data.score.beatmap.circles / 1000.0, 0.3));

    if ((data.score.enabled_mods & mods.HD) !== 0) {
        acc *= 1.02;
    }

    if ((data.score.enabled_mods & mods.FL) !== 0) {
        acc *= 1.02;
    }

    return acc;
}

function getAccuracy(count300, count100, count50, countmiss, objects) {

    if (objects === 0) {
        return 0;
    }

    return Math.min(Math.max((count50 * 50 + count100 * 100 + count300 * 300) / (objects * 300), 0.0), 1.0);
}