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

export async function getLeaderboard(stat, limit, offset, country){
    let leaderboard = null;
    try {
        const url = `${GetAPI()}leaderboards/${stat}?limit=${limit}&offset=${offset}${country ? `&country=${country}` : ""}`;
        const res = await axios.get(url, { headers: { "Access-Control-Allow-Origin": "*" } });
        console.log(res);
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
        const url = `${GetAPI()}scores/${user_id}${allowLoved ? "?loved=true" : ""}`;
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