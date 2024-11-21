import moment from "moment";
import { GetAPI, sleep } from "./Misc";
import { getLazerScore, getModString, MassCalculatePerformance, mods } from "./Osu";
import { getSessions } from "./Session";
import { getPeriodicData } from "./ScoresPeriodicProcessor.js";
import axios from "axios";
import { getCalculator } from "./Performance/Performance.js";
import Mods from "./Mods.js";

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
        latest_scores: []
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
        data.total.star_rating += score.beatmap.difficulty_data?.diff_unified ?? 0;
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
    data.longestSession = null;
    data.approximatePlaytime = 0;
    if (data.sessions !== undefined) {
        let pt = 0;
        data.sessions.forEach(session => {
            pt += session.length; //session playtime
        });
        data.totalSessionLength = pt;
        data.totalSessionLengthMoment = moment.duration(pt, 'seconds');
        data.longestSession = data.sessions.reduce((acc, session) => { return session.length > acc.length ? session : acc; }, { length: 0 });

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
    data.beatmaps_counts = (await axios.get(`${GetAPI()}beatmaps/count_periodic?include_loved=true`))?.data;
    data.beatmaps_count_total = (await axios.get(`${GetAPI()}beatmaps/count?include_loved=true`))?.data;

    onScoreProcessUpdate('Periodic data');
    await sleep(FEEDBACK_SLEEP_TIME);
    data.periodic = {};
    data.periodic['y'] = getPeriodicData(user, scores, data.beatmaps_counts, 'y');
    data.periodic['m'] = getPeriodicData(user, scores, data.beatmaps_counts, 'm');
    data.periodic['d'] = getPeriodicData(user, scores, data.beatmaps_counts, 'd');

    onScoreProcessUpdate('Active days');
    await sleep(FEEDBACK_SLEEP_TIME);
    data.activeDays = getActiveDays(scores);

    onScoreProcessUpdate('Average day spread');
    await sleep(FEEDBACK_SLEEP_TIME);
    data.averageDaySpread = getDayPlaycountSpread(scores);

    onScoreProcessUpdate('Latest scores');
    await sleep(FEEDBACK_SLEEP_TIME);
    scores.sort((a, b) => b.date_played_moment.valueOf() - a.date_played_moment.valueOf());
    data.latest_scores = scores.slice(0, 20);

    console.log(data.latest_scores);

    return data;
}

export function prepareScores(user, scores, calculateOtherPP = true) {
    scores.forEach((score, index) => {
        score = prepareScore(score, user);
    });

    //sort by time
    scores.sort((a, b) => a.date_played_moment.valueOf() - b.date_played_moment.valueOf());

    console.log(`[SCORES] Latest score:`);
    console.log(scores[scores.length - 1]);

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
    score.date_played_moment = moment(score.date_played).local();
    //test string
    score.date_played_moment_string = score.date_played_moment.format('YYYY-MM-DD HH:mm:ss');
    score.enabled_mods = parseInt(score.enabled_mods);

    //convert the enum to an array of mods in following format: 
    // [
    //     {
    //         acronym: 'HD',
    //     }
    // ]
    // this follows whatever osu api provides nowadays, but osualt uses the legacy enum format
    // futureproofing
    score.mods = new Mods(score.enabled_mods, score.mods);

    if (score.beatmap.difficulty_data) {
        score.beatmap.difficulty_data = applyModdedAttributes(score.beatmap, score.mods);
    }

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
        try {
            if (!score.is_loved) {
                if (_scores.best_pp === null || score.pp > _scores.best_pp.pp) {
                    _scores.best_pp = score;
                }
                if ((score.enabled_mods & mods.NF) === 0) {
                    if ((_scores.best_sr === null || (score.beatmap.difficulty_data?.diff_unified ?? 0) > (_scores.best_sr.beatmap.difficulty_data?.diff_unified ?? 0))) {
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
        } catch (err) {
            console.error(score);
            console.error('Something went wrong on score with beatmap_id: ' + score.beatmap_id);
            throw err;
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

const ar_ms_step1 = 120;
const ar_ms_step2 = 150;

const ar0_ms = 1800;
const ar5_ms = 1200;
const ar10_ms = 450;

const od_ms_step = 6;
const od0_ms = 79.5;
const od10_ms = 19.5;
function applyModdedAttributes(beatmap, parsed_mods) {
    let difficulty_data = JSON.parse(JSON.stringify(beatmap.difficulty_data));
    let speed = 1;
    let ar_multiplier = 1;
    let ar;
    let ar_ms;

    if ((parsed_mods.hasMod(mods.DT) || parsed_mods.hasMod(mods.NC))) {
        speed = 1.5;
    } else if (parsed_mods.hasMod(mods.HT)) {
        speed = 0.75;
    }

    if (parsed_mods.hasMod(mods.HR)) {
        ar_multiplier = 1.4;
    } else if (parsed_mods.hasMod(mods.EZ)) {
        ar_multiplier = 0.5;
    }

    ar = beatmap.ar * ar_multiplier;

    if (ar <= 5)
        ar_ms = ar0_ms - ar_ms_step1 * ar;
    else
        ar_ms = ar5_ms - ar_ms_step2 * (ar - 5);

    ar_ms /= speed;

    if (ar <= 5)
        ar = (ar0_ms - ar_ms) / ar_ms_step1;
    else
        ar = 5 + (ar5_ms - ar_ms) / ar_ms_step2;

    let cs = 1;
    let cs_multiplier = 1;

    if(parsed_mods.hasMod(mods.HR)) {
        cs_multiplier = 1.3;
    } else if(parsed_mods.hasMod(mods.EZ)) {
        cs_multiplier = 0.5;
    }

    cs = beatmap.cs * cs_multiplier;

    if(cs > 10) cs = 10;

    let od = 1;
    let odms = 1;
    let od_multiplier = 1;

    if(parsed_mods.hasMod(mods.HR)) {
        od_multiplier = 1.4;
    } else if(parsed_mods.hasMod(mods.EZ)) {
        od_multiplier = 0.5;
    }

    od = beatmap.od * od_multiplier;
    odms = od0_ms - Math.ceil(od_ms_step * od);
    odms = Math.min(od0_ms, Math.max(od10_ms));

    odms /= speed;

    od = (od0_ms - odms) / od_ms_step;

    let hp = 1;
    let hp_multiplier = 1;

    if(parsed_mods.hasMod(mods.HR)) {
        hp_multiplier = 1.4;
    } else if(parsed_mods.hasMod(mods.EZ)) {
        hp_multiplier = 0.5;
    }

    hp = beatmap.hp * hp_multiplier;

    if(hp > 10) hp = 10;

    difficulty_data.modded_ar = ar;
    difficulty_data.modded_cs = cs;
    difficulty_data.modded_od = od;
    difficulty_data.modded_hp = hp;

    if(parsed_mods.hasMod("DA")) {
        const mod = parsed_mods.getMod("DA");

        if(mod.settings?.drain_rate) { difficulty_data.modded_hp = mod.settings.drain_rate; }
        if(mod.settings?.overall_difficulty) { difficulty_data.modded_od = mod.settings.overall_difficulty; }
        if(mod.settings?.approach_rate) { difficulty_data.modded_ar = mod.settings.approach_rate; }
        if(mod.settings?.circle_size) { difficulty_data.modded_cs = mod.settings.circle_size; }
    }

    return difficulty_data;
}
