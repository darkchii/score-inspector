import { toast } from "react-toastify";
import config from "../config.json";

export const sleep = ms => new Promise(r => setTimeout(r, ms));

export const MODAL_STYLE = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    bgcolor: 'background.paper',
    minWidth: '80%',
    boxShadow: 24,
    borderRadius: 3,
    '&:focus': {
        outline: 'none',
    },
}

export function formatBytes(bytes, decimals = 2) {
    if (!+bytes) return '0 Bytes'

    const k = 1024
    const dm = decimals < 0 ? 0 : decimals
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']

    const i = Math.floor(Math.log(bytes) / Math.log(k))

    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`
}

export function range(size, startAt = 0) {
    return [...Array(size).keys()].map(i => i + startAt);
}

export function capitalize(s) {
    return s[0].toUpperCase() + s.slice(1);
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

export function readFileAsync(file) {
    return new Promise((resolve, reject) => {
        let reader = new FileReader();

        reader.onload = () => {
            resolve(reader.result);
        };

        reader.onerror = reject;

        reader.readAsArrayBuffer(file);
    })
}

export function nestedSearch(object, keyArray) {
    const _keyArray = [...keyArray];
    const _currentKey = _keyArray.shift();
    if (_keyArray.length === 0) {
        return object[_currentKey];
    }
    return nestedSearch(object[_currentKey], _keyArray);
}


export function arr_sum(array, prop) {
    var total = 0
    for (var i = 0, _len = array.length; i < _len; i++) {
        total += array[i][prop]
    }
    return total
}

export function is_numeric(str) {
    return /^\d+$/.test(str);
}

export function lerpColor(a, b, amount, alpha_a, alpha_b) {

    var ah = parseInt(a.replace(/#/g, ''), 16),
        ar = ah >> 16, ag = ah >> 8 & 0xff, ab = ah & 0xff,
        bh = parseInt(b.replace(/#/g, ''), 16),
        br = bh >> 16, bg = bh >> 8 & 0xff, bb = bh & 0xff,
        rr = ar + amount * (br - ar),
        rg = ag + amount * (bg - ag),
        rb = ab + amount * (bb - ab);

    var alpha = null;
    if (alpha_a !== undefined && alpha_b !== undefined) {
        alpha = alpha_a + amount * (alpha_b - alpha_a);
    }

    var res = '#' + ((1 << 24) + (rr << 16) + (rg << 8) + rb | 0).toString(16).slice(1);
    if (alpha !== null) {
        res += Math.round(alpha * 255).toString(16).padStart(2, '0');
    }
    return res;
}

export function linearToLogarithmic(x) {
    const yLog = Math.log10(9 * x + 1) / Math.log10(10);
    return yLog;
}
