import { getPerformanceLive } from "./PerformanceLive";

export function getCalculator(version, data, debug = false) {
    let pp;
    switch (version) {
        default:
            pp = new getPerformanceLive(data, debug);
            break;
    }
    pp.version = version ?? 'live';
    const obj = {
        accuracy: pp.accuracy,
        count300: pp.count300,
        count100: pp.count100,
        count50: pp.count50,
        countmiss: pp.countmiss,
        aim: pp.aim,
        speed: pp.speed,
        acc: pp.acc,
        flashlight: pp.flashlight,
        total: pp.total,
        version: pp.version,
        model: pp.model
    }

    if (debug) {
        console.log('output', pp)
    }

    return obj;
}