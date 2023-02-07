import { getPerformance2014 } from "./Performance2014";
import { getPerformance2016 } from "./Performance2016";
import { getPerformanceLazer } from "./PerformanceLazer";
import { getPerformanceLive } from "./PerformanceLive";

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
        default:
            pp = new getPerformanceLive(data, debug);
            break;
    }
    pp.version = version ?? 'live';
    const obj = {
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