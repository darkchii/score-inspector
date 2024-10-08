import axios from "axios";
import { GetAPI, parseReadableStreamToJson } from "./Misc";
import { GetFormattedName } from "./Account";
import { Box } from "@mui/material";

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

export async function RemoveClanMember(owner_id, member_id, token, clan_id) {
    const response = await axios.post(`${GetAPI()}clans/remove_member`, {
        owner_id: owner_id,
        member_id: member_id,
        token: token,
        clan_id: clan_id
    });
    return response.data;
}

export async function TransferClanOwnership(owner_id, new_owner_id, token, clan_id) {
    const response = await axios.post(`${GetAPI()}clans/transfer_owner`, {
        owner_id: owner_id,
        member_id: new_owner_id,
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

export async function GetClanList(page, sort, dir, limit, search = null) {
    const response = await axios.get(`${GetAPI()}clans/list?page=${page}&sort=${sort}&dir=${dir}&limit=${limit}&search=${search}`);
    return response.data;
}

export function FormatClanLog(clan, log) {
    // return 'Log format not implemented yet';
    const log_data = JSON.parse(log.data);
    switch (log_data.type) {
        case 'clan_create':
            return 'Clan created';
        case 'member_join':
            let joined_user = clan.logs_user_data.find(log => log.osu_id === log_data.user_id);
            return <Box sx={{
                display: 'flex'
            }}>
                <Box sx={{ ml: 1 }}> {GetFormattedName(joined_user ?? {})} </Box>
                <Box sx={{ ml: 1 }}> joined the clan </Box>
            </Box>;
        case 'member_leave':
            // return `${log_data.user_id} left the clan`;
            let left_user = clan.logs_user_data.find(log => log.osu_id === log_data.user_id);
            return <Box sx={{
                display: 'flex'
            }}>
                <Box sx={{ ml: 1 }}> {GetFormattedName(left_user ?? {})} </Box>
                <Box sx={{ ml: 1 }}> left the clan </Box>
            </Box>;
        case 'owner_transfer':
            const old_owner = clan.logs_user_data.find(log => log.osu_id === log_data.old_owner);
            const new_owner = clan.logs_user_data.find(log => log.osu_id === log_data.new_owner);
            //force single line (GetFormattedName causes a new line after it)
            return <Box sx={{
                display: 'flex'
            }}>
                <Box sx={{ ml: 1 }}> {GetFormattedName(old_owner ?? {})} </Box>
                <Box sx={{ ml: 1 }}> transferred ownership to </Box>
                <Box sx={{ ml: 1 }}> {GetFormattedName(new_owner ?? {})} </Box>
            </Box>;
        case 'clan_update':
            const old_data = JSON.parse(log_data.old_data);
            const new_data = JSON.parse(log_data.new_data);

            // Create a 3rd object to store the differences (omit keys with same values)
            const diff = Object.keys(new_data).reduce((acc, key) => {
                if (old_data[key] !== new_data[key]) {
                    acc[key] = new_data[key];
                }
                return acc;
            }, {});

            //if diff is empty, return null
            if (Object.keys(diff).length === 0) {
                return null;
            }

            //convert boolean values to string (on old_data and new_data)
            Object.keys(diff).forEach(key => {
                if(typeof old_data[key] === 'boolean'){ old_data[key] = old_data[key] ? 'true' : 'false'; }
                if(typeof new_data[key] === 'boolean'){ new_data[key] = new_data[key] ? 'true' : 'false'; }
            });

            //return `Clan updated:\n{list of changes in table fashion}`, no need to show the values
            // return `Clan updated:\n\n${Object.keys(diff).map(key => `${key}: ${old_data[key]} > ${new_data[key]}`).join('\n')}`;
            return <><span>Clan updated:</span>{Object.keys(diff).map(key => <><br /><span><b>{key}:</b> {old_data[key]} <b>&rarr;</b> {new_data[key]}</span></>)}</>
        default:
            return `Unknown log type: ${log.type}, please contact the developer`;
    }
}

export async function GetTopClans(){
    const response = await axios.get(`${GetAPI()}clans/rankings`);
    return response.data;
}