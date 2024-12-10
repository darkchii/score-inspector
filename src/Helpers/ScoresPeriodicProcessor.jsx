import { amber, blue, green, grey, purple, red } from "@mui/material/colors";
import moment from "moment";

const PERIOD_FORMATS = {
    'm': {
        format: 'month',
        format_str: 'MMMM yyyy',
        format_str_num_only: 'YYYY-MM',
        increment: (date) => date.add(1, 'months'),
        slice: 7,
    },
    'y': {
        format: 'year',
        format_str: 'yyyy',
        format_str_num_only: 'YYYY',
        increment: (date) => date.add(1, 'years'),
        slice: 4,
    },
    'd': {
        format: 'day',
        format_str: 'dd MMMM yyyy',
        format_str_num_only: 'YYYY-MM-DD',
        increment: (date) => date.add(1, 'days'),
        slice: 10,
    }
}

export function getPeriodicData(user, scores, beatmaps, period = 'd') {
    //we first generate the list of dates
    let dates = getDates(user, period);
    let graph_data = getScoresPeriodicData(user, scores, dates, beatmaps, period);
    return graph_data;
}

function getScoresPeriodicData(user, scores, dates, beatmaps, period = 'm') {
    let data = {};
    for (let i = 0; i < dates.length; i++) {
        data[dates[i]] = getDateDefaults(dates[i], beatmaps, period);
    }

    data = processCurrentData(scores, data, period);
    data = processAverageData(data, period);
    data = processScoreRankData(user.score_rank_history, data, period);

    //convert data to array and sort by date asc
    let data_array = [];
    for (let date in data) {
        data_array.push(data[date]);
    }
    data_array.sort((a, b) => {
        return moment(a.date).diff(moment(b.date));
    });

    let _beatmaps = {};

    for (let i = 0; i < beatmaps[period].length; i++) {
        _beatmaps[beatmaps[period][i].date] = beatmaps[period][i];
    }

    data_array = processCumulativeData(data_array, period);
    data_array = processAverageData(data_array, period);
    data_array = processCompletionData(_beatmaps, data_array, period);

    const graph_data = generateGraphData(user, data_array, period);
    return graph_data;
}

function processCurrentData(scores, data, period = 'm') {
    for (let i = 0; i < scores.length; i++) {
        let score = scores[i];
        let date_string = score.date_played_moment.format(PERIOD_FORMATS[period].format_str_num_only);
        let date = correctDate(date_string, period);
        data[date].scores.push(score);
        data[date][`gained_grade_${score.rank.toLowerCase()}`] += 1;
        data[date].gained_fc += score.is_fc ? 1 : 0;
        data[date].gained_grade_total_ss = data[date].gained_grade_xh + data[date].gained_grade_x;
        data[date].gained_grade_total_s = data[date].gained_grade_sh + data[date].gained_grade_s;
        data[date].gained_score += score.score;
        if (score.rank === 'XH' || score.rank === 'X') {
            data[date].gained_ss_score += score.score;
        }
        data[date].gained_pp += score.pp;
        data[date].gained_length += score.beatmap.length;
        data[date].gained_clears += 1;
        data[date].gained_hit_count += score.count300 + score.count100 + score.count50;
        data[date].temp_periodic_acc += score.accuracy;

        data[date].gained_hits_per_play = data[date].gained_hit_count / data[date].gained_clears;
        data[date].gained_ss_rate = 100 / data[date].gained_clears * data[date].gained_grade_total_ss;
        data[date].gained_fc_rate = 100 / data[date].gained_clears * data[date].gained_fc;
    }
    return data;
}

function processCumulativeData(data_array) {
    for (let i = 0; i < data_array.length; i++) {
        let previous_data = data_array[i - 1];
        let current_data = data_array[i];

        current_data.total_fc = (previous_data?.total_fc ?? 0) + current_data.gained_fc;
        current_data.total_grade_xh = (previous_data?.total_grade_xh ?? 0) + current_data.gained_grade_xh;
        current_data.total_grade_x = (previous_data?.total_grade_x ?? 0) + current_data.gained_grade_x;
        current_data.total_grade_total_ss = (previous_data?.total_grade_total_ss ?? 0) + current_data.gained_grade_total_ss;
        current_data.total_grade_sh = (previous_data?.total_grade_sh ?? 0) + current_data.gained_grade_sh;
        current_data.total_grade_s = (previous_data?.total_grade_s ?? 0) + current_data.gained_grade_s;
        current_data.total_grade_total_s = (previous_data?.total_grade_total_s ?? 0) + current_data.gained_grade_total_s;
        current_data.total_grade_a = (previous_data?.total_grade_a ?? 0) + current_data.gained_grade_a;
        current_data.total_grade_b = (previous_data?.total_grade_b ?? 0) + current_data.gained_grade_b;
        current_data.total_grade_c = (previous_data?.total_grade_c ?? 0) + current_data.gained_grade_c;
        current_data.total_grade_d = (previous_data?.total_grade_d ?? 0) + current_data.gained_grade_d;

        current_data.total_beatmaps = (previous_data?.total_beatmaps ?? 0) + current_data.gained_beatmaps;

        current_data.total_score = (previous_data?.total_score ?? 0) + current_data.gained_score;
        current_data.total_ss_score = (previous_data?.total_ss_score ?? 0) + current_data.gained_ss_score;
        current_data.total_pp = (previous_data?.total_pp ?? 0) + current_data.gained_pp;
        current_data.total_length = (previous_data?.total_length ?? 0) + current_data.gained_length;
        current_data.total_clears = (previous_data?.total_clears ?? 0) + current_data.gained_clears;
        current_data.total_hit_count = (previous_data?.total_hit_count ?? 0) + current_data.gained_hit_count;

        current_data.temp_total_acc = (previous_data?.temp_total_acc ?? 0) + current_data.temp_periodic_acc;
        current_data.total_average_acc = (current_data?.temp_total_acc ?? 0) / current_data.total_clears;

        current_data.total_hits_per_play = current_data.total_hit_count / current_data.total_clears;
        current_data.total_ss_rate = 100 / current_data.total_clears * current_data.total_grade_total_ss;
        current_data.total_fc_rate = 100 / current_data.total_clears * current_data.total_fc;
    }
    return data_array;
}

function processAverageData(data) {
    for (let date in data) {
        if (data[date].gained_clears === 0 || data[date].scores.length === 0) {
            continue;
        }
        data[date].gained_average_acc = data[date].temp_periodic_acc / data[date].gained_clears;

        let _total_sr = 0;
        data[date].scores.forEach((score) => {
            _total_sr += score.beatmap.stars;
        });
        data[date].average_star_rating = _total_sr / data[date].gained_clears;
        data[date].highest_star_rating = data[date].scores.reduce((acc, score) => { return Math.max(acc, score.beatmap.stars); }, 0);

        data[date].average_score = data[date].gained_score / data[date].gained_clears;
        data[date].highest_score = data[date].scores.reduce((acc, score) => { return Math.max(acc, score.score); }, 0);

        data[date].average_length = data[date].gained_length / data[date].gained_clears;
        data[date].highest_length = data[date].scores.reduce((acc, score) => { return Math.max(acc, score.beatmap.length); }, 0);

        data[date].average_pp = data[date].gained_pp / data[date].gained_clears;
        data[date].highest_pp = data[date].scores.reduce((acc, score) => { return Math.max(acc, score.pp); }, 0);

        data[date].gained_hits_per_play = data[date].gained_hit_count / data[date].gained_clears;
    }

    return data;
}

function processCompletionData(beatmaps, data_array) {
    for (let i = 0; i < data_array.length; i++) {
        const previous_data = data_array[i - 1];
        data_array[i].total_completion_clears = 100 / (beatmaps[data_array[i].date]?.amount_total ?? 0) * data_array[i].total_clears;
        data_array[i].total_completion_length = 100 / (beatmaps[data_array[i].date]?.length_total ?? 0) * data_array[i].total_length;
        data_array[i].total_completion_score = 100 / (beatmaps[data_array[i].date]?.score_total ?? 0) * data_array[i].total_score;

        if (isNaN(data_array[i].total_completion_clears) || !isFinite(data_array[i].total_completion_clears)) {
            if (previous_data !== undefined)
                data_array[i].total_completion_clears = previous_data.total_completion_clears;
            else
                data_array[i].total_completion_clears = 0;
        }

        if (isNaN(data_array[i].total_completion_length) || !isFinite(data_array[i].total_completion_length)) {
            if (previous_data !== undefined)
                data_array[i].total_completion_length = previous_data.total_completion_length;
            else
                data_array[i].total_completion_length = 0;
        }

        if (isNaN(data_array[i].total_completion_score) || !isFinite(data_array[i].total_completion_score)) {
            if (previous_data !== undefined)
                data_array[i].total_completion_score = previous_data.total_completion_score;
            else
                data_array[i].total_completion_score = 0;
        }

        if (previous_data === undefined) {
            continue;
        }

        data_array[i].gained_completion_clears = data_array[i].total_completion_clears - previous_data.total_completion_clears;
        data_array[i].gained_completion_length = data_array[i].total_completion_length - previous_data.total_completion_length;
        data_array[i].gained_completion_score = data_array[i].total_completion_score - previous_data.total_completion_score;
    }
    return data_array;
}

function processScoreRankData(score_rank_data, data, period = 'm') {
    for (let i = 0; i < score_rank_data.length; i++) {
        const rank = score_rank_data[i].rank;
        const full_date = score_rank_data[i].date;

        const date = correctDate(full_date, period);

        if (data[date].peak_score_rank === null || data[date].peak_score_rank < rank) {
            data[date].peak_score_rank = rank;
        }
    }

    return data;
}

function generateGraphData(user, data_array, period = 'm') {
    let graph_data = [];

    //clears gained
    graph_data = [...graph_data, {
        id: 'clears',
        name: 'Clears',
        category: 'incremental',
        data: [
            {
                name: 'Clears',
                graph_data: data_array.map((data) => { return [data.date, data.gained_clears] }),
            }
        ],
    }];

    //clears cumulative
    graph_data = [...graph_data, {
        id: 'clears',
        name: 'Clears',
        category: 'cumulative',
        filterNull: true,
        data: [
            {
                name: 'Clears',
                graph_data: data_array.map((data) => { return [data.date, data.total_clears] }),
            }
        ],
    }];

    //ranked score gained
    graph_data = [...graph_data, {
        id: 'ranked_score',
        name: 'Ranked Score',
        category: 'incremental',
        data: [
            {
                name: 'Ranked Score',
                graph_data: data_array.map((data) => { return [data.date, data.gained_score] }),
            }
        ],
    }];

    //ranked score cumulative
    graph_data = [...graph_data, {
        id: 'ranked_score',
        name: 'Ranked Score',
        category: 'cumulative',
        filterNull: true,
        data: [
            {
                name: 'Ranked Score',
                graph_data: data_array.map((data) => { return [data.date, data.total_score] }),
            }
        ],
    }];

    //ss score gained
    graph_data = [...graph_data, {
        id: 's_score',
        name: 'SS Score',
        category: 'incremental',
        data: [
            {
                name: 'SS Score',
                graph_data: data_array.map((data) => { return [data.date, data.gained_ss_score] }),
            }
        ],
    }];

    //ss score cumulative
    graph_data = [...graph_data, {
        id: 'ss_score',
        name: 'SS Score',
        category: 'cumulative',
        filterNull: true,
        data: [
            {
                name: 'SS Score',
                graph_data: data_array.map((data) => { return [data.date, data.total_ss_score] }),
            }
        ],
    }];

    //grades gained
    graph_data = [...graph_data, {
        id: 'grades',
        name: 'Grades',
        category: 'incremental',
        data: [
            {
                name: 'Total SS',
                graph_data: data_array.map((data) => { return [data.date, data.gained_grade_total_ss] }),
                color: grey[100]
            },
            {
                name: 'Total S',
                graph_data: data_array.map((data) => { return [data.date, data.gained_grade_total_s] }),
                color: amber[500]
            },
            {
                name: 'A',
                graph_data: data_array.map((data) => { return [data.date, data.gained_grade_a] }),
                color: green[500]
            },
            {
                name: 'B',
                graph_data: data_array.map((data) => { return [data.date, data.gained_grade_b] }),
                color: blue[500]
            },
            {
                name: 'C',
                graph_data: data_array.map((data) => { return [data.date, data.gained_grade_c] }),
                color: purple[300]
            },
            {
                name: 'D',
                graph_data: data_array.map((data) => { return [data.date, data.gained_grade_d] }),
                color: red[500]
            }
        ],
    }];
    //grades cumulative
    graph_data = [...graph_data, {
        id: 'grades',
        name: 'Grades',
        category: 'cumulative',
        filterNull: true,
        data: [
            {
                name: 'Total SS',
                graph_data: data_array.map((data) => { return [data.date, data.total_grade_total_ss] }),
                color: grey[100]
            },
            {
                name: 'Total S',
                graph_data: data_array.map((data) => { return [data.date, data.total_grade_total_s] }),
                color: amber[500]
            },
            {
                name: 'A',
                graph_data: data_array.map((data) => { return [data.date, data.total_grade_a] }),
                color: green[500]
            },
            {
                name: 'B',
                graph_data: data_array.map((data) => { return [data.date, data.total_grade_b] }),
                color: blue[500]
            },
            {
                name: 'C',
                graph_data: data_array.map((data) => { return [data.date, data.total_grade_c] }),
                color: purple[300]
            },
            {
                name: 'D',
                graph_data: data_array.map((data) => { return [data.date, data.total_grade_d] }),
                color: red[500]
            }
        ],
    }];

    //pp gained
    graph_data = [...graph_data, {
        id: 'pp',
        name: 'PP',
        category: 'incremental',
        data: [
            {
                name: 'PP',
                graph_data: data_array.map((data) => { return [data.date, data.gained_pp] }),
            }
        ],
        formatter: (value) => {
            return `${value.toLocaleString(undefined, { maximumFractionDigits: 2 })}pp`;
        }
    }];

    //pp cumulative
    graph_data = [...graph_data, {
        id: 'pp',
        name: 'PP',
        category: 'cumulative',
        filterNull: true,
        data: [
            {
                name: 'PP',
                graph_data: data_array.map((data) => { return [data.date, data.total_pp] }),
            }
        ],
        formatter: (value) => {
            return `${value.toLocaleString(undefined, { maximumFractionDigits: 2 })}pp`;
        }
    }];

    //length gained
    graph_data = [...graph_data, {
        id: 'length',
        name: 'Length',
        category: 'incremental',
        data: [
            {
                name: 'Length',
                graph_data: data_array.map((data) => { return [data.date, data.gained_length] }),
            }
        ],
        formatter: (value) => {
            //convert to hh:mm:ss
            return moment.duration(value, 'seconds').format('hh[h] mm[m] ss[s]', { trim: false });
        }
    }];

    //length cumulative
    graph_data = [...graph_data, {
        id: 'length',
        name: 'Length',
        category: 'cumulative',
        filterNull: true,
        data: [
            {
                name: 'Length',
                graph_data: data_array.map((data) => { return [data.date, data.total_length] }),
            }
        ],
        formatter: (value) => {
            return moment.duration(value, 'seconds').format('hh[h] mm[m] ss[s]', { trim: false });
        }
    }];

    //hits gained
    graph_data = [...graph_data, {
        id: 'hits',
        name: 'Hits',
        category: 'incremental',
        data: [
            {
                name: 'Hits',
                graph_data: data_array.map((data) => { return [data.date, data.gained_hit_count] }),
            }
        ]
    }];

    //hits cumulative
    graph_data = [...graph_data, {
        id: 'hits',
        name: 'Hits',
        category: 'cumulative',
        filterNull: true,
        data: [
            {
                name: 'Hits',
                graph_data: data_array.map((data) => { return [data.date, data.total_hit_count] }),
            }
        ]
    }];

    //hits per play gained
    graph_data = [...graph_data, {
        id: 'hits_per_play',
        name: 'Hits Per Play',
        category: 'incremental',
        data: [
            {
                name: 'Hits Per Play',
                graph_data: data_array.map((data) => { return [data.date, data.gained_hits_per_play] }),
            }
        ]
    }];

    //hits per play cumulative
    graph_data = [...graph_data, {
        id: 'hits_per_play',
        name: 'Hits Per Play',
        category: 'cumulative',
        filterNull: true,
        data: [
            {
                name: 'Hits Per Play',
                graph_data: data_array.map((data) => { return [data.date, data.total_hits_per_play] }),
            }
        ]
    }];

    //acc gained
    graph_data = [...graph_data, {
        id: 'acc',
        name: 'Acc',
        category: 'incremental',
        data: [
            {
                name: 'Accuracy',
                graph_data: data_array.map((data) => { return [data.date, data.gained_average_acc] }),
            }
        ],
        formatter: (value) => {
            return `${value.toLocaleString(undefined, { maximumFractionDigits: 2 })}%`;
        }
    }];

    //acc cumulative
    graph_data = [...graph_data, {
        id: 'acc',
        name: 'Acc',
        category: 'cumulative',
        filterNull: true,
        data: [
            {
                name: 'Accuracy',
                graph_data: data_array.map((data) => { return [data.date, data.total_average_acc] }),
            }
        ],
        formatter: (value) => {
            return `${value.toLocaleString(undefined, { maximumFractionDigits: 2 })}%`;
        }
    }];

    //fcrate gained
    graph_data = [...graph_data, {
        id: 'fcrate',
        name: 'FC Rate',
        category: 'incremental',
        data: [
            {
                name: 'FC Rate',
                graph_data: data_array.map((data) => { return [data.date, data.gained_fc_rate] }),
            }
        ],
        formatter: (value) => {
            return `${value.toLocaleString(undefined, { maximumFractionDigits: 2 })}%`;
        }
    }];

    //fcrate cumulative
    graph_data = [...graph_data, {
        id: 'fcrate',
        name: 'FC Rate',
        category: 'cumulative',
        filterNull: true,
        data: [
            {
                name: 'FC Rate',
                graph_data: data_array.map((data) => { return [data.date, data.total_fc_rate] }),
            }
        ],
        formatter: (value) => {
            return `${value.toLocaleString(undefined, { maximumFractionDigits: 2 })}%`;
        }
    }];

    //ssrate gained
    graph_data = [...graph_data, {
        id: 'ssrate',
        name: 'SS Rate',
        category: 'incremental',
        data: [
            {
                name: 'SS Rate',
                graph_data: data_array.map((data) => { return [data.date, data.gained_ss_rate] }),
            }
        ],
        formatter: (value) => {
            return `${value.toLocaleString(undefined, { maximumFractionDigits: 2 })}%`;
        }
    }];

    //ssrate cumulative
    graph_data = [...graph_data, {
        id: 'ssrate',
        name: 'SS Rate',
        category: 'cumulative',
        filterNull: true,
        data: [
            {
                name: 'SS Rate',
                graph_data: data_array.map((data) => { return [data.date, data.total_ss_rate] }),
            }
        ],
        formatter: (value) => {
            return `${value.toLocaleString(undefined, { maximumFractionDigits: 2 })}%`;
        }
    }];

    //completion gained
    graph_data = [...graph_data, {
        id: 'completion',
        name: 'Completion',
        category: 'incremental',
        data: [
            {
                name: 'Clears Completion',
                graph_data: data_array.map((data) => { return [data.date, data.gained_completion_clears] }),
                color: red[500]
            },
            {
                name: 'Length Completion',
                graph_data: data_array.map((data) => { return [data.date, data.gained_completion_length] }),
                color: green[500]
            },
            {
                name: 'Score Completion',
                graph_data: data_array.map((data) => { return [data.date, data.gained_completion_score] }),
                color: blue[500]
            }
        ],
        formatter: (value) => {
            return `${value.toLocaleString(undefined, { maximumFractionDigits: 2 })}%`;
        }
    }];

    //completion cumulative
    graph_data = [...graph_data, {
        id: 'completion',
        name: 'Completion',
        category: 'cumulative',
        filterNull: true,
        data: [
            {
                name: 'Clears Completion',
                graph_data: data_array.map((data) => { return [data.date, data.total_completion_clears] }),
                color: red[500]
            },
            {
                name: 'Length Completion',
                graph_data: data_array.map((data) => { return [data.date, data.total_completion_length] }),
                color: green[500]
            },
            {
                name: 'Score Completion',
                graph_data: data_array.map((data) => { return [data.date, data.total_completion_score] }),
                color: blue[500]
            }
        ],
        formatter: (value) => {
            return `${value.toLocaleString(undefined, { maximumFractionDigits: 2 })}%`;
        }
    }];

    //average sr
    graph_data = [...graph_data, {
        id: 'avg_sr',
        name: 'Average SR',
        category: 'misc',
        data: [
            {
                name: 'Average Star Rating',
                graph_data: data_array.map((data) => { return [data.date, data.average_star_rating] }),
            }
        ],
        formatter: (value) => {
            return `${value.toLocaleString(undefined, { maximumFractionDigits: 2 })}*`;
        }
    }];

    //highest sr
    graph_data = [...graph_data, {
        id: 'max_sr',
        name: 'Highest SR',
        category: 'misc',
        data: [
            {
                name: 'Highest Star Rating',
                graph_data: data_array.map((data) => { return [data.date, data.highest_star_rating] }),
            }
        ],
        formatter: (value) => {
            return `${value.toLocaleString(undefined, { maximumFractionDigits: 2 })}*`;
        }
    }];

    //average pp
    graph_data = [...graph_data, {
        id: 'avg_pp',
        name: 'Average PP',
        category: 'misc',
        data: [
            {
                name: 'Average PP',
                graph_data: data_array.map((data) => { return [data.date, data.average_pp] }),
            }
        ],
        formatter: (value) => {
            return `${value.toLocaleString(undefined, { maximumFractionDigits: 2 })}pp`;
        }
    }];

    //highest pp
    graph_data = [...graph_data, {
        id: 'max_pp',
        name: 'Highest PP',
        category: 'misc',
        data: [
            {
                name: 'Highest PP',
                graph_data: data_array.map((data) => { return [data.date, data.highest_pp] }),
            }
        ],
        formatter: (value) => {
            return `${value.toLocaleString(undefined, { maximumFractionDigits: 2 })}pp`;
        }
    }];

    //average score
    graph_data = [...graph_data, {
        id: 'avg_score',
        name: 'Average Score',
        category: 'misc',
        data: [
            {
                name: 'Average Score',
                graph_data: data_array.map((data) => { return [data.date, data.average_score] }),
            }
        ]
    }];

    //highest score
    graph_data = [...graph_data, {
        id: 'max_score',
        name: 'Highest Score',
        category: 'misc',
        data: [
            {
                name: 'Highest Score',
                graph_data: data_array.map((data) => { return [data.date, data.highest_score] }),
            }
        ]
    }];

    //average length
    graph_data = [...graph_data, {
        id: 'avg_length',
        name: 'Average Length',
        category: 'misc',
        data: [
            {
                name: 'Average Length',
                graph_data: data_array.map((data) => { return [data.date, data.average_length] }),
            }
        ],
        formatter: (value) => {
            return moment.duration(value, 'seconds').format('hh[h] mm[m] ss[s]', { trim: false });
        }
    }];

    //highest length
    graph_data = [...graph_data, {
        id: 'max_length',
        name: 'Highest Length',
        category: 'misc',
        data: [
            {
                name: 'Highest Length',
                graph_data: data_array.map((data) => { return [data.date, data.highest_length] }),
            }
        ],
        formatter: (value) => {
            return moment.duration(value, 'seconds').format('hh[h] mm[m] ss[s]', { trim: false });
        }
    }];

    //score rank
    graph_data = [...graph_data, {
        id: 'rank_score',
        name: 'Score Rank',
        category: 'misc',
        reversed: true,
        min: 1, //#0 doesn't exist
        data: [
            {
                name: 'Score Rank',
                graph_data: data_array.filter((data) => data.peak_score_rank !== null).map((data) => { return [data.date, data.peak_score_rank] }),
            }
        ],
        formatter: (value) => {
            return `#${value.toLocaleString()}`;
        }
    }];

    graph_data.forEach((graph) => {
        graph.period_format = PERIOD_FORMATS[period].format_str;
    });

    return graph_data;
}

function correctDate(date, period = 'm') {
    return date.slice(0, PERIOD_FORMATS[period].slice);
}

function getDateDefaults(date, beatmaps, period = 'm') {
    const data = {
        scores: [],
        date: date,

        gained_hits_per_play: 0,

        total_hits_per_play: 0,

        peak_raw_pp: null,
        peak_score_rank: null,
        peak_global_rank: null,
        peak_country_rank: null,
        peak_level: null,
        peak_playcount: null,

        average_star_rating: 0,
        highest_star_rating: 0,
        average_score: 0,
        highest_score: 0,
        average_length: 0,
        highest_length: 0,
        average_pp: 0,
        highest_pp: 0,

        gained_clears: 0,

        gained_fc: 0,
        gained_grade_xh: 0,
        gained_grade_x: 0,
        gained_grade_total_ss: 0,
        gained_grade_sh: 0,
        gained_grade_s: 0,
        gained_grade_total_s: 0,
        gained_grade_a: 0,
        gained_grade_b: 0,
        gained_grade_c: 0,
        gained_grade_d: 0,
        gained_beatmaps: 0,
        gained_beatmaps_length: 0,
        gained_beatmaps_score: 0,

        gained_completion_clears: 0,
        gained_completion_length: 0,
        gained_completion_score: 0,

        gained_score: 0,
        gained_total_score: null,
        gained_ss_score: 0,
        gained_pp: 0,
        gained_length: 0,
        gained_hit_count: 0,

        gained_ss_rate: 0,
        gained_fc_rate: 0,

        temp_periodic_acc: 0,
        gained_average_acc: 0,

        total_fc: 0,
        total_clears: 0,
        total_grade_xh: 0,
        total_grade_x: 0,
        total_grade_total_ss: 0,
        total_grade_sh: 0,
        total_grade_s: 0,
        total_grade_total_s: 0,
        total_grade_a: 0,
        total_grade_b: 0,
        total_grade_c: 0,
        total_grade_d: 0,
        total_beatmaps: 0,
        total_beatmaps_length: 0,
        total_beatmaps_score: 0,

        total_completion_clears: 0,
        total_completion_length: 0,
        total_completion_score: 0,

        total_score: 0,
        total_total_score: null,
        total_ss_score: 0,
        total_pp: 0,
        total_length: 0,
        total_hit_count: 0,

        total_ss_rate: 0,
        total_fc_rate: 0,

        temp_total_acc: 0,
        total_average_acc: 0,
    };

    beatmaps[period].forEach(beatmap_period_data => {
        if (beatmap_period_data.date === data.date) {
            data.gained_beatmaps = parseInt(beatmap_period_data.amount);
            data.gained_beatmaps_length = parseInt(beatmap_period_data.length);
            data.gained_beatmaps_score = parseInt(beatmap_period_data.score);
            
            data.total_beatmaps = parseInt(beatmap_period_data.amount_total);
            data.total_beatmaps_length = parseInt(beatmap_period_data.length_total);
            data.total_beatmaps_score = parseInt(beatmap_period_data.score_total);
        }
    });

    return data;
}

function getDates(user, period = 'm') {
    //use utc dates
    const start_date = moment(user.osu.join_date).utc().subtract(1, 'days');
    const end_date = moment();
    const dates = [];
    let current_date = start_date;
    let latest_date = null;
    while (current_date <= end_date) {
        latest_date = current_date.format(PERIOD_FORMATS[period].format_str_num_only);
        dates.push(latest_date);
        current_date = PERIOD_FORMATS[period].increment(current_date);
    }
    latest_date = current_date.format(PERIOD_FORMATS[period].format_str_num_only);
    if (end_date.format(PERIOD_FORMATS[period].format_str_num_only) === latest_date) {
        dates.push(latest_date);
    }
    return dates;
}
