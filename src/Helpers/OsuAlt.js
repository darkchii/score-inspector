import axios from "axios";
import config from "../config.json";
import { GetAPI } from "./Misc";

export async function findUsers(query) {
    let users = [];
    try {
        const _users = await axios.get(`${GetAPI()}users/alt/find/${query}`);
        users = _users.data;
    } catch (e) {
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
    }
    return user;
}

export async function getUserScores(user_id, allowLoved, onScoreDownloadProgress) {
    let _scores = null;
    try {
        console.warn("getUserScores was called!");
        const url = `${GetAPI()}scores/user/${user_id}${allowLoved ? "?include_loved=true" : ""}`;
        const config = {
            onDownloadProgress: (progressEvent) => {
                onScoreDownloadProgress?.(progressEvent);
            }
        }
        const res = await axios.get(url, { headers: { "Access-Control-Allow-Origin": "*" }, ...config });
        _scores = res.data;
    } catch (err) {
        return null;
    }
    return _scores;
}

export async function getBeatmapScores(beatmap_id, limit = 500, offset = 0){
    let _scores = null;
    try {
        const url = `${GetAPI()}scores/beatmap/${beatmap_id}?${limit > 0 ? `limit=${limit}` : ""}${offset > 0 ? `?offset=${offset}` : ""}`;
        const res = await axios.get(url, { headers: { "Access-Control-Allow-Origin": "*" }, ...config });
        _scores = res.data;
    } catch (err) {
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

export async function getScoreActivity(hours = 72) {
    try {
        let activity = null;
        const url = `${GetAPI()}scores/activity?hours=${hours}`;
        const res = await axios.get(url, {
            headers: {
                "Access-Control-Allow-Origin": "*", 'Cache-Control': 'no-cache',
                'Pragma': 'no-cache',
                'Expires': '0'
            }
        });
        activity = res?.data?.[0];
        return activity;
    } catch (e) {
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

export async function getCompletionData(user_id, allowLoved) {
    let data = null;
    const url = `${GetAPI()}scores/completion/${user_id}${allowLoved ? "?include_loved=true" : ""}`;
    const res = await axios.get(url, { headers: { "Access-Control-Allow-Origin": "*" } });
    data = res?.data;
    return data;
}