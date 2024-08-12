import { GetAPI, GetOsuApiRedirect, parseReadableStreamToJson, showNotification } from "./Misc";
import config from '../config.json';
import axios from "axios";
import { Avatar, Box, Tooltip } from "@mui/material";
import * as Muicon from "@mui/icons-material";
import PlayerChip from "../Components/UI/PlayerChip.js";
import PlayerChipIcon from "../Components/UI/PlayerChipIcon.js";

const ROLE_PADDING = 0.2;

export function GetRoleIcon(role) {
    const Icon = Muicon[role.icon ?? 'QuestionMark'];
    return <Icon sx={{ p: ROLE_PADDING, color: `#${role.color}` }} />
}

export function GetFormattedName(inspector_user, settings = null) {
    let _settings = {
        custom_tooltip: null,
        is_link: false,
        size: 'small',
        show_avatar: true,
        icon_only: false,
        ...settings
    };
    let name = inspector_user?.known_username;
    if (inspector_user === null || inspector_user.osu_id === null) {
        name = 'Guest';
    }

    // name = <span><b>{`[TEST]`}</b> {name}</span>;
    // if(inspector_user.clan !== null && inspector_user.clan !== undefined && inspector_user.clan.tag !== null && inspector_user.clan.tag !== undefined && inspector_user.clan.tag !== ''){
    //     name = <span><b style={{
    //         color: `#${inspector_user.clan.color ?? '000000'}`,
    //     }}>{`[${inspector_user.clan.tag}]`}</b> {name}</span>;
    // }

    if (inspector_user.clan_member &&
        inspector_user.clan_member.clan !== null &&
        inspector_user.clan_member.clan !== undefined &&
        inspector_user.clan_member.clan.tag !== null &&
        inspector_user.clan_member.clan.tag !== undefined &&
        inspector_user.clan_member.clan.tag !== '' &&
        !inspector_user.clan_member.pending) {
        name = <span><b style={{
            color: `#${inspector_user.clan_member.clan.color ?? '000000'}`,
        }}>{`[${inspector_user.clan_member.clan.tag}]`}</b> {name}</span>;
    }


    if (inspector_user.roles !== null && typeof inspector_user.roles === 'string') {
        inspector_user.roles = JSON.parse(inspector_user.roles);
    }

    return (
        <>
            <Tooltip title={_settings.custom_tooltip ?? ''} placement='top'>
                {
                    _settings.icon_only ? <>
                        <PlayerChipIcon sx={{
                            pr: inspector_user.roles?.length > 0 ? 1 : 0, '&:hover': {
                                cursor: _settings.is_link ? 'pointer' : 'default'
                            },
                            borderRadius: '5px',
                            textDecoration: 'none'
                        }}
                            user_id={inspector_user.osu_id}
                            roleIcons={Array.isArray(inspector_user.roles) && GetRoleIcons(inspector_user.roles)}
                            avatar={_settings.show_avatar ? <Avatar alt={name} src={`https://a.ppy.sh/${inspector_user.osu_id}`} /> : null}
                            label={name}
                            settings={_settings}
                            variant={_settings.variant ?? 'body2'}
                            size={_settings.size} />
                    </> : <>
                        <PlayerChip sx={{
                            pr: inspector_user.roles?.length > 0 ? 1 : 0, '&:hover': {
                                cursor: _settings.is_link ? 'pointer' : 'default'
                            },
                            borderRadius: '5px',
                            textDecoration: 'none'
                        }}
                            user_id={inspector_user.osu_id}
                            roleIcons={Array.isArray(inspector_user.roles) && GetRoleIcons(inspector_user.roles)}
                            avatar={_settings.show_avatar ? <Avatar alt={name} src={`https://a.ppy.sh/${inspector_user.osu_id}`} /> : null}
                            label={name}
                            settings={_settings}
                            variant={_settings.variant ?? 'body2'}
                            size={_settings.size} />
                    </>
                }
            </Tooltip>
        </>
    );
}

export function GetRoleIcons(roles, chips = false) {
    if (roles !== null && typeof roles === 'string') {
        roles = JSON.parse(roles);
    }

    const wrapIcon = (icon) => (
        <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            sx={{
                borderRadius: '50%',
                backgroundColor: 'rgba(0, 0, 0, 0.7)',
            }}>
            {icon}
        </Box>
    );

    return roles?.filter(role => role.is_visible).map(role => {
        return (
            <>
                <Tooltip title={role.name}>
                    {chips ? wrapIcon(GetRoleIcon(role)) : GetRoleIcon(role)}
                </Tooltip>
            </>)
    });
}

export function GetRoles(inspector_user) {
    if (inspector_user === null || inspector_user.roles === null) return [];
    if (inspector_user.roles !== null && typeof inspector_user.roles === 'string') {
        inspector_user.roles = JSON.parse(inspector_user.roles);
    }

    return inspector_user.roles ?? [];
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

    if (token && user_id) {
        try {
            const res = await axios.post(`${GetAPI()}login/validate_token`, {
                token: token,
                user_id: user_id
            }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            const body = res.data;

            if (body.data && body.data.osu_id && body.data.access_token) {
                const old_token = localStorage.getItem('auth_token');
                localStorage.setItem('auth_token', body.data.access_token);
                localStorage.setItem('auth_osu_id', body.data.osu_id);

                if (old_token !== body.data.access_token) {
                    // Token has been refreshed, perform this function again to prevent errors
                    return await IsUserLoggedIn();
                }
            }

            // if (!body.valid && body.error) {
            //     showNotification('Error', body.error, 'error');
            // }

            return body !== undefined && body !== null && body.valid;
        } catch (e) {
            console.error(e);
            return false;
        }
    } else {
        return false;
    }
}

export async function GetUser(osu_id, session_token = null) {
    try {
        const res = await axios.get(`${GetAPI()}login/get/${osu_id}`);
        if (res.data !== null && res.data?.osu_id?.toString() === osu_id.toString()) {
            return res.data;
        }
        return null;
    } catch (e) {
        console.error(e);
        return null;
    }
}

export async function GetLoginID() {
    if (await IsUserLoggedIn()) {
        return localStorage.getItem('auth_osu_id');
    }

    return null;
}

export function GetLoginIDUnsafe() {
    if (IsUserLoggedInUnsafe()) {
        return localStorage.getItem('auth_osu_id');
    }

    return null;
}

export async function GetLoginToken() {
    if (await IsUserLoggedIn()) {
        return localStorage.getItem('auth_token');
    }

    return null;
}

export function GetLoginTokenUnsafe() {
    if (IsUserLoggedInUnsafe()) {
        return localStorage.getItem('auth_token');
    }

    return null;
}

export async function UpdateVisitor(target_id) {
    let res = null;
    try {
        const visitor_id = await GetLoginID();
        const login_token = await GetLoginToken();
        res = await fetch(`${GetAPI()}login/update_visitor`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                visitor: visitor_id,
                target: target_id,
                token: login_token
            })
        });
    } catch (e) { }
    const body = await parseReadableStreamToJson(res.body);
    return body;
}

export async function GetVisitors(osu_id) {
    let res = null;
    try {
        res = await axios.get(`${GetAPI()}login/visitors/get/${osu_id}`);
    } catch (e) { }
    if (res === null) return null;
    return res?.data;
}

export async function GetVisited() {
    const token = localStorage.getItem('auth_token');
    const user_id = localStorage.getItem('auth_osu_id');
    let res = null;
    if (token && user_id) {
        try {
            res = await axios.post(`${GetAPI()}login/visitors/get/${user_id}?check_visitor=true`, {
                token: token
            }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        } catch (e) {
            console.error(e);
        }
    }
    if (res === null || res?.data == null) return null;
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

export async function GetRemoteUsersByRole(role) {
    let res = null;
    try {
        res = await axios.get(`${GetAPI()}roles/${role}`);
    } catch (e) { }
    if (res === null) return null;
    return res?.data;
}

export async function GetRemoteRoles() {
    let res = null;
    try {
        res = await axios.get(`${GetAPI()}roles`);
    } catch (e) { }
    if (res === null) return null;
    return res?.data;
}

export async function AdminValidate(osu_id, session_token) {
    if (!osu_id || !session_token) {
        osu_id = localStorage.getItem('auth_osu_id');
        session_token = localStorage.getItem('auth_token');
    }

    try {
        const res = await fetch(`${GetAPI()}admin/validate`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                user_id: osu_id,
                session_token: session_token
            })
        });

        const body = await parseReadableStreamToJson(res.body);

        return body?.has_admin === true;
    } catch (e) {
        console.error(e);
        return false;
    }
}

export async function AdminGetUsers() {
    const osu_id = localStorage.getItem('auth_osu_id');
    const session_token = localStorage.getItem('auth_token');

    try {
        const res = await axios.post(`${GetAPI()}admin/get_users`, {
            user_id: osu_id,
            session_token: session_token
        }, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
        });

        return res?.data;
    } catch (e) {
        console.error(e);
        return null;
    }
}