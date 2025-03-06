import moment from "moment";
import { GetAPI, sleep } from "./Misc";
import { computeAccuracy, getLazerScore, getRankFromAccuracy, MassCalculatePerformance } from "./Osu";
import { getSessions } from "./Session";
import { getPeriodicData } from "./ScoresPeriodicProcessor";
import axios from "axios";
import { getCalculator } from "./Performance/Performance";
import Mods from "./Mods";
import _, { round } from "lodash";
import OsuHitWindows from "./Performance/Standard/OsuHitWindows";
import HitResult from "./Performance/HitResult";
import BeatmapDifficultyInfo from "./Performance/BeatmapDifficultyInfo";
import { getCompletionData } from "./OsuAlt";

const FEEDBACK_SLEEP_TIME = 100; // give the browser bit of breathing room to update the UI before each intensive task
export async function processScores(user, scores, onCallbackError, onScoreProcessUpdate, allow_loved) {
    onScoreProcessUpdate('Preparing scores');
    await sleep(FEEDBACK_SLEEP_TIME);
    scores = prepareScores(user, scores);
    const beatmaps = user.beatmaps.map(beatmap => prepareBeatmap(beatmap));

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
        legacy_scores: 0,
        average_pp: 0,
        clears: scores.length,
        total_beatmaps: 0,
        total: {
            pp: 0,
            score: 0,
            acc: 0,
            length: 0,
            star_rating: 0,
            // scoreLazerClassic: 0,
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
        latest_scores: [],
        beatmaps: beatmaps,
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
        data.total.star_rating += score.beatmap.difficulty_data?.star_rating ?? 0;
        // data.total.scoreLazerClassic += score.scoreLazerClassic ?? 0;
        data.total.scoreLazerStandardised += score.scoreLazerStandardised ?? 0;
        data.total.is_fc += score.is_fc ?? 0;

        data.legacy_scores += score.beatmap.difficulty_data?.is_legacy ? 1 : 0;
    }

    await sleep(FEEDBACK_SLEEP_TIME);
    onScoreProcessUpdate('Average data');
    if (data.clears > 0) {
        data.average.pp = data.total.pp / data.clears;
        data.average.score = data.total.score / data.clears;
        data.average.scoreLazerStandardised = data.total.scoreLazerStandardised / data.clears;
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

    onScoreProcessUpdate('Beatmap counts');
    await sleep(FEEDBACK_SLEEP_TIME);
    data.beatmaps_counts = (await axios.get(`${GetAPI()}beatmaps/count_periodic?include_loved=true`))?.data;
    data.beatmaps_count_total = beatmaps.length;

    onScoreProcessUpdate('Periodic data');
    await sleep(FEEDBACK_SLEEP_TIME);
    data.periodic = {};
    data.periodic['y'] = getPeriodicData(user, scores, data.beatmaps_counts, 'y', data);
    data.periodic['m'] = getPeriodicData(user, scores, data.beatmaps_counts, 'm', data);
    data.periodic['d'] = getPeriodicData(user, scores, data.beatmaps_counts, 'd', data);

    onScoreProcessUpdate('Active days');
    await sleep(FEEDBACK_SLEEP_TIME);
    data.activeDays = getActiveDays(scores);

    onScoreProcessUpdate('Average day spread');
    await sleep(FEEDBACK_SLEEP_TIME);
    data.averageDaySpread = getDayPlaycountSpread(scores);

    onScoreProcessUpdate('Rate change spread');
    await sleep(FEEDBACK_SLEEP_TIME);
    data.averageRateChangeSpread = getRateChangeSpread(scores);

    onScoreProcessUpdate('Latest scores');
    await sleep(FEEDBACK_SLEEP_TIME);
    scores.sort((a, b) => b.date_played_moment.valueOf() - a.date_played_moment.valueOf());
    data.latest_scores = scores.slice(0, 20);

    onScoreProcessUpdate('Detailed data');
    await sleep(FEEDBACK_SLEEP_TIME);
    data.ultra_detailed = await getDetailedData(data, scores);

    if(!user.inspector_user.is_completion_mode){
        onScoreProcessUpdate('Completion data');
        await sleep(FEEDBACK_SLEEP_TIME);
        data.completion = await getCompletionData(scores, beatmaps);
    }

    return data;
}

export function prepareScores(user, scores) {
    for (let i = 0; i < scores.length; i++) {
        scores[i] = prepareScore(scores[i], user);
    }

    //sort by time
    scores.sort((a, b) => a.date_played_moment.valueOf() - b.date_played_moment.valueOf());

    return scores;
}

export function prepareScore(score, user = null) {
    score.is_loved = score.beatmap.approved === 4;
    if (user !== null) {
        score.is_unique_ss = user.alt.unique_ss.includes(score.beatmap_id);
        score.is_unique_fc = user.alt.unique_fc.includes(score.beatmap_id);
        score.is_unique_dt_fc = user.alt.unique_dt_fc.includes(score.beatmap_id);
    }
    score.pp = Math.max(0, parseFloat(score.pp));
    score.date_played_moment = moment(score.date_played).local();

    //only if score.mods isnt of type Mods
    if (!(score.mods instanceof Mods)) {
        score.mods = new Mods(parseInt(score.enabled_mods), score.mods);
    }
    delete score.enabled_mods;



    if (score.beatmap.difficulty_data) {
        score.beatmap.difficulty_data = applyModdedAttributes(score.beatmap, score.mods);

        score.beatmap.difficulty_data.aim_difficulty = parseFloat(score.beatmap.difficulty_data.aim_difficulty);
        score.beatmap.difficulty_data.speed_difficulty = parseFloat(score.beatmap.difficulty_data.speed_difficulty);
        score.beatmap.difficulty_data.flashlight_difficulty = parseFloat(score.beatmap.difficulty_data.flashlight_difficulty);
        score.beatmap.difficulty_data.star_rating = parseFloat(score.beatmap.difficulty_data.star_rating);
        score.beatmap.difficulty_data.slider_factor = parseFloat(score.beatmap.difficulty_data.slider_factor ?? 1);
        score.beatmap.difficulty_data.speed_note_count = parseFloat(score.beatmap.difficulty_data.speed_note_count ?? 0);

        score.beatmap.difficulty_data.aim_difficult_slider_count = parseFloat(score.beatmap.difficulty_data.aim_difficult_slider_count ?? 0);
        score.beatmap.difficulty_data.aim_difficult_strain_count = parseFloat(score.beatmap.difficulty_data.aim_difficult_strain_count ?? 0);
        score.beatmap.difficulty_data.speed_difficult_strain_count = parseFloat(score.beatmap.difficulty_data.speed_difficult_strain_count ?? 0);

        score.beatmap.difficulty_data.overall_difficulty = parseFloat(score.beatmap.difficulty_data.overall_difficulty);
        score.beatmap.difficulty_data.approach_rate = parseFloat(score.beatmap.difficulty_data.approach_rate);
        score.beatmap.difficulty_data.circle_size = parseFloat(score.beatmap.difficulty_data.circle_size);
        score.beatmap.difficulty_data.drain_rate = parseFloat(score.beatmap.difficulty_data.drain_rate);
    }



    score.accuracy = parseFloat(score.accuracy);

    if (score.statistics && score.maximum_statistics) {
        score.accuracy = computeAccuracy(score) * 100; //for some reason, osualt sometimes has wrong accuracy values
        score.rank = getRankFromAccuracy(score, score.accuracy / 100);
    }

    score.beatmap = prepareBeatmap(score.beatmap, score.mods);

    score.totalhits = score.count300 + score.count100 + score.count50;

    score.is_fc = isScoreFullcombo(score);
    score.is_pfc = score.beatmap.maxcombo - score.combo === 0;
    // score.scoreLazerClassic = Math.floor(getLazerScore(score));
    score.scoreLazerStandardised = Math.floor(getLazerScore(score));

    score.estimated_pp = getCalculator('live', {
        score: score,
    }).total;

    if (!score.user && user) {
        score.user = user.alt;
    }

    return score;
}

export function prepareBeatmap(beatmap, parsed_mods = null) {
    parsed_mods = parsed_mods ?? new Mods(0);

    beatmap.stars = parseFloat(beatmap.stars);
    beatmap.stars_rounded = round(beatmap.stars, 2);
    beatmap.objects = beatmap.sliders + beatmap.circles + beatmap.spinners;
    beatmap.modded_length = beatmap.length;
    beatmap.modded_bpm = beatmap.bpm;
    beatmap.approved_date_moment = moment(beatmap.approved_date);

    if (parsed_mods) {
        beatmap.modded_length /= parsed_mods.speed;
        beatmap.modded_bpm *= parsed_mods.speed;
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
                if (!Mods.hasMod(score.mods, "NF")) {
                    if ((_scores.best_sr === null || (score.beatmap.difficulty_data?.star_rating ?? 0) > (_scores.best_sr.beatmap.difficulty_data?.star_rating ?? 0))) {
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
    const is_fc = (score.countmiss === 0 && ((score.beatmap.maxcombo - score.combo) <= score.count100)) || score.perfect === 1 || score.rank === 'X' || score.rank === 'XH';
    return is_fc;
}

function getDayPlaycountSpread(scores) {
    //ranges
    //const ranges = ['0-1', '1-2', '2-3', '3-4', '4-5', '5-6', '6-7', '7-8', '8-9', '9-10', '10-11', '11-12', '12-13', '13-14', '14-15', '15-16', '16-17', '17-18', '18-19', '19-20', '20-21', '21-22', '22-23', '23-24'];
    // const hours = ["12 AM", "1 AM", "2 AM", "3 AM", "4 AM", "5 AM", "6 AM", "7 AM", "8 AM", "9 AM", "10 AM", "11 AM", "12 PM", "1 PM", "2 PM", "3 PM", "4 PM", "5 PM", "6 PM", "7 PM", "8 PM", "9 PM", "10 PM", "11 PM"];
    const hours = ["00:00", "01:00", "02:00", "03:00", "04:00", "05:00", "06:00", "07:00", "08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00", "20:00", "21:00", "22:00", "23:00"];
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

const RATE_MIN = 0.5;
const RATE_MAX = 2.0;
const RATE_DETAIL = 0.1; //show every 0.05 rate, inbetween values will be rounded to the nearest value
function getRateChangeSpread(scores, detail = RATE_DETAIL) {
    const values = [];

    for (let i = RATE_MIN; i <= RATE_MAX; i += detail) {
        values[i.toFixed(2)] = 0;
    }

    scores.forEach(score => {
        //round score.mods.speed to nearest RATE_DETAIL
        let rate = _.floor(parseFloat(score.mods.speed), 2);
        rate = Math.floor(rate / detail) * detail;
        rate = rate.toFixed(2);

        if (!values[rate]) {
            values[rate] = 0;
        }
        values[rate]++;
    });

    const objects = [];
    Object.keys(values).forEach(key => {
        objects.push({ rate: key, count: values[key] });
    });

    //sort by rate
    objects.sort((a, b) => parseFloat(a.rate) - parseFloat(b.rate));

    return objects;
}

const ar_ms_step1 = 120;
const ar_ms_step2 = 150;

const ar0_ms = 1800;
const ar5_ms = 1200;

const od_ms_step = 6;
const od0_ms = 79.5;
const od10_ms = 19.5;
function applyModdedAttributes(beatmap, parsed_mods) {
    let difficulty_data = JSON.parse(JSON.stringify(beatmap.difficulty_data));
    if (difficulty_data.is_corrected) return difficulty_data;
    let speed = parsed_mods.speed;

    if (!difficulty_data.approach_rate) {
        let ar_multiplier = 1;
        let ar;
        let ar_ms;

        if (Mods.hasMod(parsed_mods, "HR")) {
            ar_multiplier = 1.4;
        } else if (Mods.hasMod(parsed_mods, "EZ")) {
            ar_multiplier = 0.5;
        }

        let original_ar = beatmap.ar;
        if (Mods.hasMod(parsed_mods, "DA") && Mods.containsSetting(parsed_mods, "approach_rate")) {
            original_ar = Mods.getModSetting(parsed_mods, "DA", "approach_rate");
        }
        original_ar = Number(original_ar);

        ar = original_ar * ar_multiplier;

        if (ar <= 5)
            ar_ms = ar0_ms - ar_ms_step1 * ar;
        else
            ar_ms = ar5_ms - ar_ms_step2 * (ar - 5);

        ar_ms /= speed;

        if (ar <= 5)
            ar = (ar0_ms - ar_ms) / ar_ms_step1;
        else
            ar = 5 + (ar5_ms - ar_ms) / ar_ms_step2;

        difficulty_data.approach_rate = ar;
    }

    if (!difficulty_data.circle_size) {
        let cs = 1;
        let cs_multiplier = 1;

        if (Mods.hasMod(parsed_mods, "HR")) {
            cs_multiplier = 1.3;
        } else if (Mods.hasMod(parsed_mods, "EZ")) {
            cs_multiplier = 0.5;
        }

        let original_cs = beatmap.cs;
        if (Mods.hasMod(parsed_mods, "DA") && Mods.containsSetting(parsed_mods, "circle_size")) {
            original_cs = Mods.getModSetting(parsed_mods, "DA", "circle_size");
        }
        original_cs = Number(original_cs);

        cs = original_cs * cs_multiplier;

        if (cs > 10) cs = 10;

        difficulty_data.circle_size = cs;
    }

    if (!difficulty_data.overall_difficulty) {
        let od = 1;
        let odms = 1;
        let od_multiplier = 1;

        if (Mods.hasMod(parsed_mods, "HR")) {
            od_multiplier = 1.4;
        } else if (Mods.hasMod(parsed_mods, "EZ")) {
            od_multiplier = 0.5;
        }

        let original_od = beatmap.od;
        if (Mods.hasMod(parsed_mods, "DA") && Mods.containsSetting(parsed_mods, "overall_difficulty")) {
            original_od = Mods.getModSetting(parsed_mods, "DA", "overall_difficulty");
        }
        original_od = Number(original_od);

        od = original_od * od_multiplier;
        odms = od0_ms - Math.ceil(od_ms_step * od);
        odms = Math.min(od0_ms, Math.max(od10_ms, odms));

        odms /= speed;

        od = (od0_ms - odms) / od_ms_step;

        difficulty_data.overall_difficulty = od;
    }

    if (!difficulty_data.drain_rate) {
        let hp = 1;
        let hp_multiplier = 1;

        if (Mods.hasMod(parsed_mods, "HR")) {
            hp_multiplier = 1.4;
        } else if (Mods.hasMod(parsed_mods, "EZ")) {
            hp_multiplier = 0.5;
        }

        let original_hp = beatmap.hp;
        if (Mods.hasMod(parsed_mods, "DA") && Mods.containsSetting(parsed_mods, "drain_rate")) {
            original_hp = Mods.getModSetting(parsed_mods, "DA", "drain_rate");
        }
        original_hp = Number(original_hp);

        hp = original_hp * hp_multiplier;

        if (hp > 10) hp = 10;

        difficulty_data.drain_rate = hp;
    }

    difficulty_data.is_corrected = true;

    return difficulty_data;
}

async function getDetailedData(data, scores) {
    const detailed_data = {};

    detailed_data.rate_change_spread = getRateChangeSpread(scores, 0.01);
    detailed_data.session_time_spread = getSessionTimeSpread(data.sessions);
    detailed_data.rate_change_to_stars_spread = getRateChangeToStarsSpread(scores);
    detailed_data.mod_spread = getModSpread(scores);

    return detailed_data;
}

function getSessionTimeSpread(sessions) {
    //range detail is hour,
    //so 0-1 hour long session, 1-2 hour long session etc.
    //some users are insane and play for >24 hours, but we will cap it at 24

    const values = {};

    for (let i = 0; i <= 24; i++) {
        values[i] = 0;
    }

    sessions.forEach(session => {
        let hours = Math.floor(session.length / 3600);
        if (hours > 24) hours = 24;
        values[hours]++;
    });

    //convert to array
    const objects = [];
    Object.keys(values).forEach(key => {
        objects.push({ hour: key, count: values[key] });
    });

    return objects;
}

function getRateChangeToStarsSpread(scores) {
    //get the average rate change value for each base star rating range (0-1, 1-2, 2-3 etc.)
    //limit to 10

    const values = [];

    for (let i = 0; i <= 10; i++) {
        values[i] = {
            stars: i,
            rate: 0,
            lowest: -1,
            highest: -1,
            count: 0,
            result: 0
        }
    }

    scores.forEach(score => {
        let rate = parseFloat(score.mods.speed);
        let stars = score.beatmap.stars;
        let range = Math.floor(stars);

        if (range > 10) range = 10;

        values[range].rate += rate;
        values[range].count++;

        //-1 means not set, rate can never be negative
        if (values[range].lowest === -1 || rate < values[range].lowest) values[range].lowest = rate;
        if (values[range].highest === -1 || rate > values[range].highest) values[range].highest = rate;
    });

    values.forEach(value => {
        if (value.lowest === -1) value.lowest = 0;
        if (value.highest === -1) value.highest = 0;
        if (value.count === 0) return;
        value.result = value.rate / value.count;
    });

    return values.map(value => {
        return {
            stars: value.stars,
            rate: value.result,
            count: value.count,
            lowest: value.lowest,
            highest: value.highest
        }
    });
}

function getModSpread(scores) {
    const mods = Mods.getAllMods();

    const values = {};

    mods.mods_data.forEach(mod => {
        values[mod.acronym] = {
            count: 0,
            mod: mod
        }
    });

    scores.forEach(score => {
        score.mods.mods_data.forEach(mod => {
            if (mod.acronym === 'NM') return;
            if (!values[mod.acronym]) {
                console.error(`Mod ${mod.acronym} not found in mods list`);
                console.error(score);
            }
            values[mod.acronym].count++;
        });
    });

    //convert to array
    const objects = [];

    Object.keys(values).forEach(key => {
        objects.push({ mod: values[key].mod, count: values[key].count });
    });

    objects.sort((a, b) => b.count - a.count);

    return objects;
}