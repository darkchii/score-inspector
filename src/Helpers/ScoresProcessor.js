import moment from "moment";
import { GetAPI, sleep } from "./Misc";
import { calculatePP2014, calculatePP2016, calculatePP2020, calculatePPifFC, calculatePPifSS, calculatePPLazer, getBeatmapCount, getBonusPerformance, getLazerScore, getModString, MassCalculatePerformance, mods } from "./Osu";
import { getSessions } from "./Session";
import { getPeriodicData } from "./ScoresPeriodicProcessor.js";
import axios from "axios";
import { getCalculator } from "./Performance/Performance.js";

const FEEDBACK_SLEEP_TIME = 100; // give the browser bit of breathing room to update the UI before each intensive task
export async function processScores(user, scores, onCallbackError, onScoreProcessUpdate, allow_loved) {
    onScoreProcessUpdate('Preparing scores');
    await sleep(FEEDBACK_SLEEP_TIME);
    scores = prepareScores(user, scores);

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
        total_beatmaps: 0,
        total: {
            pp: 0,
            score: 0,
            acc: 0,
            length: 0,
            star_rating: 0,
            scoreLazerClassic: 0,
            scoreLazerStandardised: 0,
            is_fc: 0,
        },
        average: {
            pp: 0,
            score: 0,
            acc: 0,
            length: 0,
            star_rating: 0
        },
        allow_loved: allow_loved,
        best_days: {
            clears: [],
            ss: [],
            score: [],
        }
    };

    onScoreProcessUpdate('Calculating performance');
    await sleep(FEEDBACK_SLEEP_TIME);
    let [_scores, _performance] = await MassCalculatePerformance(scores);
    scores = _scores;
    data.performance = _performance;

    onScoreProcessUpdate('Misc data');
    await sleep(FEEDBACK_SLEEP_TIME);
    for (const score of scores) {
        const grade = score.rank;
        data.grades[grade]++;

        data.total.pp += score.pp ?? 0;
        data.total.score += score.score ?? 0;
        data.total.acc += score.accuracy ?? 0;
        data.total.length += score.beatmap.modded_length ?? 0;
        data.total.star_rating += score.beatmap.modded_sr.star_rating ?? 0;
        data.total.scoreLazerClassic += score.scoreLazerClassic ?? 0;
        data.total.scoreLazerStandardised += score.scoreLazerStandardised ?? 0;
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
    onScoreProcessUpdate('Sessions');
    await sleep(FEEDBACK_SLEEP_TIME);
    data.sessions = getSessions(scores);
    data.totalSessionLength = 0;
    data.totalSessionLengthMoment = null;
    data.approximatePlaytime = 0;
    if (data.sessions !== undefined) {
        let pt = 0;
        data.sessions.forEach(session => {
            pt += session.length; //session playtime
        });
        data.totalSessionLength = pt;
        data.totalSessionLengthMoment = moment.duration(pt, 'seconds');

        let it = user.osu.statistics.play_time - data.total.length; // idle time in game
        let pcT = user.osu.statistics.play_count * (data.average.length * 0.5); // playtime based on playcount

        data.approximatePlaytime = Math.round((pt + pcT + it * (Math.log10(it) * 0.1)) * 0.5);
    }
    //end session data

    //fc rate
    onScoreProcessUpdate('Fullcombo rate');
    await sleep(FEEDBACK_SLEEP_TIME);
    data.fcRate = data.total.is_fc / data.clears;

    //best scores
    onScoreProcessUpdate('Best scores');
    await sleep(FEEDBACK_SLEEP_TIME);
    data.bestScores = getBestScores(scores);

    onScoreProcessUpdate('Beatmaps');
    await sleep(FEEDBACK_SLEEP_TIME);
    data.beatmaps_counts = (await axios.get(`${GetAPI()}beatmaps/count_periodic`))?.data;
    data.beatmaps_count_total = (await axios.get(`${GetAPI()}beatmaps/count?include_loved=true`))?.data;

    onScoreProcessUpdate('Periodic data');
    await sleep(FEEDBACK_SLEEP_TIME);
    data.periodic = {};
    data.periodic['y'] = getPeriodicData(user, scores, data.beatmaps_counts, 'y');
    data.periodic['m'] = getPeriodicData(user, scores, data.beatmaps_counts, 'm');
    data.periodic['d'] = getPeriodicData(user, scores, data.beatmaps_counts, 'd');

    onScoreProcessUpdate('Best days');
    await sleep(FEEDBACK_SLEEP_TIME);
    data.best_days = ProcessBestDays(scores);

    onScoreProcessUpdate('Active days');
    await sleep(FEEDBACK_SLEEP_TIME);
    data.activeDays = getActiveDays(scores);

    onScoreProcessUpdate('Average day spread');
    await sleep(FEEDBACK_SLEEP_TIME);
    data.averageDaySpread = getDayPlaycountSpread(scores);

    return data;
}

async function weighPerformance(scores, onScoreProcessUpdate) {
    scores = calculatePPifFC(scores);
    scores = calculatePPifSS(scores);
    scores = calculatePP2014(scores);
    scores = calculatePP2016(scores);
    scores = calculatePP2020(scores);
    scores = calculatePPLazer(scores);

    scores.sort((a, b) => {
        return b.pp - a.pp;
    });
    scores.forEach(score => { score.pp_weight = Math.pow(0.95, index); index++; });
    var index = 0;

    const data = {};

    data.weighted = {};

    data.weighted.v1 = 0;
    data.weighted.fc = 0;
    data.weighted.ss = 0;
    data.weighted.xexxar = 0;
    data.weighted._2014 = 0;
    data.weighted._2016 = 0;
    data.weighted._2020 = 0;
    data.weighted.lazer = 0;

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
        if (!isNaN(score.pp_2014.total)) {
            data.weighted._2014 += score.pp_2014.total * score.pp_2014.weight;
        }
        if (!isNaN(score.pp_2016.total)) {
            data.weighted._2016 += score.pp_2016.total * score.pp_2016.weight;
        }
        if (!isNaN(score.pp_2020.total)) {
            data.weighted._2020 += score.pp_2020.total * score.pp_2020.weight;
        }
        if (!isNaN(score.pp_lazer.total)) {
            data.weighted.lazer += score.pp_lazer.total * score.pp_lazer.weight;
        }
    });
    const bonus = getBonusPerformance(scores.length);
    data.weighted.fc += bonus;
    data.weighted.ss += bonus;
    data.weighted._2014 += bonus;
    data.weighted._2016 += bonus;
    data.weighted._2020 += bonus;
    // data.weighted.lazer += bonus;

    scores.sort((a, b) => {
        return b.pp_v1?.total - a.pp_v1?.total;
    });

    let j = 1;
    let rank_score = 0;
    scores.forEach(score => {
        rank_score += score.pp_v1.total * j;
        j *= 0.994;
    });

    rank_score = Math.max(0, Math.log(rank_score + 1) * 400);
    data.weighted.v1 = rank_score;

    return data;
}

const BEST_DAYS_AMOUNT = 5;
function ProcessBestDays(scores) {
    //group scores by day
    const days = {};
    scores.forEach(score => {
        const day = new Date(score.date_played).toISOString().slice(0, 10);
        if (!days[day]) {
            days[day] = [];
        }
        days[day].push(score);
    });

    //convert to array
    const days_array = [];
    Object.keys(days).forEach(key => {
        days_array.push({
            day: key,
            scores: days[key],
            clears: days[key].length,
            ss: days[key].filter(score => { return score.rank === 'XH' || score.rank === 'X' }).length,
            score: days[key].reduce((acc, score) => { return acc + score.score; }, 0),
        });
    });

    const best_days = [
        {
            name: 'Clears',
            data: days_array.sort((a, b) => { return b.clears - a.clears; }).slice(0, BEST_DAYS_AMOUNT).map(day => { return { day: day.day, value: day.clears }; }),

        }, 
        {
            name: 'SS',
            data: days_array.sort((a, b) => { return b.ss - a.ss; }).slice(0, BEST_DAYS_AMOUNT).map(day => { return { day: day.day, value: day.ss }; }),
        },
        {
            name: 'Score',
            data: days_array.sort((a, b) => { return b.score - a.score; }).slice(0, BEST_DAYS_AMOUNT).map(day => { return { day: day.day, value: day.score }; })
        }
    ]

    return best_days;
}

export function prepareScores(user, scores, calculateOtherPP = true) {
    let debugged = false;
    scores.forEach((score, index) => {
        score = prepareScore(score, user);

        if (score.top_score && score.top_score.user_id && !debugged) {
            debugged = true;
        }
    });

    console.log(scores);

    return scores;
}

export function prepareScore(score, user = null) {
    score.is_loved = score.beatmap.approved === 4;
    if (user !== null) {
        score.is_unique_ss = user.alt.unique_ss.includes(score.beatmap_id);
        score.is_unique_fc = user.alt.unique_fc.includes(score.beatmap_id);
        score.is_unique_dt_fc = user.alt.unique_dt_fc.includes(score.beatmap_id);
    }
    score.accuracy = parseFloat(score.accuracy);
    score.pp = Math.max(0, parseFloat(score.pp));
    score.date_played_moment = moment(score.date_played);
    score.enabled_mods = parseInt(score.enabled_mods);

    score.beatmap = prepareBeatmap(score.beatmap, score.enabled_mods);

    score.modString = getModString(score.enabled_mods).toString();
    score.totalhits = score.count300 + score.count100 + score.count50;

    score.is_fc = isScoreFullcombo(score);
    score.scoreLazerClassic = Math.floor(getLazerScore(score));
    score.scoreLazerStandardised = Math.floor(getLazerScore(score, false));

    score.estimated_pp = getCalculator('live', {
        score: score,
    }).total;

    if (!score.user && user) {
        score.user = user.alt;
    }

    return score;
}

export function prepareBeatmap(beatmap, enabled_mods = null) {
    enabled_mods = enabled_mods ?? mods.None;

    beatmap.stars = parseFloat(beatmap.stars);
    beatmap.objects = beatmap.sliders + beatmap.circles + beatmap.spinners;
    beatmap.modded_length = beatmap.length;
    beatmap.modded_bpm = beatmap.bpm;
    beatmap.date_approved_moment = moment(beatmap.date_approved);
    if (enabled_mods & mods.DT || enabled_mods & mods.NC) {
        beatmap.modded_length /= 1.5;
        beatmap.modded_bpm *= 1.5;
    } else if (enabled_mods & mods.HT) {
        beatmap.modded_length /= 0.75;
        beatmap.modded_bpm *= 0.75;
    }

    return beatmap;
}

function getBestScores(scores) {
    let _scores = {
        best_pp: null,
        best_sr: null,
        best_score: null,
        oldest: null
    };

    scores.forEach(score => {
        if (!score.is_loved) {
            if (_scores.best_pp === null || score.pp > _scores.best_pp.pp) {
                _scores.best_pp = score;
            }
            if ((score.enabled_mods & mods.NF) === 0) {
                if ((_scores.best_sr === null || score.beatmap.modded_sr.star_rating > _scores.best_sr.beatmap.modded_sr.star_rating)) {
                    _scores.best_sr = score;
                }
            }
            if (_scores.best_score === null || score.score > _scores.best_score.score) {
                _scores.best_score = score;
            }
            if (_scores.oldest === null || score.date_played < _scores.oldest.date_played) {
                _scores.oldest = score;
            }
        }
    });

    return _scores;
}

function getActiveDays(scores) {
    const activeDays = new Set();
    scores.forEach(score => {
        activeDays.add(new Date(score.date_played).toISOString().slice(0, 10));
    });

    const arrayActiveDays = Array.from(activeDays);
    arrayActiveDays.sort((a, b) => {
        return new Date(a) - new Date(b);
    });
    return arrayActiveDays;
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
    const is_fc = (score.countmiss === 0 && ((score.beatmap.maxcombo - score.maxcombo) <= score.count100)) || score.perfect === 1 || score.rank === 'X' || score.rank === 'XH';
    return is_fc;
}

function getDayPlaycountSpread(scores) {
    //ranges
    //const ranges = ['0-1', '1-2', '2-3', '3-4', '4-5', '5-6', '6-7', '7-8', '8-9', '9-10', '10-11', '11-12', '12-13', '13-14', '14-15', '15-16', '16-17', '17-18', '18-19', '19-20', '20-21', '21-22', '22-23', '23-24'];
    const hours = ["12 AM", "1 AM", "2 AM", "3 AM", "4 AM", "5 AM", "6 AM", "7 AM", "8 AM", "9 AM", "10 AM", "11 AM", "12 PM", "1 PM", "2 PM", "3 PM", "4 PM", "5 PM", "6 PM", "7 PM", "8 PM", "9 PM", "10 PM", "11 PM"];
    const values = [
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    ];

    scores.forEach(score => {
        // const hour = moment(score.date_played).hour();
        const hour = parseInt(score.date_played_moment.hour());
        if (!values[hour]) {
            values[hour] = 0;
        }
        values[hour]++;
    });

    return { hours, values };
}