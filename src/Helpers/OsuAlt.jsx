import axios from "axios";
import config from "../config.json";
import { GetAPI, range } from "./Misc";
import moment from "moment";

export async function findUsers(query) {
    let users = [];
    try {
        const _users = await axios.get(`${GetAPI()}users/alt/find/${query}`);
        users = _users.data;
    } catch (e) {
        console.warn(e);
    }
    return users;
}

export async function isUserRegistered(id) {
    let _registered = false;
    try {
        const url = `${GetAPI()}users/alt/registered/${id}`;
        const res = await axios.get(url, { headers: { "Access-Control-Allow-Origin": "*" } });
        _registered = res.data.registered;
    } catch (err) {
        console.warn(err);
        _registered = false;
    }
    return _registered;
}

export async function getLeaderboard(stat, limit, offset, country) {
    let leaderboard = null;
    try {
        const url = `${GetAPI()}leaderboards/${stat}?limit=${limit}&offset=${offset}${country && country !== 'world' ? `&country=${country}` : ""}`;
        const res = await axios.get(url, { headers: { "Access-Control-Allow-Origin": "*" } });
        leaderboard = res.data;
    } catch (err) {
        console.warn(err);
        return null;
    }
    return leaderboard;
}

export async function getUser(user_id) {
    let user = null;
    try {
        const _user = await axios.get(`${GetAPI()}users/find/${user_id}?single=true`);
        user = _user.data;
    } catch (e) {
        console.warn(e);
    }
    return user;
}

export async function getUserScores(user_id, allowLoved, onScoreDownloadProgress) {
    let _scores = null;
    try {
        const url = `${GetAPI()}scores/user/${user_id}${allowLoved ? "?approved=1,2,4" : ""}`;
        const config = {
            onDownloadProgress: (progressEvent) => {
                onScoreDownloadProgress?.(progressEvent);
            }
        }
        const res = await axios.get(url, { headers: { "Access-Control-Allow-Origin": "*" }, ...config });
        _scores = res.data;
    } catch (err) {
        console.warn(err);
        return null;
    }
    return _scores;
}

export async function getPopulation() {
    let _pop = null;
    try {
        const url = `${GetAPI()}country_list`;
        const res = await axios.get(url, { headers: { "Access-Control-Allow-Origin": "*" }, ...config });
        _pop = res.data;
    } catch (err) {
        console.warn(err);
        return null;
    }
    return _pop;
}

export async function getBeatmapScores(beatmap_id, limit = 500, offset = 0) {
    let _scores = null;
    try {
        const url = `${GetAPI()}scores/beatmap/${beatmap_id}?${limit > 0 ? `limit=${limit}` : ""}${offset > 0 ? `?offset=${offset}` : ""}`;
        const res = await axios.get(url, { headers: { "Access-Control-Allow-Origin": "*" }, ...config });
        _scores = res.data;
    } catch (err) {
        console.warn(err);
        return null;
    }
    return _scores;
}

export async function getUserTrackerStatus(user_id) {
    const currentlyTracking = await axios.get(`${(config.USE_DEV_API) ? config.API_DEV : config.API}proxy/aHR0cHM6Ly9vc3VhbHQucmVzcGVrdGl2ZS5wdy9hcGkvY3VycmVudA==`, { headers: { "Access-Control-Allow-Origin": "*" } });

    if (currentlyTracking.data === undefined || currentlyTracking.data.length === 0) {
        return false;
    }

    const existing = currentlyTracking.data.filter(user => parseInt(user.user_id) === parseInt(user_id));
    if (existing.length > 0) {
        return existing[0];
    }

    return false;
}

export async function getBestScores(period, stat, limit, loved) {
    let scores = null;
    const url = `${GetAPI()}scores/best?stat=${stat}&limit=${limit}&period=${period}${loved ? "&include_loved=true" : ""}`;
    const res = await axios.get(url, { headers: { "Access-Control-Allow-Origin": "*" } });
    scores = res?.data;
    return scores;
}

export async function getScoreActivity(interval = 72, period = 'h') {
    try {
        let activity = null;
        const url = `${GetAPI()}scores/activity?period_amount=${interval}&period=${period}`;
        const res = await axios.get(url, { headers: { "Access-Control-Allow-Origin": "*" } });
        activity = res?.data?.[0];
        return activity;
    } catch (e) {
        console.warn(e);
        return null;
    }
}

export async function getScoreStats() {
    let stats = null;
    const url = `${GetAPI()}scores/stats`;
    const res = await axios.get(url, { headers: { "Access-Control-Allow-Origin": "*" } });
    stats = res?.data;
    return stats;
}

export async function getCompletionData(scores, beatmaps) {
    console.log(scores);
    console.log(beatmaps);
    const completion = {};

    let spread = ["0-1", "1-2", "2-3", "3-4", "4-5", "5-6", "6-7", "7-8", "8-9", "9-10", "10-11"];
    completion.cs = [];
    for (const range of spread) {
        const is_last = range === spread[spread.length - 1];
        let perc = 100;
        let min = parseInt(range.split("-")[0]);
        let max = parseInt(range.split("-")[1]);
        let range_output = `${min}-${max}`;
        if (is_last) range_output = `${min}+`;
        let filtered_scores = scores.filter(score => score.beatmap.cs >= min && (is_last ? true : score.beatmap.cs < max));
        let filtered_beatmaps = beatmaps.filter(beatmap => beatmap.cs >= min && (is_last ? true : beatmap.cs < max));
        perc = filtered_scores.length / filtered_beatmaps.length * 100;
        completion.cs.push({
            range: range_output, min, max, completion: perc, scores: filtered_scores.length, beatmaps: filtered_beatmaps.length
        });
    }

    completion.ar = [];
    for (const range of spread) {
        const is_last = range === spread[spread.length - 1];
        let perc = 100;
        let min = parseInt(range.split("-")[0]);
        let max = parseInt(range.split("-")[1]);
        let range_output = `${min}-${max}`;
        if (is_last) range_output = `${min}+`;
        let filtered_scores = scores.filter(score => score.beatmap.ar >= min && (is_last ? true : score.beatmap.ar < max));
        let filtered_beatmaps = beatmaps.filter(beatmap => beatmap.ar >= min && (is_last ? true : beatmap.ar < max));
        perc = filtered_scores.length / filtered_beatmaps.length * 100;
        completion.ar.push({
            range: range_output, min, max, completion: perc, scores: filtered_scores.length, beatmaps: filtered_beatmaps.length
        });
    }

    completion.od = [];
    for (const range of spread) {
        const is_last = range === spread[spread.length - 1];
        let perc = 100;
        let min = parseInt(range.split("-")[0]);
        let max = parseInt(range.split("-")[1]);
        let range_output = `${min}-${max}`;
        if (is_last) range_output = `${min}+`;
        let filtered_scores = scores.filter(score => score.beatmap.od >= min && (is_last ? true : score.beatmap.od < max));
        let filtered_beatmaps = beatmaps.filter(beatmap => beatmap.od >= min && (is_last ? true : beatmap.od < max));
        perc = filtered_scores.length / filtered_beatmaps.length * 100;
        completion.od.push({
            range: range_output, min, max, completion: perc, scores: filtered_scores.length, beatmaps: filtered_beatmaps.length
        });
    }

    completion.hp = [];
    for (const range of spread) {
        const is_last = range === spread[spread.length - 1];
        let perc = 100;
        let min = parseInt(range.split("-")[0]);
        let max = parseInt(range.split("-")[1]);
        let range_output = `${min}-${max}`;
        if (is_last) range_output = `${min}+`;
        let filtered_scores = scores.filter(score => score.beatmap.hp >= min && (is_last ? true : score.beatmap.hp < max));
        let filtered_beatmaps = beatmaps.filter(beatmap => beatmap.hp >= min && (is_last ? true : beatmap.hp < max));
        perc = filtered_scores.length / filtered_beatmaps.length * 100;
        completion.hp.push({
            range: range_output, min, max, completion: perc, scores: filtered_scores.length, beatmaps: filtered_beatmaps.length
        });
    }

    spread = range(moment.utc().year() - 2007 + 1, 2007);
    completion.years = [];
    for (const year of spread) {
        const moment_year = moment.utc().year(year);
        console.log(moment_year);
        let perc = 100;

        let filtered_scores = scores.filter(score => score.beatmap.approved_date_moment.utc().isSame(moment_year, 'year'));
        let filtered_beatmaps = beatmaps.filter(beatmap => beatmap.approved_date_moment.utc().isSame(moment_year, 'year'));

        perc = filtered_scores.length / filtered_beatmaps.length * 100;
        completion.years.push({
            range: year, completion: perc, scores: filtered_scores.length, beatmaps: filtered_beatmaps.length
        });
    }

    spread = ["0-1", "1-2", "2-3", "3-4", "4-5", "5-6", "6-7", "7-8", "8-9", "9-10", "10-20"];
    completion.stars = [];
    for (const range of spread) {
        const is_last = range === spread[spread.length - 1];
        let perc = 100;
        let min = parseInt(range.split('-')[0]);
        let max = parseInt(range.split('-')[1]);
        let filtered_scores = scores.filter(score => score.beatmap.stars_rounded >= min && (is_last ? true : score.beatmap.stars_rounded < max));
        let filtered_beatmaps = beatmaps.filter(beatmap => beatmap.stars_rounded >= min && (is_last ? true : beatmap.stars_rounded < max));
        perc = filtered_scores.length / filtered_beatmaps.length * 100;
        completion.stars.push({
            range: (max < 20 ? `${range}*` : (range.split('-')[0] + '*+')), min, max, completion: perc, scores: filtered_scores.length, beatmaps: filtered_beatmaps.length
        });
    }

    spread = ["0-60", "60-120", "120-180", "180-240", "240-300", "300-360", "360-420", "420-480", "480-540", "540-600", "600-99999"];
    completion.length = [];
    for (const range of spread) {
        let perc = 100;
        let min = parseInt(range.split('-')[0]);
        let max = parseInt(range.split('-')[1]);
        let filtered_scores = scores.filter(score => score.beatmap.length >= min && score.beatmap.length < max);
        let filtered_beatmaps = beatmaps.filter(beatmap => beatmap.length >= min && beatmap.length < max);
        perc = filtered_scores.length / filtered_beatmaps.length * 100;
        completion.length.push({
            range: (max < 99999 ? range : (range.split('-')[0] + '+')), min, max, completion: perc, scores: filtered_scores.length, beatmaps: filtered_beatmaps.length
        });
    }

    spread = ["0-100", "100-200", "200-300", "300-400", "400-500", "500-600", "600-700", "700-800", "800-900", "900-1000", "1000-99999"];
    completion.max_combo = [];
    for (const range of spread) {
        let perc = 100;
        let min = parseInt(range.split('-')[0]);
        let max = parseInt(range.split('-')[1]);
        let filtered_scores = scores.filter(score => score.beatmap.maxcombo >= min && score.beatmap.maxcombo < max);
        let filtered_beatmaps = beatmaps.filter(beatmap => beatmap.maxcombo >= min && beatmap.maxcombo < max);
        perc = filtered_scores.length / filtered_beatmaps.length * 100;
        completion.max_combo.push({
            range: (max < 99999 ? range : (range.split('-')[0] + '+')), min, max, completion: perc, scores: filtered_scores.length, beatmaps: filtered_beatmaps.length
        });
    }

    return completion;
}