import { sleep } from "./Misc";
import { calculatePP2016, calculatePPifFC, calculatePPifSS, getBeatmapCount, getBonusPerformance, getLazerScore, getModString, mods } from "./Osu";
import { getPerformance2016 } from "./Performance/Performance2016";
import { getPerformanceLive } from "./Performance/PerformanceLive";
import { getPeriodicData } from "./ScoresPeriodProcessor";
import { getSessions } from "./Session";

const FEEDBACK_SLEEP_TIME = 100; // give the browser bit of breathing room to update the UI before each intensive task
export async function processScores(user, scores, onCallbackError, onScoreProcessUpdate) {
    await sleep(FEEDBACK_SLEEP_TIME);
    onScoreProcessUpdate('Fetching beatmaps');
    let bmCount;
    try {
        bmCount = await getBeatmapCount();
    } catch (err) {
        bmCount = null;
    }

    if (bmCount === null) {
        onCallbackError('Error fetching beatmap count');
        return null;
    }

    await sleep(FEEDBACK_SLEEP_TIME);
    onScoreProcessUpdate('Preparing scores');
    scores = prepareScores(scores, onScoreProcessUpdate);

    const data = {
        grades: {
            XH: 0,
            X: 0,
            SH: 0,
            S: 0,
            A: 0,
            B: 0,
            C: 0,
            D: 0
        },
        average_pp: 0,
        clears: scores.length,
        total: {
            pp: 0,
            score: 0,
            acc: 0,
            length: 0,
            star_rating: 0,
            scoreLazer: 0,
            is_fc: 0,
        },
        average: {
            pp: 0,
            score: 0,
            acc: 0,
            length: 0,
            star_rating: 0
        }
    };

    await sleep(FEEDBACK_SLEEP_TIME);
    onScoreProcessUpdate('Generate monthly beatmap data');
    data.beatmapInfo = getMonthlyBeatmapData(bmCount);

    await sleep(FEEDBACK_SLEEP_TIME);
    onScoreProcessUpdate('Misc data');
    for (const score of scores) {
        const grade = score.rank;
        data.grades[grade]++;

        data.total.pp += score.pp ?? 0;
        data.total.score += score.score ?? 0;
        data.total.acc += score.accuracy ?? 0;
        data.total.length += score.modded_length ?? 0;
        data.total.star_rating += score.star_rating ?? 0;
        data.total.scoreLazer += score.scoreLazer ?? 0;
        data.total.is_fc += score.is_fc ?? 0;
    }

    await sleep(FEEDBACK_SLEEP_TIME);
    onScoreProcessUpdate('Average data');
    if (data.clears > 0) {
        data.average.pp = data.total.pp / data.clears;
        data.average.score = data.total.score / data.clears;
        data.average.acc = data.total.acc / data.clears;
        data.average.length = data.total.length / data.clears;
        data.average.star_rating = data.total.star_rating / data.clears;
    }

    //session data
    await sleep(FEEDBACK_SLEEP_TIME);
    onScoreProcessUpdate('Sessions');
    data.sessions = getSessions(scores);
    data.approximatePlaytime = 0;
    if (data.sessions !== undefined) {
        let pt = 0;
        data.sessions.forEach(session => {
            pt += session.length; //session playtime
        });

        let it = user.osu.statistics.play_time - data.total.length; // idle time in game
        let pcT = user.osu.statistics.play_count * (data.average.length * 0.5); // playtime based on playcount

        data.approximatePlaytime = Math.round((pt + pcT + it * (Math.log10(it) * 0.1)) * 0.5);
    }
    //end session data

    //fc rate
    await sleep(FEEDBACK_SLEEP_TIME);
    onScoreProcessUpdate('Fullcombo rate');
    data.fcRate = data.total.is_fc / data.clears;

    //best scores
    await sleep(FEEDBACK_SLEEP_TIME);
    onScoreProcessUpdate('Best scores');
    data.bestScores = getBestScores(scores);

    data.performance = await weighPerformance(scores, onScoreProcessUpdate);

    await sleep(FEEDBACK_SLEEP_TIME);
    onScoreProcessUpdate('Monthly data');
    data.monthly = getPeriodicData(scores, data, user);

    await sleep(FEEDBACK_SLEEP_TIME);
    onScoreProcessUpdate('Active days');
    data.activeDays = getActiveDays(scores);

    return data;
}

async function weighPerformance(scores, onScoreProcessUpdate) {
    await sleep(FEEDBACK_SLEEP_TIME);
    onScoreProcessUpdate('Fullcombo performance');
    scores = calculatePPifFC(scores);

    await sleep(FEEDBACK_SLEEP_TIME);
    onScoreProcessUpdate('SS performance');
    scores = calculatePPifSS(scores);

    await sleep(FEEDBACK_SLEEP_TIME);
    onScoreProcessUpdate('2016 performance');
    scores = calculatePP2016(scores);

    await sleep(FEEDBACK_SLEEP_TIME);
    onScoreProcessUpdate('2016 performance');
    scores.sort((a, b) => {
        return b.pp - a.pp;
    });
    scores.forEach(score => { score.pp_weight = Math.pow(0.95, index); index++; });
    var index = 0;

    await sleep(FEEDBACK_SLEEP_TIME);
    onScoreProcessUpdate('Weighing scores');
    const data = {};

    data.weighted = {};

    data.weighted.fc = 0;
    data.weighted.ss = 0;
    data.weighted.xexxar = 0;
    data.weighted._2016 = 0;

    let xexxar_score_pp = 0;
    let xexxar_total_pp = 0;
    scores.forEach((score, index) => {
        xexxar_score_pp += score.pp * Math.pow(0.95, index);
        xexxar_total_pp += score.pp;
    });
    data.weighted.xexxar = ((2 - 1) * xexxar_score_pp + 0.75 * xexxar_score_pp * (Math.log(xexxar_total_pp) / Math.log(xexxar_score_pp))) / 2;

    scores.forEach(score => {
        if (!isNaN(score.pp_fc.total)) {
            data.weighted.fc += score.pp_fc.total * score.pp_fc.weight;
        }
        if (!isNaN(score.pp_ss.total)) {
            data.weighted.ss += score.pp_ss.total * score.pp_ss.weight;
        }
        if (!isNaN(score.pp_2016.total)) {
            data.weighted._2016 += score.pp_2016.total * score.pp_2016.weight;
        }
    });
    await sleep(FEEDBACK_SLEEP_TIME);
    onScoreProcessUpdate('Bonus PP');
    const bonus = getBonusPerformance(scores.length);
    data.weighted.fc += bonus;
    data.weighted.ss += bonus;
    data.weighted._2016 += bonus;

    return data;
}

export function prepareScores(scores, onScoreProcessUpdate) {
    scores.forEach(score => {
        onScoreProcessUpdate?.('' + score.id);
        score.pp = Math.max(0, parseFloat(score.pp));
        score.enabled_mods = parseInt(score.enabled_mods);
        score.stars = parseFloat(score.stars);
        score.ar = parseFloat(score.ar);
        score.od = parseFloat(score.od);
        score.cs = parseFloat(score.cs);
        score.hp = parseFloat(score.hp);
        score.maxcombo = parseInt(score.maxcombo);
        score.combo = parseInt(score.combo);
        score.countmiss = parseInt(score.countmiss);
        score.count300 = parseInt(score.count300);
        score.count100 = parseInt(score.count100);
        score.count50 = parseInt(score.count50);
        score.score = parseInt(score.score);
        score.accuracy = parseFloat(score.accuracy);
        score.length = parseInt(score.length);
        score.bpm = parseInt(score.bpm);
        score.approved = parseInt(score.approved);
        score.star_rating = parseFloat(score.star_rating);
        score.aim_diff = parseFloat(score.aim_diff);
        score.speed_diff = parseFloat(score.speed_diff);
        score.fl_diff = parseFloat(score.fl_diff);
        score.slider_factor = parseFloat(score.slider_factor);
        score.modded_od = parseFloat(score.modded_od);
        score.modded_ar = parseFloat(score.modded_ar);
        score.modded_cs = parseFloat(score.modded_cs);
        score.modded_hp = parseFloat(score.modded_hp);
        score.sliders = parseInt(score.sliders);
        score.circles = parseInt(score.circles);
        score.spinners = parseInt(score.spinners);
        score.objects = score.sliders + score.circles + score.spinners;
        score.modded_length = score.length;
        score.date_played_object = new Date(score.date_played);
        if (score.enabled_mods & mods.DT || score.enabled_mods & mods.NC) {
            score.modded_length /= 1.5;
        } else if (score.enabled_mods & mods.HT) {
            score.modded_length /= 0.75;
        }
        score.modString = getModString(score.enabled_mods).toString();
        score.totalhits = score.count300 + score.count100 + score.count50 + score.countmiss;

        score.pp_fc = getPerformanceLive({ count300: score.count300 + score.countmiss, count100: score.count100, count50: score.count50, countmiss: 0, combo: score.maxcombo, score: score });
        score.pp_ss = getPerformanceLive({ count300: score.count300 + score.countmiss + score.count100 + score.count50, count100: 0, count50: 0, countmiss: 0, combo: score.maxcombo, score: score });
        score.pp_cur = getPerformanceLive({ score: score });
        score.pp_2016 = getPerformance2016({ score: score });

        score.is_fc = isScoreFullcombo(score);
        score.scoreLazer = Math.floor(getLazerScore(score));
    });

    return scores;
}

function getBestScores(scores) {
    let _scores = {
        best_pp: null,
        best_sr: null,
        best_score: null
    };

    scores.forEach(score => {
        if (_scores.best_pp === null || score.pp > _scores.best_pp.pp) {
            _scores.best_pp = score;
        }
        if ((score.enabled_mods & mods.NF) === 0) {
            if ((_scores.best_sr === null || score.star_rating > _scores.best_sr.star_rating)) {
                _scores.best_sr = score;
            }
        }
        if (_scores.best_score === null || score.score > _scores.best_score.score) {
            _scores.best_score = score;
        }
    });

    return _scores;
}

function getActiveDays(scores) {
    const activeDays = new Set();
    scores.forEach(score => {
        activeDays.add(new Date(score.date_played).toISOString().slice(0, 10));
    });
    return activeDays;
}

function getMonthlyBeatmapData(beatmaps) {
    var beatmapInfo = {};
    beatmapInfo.monthly = [];

    beatmaps.data.forEach(monthData => {
        const y = monthData.year;
        const m = monthData.month;
        beatmapInfo.monthly[`${y}-${m}-01`] = monthData;
    });

    var bm_maps = 0;
    var bm_score = 0;
    var bm_length = 0;
    beatmapInfo.monthlyCumulative = [];
    Object.keys(beatmapInfo.monthly).forEach(key => {
        const o = JSON.parse(JSON.stringify(beatmapInfo.monthly[key]));
        o.amount = bm_maps += o.amount;
        o.score = bm_score += o.score;
        o.length = bm_length += o.length;
        beatmapInfo.monthlyCumulative[key] = o;
    });

    return beatmapInfo;
}

function isScoreFullcombo(score) {
    var is_fc = score.perfect === "1";

    if (!is_fc) {
        if (score.countmiss === 0 && score.maxcombo > 0) {
            const perc_fc = 100 / score.maxcombo * score.combo;
            is_fc = perc_fc >= 99;
        }
    }

    return is_fc;
}