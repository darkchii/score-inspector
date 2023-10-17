import moment from "moment";
import { mods } from "../Osu";

export function getPerformanceV1(data, debug = false) {
    const sr_model = 'live';
    const score = data.score;
    data.count300 = data.count300 ?? score.count300;
    data.count100 = data.count100 ?? score.count100;
    data.count50 = data.count50 ?? score.count50;
    data.countmiss = data.countmiss ?? score.countmiss;
    data.combo = data.combo ?? score.combo;
    data.totalhits = data.count300 + data.count100 + data.count50 + data.countmiss;
    data.accuracy = getAccuracy(data);
    data.beatmap = data.beatmap ?? score.beatmap;
    data.sr = data.beatmap?.eyup_sr?.difficultyrating;
    data.position = score?.top_score?.pos;
    data.playcount = data.beatmap?.playcount;
    data.max_playcount = data.beatmap?.eyup_sr?.max_playcount;
    data.ss_ratio = data.beatmap?.ss_ratio?.ratio;
    data.relative_playcount = data.playcount / data.max_playcount;
    data.passcount = data.beatmap?.passcount;

    data.modded_sr = score.beatmap.modded_sr[sr_model] ?? score.beatmap.modded_sr;


    const cutoff_score = 0.001;

    let v1 = 0;

    if (data.sr && data.position && data.position <= 500 && data.position > 0) {
        v1 = Math.pow(data.sr, 4) / Math.pow(data.position, 0.8);

        if(debug){
            console.log('v1 after sr', v1);
        }

        let current_time = moment().unix();
        let score_time = moment(data.score.date).unix();
        let time_elapsed = current_time - score_time;

        v1 *= Math.max(0, 1 - 0.01 * (time_elapsed / 3600 / 24 / 10));

        if (data.score.rank === 'X' || data.score.rank === 'XH') {
            v1 *= 1.36;
        } else if (data.score.perfect) {
            v1 *= 1.2;
        }

        if(debug){
            console.log('v1 after grade/perfect', v1);
        }

        if (data.score.enabled_mods & mods.HR) {
            v1 *= 1.1
        }
        if (data.score.enabled_mods & mods.DT) {
            v1 *= 1.1
        }
        if (data.score.enabled_mods & mods.EZ || data.score.enabled_mods & mods.HT) {
            v1 *= 0.2
        }

        if(debug){
            console.log('v1 after mods', v1);
        }

        v1 *= Math.pow(data.beatmap?.playcount, 0.4) * 3.6;

        if(debug){
            console.log('v1 after playcount', v1);
        }

        if (v1 <= cutoff_score) {
            v1 = 0;
        }

        v1 *= 1 - Math.min(1, 3 * data.ss_ratio);

        if(debug){
            console.log('v1 after ss_ratio', v1);
        }

        if(data.relative_playcount < 0.98){
            v1 *= 0.24;
        }

        if(debug){
            console.log('v1 after relative_playcount', v1);
        }

        if((data.passcount / data.playcount) > 0.3){
            v1 *= 0.2;
        }

        if(debug){
            console.log('v1 after passcount', v1);
        }

        v1 *= Math.pow(data.accuracy/100, 15);

        if(debug){
            console.log('v1 after accuracy', v1);
        }

        v1 = Math.max(0, v1);
    }else if(debug){
        console.log(`Something might have gone wrong:\n
        sr: ${data.sr}\n
        position: ${data.position}\n
        playcount: ${data.playcount}\n
        max_playcount: ${data.max_playcount}\n
        ss_ratio: ${data.ss_ratio}\n
        relative_playcount: ${data.relative_playcount}\n
        passcount: ${data.passcount}\n`);
    }

    data.score = undefined;

    const output = {
        aim: 0,
        speed: 0,
        acc: 0,
        total: v1,
        version: 'v1',
        model: sr_model,
        accuracy: data.accuracy,
        count300: data.count300,
        count100: data.count100,
        count50: data.count50,
        countmiss: data.countmiss,
    }

    return output;
}

function getAccuracy(data) {

    let totalhits = (data.count300 + data.count100 + data.count50 + data.countmiss) * 300;
    if(totalhits>0){
        return Math.round(
            ((data.count50*50+data.count100*100+data.count300*300)/(totalhits))*100 * 100
        ) / 100;
    }

    return 0;
}