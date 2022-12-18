import { getLazerScore, getModString, mods } from "./Osu";
import { getPerformanceLive } from "./Performance/PerformanceLive";
import { getSessions } from "./Session";

export async function processScores(user, scores, onScoreProcessUpdate) {
    onScoreProcessUpdate('Preparation');
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
    onScoreProcessUpdate('Fullcombo rate');
    data.fcRate = data.total.is_fc / data.clears;

    //best scores
    onScoreProcessUpdate('Best scores');
    data.bestScores = getBestScores(scores);



    return data;
}

function prepareScores(scores, onScoreProcessUpdate) {
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