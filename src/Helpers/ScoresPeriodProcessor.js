// created array based on months or weeks or whatever with scores and interesting stats with it

import moment from "moment";
import TimeGraph from "../Components/TimeGraph";
import { dataToList } from "./MonthlyDataConfig";

const PERIOD_FORMATS = {
    'm': {
        format: 'month',
        format_str: 'MMMM YYYY'
    },
    'w': {
        format: 'week',
        format_str: 'w YYYY'
    },
    'd': {
        format: 'day',
        format_str: 'DD MMMM YYYY'
    }
}

//split entire score array into chunks of months
export function getPeriodicData(scores, data, user, f = 'm') {
    if (f === undefined || f === null || PERIOD_FORMATS[f] === undefined) {
        f = 'm';
    }
    let chunks = [];
    // let duplicate_scores = JSON.parse(JSON.stringify(scores));
    let duplicate_scores = [...scores];

    for (const score of duplicate_scores) {
        const _m = moment(score.date_played);
        const _v = _m.format(PERIOD_FORMATS[f].format_str);

        if (chunks[_v] === undefined) {
            chunks[_v] = [];
            chunks[_v].scores = [];
        }

        dataToList.forEach(data => {
            if (chunks[_v][data.outputValue] === undefined || chunks[_v][data.outputValue] === null) chunks[_v][data.outputValue] = 0;
            chunks[_v][data.outputValue] = data.exec(chunks[_v][data.outputValue], score);
        });

        chunks[_v].actual_date = _m;
        chunks[_v].scores.push(score);
    }

    const parsedChunks = [];
    Object.keys(chunks).forEach(key => {
        var obj = {};
        dataToList.forEach(data => {
            obj[data.outputValue] = chunks[key][data.outputValue];
        });

        obj.date = key;
        obj.scores = chunks[key].scores;
        obj.actual_date = chunks[key].actual_date;

        //average data
        if (obj.count_scores > 0) {
            obj.average_pp = obj.total_pp / obj.count_scores;
            obj.average_sr = obj.total_sr / obj.count_scores;
            obj.average_score = obj.total_score / obj.count_scores;
            obj.average_length = obj.total_length / obj.count_scores;
        } else {
            obj.average_pp = 0;
            obj.average_sr = 0;
            obj.average_score = 0;
            obj.average_length = 0;
        }

        parsedChunks.push(obj);
    });

    //sort
    let sortedChunks = parsedChunks.sort((a, b) => {
        return a.actual_date.valueOf() - b.actual_date.valueOf();
    });

    //fill empty gaps
    const dates = [];
    const _start = moment(sortedChunks[0].actual_date);
    const _end = moment();

    for (let m = moment(_start); m.isBefore(_end) || m.isSame(_end, PERIOD_FORMATS[f].format); m.add(1, PERIOD_FORMATS[f].format)) {
        dates.push(moment(m));
    }

    const chunk_ref = JSON.parse(JSON.stringify(sortedChunks[0]));
    for (var p in chunk_ref) {
        chunk_ref[p] = 0;
    }

    var r = dates.map(date => {
        var o = sortedChunks.findIndex(x => x.actual_date.isSame(date, PERIOD_FORMATS[f].format));
        if (o === -1) {
            var clone = JSON.parse(JSON.stringify(chunk_ref));
            clone.date = date.format(PERIOD_FORMATS[f].format_str);
            clone.actual_date = date;
            return clone;
        }
        const data = sortedChunks[o];
        sortedChunks.splice(o, 1);
        return data;
    });

    sortedChunks = r;
    const cumulativeChunks = getCumulative(sortedChunks, user, data, f); //get cumulative data
    const osuDailyChunks = processDailyData(cumulativeChunks, user, data, f); //process the data from osu!daily
    const labels = osuDailyChunks.map(x => x.date);

    const graphs = getGraphObjects(osuDailyChunks, labels, f);

    return {
        chunks: osuDailyChunks,
        graphs: graphs
    };
}

function processDailyData(chunks, user, data, f = 'm') {
    for (var i = 0; i < chunks.length; i++) {
        //get highest rank at this time point
        const previous = chunks[i - 1]?.osudaily;
        let rank = previous?.rank ?? 0;
        let c_rank = previous?.c_rank ?? 0;
        let raw_pp = previous?.raw_pp ?? 0;
        let cumulative_total_score = previous?.cumulative_total_score ?? 0;
        let cumulative_level = previous?.cumulative_level ?? 0;
        if (user.daily !== null && user.daily.error === undefined) {
            const dailyPoints = user.daily.modes[0].lines;
            for (var j = 0; j < dailyPoints.length; j++) {
                const point = dailyPoints[j];
                const date = moment(point.date);
                if (date.isSame(chunks[i].actual_date, PERIOD_FORMATS[f].format)) {
                    //perDatePoints.push(dailyPoints[j]);
                    if (rank === null || point.rankworld > rank) {
                        rank = point.rankworld;
                    }

                    if (c_rank === null || point.rankcountry > c_rank) {
                        c_rank = point.rankcountry;
                    }
                    if (raw_pp === null || point.pp > raw_pp) {
                        raw_pp = point.pp;
                    }
                    if (cumulative_total_score === null || point.totalscore > cumulative_total_score) {
                        cumulative_total_score = point.totalscore;
                    }
                    if (cumulative_level === null || point.level > cumulative_level) {
                        cumulative_level = point.level;
                    }
                }
            }
        }

        if (rank === 0) rank = null;
        if (c_rank === 0) c_rank = null;
        chunks[i].osudaily = {};
        chunks[i].osudaily.global_rank = rank !== null ? -rank : null;
        chunks[i].osudaily.country_rank = c_rank !== null ? -c_rank : null;
        chunks[i].osudaily.cumulative_total_score = cumulative_total_score;
        chunks[i].osudaily.raw_pp = raw_pp;
        chunks[i].osudaily.cumulative_level = cumulative_level;
    }

    //get the difference between chunks
    for (var i = 0; i < chunks.length; i++) {
        var prev = i > 0 ? chunks[i - 1].osudaily : null;
        if (prev) {
            chunks[i].osudaily.total_score = Math.max(0, chunks[i].osudaily.cumulative_total_score - (prev?.cumulative_total_score ?? 0));
            chunks[i].osudaily.gained_level = Math.max(0, chunks[i].osudaily.cumulative_level - (prev?.cumulative_level ?? 0));
        } else {
            chunks[i].osudaily.total_score = 0;
            chunks[i].osudaily.gained_level = 0;
        }
    }

    //console.log(chunks[20].osudaily);

    // //get cumulative osu!daily data
    // if (user.daily !== null && user.daily.error === undefined) {
    //     for (var i = 0; i < chunks.length; i++) {
    //         var prev = i > 0 ? chunks[i - 1].osudaily.total_score : 0;
    //         if (prev) {
    //             chunks[i].osudaily.total_score = chunks[i].osudaily.cumulative_total_score + prev;
    //         } else {
    //             chunks[i].osudaily.total_score = chunks[i].osudaily.cumulative_total_score;
    //         }
    //     }
    // }
    return chunks;
}

function getCumulative(chunks, user, data, f = 'm') {
    for (var i = 0; i < chunks.length; i++) {
        var prev = i > 0 ? chunks[i - 1].cumulative_score : 0;

        if (prev) {
            chunks[i].cumulative_score = chunks[i].total_score + prev;
        } else {
            chunks[i].cumulative_score = chunks[i].total_score;
        }

        prev = i > 0 ? chunks[i - 1].cumulative_ss_score : 0;
        if (prev) {
            chunks[i].cumulative_ss_score = chunks[i].total_ss_score + prev;
        } else {
            chunks[i].cumulative_ss_score = chunks[i].total_ss_score;
        }

        prev = i > 0 ? chunks[i - 1].cumulative_length : 0;
        if (prev) {
            chunks[i].cumulative_length = chunks[i].total_length + prev;
        } else {
            chunks[i].cumulative_length = chunks[i].total_length;
        }

        prev = i > 0 ? chunks[i - 1].cumulative_plays : 0;
        if (prev) {
            chunks[i].cumulative_plays = chunks[i].count_scores + prev;
        } else {
            chunks[i].cumulative_plays = chunks[i].count_scores;
        }

        prev = i > 0 ? chunks[i - 1].cumulative_rank_ss : 0;
        if (prev) {
            chunks[i].cumulative_rank_ss = chunks[i].total_ss + prev;
        } else {
            chunks[i].cumulative_rank_ss = chunks[i].total_ss;
        }

        prev = i > 0 ? chunks[i - 1].cumulative_rank_s : 0;
        if (prev) {
            chunks[i].cumulative_rank_s = chunks[i].total_s + prev;
        } else {
            chunks[i].cumulative_rank_s = chunks[i].total_s;
        }

        prev = i > 0 ? chunks[i - 1].cumulative_rank_a : 0;
        if (prev) {
            chunks[i].cumulative_rank_a = chunks[i].total_a + prev;
        } else {
            chunks[i].cumulative_rank_a = chunks[i].total_a;
        }

        prev = i > 0 ? chunks[i - 1].cumulative_rank_b : 0;
        if (prev) {
            chunks[i].cumulative_rank_b = chunks[i].total_b + prev;
        } else {
            chunks[i].cumulative_rank_b = chunks[i].total_b;
        }

        prev = i > 0 ? chunks[i - 1].cumulative_rank_c : 0;
        if (prev) {
            chunks[i].cumulative_rank_c = chunks[i].total_c + prev;
        } else {
            chunks[i].cumulative_rank_c = chunks[i].total_c;
        }

        prev = i > 0 ? chunks[i - 1].cumulative_rank_d : 0;
        if (prev) {
            chunks[i].cumulative_rank_d = chunks[i].total_d + prev;
        } else {
            chunks[i].cumulative_rank_d = chunks[i].total_d;
        }

        prev = i > 0 ? chunks[i - 1].cumulative_total_pp : 0;
        if (prev) {
            chunks[i].cumulative_total_pp = chunks[i].total_pp + prev;
        } else {
            chunks[i].cumulative_total_pp = chunks[i].total_pp;
        }

        prev = i > 0 ? chunks[i - 1].cumulative_total_hits : 0;
        if (prev) {
            chunks[i].cumulative_total_hits = chunks[i].total_hits + prev;
        } else {
            chunks[i].cumulative_total_hits = chunks[i].total_hits;
        }

        prev = i > 0 ? chunks[i - 1].cumulative_total_base_score : 0;
        if (prev) {
            chunks[i].cumulative_total_base_score = chunks[i].total_base_score + prev;
        } else {
            chunks[i].cumulative_total_base_score = chunks[i].total_base_score;
        }

        prev = i > 0 ? chunks[i - 1].cumulative_total_max_base_score : 0;
        if (prev) {
            chunks[i].cumulative_total_max_base_score = chunks[i].total_max_base_score + prev;
        } else {
            chunks[i].cumulative_total_max_base_score = chunks[i].total_max_base_score;
        }
        chunks[i].total_average_acc = chunks[i].total_base_score * Math.pow(chunks[i].total_max_base_score, -1) * 100;
        chunks[i].cumulative_average_acc = chunks[i].cumulative_total_base_score * Math.pow(chunks[i].cumulative_total_max_base_score, -1) * 100;

        const beatmaps = data.beatmapInfo.monthlyCumulative[`${chunks[i].actual_date.format("YYYY-M")}-01`];
        chunks[i].completion = 100 / beatmaps.amount * chunks[i].cumulative_plays;
        chunks[i].completion_score = 100 / beatmaps.score * chunks[i].cumulative_score;
        chunks[i].completion_length = 100 / beatmaps.length * chunks[i].cumulative_length;
        // sorted[i].average_acc = getAverageAccuracy(sorted[i].scores);
    }

    return chunks;
}

function getGraphObjects(chunks, labels, f = 'm') {
    const graphObjects = {
        "clearsPerSection": <TimeGraph name={`Scores set per ${PERIOD_FORMATS[f].format_str}`} labels={labels} data={[{ name: "Scores set", set: chunks.map(x => x.count_scores), color: { r: 255, g: 102, b: 158 } }]} />,
        "ppPerSection": <TimeGraph name={`Total PP per ${PERIOD_FORMATS[f].format}`} labels={labels} data={[{ name: "Total PP set", set: chunks.map(x => x.total_pp), color: { r: 255, g: 102, b: 158 } }]} />,
        "lengthPerSection": <TimeGraph name={`Total length per ${PERIOD_FORMATS[f].format}`} labels={labels} data={[{ name: "Total length played", set: chunks.map(x => x.total_length), color: { r: 255, g: 102, b: 158 } }]} />,
        "totalscorePerSection": <TimeGraph name={`Ranked score per ${PERIOD_FORMATS[f].format}`} labels={labels} data={[{ name: "Ranked score gained", set: chunks.map(x => x.total_score), color: { r: 255, g: 102, b: 158 } }]} />,
        "totaltotalScorePerSection": <TimeGraph name={`Total score per ${PERIOD_FORMATS[f].format}`} labels={labels} data={[{ name: "Total score gained", set: chunks.map(x => x.osudaily.total_score), color: { r: 255, g: 102, b: 158 } }]} />,
        "totalSSscorePerSection": <TimeGraph name={`Total SS score per ${PERIOD_FORMATS[f].format}`} labels={labels} data={[{ name: "Total SS score gained", set: chunks.map(x => x.total_ss_score), color: { r: 255, g: 102, b: 158 } }]} />,
        "totalhitsPerSection": <TimeGraph name={`Total hits per ${PERIOD_FORMATS[f].format}`} labels={labels} data={[{ name: "Total hits", set: chunks.map(x => x.total_hits), color: { r: 255, g: 102, b: 158 } }]} />,
        "totalAverageAcc": <TimeGraph name={`Average accuracy per ${PERIOD_FORMATS[f].format}`} labels={labels} data={[{ name: "Average accuracy", set: chunks.map(x => x.total_average_acc), color: { r: 255, g: 102, b: 158 } }]} />,
        "gainedLevel": <TimeGraph name={`Gained Level %`} labels={labels} data={[{ name: "Gained Level %", set: chunks.map(x => x.osudaily.gained_level), color: { r: 255, g: 102, b: 158 } }]} />,
        "completion": <TimeGraph name='Completion' labels={labels} data={[
            { name: "% Clear Completion", set: chunks.map(x => x.completion), color: { r: 255, g: 102, b: 158 } },
            { name: "% Score Completion", set: chunks.map(x => x.completion_score), color: { r: 244, g: 67, b: 54 } },
            { name: "% Length Completion", set: chunks.map(x => x.completion_length), color: { r: 63, g: 81, b: 181 } },
        ]}
            formatter={(value, context) => { return `${value.toFixed(2)}%`; }} />,
        "cumulativePP": <TimeGraph name="Total PP" labels={labels} data={[{ name: "Total PP", set: chunks.map(x => Math.floor(x.cumulative_total_pp)), color: { r: 255, g: 102, b: 158 } }]} />,
        "cumulativeScore": <TimeGraph name="Cumulative ranked score" labels={labels} data={[{ name: "Cumulative ranked score", set: chunks.map(x => x.cumulative_score), color: { r: 255, g: 102, b: 158 } }]} />,
        "cumulativeTotalScore": <TimeGraph name="Cumulative total score" labels={labels} data={[{ name: "Cumulative total score", set: chunks.map(x => x.osudaily.cumulative_total_score), color: { r: 255, g: 102, b: 158 } }]} />,
        "cumulativeSSScore": <TimeGraph name="Cumulative SS score" labels={labels} data={[{ name: "Cumulative SS score", set: chunks.map(x => x.cumulative_ss_score), color: { r: 255, g: 102, b: 158 } }]} />,
        "cumulativeClears": <TimeGraph name="Cumulative plays" labels={labels} data={[{ name: "Cumulative plays", set: chunks.map(x => x.cumulative_plays), color: { r: 255, g: 102, b: 158 } }]} />,
        "cumulativeLength": <TimeGraph name={`Cumulative length played`} labels={labels} data={[{ name: "Cumulative total length played", set: chunks.map(x => x.cumulative_length), color: { r: 255, g: 102, b: 158 } }]} />,
        "cumulativeHits": <TimeGraph name={`Cumulative note hits`} labels={labels} data={[{ name: "Cumulative note hits", set: chunks.map(x => x.cumulative_total_hits), color: { r: 255, g: 102, b: 158 } }]} />,
        "cumulativeAcc": <TimeGraph name={`Overall average accuracy`} labels={labels} data={[{ name: "Overall average accuracy", set: chunks.map(x => x.cumulative_average_acc), color: { r: 255, g: 102, b: 158 } }]} />,
        "cumulativeLevel": <TimeGraph name={`Level over time`} labels={labels} data={[{ name: "Level over time", set: chunks.map(x => x.osudaily.cumulative_level), color: { r: 255, g: 102, b: 158 } }]} />,
        "gradesPerSection": <TimeGraph name="Grades" labels={labels} data={[
            { name: "Total SS", set: chunks.map(x => x.total_ss), color: { r: 197, g: 197, b: 197 } },
            { name: "Total S", set: chunks.map(x => x.total_s), color: { r: 255, g: 186, b: 14 } },
            { name: "Total A", set: chunks.map(x => x.total_a), color: { r: 163, g: 163, b: 163 } },
            { name: "Total B", set: chunks.map(x => x.total_b), color: { r: 255, g: 148, b: 11 } },
            { name: "Total C", set: chunks.map(x => x.total_c), color: { r: 133, g: 214, b: 28 } },
            { name: "Total D", set: chunks.map(x => x.total_d), color: { r: 243, g: 87, b: 90 } },
        ]} />,
        "cumulativeGrades": <TimeGraph name="Cumulative Grades" labels={labels} data={[
            { name: "Total SS", set: chunks.map(x => x.cumulative_rank_ss), color: { r: 197, g: 197, b: 197 } },
            { name: "Total S", set: chunks.map(x => x.cumulative_rank_s), color: { r: 255, g: 186, b: 14 } },
            { name: "Total A", set: chunks.map(x => x.cumulative_rank_a), color: { r: 163, g: 163, b: 163 } },
            { name: "Total B", set: chunks.map(x => x.cumulative_rank_b), color: { r: 255, g: 148, b: 11 } },
            { name: "Total C", set: chunks.map(x => x.cumulative_rank_c), color: { r: 133, g: 214, b: 28 } },
            { name: "Total D", set: chunks.map(x => x.cumulative_rank_d), color: { r: 243, g: 87, b: 90 } },
        ]} />,
        "ppPerPlay": <TimeGraph name="Average PP per play" labels={labels} data={[{ name: "Average PP", set: chunks.map(x => x.average_pp), color: { r: 255, g: 102, b: 158 } }]} />,
        "highestPPPlay": <TimeGraph name="Highest PP play" labels={labels} data={[{ name: "Highest PP", set: chunks.map(x => x.highest_pp), color: { r: 255, g: 102, b: 158 } }]} />,
        "srPerPlay": <TimeGraph name="Average SR per play" labels={labels} data={[{ name: "Average SR", set: chunks.map(x => x.average_sr), color: { r: 255, g: 102, b: 158 } }]} />,
        "scorePerPlay": <TimeGraph name="Average score per play" labels={labels} data={[{ name: "Average score", set: chunks.map(x => x.average_score), color: { r: 255, g: 102, b: 158 } }]} />,
        "lengthPerPlay": <TimeGraph name="Average length per play" labels={labels} data={[{ name: "Average score", set: chunks.map(x => x.average_length), color: { r: 255, g: 102, b: 158 } }]} />,
        "globalRank": <TimeGraph formatter={(value, context) => { return `#${Math.abs(value).toLocaleString("en-US")}`; }} name="World Rank" labels={labels} data={[
            { name: "Global Rank", set: chunks.map(x => x.osudaily.global_rank), color: { r: 255, g: 102, b: 158 } },
        ]} />,
        "countryRank": <TimeGraph formatter={(value, context) => { return `#${Math.abs(value).toLocaleString("en-US")}`; }} name="Country Rank" labels={labels} data={[
            { name: "Country Rank", set: chunks.map(x => x.osudaily.country_rank), color: { r: 82, g: 158, b: 250 } },
        ]} />,
        "rawPP": <TimeGraph name="Raw PP" labels={labels} data={[{ name: "Raw PP", set: chunks.map(x => x.osudaily.raw_pp), color: { r: 255, g: 102, b: 158 } }]} />,
        //"accPerPlay": <TimeGraph name="Average accuracy per play" labels={labels[dateFormat]} data={[{ name: "Average accuracy", set: chunks[dateFormat].map(x => x.average_acc), color: { r: 255, g: 102, b: 158 } }]} />,
    };

    return graphObjects;
}