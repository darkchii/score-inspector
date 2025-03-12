import Mods from "./Mods";

export const dataToList = [
    {
        outputValue: "count_scores",
        exec: function (output) {
            return output + 1;
        }
    },
    {
        outputValue: "total_score",
        exec: function (output, score) {
            return output + score.score;
        }
    },
    {
        outputValue: "total_ss_score",
        exec: function (output, score) {
            if (score.rank === "X" || score.rank === "XH") {
                return output + score.score;
            }
            return output;
        }
    },
    {
        outputValue: "total_pp",
        exec: function (output, score) {
            return output + (score.pp !== null && score.pp !== undefined ? score.pp : 0);
        }
    },
    {
        outputValue: "highest_pp",
        exec: function (output, score) {
            return Math.max(output, (score.pp !== null && score.pp !== undefined ? score.pp : 0));
        }
    },
    {
        outputValue: "total_sr",
        exec: function (output, score) {
            return output + score.beatmap.difficulty.star_rating;
        }
    },
    {
        outputValue: "highest_sr",
        exec: function (output, score) {
            if((score.beatmap.approved === 1 || score.beatmap.approved === 2) && !(Mods.hasMod(score.mods, "NF"))){
                return Math.max(output, score.beatmap.difficulty.star_rating ?? 0);
            }
            return output;
        }
    },
    {
        outputValue: "total_ss",
        exec: function (output, score) {
            if (score.rank === "X" || score.rank === "XH") {
                return output + 1;
            }
            return output;
        }
    },
    {
        outputValue: "total_s",
        exec: function (output, score) {
            if (score.rank === "S" || score.rank === "SH") {
                return output + 1;
            }
            return output;
        }
    },
    {
        outputValue: "total_a",
        exec: function (output, score) {
            if (score.rank === "A") {
                return output + 1;
            }
            return output;
        }
    },
    {
        outputValue: "total_b",
        exec: function (output, score) {
            if (score.rank === "B") {
                return output + 1;
            }
            return output;
        }
    },
    {
        outputValue: "total_c",
        exec: function (output, score) {
            if (score.rank === "C") {
                return output + 1;
            }
            return output;
        }
    },
    {
        outputValue: "total_d",
        exec: function (output, score) {
            if (score.rank === "D") {
                return output + 1;
            }
            return output;
        }
    },
    {
        outputValue: "total_length",
        exec: function (output, score) {
            return output + score.beatmap.modded_length;
        }
    },
    {
        outputValue: "total_hits",
        exec: function (output, score) {
            return output + score.count300 + score.count100 + score.count50;
        }
    },
    {
        outputValue: "total_base_score",
        exec: function (output, score) {
            return output + (score.count300 + score.count100 * 0.3333 + score.count50 * 0.1667);
        }
    },
    {
        outputValue: "total_max_base_score",
        exec: function (output, score) {
            return output + (score.count300 + score.count100 + score.count50 + score.countmiss);
        }
    }
];