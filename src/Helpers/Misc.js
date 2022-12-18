export function getUnix(date_string) {
    return Math.floor(new Date(date_string).getTime() / 1000);
}

export function toFixedNumber(num, digits, base) {
    var pow = Math.pow(base || 10, digits);
    return Math.round(num * pow) / pow;
}