/* eslint-disable react-refresh/only-export-components */
import { toast } from "react-toastify";
import config from "../config.json";
import moment from "moment";

export const sleep = ms => new Promise(r => setTimeout(r, ms));

export const MODAL_STYLE = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    minWidth: '80%',
    maxHeight: '80%',
    boxShadow: 24,
    borderRadius: 3,
    '&:focus': {
        outline: 'none',
    },
}

export const ImageWithColor = ({ src, color, height }) => {
    return (
        <svg height={height} style={{ display: "block" }}>
          <defs>
            <filter id="colorFilter">
              <feColorMatrix
                type="matrix"
                values={`0 0 0 0 ${parseInt(color.slice(1, 3), 16) / 255}
                         0 0 0 0 ${parseInt(color.slice(3, 5), 16) / 255}
                         0 0 0 0 ${parseInt(color.slice(5, 7), 16) / 255}
                         0 0 0 1 0`}
              />
            </filter>
          </defs>
          <image
            href={src}
            height={height}
            style={{ filter: "url(#colorFilter)" }}
          />
        </svg>
      );
};

export function getHueRotate(hex) {
    // Convert hex to RGB
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);

    // Calculate hue
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let hue;
    if (max === min) {
        hue = 0;
    } else if (max === r) {
        hue = (60 * ((g - b) / (max - min)) + 360) % 360;
    } else if (max === g) {
        hue = (60 * ((b - r) / (max - min)) + 120) % 360;
    } else {
        hue = (60 * ((r - g) / (max - min)) + 240) % 360;
    }
    return hue;
}

const eachModifier = (modifiersArray, callback) => {
    modifiersArray.forEach((modifiers) => {
        if (Array.isArray(modifiers)) {
            modifiers.forEach((modifier) => {
                if (modifier != null) {
                    callback(modifier);
                }
            });
        } else if (typeof modifiers === 'string') {
            callback(modifiers);
        } else {
            // forEach(modifiers, (isActive, modifier) => {
            //   if (isActive) {
            //     callback(modifier);
            //   }
            // });
            //forEach doesnt exist in our codebase
            for (const [modifier, isActive] of Object.entries(modifiers)) {
                if (isActive) {
                    callback(modifier);
                }
            }
        }
    });
};

export function classWithModifiers(className, ...modifiersArray) {
    let ret = className;

    eachModifier(modifiersArray, (m) => ret += ` ${className}--${m}`);

    return ret;
}

const defaultNumberFormatter = new Intl.NumberFormat(window.currentLocale);

export function formatNumber(num, precision, options, locale) {
    if (num === null || num === undefined || !num || isNaN(num) || num === Infinity || num === -Infinity) {
        return num;
    }

    if (precision == null && options == null && locale == null) {
        return defaultNumberFormatter.format(num);
    }

    options ??= {};

    if (precision != null) {
        options.minimumFractionDigits = precision;
        options.maximumFractionDigits = precision;
    }

    return num.toLocaleString(locale ?? window.currentLocale, options);
}

export function fixedEncodeURIComponent(str) {
    let res = encodeURI(str);
    res = res.replace(/\(/g, '%28').replace(/\)/g, '%29');
    res = res.replace(/'/g, '%27');
    res = res.replace(/\*/g, '%2A');
    res = res.replace(/!/g, '%21');
    res = res.replace(/~/g, '%7E');
    res = res.replace(/"/g, '%22');
    return res;
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
    return `${config.USE_DEV_API ? config.BASE_URL_DEV : config.BASE_URL}${import.meta.env.BASE_URL}`;
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
    if (!object) return null;
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
        ar = ah >> 16, ag = (ah >> 8) & 0xff, ab = ah & 0xff,
        bh = parseInt(b.replace(/#/g, ''), 16),
        br = bh >> 16, bg = (bh >> 8) & 0xff, bb = bh & 0xff,
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

export function pxToRem(number, baseNumber = 16) {
    return `${number / baseNumber}rem`;
}

export function formatDuration(seconds) {
    const duration = moment.duration(seconds, 'seconds');

    if (duration.asDays() >= 1) {
        return duration.asDays() + 'd';
    } else if (duration.asHours() >= 1) {
        return duration.asHours() + 'h';
    } else if (duration.asMinutes() >= 1) {
        return duration.asMinutes() + 'm';
    } else {
        return duration.asSeconds() + 's';
    }
}

export function formatNumberAsSize(number) {
    if (number >= 1e12) {
        return (number / 1e12).toFixed(1) + 'T';
    } else if (number >= 1e9) {
        return (number / 1e9).toFixed(1) + 'B';
    } else if (number >= 1e6) {
        return (number / 1e6).toFixed(1) + 'M';
    } else if (number >= 1e3) {
        return (number / 1e3).toFixed(1) + 'K';
    } else {
        return number.toString();
    }
}

export const MILESTONES_FORMATTER = [
    {
        name: 'Global Rank',
        getValue: (value) => (<span style={{ fontWeight: 'bold' }}>{value.toLocaleString('en-US')}</span>),
        getText: (value) => (<span>Reached top #{value}</span>),
    }, {
        name: 'Level',
        getValue: (value) => (<span style={{ fontWeight: 'bold' }}>{value.toLocaleString('en-US')}</span>),
        getText: (value) => (<span>Reached level {value}</span>),
    }, {
        name: 'Playcount',
        getValue: (value) => (<span style={{ fontWeight: 'bold' }}>{value.toLocaleString('en-US')}</span>),
        getText: (value) => (<span>Reached {value} playcount</span>)
    }, {
        name: 'Playtime',
        getValue: (value) => (<span style={{ fontWeight: 'bold' }}>{moment.duration(value, 'seconds').asHours()}</span>),
        getText: (value) => (<span>Reached {value} hours of playtime</span>),
    }, {
        name: 'Clears',
        getValue: (value) => (<span style={{ fontWeight: 'bold' }}>{value.toLocaleString('en-US')}</span>),
        getText: (value) => (<span>Reached {value} clears</span>),
    }, {
        name: 'Total SS',
        getValue: (value) => (<span style={{ fontWeight: 'bold' }}>{value.toLocaleString('en-US')}</span>),
        getText: (value) => (<span>Reached {value} total SS ranks</span>),
    }, {
        name: 'Total S',
        getValue: (value) => (<span style={{ fontWeight: 'bold' }}>{value.toLocaleString('en-US')}</span>),
        getText: (value) => (<span>Reached {value} total S ranks</span>),
    }, {
        name: 'Silver SS',
        getValue: (value) => (<span style={{ fontWeight: 'bold' }}>{value.toLocaleString('en-US')}</span>),
        getText: (value) => (<span>Reached {value} silver SS ranks</span>),
    }, {
        name: 'Silver S',
        getValue: (value) => (<span style={{ fontWeight: 'bold' }}>{value.toLocaleString('en-US')}</span>),
        getText: (value) => (<span>Reached {value} silver S ranks</span>),
    }, {
        name: 'Gold SS',
        getValue: (value) => (<span style={{ fontWeight: 'bold' }}>{value.toLocaleString('en-US')}</span>),
        getText: (value) => (<span>Reached {value} gold SS ranks</span>),
    }, {
        name: 'Gold S',
        getValue: (value) => (<span style={{ fontWeight: 'bold' }}>{value.toLocaleString('en-US')}</span>),
        getText: (value) => (<span>Reached {value} gold S ranks</span>),
    }, {
        name: 'A',
        getValue: (value) => (<span style={{ fontWeight: 'bold' }}>{value.toLocaleString('en-US')}</span>),
        getText: (value) => (<span>Reached {value} A ranks</span>),
    }, {
        name: 'Total Score',
        getValue: (value) => (<span style={{ fontWeight: 'bold' }}>{value.toLocaleString('en-US')}</span>),
        getText: (value) => (<span>Reached {value} total score</span>),
    }, {
        name: 'Ranked Score',
        getValue: (value) => (<span style={{ fontWeight: 'bold' }}>{value.toLocaleString('en-US')}</span>),
        getText: (value) => (<span>Reached {value} ranked score</span>),
    }, {
        name: 'PP',
        getValue: (value) => (<span style={{ fontWeight: 'bold' }}>{value.toLocaleString('en-US')}</span>),
        getText: (value) => (<span>Reached {value}pp</span>),
    }
]

export function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

export function fastSlice(text, length) {
    let substr = "";
    for (var i = 0; i < length; i++) {
        substr += text.charAt(i);
    }
    return substr;
}

export function convertEpochToHumanReadable(epochDuration, short = false) {
    const duration = moment.duration(epochDuration);

    const years = duration.years();
    const months = duration.months();
    const days = duration.days();
    const hours = duration.hours();
    const minutes = duration.minutes();
    const seconds = duration.seconds();

    if (short) {
        const parts = [];
        if (years > 0) parts.push(`${years}y`);
        if (months > 0) parts.push(`${months}m`);
        if (days > 0) parts.push(`${days}d`);
        if (hours > 0) parts.push(`${hours}h`);
        if (minutes > 0) parts.push(`${minutes}min`);
        if (seconds > 0) parts.push(`${seconds}s`);
        return parts.join(' ');
    }

    const parts = [];

    if (years > 0) {
        parts.push(`${years} ${years === 1 ? 'year' : 'years'}`);
    }

    if (months > 0) {
        parts.push(`${months} ${months === 1 ? 'month' : 'months'}`);
    }

    if (days > 0) {
        parts.push(`${days} ${days === 1 ? 'day' : 'days'}`);
    }

    if (hours > 0) {
        parts.push(`${hours} ${hours === 1 ? 'hour' : 'hours'}`);
    }

    if (minutes > 0) {
        parts.push(`${minutes} ${minutes === 1 ? 'minute' : 'minutes'}`);
    }

    if (seconds > 0) {
        parts.push(`${seconds} ${seconds === 1 ? 'second' : 'seconds'}`);
    }

    return parts.join(', ').replace(/,([^,]*)$/, ' and$1');
}
