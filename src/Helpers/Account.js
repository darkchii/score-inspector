import { GetAPI, GetOsuApiRedirect, parseReadableStreamToJson } from "./Misc";
import config from '../config.json';
import axios from "axios";

export async function IsUserLoggedInUnsafe() {
    const token = localStorage.getItem('auth_token');
    const user_id = localStorage.getItem('auth_osu_id');
    const username = localStorage.getItem('auth_username');

    if (token && user_id && username) {
        return true;
    }
    return false;
}

export async function LoginUser(code) {
    const response = await fetch(`${GetAPI()}login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            code: code,
            is_dev: config.USE_DEV_API,
            redirect: GetOsuApiRedirect()
        })
    });
    return response;
}

export async function IsUserLoggedIn() {
    const token = localStorage.getItem('auth_token');
    const user_id = localStorage.getItem('auth_osu_id');
    // const username = localStorage.getItem('auth_username');

    if (token && user_id) {
        const res = await fetch(`${GetAPI()}login/validate_token`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                token: token,
                user_id: user_id
            })
        });
        const body = await parseReadableStreamToJson(res.body);

        return body !== undefined && body !== null && body.valid;
    } else {
        return false;
    }
}

export async function GetUser(osu_id) {
    try{
        const res = await axios.get(`${GetAPI()}login/get/${osu_id}`);
        if(res.data!==null && res.data.osu_id.toString()===osu_id.toString()){
            return res.data;
        }
        return null;
    }catch(e){
        console.log(e);
        return null;
    }
}