import axios from "axios";
import config from "../config.json";

export function getAPIURL() {
    return (config.USE_DEV_API) ? config.OSU_TEST_API : config.OSU_API;
}

export async function getUser(user_id) {
    let user = null;
    try{
        const _user = await axios.get(`${getAPIURL()}users/${user_id}`);
        user = _user.data;
    }catch(e){
    }
    return user;
}