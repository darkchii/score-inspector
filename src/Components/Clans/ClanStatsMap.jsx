import moment from "moment";
import { CalculateNewXPLevel, getLevelForScore } from "../../Helpers/Osu";
import { formatNumber } from "../../Helpers/Misc";

const CLAN_STATS_MAP = [
    {
        name: 'Performance',
        key: 'average_pp',
        format: (stats) => `${(Math.round((stats.average_pp ?? 0) * 100) / 100).toLocaleString('en-US')}pp`,
        description: 'Average PP of all members profile performance',
        ranking: true,
    },
    {
        name: 'Total PP',
        key: 'total_pp',
        format: (stats) => `${(Math.round((stats.total_pp ?? 0) * 100) / 100).toLocaleString('en-US')}pp`,
        description: 'Sum of all pp from all scores',
        ranking: true,
    },
    {
        name: 'Accuracy',
        format: (stats) => `${(Math.round((stats.accuracy ?? 0) * 100) / 100).toLocaleString('en-US')}%`,
        description: 'Average accuracy of all members',
        key: 'accuracy',
        ranking: true,
    },
    {
        name: 'Ranked score',
        key: 'ranked_score',
        format: (stats) => parseInt(stats.ranked_score ?? 0).toLocaleString('en-US'),
        ranking: true,
    }, {
        name: 'Total score',
        format: (stats) => parseInt(stats.total_score ?? 0).toLocaleString('en-US'),
        ranking: true,
        key: 'total_score',
    }, {
        name: 'Level',
        format: (stats) => getLevelForScore(stats.total_score ?? 0).toLocaleString('en-US'),
        ranking: false,
        display: true,
        sort_value: (stats) => getLevelForScore(stats.total_score ?? 0),
        key: 'level',
    }, {
        name: 'XP 2.0',
        format: (stats) => formatNumber(stats.xp ?? 0, 0),
        ranking: false,
        display: true,
        key: 'xp',
        extra_format: (stats) => `Level ${formatNumber(CalculateNewXPLevel(stats.xp ?? 0), 2)}`,
        user: false,
    },
    {
        name: 'Clears',
        format: (stats) => (stats.clears ?? 0).toLocaleString('en-US'),
        description: 'Total clears of all members',
        ranking: true,
        key: 'clears',
    }, {
        name: 'Total SS',
        format: (stats) => (stats.total_ss_both ?? 0).toLocaleString('en-US'),
        ranking: true,
        key: 'total_ss_both',
    }, {
        name: 'Total S',
        format: (stats) => (stats.total_s_both ?? 0).toLocaleString('en-US'),
        ranking: true,
        key: 'total_s_both',
    }, {
        name: 'Total A',
        format: (stats) => (stats.total_a ?? 0).toLocaleString('en-US'),
        ranking: true,
        key: 'total_a',
    }, {
        name: 'Total B',
        format: (stats) => (stats.total_b ?? 0).toLocaleString('en-US'),
        ranking: true,
        key: 'total_b',
    }, {
        name: 'Total C',
        format: (stats) => (stats.total_c ?? 0).toLocaleString('en-US'),
        ranking: true,
        key: 'total_c',
    }, {
        name: 'Total D',
        format: (stats) => (stats.total_d ?? 0).toLocaleString('en-US'),
        ranking: true,
        key: 'total_d',
    }, {
        name: 'Playtime',
        format: (stats) => (Math.round(moment.duration(stats.playtime ?? 0, 'seconds').asHours()).toLocaleString('en-US')) + ' hours',
        ranking: true,
        key: 'playtime',
    }, {
        name: 'Playcount',
        format: (stats) => (stats.playcount ?? 0).toLocaleString('en-US'),
        ranking: true,
        key: 'playcount',
    }, {
        name: 'Replays watched',
        format: (stats) => (stats.replays_watched ?? 0).toLocaleString('en-US'),
        ranking: true,
        key: 'replays_watched',
    }, {
        name: 'Total hits',
        format: (stats) => (stats.total_hits ?? 0).toLocaleString('en-US'),
        ranking: true,
        key: 'total_hits',
    }, {
        name: 'Badges',
        format: (stats) => (stats.badges ?? 0).toLocaleString('en-US'),
        ranking: false,
        key: 'badges'
    }, {
        name: 'Medals',
        format: (stats) => (stats.medals ?? 0).toLocaleString('en-US'),
        ranking: false,
        key: 'medals'
    }, {
        name: 'Members',
        format: (stats) => (stats.members ?? 0).toLocaleString('en-US'),
        ranking: false,
        display: false,
        key: 'members',
        user: false, //not a user stat
    }, {
        name: 'Joined',
        format: (stats) => moment(stats.join_date).fromNow(),
        ranking: false,
        display: false,
        clanlist: false,
        key: 'join_date',
        sort_value: (stats) => new Date(stats.join_date),
        dir: 'asc',
    }
]

export default CLAN_STATS_MAP;