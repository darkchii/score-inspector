import { mods } from "../Osu";

export function getPerformance2014(data) {
    const score = JSON.parse(JSON.stringify(data.score));
    data.objects = score.beatmap.objects;
    const count300 = data.count300 ?? score.count300;
    const count100 = data.count100 ?? score.count100;
    const count50 = data.count50 ?? score.count50;
    const countmiss = Math.min(data.countmiss ?? score.countmiss, data.objects);

    data.countmiss = Math.min(data.objects, countmiss);

    const max300 = data.objects - data.countmiss;

    data.accuracyPercent = Math.max(0.0, Math.min(getAccuracy(max300, 0, 0, data.countmiss, data.objects) * 100.0, 100.0));

    let c50 = 0;
    let c100 = Math.round(-3.0 * ((data.accuracyPercent * 0.01 - 1.0) * data.objects + data.countmiss) / 2.0);

    if (c100 > data.objects - data.countmiss) {
        c100 = 0;
        c50 = Math.round(-6.0 * ((data.accuracyPercent * 0.01 - 1.0) * data.objects + data.countmiss) * 0.2);

        c50 = Math.min(max300, c50);
    } else {
        c100 = Math.min(max300, c100);
    }

    let c300 = data.objects - c100 - c50 - data.countmiss;

    data.count300 = c300;
    data.count100 = c100;
    data.count50 = 0;

    data.combo = data.combo ?? score.combo;
    data.totalhits = data.count300 + data.count100 + data.count50 + data.countmiss;
    data.accuracy = getAccuracy(data.count300, data.count100, data.count50, data.countmiss, data.objects);

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

    let mul = 1;

    if (data.score.enabled_mods & mods.NF) {
        mul *= 0.90;
    }

    if (data.score.enabled_mods & mods.SO) {
        mul *= 0.95;
    }

    const total = (
        data.aim + data.speed + data.acc
    ) * mul;

    return total;
}

function getAimValue(data) {
    const raw_aim = data.score.beatmap.modded_sr.aim_diff;
    let aim = Math.pow(5.0 * Math.max(1.0, raw_aim / 0.0675) - 4.0, 3.0) / 100000.0;

    aim *= 1.0 + 0.1 * Math.min(1.0, data.totalhits / 1500.0); //length bonus
    aim *= Math.pow(0.97, data.countmiss); // miss penalty

    if (data.score.beatmap.maxcombo > 0) {
        aim *= Math.min(Math.pow(data.combo, 0.8) / Math.pow(data.score.beatmap.maxcombo, 0.8), 1.0);
    }

    let approachRateFactor = 1.0;

    if (data.score.beatmap.modded_sr.modded_ar > 10.0) {
        approachRateFactor += 0.3 * (data.score.beatmap.modded_sr.modded_ar - 10.0);
    } else if (data.score.beatmap.modded_sr.modded_ar < 8.0) {
        if ((data.score.enabled_mods & mods.HD) !== 0) {
            approachRateFactor += 0.02 * (8.0 - data.score.beatmap.modded_sr.modded_ar);
        } else {
            approachRateFactor += 0.01 * (8.0 - data.score.beatmap.modded_sr.modded_ar);
        }
    }

    aim *= approachRateFactor;

    if ((data.score.enabled_mods & mods.HD) !== 0) {
        aim *= 1.18;
    }

    if ((data.score.enabled_mods & mods.FL) !== 0) {
        aim *= 1.36;
    }

    aim *= 0.5 + data.accuracy * 0.5;

    aim *= 0.98 + (Math.pow(data.score.beatmap.modded_sr.modded_od, 2) / 2500.0);

    return aim;
}

function getSpeedValue(data) {
    let speed = Math.pow(5.0 * Math.max(1.0, data.score.beatmap.modded_sr.speed_diff / 0.0675) - 4.0, 3.0) / 100000.0;

    speed *= 1.0 + 0.1 * Math.min(1.0, data.totalhits / 1500.0); //length bonus
    speed *= Math.pow(0.97, data.countmiss); // miss penalty

    if (data.score.beatmap.maxcombo > 0) {
        speed *= Math.min(Math.pow(data.combo / data.score.beatmap.maxcombo, 0.8), 1.0);
    }

    speed *= 0.5 + data.accuracy * 0.5;
    speed *= 0.98 + (Math.pow(data.score.beatmap.modded_sr.modded_od, 2) / 2500.0);

    return speed;
}

function getAccuracyValue(data) {
    let betterAccuracyPercentage = 0;

    if (data.score.beatmap.circles > 0) {
        betterAccuracyPercentage = ((data.count300 - (data.totalhits - data.score.beatmap.circles)) * 6 + data.count100 * 2 + data.count50) / (data.score.beatmap.circles * 6);
    }

    betterAccuracyPercentage = Math.max(0.0, betterAccuracyPercentage);

    let acc = Math.pow(Math.pow(1.3, data.score.beatmap.modded_sr.modded_od) * Math.pow(betterAccuracyPercentage, 15) / 2, 1.6) * 8.3;

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