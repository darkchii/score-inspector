import axios from "axios";
import config from "../config.json";

export function getAPIURL() {
    return (config.USE_DEV_API) ? config.OSU_TEST_API : config.OSU_API;
}

export async function getUser(user_id) {
    let user = null;
    try {
        const _user = await axios.get(`${getAPIURL()}users/${user_id}`);
        user = _user.data;
    } catch (e) {
    }

    try {
        let _scoreRank = await fetch(`${config.SCORE_API}${user.id}`).then((res) => res.json());
        if (_scoreRank !== undefined) {
            user.scoreRank = _scoreRank[0].rank;
        }
    } catch (err) {
        return null;
    }

    try {
        let _dailyUser = await axios.get(`${getAPIURL()}daily/${user.id}`, { headers: { "Access-Control-Allow-Origin": "*" } });
        if (_dailyUser !== undefined && _dailyUser.data.error === undefined) {
            user.daily = _dailyUser.data;
        }
    } catch (err) {
        user.daily = null;
    }


    return user;
}