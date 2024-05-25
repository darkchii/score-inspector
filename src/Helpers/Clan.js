import axios from "axios";
import { GetAPI, parseReadableStreamToJson } from "./Misc";

export async function CreateClan(data) {
    const response = await fetch(`${GetAPI()}clans/create`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });
    const body = await parseReadableStreamToJson(response.body);
    return body;
}

export async function UpdateClan(data) {
    const response = await fetch(`${GetAPI()}clans/update`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });
    const body = await parseReadableStreamToJson(response.body);
    return body;

}

export async function GetClan(id, login_user_id = null, login_user_token = null) {
    // const response = await fetch(`${GetAPI()}clans/get/${id}`);
    const response = await axios.post(`${GetAPI()}clans/get/${id}`, {
        login_user_id: login_user_id,
        login_user_token: login_user_token
    });
    return response.data;
}

export async function DeleteClan(data) {
    const response = await fetch(`${GetAPI()}clans/delete`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });
    const body = await parseReadableStreamToJson(response.body);
    return body;
}

export async function JoinRequestClan(clan_id, user_id, token) {
    const response = await axios.post(`${GetAPI()}clans/join_request`, {
        clan_id: clan_id,
        user_id: user_id,
        token: token
    });
    return response.data;
}

export async function AcceptJoinRequestClan(accepter_id, join_request_id, token, clan_id) {
    const response = await axios.post(`${GetAPI()}clans/accept_request`, {
        owner_id: accepter_id,
        join_request_id: join_request_id,
        token: token,
        clan_id: clan_id
    });
    return response.data;
}

export async function RejectJoinRequestClan(rejecter_id, join_request_id, token, clan_id) {
    const response = await axios.post(`${GetAPI()}clans/reject_request`, {
        owner_id: rejecter_id,
        join_request_id: join_request_id,
        token: token,
        clan_id: clan_id
    });
    return response.data;
}

export async function LeaveClan(user_id, token, clan_id) {
    const response = await axios.post(`${GetAPI()}clans/leave`, {
        user_id: user_id,
        token: token,
        clan_id: clan_id
    });
    return response.data;
}

export async function GetClanList() {
    const response = await axios.get(`${GetAPI()}clans/list`);
    return response.data;
}