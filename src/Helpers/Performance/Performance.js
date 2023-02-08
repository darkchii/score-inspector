import { getPerformance2014 } from "./Performance2014";
import { getPerformance2016 } from "./Performance2016";
import { getPerformanceLazer } from "./PerformanceLazer";
import { getPerformanceLive } from "./PerformanceLive";
import { cloneDeep } from "lodash";

export function getCalculator(version, data, debug = false) {
    const _data = cloneDeep(data);
    // const _data = JSON.parse(JSON.stringify(data));
    let pp;
    switch (version) {
        case '2016':
            pp = new getPerformance2016(_data, debug);
            break;
        case '2014':
            pp = new getPerformance2014(_data, debug);
            break;
        case 'lazer':
            pp = new getPerformanceLazer(_data, debug);
            break;
        default:
            pp = new getPerformanceLive(_data, debug);
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