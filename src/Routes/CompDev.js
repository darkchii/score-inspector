import { Grid, Paper } from "@mui/material";
import LevelIcon from "../Components/UI/LevelIcon";
import PlayerCard from "../Components/PlayerCard";

function CompDev() {
    const testUser = {
        "user_id": 10153735,
        "username": "boob enjoyer",
        "country_code": "NL",
        "global_rank": 140171,
        "score_rank": {
            "rank": 2844,
            "user_id": 10153735,
            "username": "boob enjoyer",
            "score": 47855392433
        },
        "osu": {
            "avatar_url": "https://a.ppy.sh/10153735?1682702595.png",
            "country_code": "NL",
            "default_group": "default",
            "id": 10153735,
            "is_active": true,
            "is_bot": false,
            "is_deleted": false,
            "is_online": false,
            "is_supporter": true,
            "last_visit": null,
            "pm_friends_only": false,
            "profile_colour": null,
            "username": "boob enjoyer",
            "country": {
                "code": "NL",
                "name": "Netherlands"
            },
            "cover": {
                "custom_url": null,
                "url": "https://osu.ppy.sh/images/headers/profile-covers/c8.jpg",
                "id": "8"
            },
            "groups": [],
            "statistics_rulesets": {
                "osu": {
                    "count_100": 530436,
                    "count_300": 8885441,
                    "count_50": 46327,
                    "count_miss": 151931,
                    "level": {
                        "current": 100,
                        "progress": 51
                    },
                    "global_rank": 140171,
                    "global_rank_exp": 25416,
                    "pp": 3681.67,
                    "pp_exp": 3681.68,
                    "ranked_score": 47855392433,
                    "hit_accuracy": 98.8736,
                    "play_count": 70404,
                    "play_time": 3918996,
                    "total_score": 78355292622,
                    "total_hits": 9462204,
                    "maximum_combo": 5186,
                    "replays_watched_by_others": 92,
                    "is_ranked": true,
                    "grade_counts": {
                        "ss": 12424,
                        "ssh": 1000,
                        "s": 3346,
                        "sh": 500,
                        "a": 806
                    }
                },
                "taiko": {
                    "count_100": 731,
                    "count_300": 3725,
                    "count_50": 0,
                    "count_miss": 280,
                    "level": {
                        "current": 7,
                        "progress": 98
                    },
                    "global_rank": 86743,
                    "global_rank_exp": null,
                    "pp": 235.906,
                    "pp_exp": 0,
                    "ranked_score": 1354838,
                    "hit_accuracy": 93.0067,
                    "play_count": 75,
                    "play_time": 2982,
                    "total_score": 3067199,
                    "total_hits": 4456,
                    "maximum_combo": 133,
                    "replays_watched_by_others": 0,
                    "is_ranked": true,
                    "grade_counts": {
                        "ss": 0,
                        "ssh": 0,
                        "s": 6,
                        "sh": 0,
                        "a": 11
                    }
                },
                "fruits": {
                    "count_100": 15174,
                    "count_300": 263375,
                    "count_50": 256860,
                    "count_miss": 9693,
                    "level": {
                        "current": 54,
                        "progress": 90
                    },
                    "global_rank": 22789,
                    "global_rank_exp": null,
                    "pp": 951.022,
                    "pp_exp": 0,
                    "ranked_score": 675677539,
                    "hit_accuracy": 99.6765,
                    "play_count": 1540,
                    "play_time": 72496,
                    "total_score": 1088324105,
                    "total_hits": 535409,
                    "maximum_combo": 1201,
                    "replays_watched_by_others": 1,
                    "is_ranked": true,
                    "grade_counts": {
                        "ss": 65,
                        "ssh": 0,
                        "s": 258,
                        "sh": 0,
                        "a": 85
                    }
                },
                "mania": {
                    "count_100": 9369,
                    "count_300": 47956,
                    "count_50": 1232,
                    "count_miss": 1333,
                    "level": {
                        "current": 32,
                        "progress": 76
                    },
                    "global_rank": 342506,
                    "global_rank_exp": null,
                    "pp": 220.823,
                    "pp_exp": 0,
                    "ranked_score": 134327463,
                    "hit_accuracy": 97.7785,
                    "play_count": 496,
                    "play_time": 31409,
                    "total_score": 229177455,
                    "total_hits": 58557,
                    "maximum_combo": 1659,
                    "replays_watched_by_others": 0,
                    "is_ranked": true,
                    "grade_counts": {
                        "ss": 2,
                        "ssh": 0,
                        "s": 98,
                        "sh": 0,
                        "a": 32
                    }
                }
            }
        },
        "inspector_user": {
            "id": 1,
            "osu_id": 10153735,
            "known_username": "boob enjoyer",
            "background_image": "https://cdn.donmai.us/original/ab/dd/__kousaka_kirino_ore_no_imouto_ga_konna_ni_kawaii_wake_ga_nai_drawn_by_ootomo_takuji__abdde8f03fcb63fb13a0cc36aa472cfa.png",
            "roles": "[\"dev\", \"trusted\",\"vip\"]"
        }
    };
    return (
        <>
            <h2>Are you supposed to be here?</h2>
            <Grid container sx={{ height: '150px', pt: 1 }} spacing={2}>
                <Grid item xs={2} sx={{ height: '100%' }}>
                    <Paper sx={{ height: '100%' }} elevation={5}>
                        <PlayerCard user={testUser} sx={{
                            rowHeight: 60
                        }} />
                    </Paper>
                </Grid>
                <Grid item xs={4} sx={{ height: '100%' }}>
                    <Paper sx={{ height: '100%' }} elevation={5}>
                        <PlayerCard user={testUser} />
                    </Paper>
                </Grid>
                <Grid item xs={5} sx={{ height: '100%' }}>
                    <Paper sx={{ height: '100%' }} elevation={5}>
                        <PlayerCard user={testUser} />
                    </Paper>
                </Grid>
                <Grid item xs={1} sx={{ height: '100%' }}>
                    <Paper sx={{ height: '100%' }} elevation={5}>
                        <PlayerCard user={testUser} />
                    </Paper>
                </Grid>
            </Grid>
            <Grid container sx={{ height: '350px', pt: 1 }} spacing={2}>
                <Grid item xs={2} sx={{ height: '100%' }}>
                    <Paper sx={{ height: '100%' }} elevation={5}>
                        <PlayerCard user={testUser} />
                    </Paper>
                </Grid>
                <Grid item xs={4} sx={{ height: '100%' }}>
                    <Paper sx={{ height: '100%' }} elevation={5}>
                        <PlayerCard user={testUser} />
                    </Paper>
                </Grid>
                <Grid item xs={5} sx={{ height: '100%' }}>
                    <Paper sx={{ height: '100%' }} elevation={5}>
                        <PlayerCard user={testUser} />
                    </Paper>
                </Grid>
                <Grid item xs={1} sx={{ height: '100%' }}>
                    <Paper sx={{ height: '100%' }} elevation={5}>
                        <PlayerCard user={testUser} />
                    </Paper>
                </Grid>
            </Grid>
        </>
    );
}

export default CompDev;