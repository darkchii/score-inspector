import { GetAPI, GetOsuApiRedirect, parseReadableStreamToJson } from "./Misc";
import config from '../config.json';
import axios from "axios";
import { Avatar, Chip, Tooltip } from "@mui/material";
import CodeIcon from '@mui/icons-material/Code';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { green, pink } from "@mui/material/colors";

const ROLE_PADDING = 0.2;
export const ROLES = [
    {
        name: 'Developer',
        id: 'dev',
        icon: <CodeIcon sx={{ p: ROLE_PADDING, color: pink[500] }} />
    },
    {
        name: 'Trusted',
        id: 'trusted',
        icon: <CheckCircleIcon sx={{ p: ROLE_PADDING * 1.5, color: green[500] }} />
    }
]

export function GetFormattedName(inspector_user, custom_tooltip = null, is_link = false, size = 'small') {
    let name = inspector_user.known_username;
    if (inspector_user === null || inspector_user.osu_id === null) {
        name = 'Guest';
    }

    if (inspector_user.roles !== null && typeof inspector_user.roles === 'string') {
        inspector_user.roles = JSON.parse(inspector_user.roles);
    }

    return (
        <>
            <Tooltip title={custom_tooltip ?? ''} placement='top'>
                <Chip sx={{ pr: inspector_user.roles?.length > 0 ? 1 : 0, '&:hover': {
                    cursor: is_link ? 'pointer' : 'default'
                } }}
                    onDelete={() => { }}
                    deleteIcon={<>{Array.isArray(inspector_user.roles) && inspector_user.roles?.map(role => {
                        const _role = ROLES.find(r => r.id === role);
                        if (!_role) return null;
                        return (
                            <>
                                <Tooltip title={_role.name}>
                                    {_role.icon}
                                </Tooltip>
                            </>)
                    })}</>}
                    avatar={<Avatar alt={name} src={`https://a.ppy.sh/${inspector_user.osu_id}`} />} 
                    label={name} 
                    size={size} />
            </Tooltip>
        </>
    );
}

export function GetRoles(inspector_user) {
    if (inspector_user.roles !== null && typeof inspector_user.roles === 'string') {
        inspector_user.roles = JSON.parse(inspector_user.roles);
    }

    return inspector_user.roles;
}

export function IsUserLoggedInUnsafe() {
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

export async function LogoutUser(token, osu_id) {
    const response = await fetch(`${GetAPI()}login/logout`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            token: token,
            user_id: osu_id
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
    try {
        const res = await axios.get(`${GetAPI()}login/get/${osu_id}`);
        if (res.data !== null && res.data?.osu_id?.toString() === osu_id.toString()) {
            return res.data;
        }
        return null;
    } catch (e) {
        console.log(e);
        return null;
    }
}

export async function GetLoginID() {
    if (await IsUserLoggedIn()) {
        return localStorage.getItem('auth_osu_id');
    }

    return null;
}

export async function UpdateVisitor(target_id) {
    let res = null;
    try {
        const visitor_id = await GetLoginID();
        console.log(`Updating visitor data: Visitor:${visitor_id} -> Target:${target_id}`)
        res = await fetch(`${GetAPI()}login/update_visitor`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                visitor: visitor_id,
                target: target_id
            })
        });
    } catch (e) { }
    return res;
}

export async function GetVisitors(osu_id) {
    let res = null;
    try {
        res = await axios.get(`${GetAPI()}login/visitors/get/${osu_id}`);
    } catch (e) { }
    if (res === null) return null;
    return res?.data;
}

export async function GetTopVisited(order_by = 'count', limit = 10) {
    let res = null;
    try {
        res = await axios.get(`${GetAPI()}login/visitors/get?order_by=${order_by}&limit=${limit}`);
    } catch (e) { }
    if (res === null) return null;
    return res?.data;
}

export async function UpdateProfile(data) {
    if (!await IsUserLoggedIn()) return null;

    const res = await fetch(`${GetAPI()}login/update_profile`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            token: localStorage.getItem('auth_token'),
            user_id: localStorage.getItem('auth_osu_id'),
            data: data
        })
    });

    return res;
}

export async function DeleteComment(comment_id, deleter_id){
    if (!await IsUserLoggedIn()) return null;

    const res = await fetch(`${GetAPI()}login/comments/delete`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            token: localStorage.getItem('auth_token'),
            comment_id: comment_id,
            deleter_id: deleter_id
        })
    });

    return res;
}

export async function GetComments(user_id){
    let res = null;
    try {
        res = await axios.get(`${GetAPI()}login/comments/get/${user_id}`);
    } catch (e) { }
    if (res === null) return null;
    return res?.data;
}

export async function SendComment(sender, recipient, reply_to, content){
    if (!await IsUserLoggedIn()) return null;

    const res = await fetch(`${GetAPI()}login/comments/send`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            token: localStorage.getItem('auth_token'),
            sender: sender,
            recipient: recipient,
            reply_to: reply_to,
            comment: content
        })
    });

    return res;
}