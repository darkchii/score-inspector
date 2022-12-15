import axios from "axios";
import config from "../config.json";

export function getAltAPIURL() {
    return (config.USE_DEV_API) ? config.OSU_TEST_API_ALT : config.OSU_API_ALT;
}

export async function findUsers(query) {
    let users = [];
    try {
        const _users = await axios.get(`${getAltAPIURL()}users/find/${query}`);
        users = _users.data;
    } catch (e) {
    }
    return users;
}

export async function getUser(user_id) {
    let user = null;
    try {
        const _user = await axios.get(`${getAltAPIURL()}users/find/${user_id}?single=true`);
        user = _user.data;
    } catch (e) {
    }
    return user;
}

export async function getUserScores(user_id, allowLoved) {
    let _scores = null;
    try {
        const url = `${getAltAPIURL()}scores/${user_id}${allowLoved ? "?loved=true" : ""}`;
        const res = await axios.get(url, { headers: { "Access-Control-Allow-Origin": "*" } });
        _scores = res.data;
    } catch (err) {
        return null;
    }
    return _scores;
}

export async function getUserTrackerStatus(user_id) {
    const currentlyTracking = await axios.get(`${(config.USE_DEV_API) ? config.OSU_TEST_API : config.OSU_API}proxy/aHR0cHM6Ly9vc3VhbHQucmVzcGVrdGl2ZS5wdy9hcGkvY3VycmVudA==`, { headers: { "Access-Control-Allow-Origin": "*" } });

    if (currentlyTracking.data === undefined || currentlyTracking.data.length === 0) {
        return false;
    }

    const existing = currentlyTracking.data.filter(user => parseInt(user.user_id) === parseInt(user_id));
    if (existing.length > 0) {
        return existing[0];
    }

    return false;
}