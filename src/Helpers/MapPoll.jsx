import axios from "axios";
import { GetAPI } from "./Misc";
import { GetLoginIDUnsafe, GetLoginTokenUnsafe } from "./Account";

export async function GetCurrentPoll() {
    try {
        const user = await GetLoginIDUnsafe();
        const url = `${GetAPI()}poll/current/${user !== null ? user : ''}`;
        const res = await axios.get(url, { headers: { "Access-Control-Allow-Origin": "*" } });
        return res.data;
    } catch (err) {
        console.error(err);
        return null;
    }
}

export async function SubmitVote(map_id) {
    try {
        const login = await GetLoginIDUnsafe();
        const token = await GetLoginTokenUnsafe();
        const url = `${GetAPI()}poll/vote`;
        const res = await axios.post(url, { map_id, login, token });
        return res.data;
    } catch (err) {
        return null;
    }
}