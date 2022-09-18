import moment from "moment";
import Papa from "papaparse";
import { calculatePP2016, calculatePPifFC, calculatePPifSS, getModString, getUserTrackerStatus, mods, naturalSorter } from "./helper";
import { getBeatmapCount, getBeatmapPacks, getBonusPerformance, getLazerScore, getSessions, getUser } from "./osu";
import { getPerformance2016 } from "./Performance/Performance2016";
import { getPerformanceLive } from "./Performance/PerformanceLive";

const processData = async (scores, cb, cbProc, allowLoved) => {
    let _user;

    try {
        _user = await getUser(scores[0].user_id);
    } catch (err) {
        alert(err);
        cb(false);
        return;
    }

    _user.isWorking = await getUserTrackerStatus(_user.id);

    cb(_user);

    var processed = {};
    processed.allowLoved = allowLoved;


    let bmCount = null;
    try {
        bmCount = await getBeatmapCount();
    } catch (err) {
        alert(`Unable to get beatmap information right now`);
        cb(false);
        return;
    }

    processed.beatmapInfo = {};
    processed.beatmapInfo.monthly = [];

    bmCount.data.forEach(monthData => {
        const y = monthData.year;
        const m = monthData.month;
        const c = monthData.amount;
        processed.beatmapInfo.monthly[`${y}-${m}-01`] = monthData;
    })

    var bm_maps = 0;
    var bm_score = 0;
    var bm_length = 0;
    processed.beatmapInfo.monthlyCumulative = [];
    Object.keys(processed.beatmapInfo.monthly).forEach(key => {
        const o = JSON.parse(JSON.stringify(processed.beatmapInfo.monthly[key]));
        o.amount = bm_maps += o.amount;
        o.score = bm_score += o.score;
        o.length = bm_length += o.length;
        processed.beatmapInfo.monthlyCumulative[key] = o;
    });

    // console.time('start calc');
    processed = await CalculateData(processed, scores, _user);
    processed = await calculatePackData(processed, scores);
    // console.timeEnd('start calc');
    cbProc(processed);
};

export async function processFile(file, allowLoved, cbProc, cbUser, cbScores, cb) {
    Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        worker: true,
        complete: async function (results) {
            if (testScores(results.data)) {
                if (!allowLoved) {
                    results.data = results.data.filter(score => parseInt(score.approved) < 4);
                }

                results.data.forEach(score => {
                    score = parseScore(score);
                });

                cbScores(results.data);
                cb();

                Promise.resolve(processData(results.data, res => {
                    cbUser(res);
                    cb();
                }, res => {
                    cbProc(res);
                    cb();
                }, allowLoved));
            } else {
                cbProc(false);
                cb();
            }
        }
    });
}

function parseScore(score) {
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

    score.scoreLazer = getLazerScore(score);

    return score;
}

async function CalculateData(processed, scores, _user) {
    const rankIndex = {
        "XH": 0,
        "X": 1,
        "SH": 2,
        "S": 3,
        "A": 4,
        "B": 5,
        "C": 6,
        "D": 7,
    };

    var ranks = [];
    ranks["XH"] = 0;
    ranks["X"] = 0;
    ranks["SH"] = 0;
    ranks["S"] = 0;
    ranks["A"] = 0;
    ranks["B"] = 0;
    ranks["C"] = 0;
    ranks["D"] = 0;
    var used_mods = [];
    var tags = [];
    var highest_sr = 0;

    processed = calculatePPdata(processed, scores);

    scores.forEach(score => {

        var is_fc = score.perfect === "1";

        if (!is_fc) {
            if (score.countmiss === 0 && score.maxcombo > 0) {
                const perc_fc = 100 / score.maxcombo * score.combo;
                is_fc = perc_fc >= 99;
            }
        }

        score.is_fc = is_fc;

        if (ranks[rankIndex[score.rank]] !== undefined) {
            ranks[rankIndex[score.rank]]++;
        } else {
            ranks[rankIndex[score.rank]] = 1;
        }

        if (score.tags.length > 0) {
            score.tags.trim().split(" ").forEach(tag => {
                const _tag = tag.trim().toString();
                if (tags[_tag] !== undefined) {
                    tags[_tag]++;
                } else {
                    tags[_tag] = 1;
                }
            });
        }

        if (used_mods.findIndex(m => m.mods === score.modString) === -1) {
            used_mods.push({
                mods: score.modString,
                value: 1
            });
        } else {
            used_mods.forEach((m) => {
                if (m.mods === score.modString) {
                    m.value++;
                }
            })
        }

        if (!(score.enabled_mods & mods.NF) && score.star_rating > highest_sr) {
            highest_sr = score.star_rating;
        }
    });

    used_mods.sort((a, b) => {
        if (a.value > b.value) { return -1; }
        if (a.value < b.value) { return 1; }
        return 0;
    })

    var improvedTags = [];
    for (const tag in tags) {
        improvedTags.push({
            tag: tag,
            value: tags[tag]
        });
    }

    improvedTags.sort((a, b) => {
        if (a.value > b.value) { return -1; }
        if (a.value < b.value) { return 1; }
        return 0;
    })

    processed.usedMods = used_mods;
    // processed.usedTags = tags;
    processed.usedTags = improvedTags;

    processed.rankCounts = ranks;

    processed.scoreCount = scores.length;

    var total_pp = 0;
    var total_sr = 0;
    var total_fc = 0;
    var total_length = 0;
    processed.ranked_score = 0;
    processed.ranked_scorelazer = 0;
    for await (const score of scores) {
        if (!isNaN(score.length)) {
            total_length += score.length;
        }
        if (!isNaN(score.pp)) {
            total_pp += score.pp;
        }
        if (!isNaN(score.stars)) {
            total_sr += score.stars;
        }
        if (score.is_fc) {
            total_fc++;
        }
        processed.ranked_score += score.score;
        processed.ranked_scorelazer += score.scoreLazer;
    }

    processed.total_pp = total_pp;
    processed.average_pp = total_pp / scores.length;
    processed.average_sr = total_sr / scores.length;
    processed.average_score = _user.statistics.ranked_score / scores.length;
    processed.highest_sr = highest_sr;
    processed.fc_rate = 100 / scores.length * total_fc;
    processed.total_length = total_length;
    processed.average_length = total_length / scores.length;

    const activeDays = new Set();
    scores.forEach(score => {
        // const cur = moment(score.date_played);
        // activeDays.add(cur.format("YYYY-MM-DD"));
        activeDays.add(new Date(score.date_played).toISOString().slice(0, 10));
    });
    processed.activeDays = activeDays;

    processed.topScores = getBestScores(scores);

    processed.sessions = getSessions(scores);

    return processed;
}

function getBestScores(scores) {
    let _scores = {
        best_pp: null,
        best_sr: null,
        best_score: null,
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

function calculatePPdata(processed, scores) {
    scores = calculatePPifFC(scores);
    scores = calculatePPifSS(scores);
    scores = calculatePP2016(scores);

    scores.sort((a, b) => {
        return b.pp - a.pp;
    });
    scores.forEach(score => { score.pp_weight = Math.pow(0.95, index); index++; });
    var index = 0;

    processed.weighted = {};

    processed.weighted.fc = 0;
    processed.weighted.ss = 0;
    processed.weighted.xexxar = 0;
    processed.weighted._2016 = 0;

    let xexxar_score_pp = 0;
    let xexxar_total_pp = 0;
    scores.forEach((score, index) => {
        xexxar_score_pp += score.pp * Math.pow(0.95, index);
        xexxar_total_pp += score.pp;
    });
    processed.weighted.xexxar = ((2 - 1) * xexxar_score_pp + 0.75 * xexxar_score_pp * (Math.log(xexxar_total_pp) / Math.log(xexxar_score_pp))) / 2;

    scores.forEach(score => {
        if (!isNaN(score.pp_fc.total)) {
            processed.weighted.fc += score.pp_fc.total * score.pp_fc.weight;
        }
        if (!isNaN(score.pp_ss.total)) {
            processed.weighted.ss += score.pp_ss.total * score.pp_ss.weight;
        }
        if (!isNaN(score.pp_2016.total)) {
            processed.weighted._2016 += score.pp_2016.total * score.pp_2016.weight;
        }
    });
    const bonus = getBonusPerformance(scores.length);
    processed.weighted.fc += bonus;
    processed.weighted.ss += bonus;
    processed.weighted._2016 += bonus;

    return processed;
}

async function calculatePackData(processed, scores) {
    const fetched_packs = await getBeatmapPacks(processed.allowLoved);
    let packs = [];

    Object.keys(fetched_packs).forEach(key => {
        packs.push({
            name: key,
            count: fetched_packs[key]
        });
    });

    processed.beatmap_packs = [];
    processed.beatmap_packs.individual = packs;

    processed.beatmap_packs.individual.forEach(pack => {
        pack.cleared = 0;
    });

    scores.forEach(score => {
        if (score.pack_id.length === 0) return;
        const _packs = score.pack_id.split(',');

        _packs.forEach(pack => {
            const index = processed.beatmap_packs.individual.findIndex(p => p.name === pack);
            if (index === -1) {
                return;
            }

            processed.beatmap_packs.individual[index].cleared++;
        });
    });

    processed.beatmap_packs.individual.sort((a, b) => {
        if (a.name > b.name) { return 1; }
        if (a.name < b.name) { return -1; }
        return 0;
    });

    return processed;
}

function testScores(scores) {
    let valid = true;
    scores.every(score => {
        if (score.user_id === undefined || score.beatmap_id === undefined) {
            valid = false;
            return false;
        }

        return true;
    });
    return valid;
}