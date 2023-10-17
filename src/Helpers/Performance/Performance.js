import { getPerformance2014July } from "./Performance2014July.js";
import { getPerformance2014May } from "./Performance2014May";
import { getPerformance2015February } from "./Performance2015February.js";
import { getPerformance2016 } from "./Performance2016.js";
import { getPerformance2018 } from "./Performance2018.js";
import { getPerformance2019 } from "./Performance2019.js";
import { getPerformance2021January } from "./Performance2021January.js";
import { getPerformance2021July } from "./Performance2021July.js";
import { getPerformance2021November } from "./Performance2021November.js";
import { getPerformanceLazer } from "./PerformanceLazer";
import { getPerformanceLive } from "./PerformanceLive";
import { getPerformanceV1 } from "./PerformanceV1";

export function getCalculator(version, data, debug = false) {
    let pp;
    switch (version) {
        case '2014may':
            pp = new getPerformance2014May(data, debug);
            break;
        case '2014july':
            pp = new getPerformance2014July(data, debug);
            break;
        case '2015april':
        case '2015february':
            pp = new getPerformance2015February(data, debug, version);
            break;
        case '2016':
            pp = new getPerformance2016(data, debug);
            break;
        case '2018':
            pp = new getPerformance2018(data, debug);
            break;
        case '2019':
            pp = new getPerformance2019(data, debug);
            break;
        case '2021january':
            pp = new getPerformance2021January(data, debug);
            break;
        case '2021july':
            pp = new getPerformance2021July(data, debug);
            break;
        case '2021november':
            pp = new getPerformance2021November(data, debug);
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
        version: pp.version,
        model: pp.model
    }

    if (debug) {
        console.log('output', pp)
    }

    return obj;
}