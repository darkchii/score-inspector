import axios from "axios";
import { GetAPI, parseReadableStreamToJson } from "./Misc";
import { GetFormattedName } from "./Account";
import { Box } from "@mui/material";
import { prepareScore, prepareScores } from "./ScoresProcessor";
import { MassCalculatePerformance } from "./Osu";

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
    const response = await axios.post(`${GetAPI()}clans/get/${id}?activities=true`, {
        login_user_id: login_user_id,
        login_user_token: login_user_token
    });

    const data = response.data;

    if (data.activities?.scores !== undefined && data.activities?.scores.length > 0) {
        data.activities.scores = prepareScores(null, data.activities?.scores, true);
        let [_scores] = await MassCalculatePerformance(data.activities.scores);
        data.activities.scores = _scores;

        //order by date_played_moment
        data.activities.scores.sort((a, b) => b.date_played_moment - a.date_played_moment);
    }

    return data;
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
        moderator_id: accepter_id,
        join_request_id: join_request_id,
        token: token,
        clan_id: clan_id
    });
    return response.data;
}

export async function RejectJoinRequestClan(rejecter_id, join_request_id, token, clan_id) {
    const response = await axios.post(`${GetAPI()}clans/reject_request`, {
        moderator_id: rejecter_id,
        join_request_id: join_request_id,
        token: token,
        clan_id: clan_id
    });
    return response.data;
}

export async function RemoveClanMember(moderator_id, member_id, token, clan_id) {
    const response = await axios.post(`${GetAPI()}clans/remove_member`, {
        moderator_id: moderator_id,
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

export async function UpdateClanModerator(owner_id, token, clan_id, target_user_id, new_status) {
    const response = await axios.post(`${GetAPI()}clans/update_moderator`, {
        owner_id: owner_id,
        token: token,
        clan_id: clan_id,
        target_user_id: target_user_id,
        new_status: new_status
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
    let left_user;
    switch (log_data.type) {
        case 'clan_create':
            return 'Clan created';
        case 'member_join':
            {
                let joined_user = clan.logs_user_data.find(log => log.osu_id === log_data.user_id);
                return <Box sx={{
                    display: 'flex'
                }}>
                    <Box sx={{ ml: 1 }}> {GetFormattedName(joined_user ?? {})} </Box>
                    <Box sx={{ ml: 1 }}> joined the clan </Box>
                </Box>;
            }
        case 'member_remove':
            // return `${log_data.user_id} left the clan`;
            left_user = clan.logs_user_data.find(log => log.osu_id === log_data.user_id);
            return <Box sx={{
                display: 'flex'
            }}>
                <Box sx={{ ml: 1 }}> {GetFormattedName(left_user ?? {})} </Box>
                <Box sx={{ ml: 1 }}> has been removed from the clan </Box>
            </Box>;
        case 'member_leave':
            // return `${log_data.user_id} left the clan`;
            left_user = clan.logs_user_data.find(log => log.osu_id === log_data.user_id);
            return <Box sx={{
                display: 'flex'
            }}>
                <Box sx={{ ml: 1 }}> {GetFormattedName(left_user ?? {})} </Box>
                <Box sx={{ ml: 1 }}> left the clan </Box>
            </Box>;
        case 'owner_transfer':
            {
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
            }
        case 'clan_update':
            {
                let old_data = JSON.parse(log_data.old_data);
                let new_data = JSON.parse(log_data.new_data);

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
                    if (typeof old_data[key] === 'boolean') { old_data[key] = old_data[key] ? 'true' : 'false'; }
                    if (typeof new_data[key] === 'boolean') { new_data[key] = new_data[key] ? 'true' : 'false'; }
                });

                //limit value lengths to 50 characters
                old_data = Object.keys(old_data).reduce((acc, key) => {
                    if(old_data[key] === null || old_data[key] === undefined) return acc;
                    acc[key] = old_data[key].length > 50 ? old_data[key].substring(0, 50) + '...' : old_data[key];
                    return acc;
                }, {});
                new_data = Object.keys(new_data).reduce((acc, key) => {
                    if(new_data[key] === null || new_data[key] === undefined) return acc;
                    acc[key] = new_data[key].length > 50 ? new_data[key].substring(0, 50) + '...' : new_data[key];
                    return acc;
                }, {});

                //return `Clan updated:\n{list of changes in table fashion}`, no need to show the values
                // return `Clan updated:\n\n${Object.keys(diff).map(key => `${key}: ${old_data[key]} > ${new_data[key]}`).join('\n')}`;
                return <><span>Clan updated:</span>{Object.keys(diff).map(key => <><br /><span><b>{key}:</b> {old_data[key]} <b>&rarr;</b> {new_data[key]}</span></>)}</>
            }
        default:
            return `Unknown log type: ${log.type}, please contact the developer`;
    }
}

export async function GetTopClans() {
    const response = await axios.get(`${GetAPI()}clans/rankings`);
    const top_data = response.data.data;

    Object.keys(top_data).forEach(key => {
        // top_data[key].scores = prepareScores(null, top_data[key].scores, true);
        if(Array.isArray(top_data[key])){
            top_data[key].forEach(clan => {
                // clan.scores = prepareScores(null, clan.scores, true);
                //if object
                if(clan.ranking_prepared?.[key] !== undefined && clan.ranking_prepared?.[key]?.beatmap_id !== undefined){
                    // clan.ranking_prepared[key].scores = prepareScores(null, clan.ranking_prepared[key].scores, true);
                    clan.ranking_prepared[key] = prepareScore(clan.ranking_prepared[key], null);
                }
            });
        }
    });

    return response.data;
}