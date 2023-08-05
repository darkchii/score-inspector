import { getPerformance2014 } from "./Performance2014";
import { getPerformance2016 } from "./Performance2016";
import { getPerformanceLazer } from "./PerformanceLazer";
import { getPerformanceLive } from "./PerformanceLive";
import { getPerformanceV1 } from "./PerformanceV1";

export function getCalculator(version, data, debug = false) {
    let pp;
    switch (version) {
        case '2016':
            pp = new getPerformance2016(data, debug);
            break;
        case '2014':
            pp = new getPerformance2014(data, debug);
            break;
        case 'lazer':
            pp = new getPerformanceLazer(data, debug);
            break;
        case 'v1':
            pp = new getPerformanceV1(data, debug);
            break;
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
        version: pp.version
    }

    if (debug) {
        console.log('output', pp)
    }

    return obj;
}