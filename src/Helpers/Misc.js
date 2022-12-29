import { toast } from "react-toastify";
import config from "../config.json";

export const sleep = ms => new Promise(r => setTimeout(r, ms));

export const MODAL_STYLE = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    bgcolor: 'background.paper',
    minWidth: 800,
    boxShadow: 24,
    borderRadius: 3,
    '&:focus': {
        outline: 'none',
    },
}

export function validateImage(url) {
    return (url.match(/\.(jpeg|jpg|gif|png)$/) != null);
}

export function getUnix(date_string) {
    return Math.floor(new Date(date_string).getTime() / 1000);
}

export function toFixedNumber(num, digits, base) {
    var pow = Math.pow(base || 10, digits);
    return Math.round(num * pow) / pow;
}

export function GetAPI() {
    return (config.USE_DEV_API) ? config.API_DEV : config.API;
}

export function GetOsuClientID() {
    return (config.USE_DEV_API) ? config.OSU_CLIENT_ID_DEV : config.OSU_CLIENT_ID;
}

export function GetOsuApiRedirect() {
    return `${config.USE_DEV_API ? config.BASE_URL_DEV : config.BASE_URL}${process.env.PUBLIC_URL}/`;
}

export function GetOsuAuthUrl() {
    const redirect = 'http://localhost:3006/score_test/';
    return `https://osu.ppy.sh/oauth/authorize?response_type=code&client_id=${GetOsuClientID()}&scope=identify%20public&redirect_uri=${GetOsuApiRedirect()}`
}

export async function parseReadableStreamToJson(input) {
    const data = (await input.getReader().read()).value
    const str = String.fromCharCode.apply(String, data);
    return JSON.parse(str);
}

export const showNotification = (title, message, severity) => {
    toast[severity](message, config.NOTIFICATIONS);
};