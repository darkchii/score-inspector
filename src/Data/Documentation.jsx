import { GetAPI } from "../Helpers/Misc";

const apiKeyParam = {
    name: "key",
    required: true,
    description: "API Key"
}

const userIdParam = {
    name: "id",
    required: true,
    description: "User ID (can also be 'me' for API key owner)"
}

const beatmapParams = [
    {
        name: "approved",
        required: false,
        description: "Filter by approval status",
        example: '1,2,4'
    },
    {
        name: "approved",
        min_attr: "start",
        max_attr: "end",
        required: false,
        type: "range",
        description: "Filter maps on approval/rank date",
        example: '2023-10-31'
    },
    {
        name: "length",
        required: false,
        type: "range",
        description: "Filter on beatmap length (in seconds)",
        example: '600'
    },
    {
        name: "stars",
        required: false,
        type: "range",
        description: "Filter on beatmap star rating (unmodded)",
        example: '6.5'
    },
    {
        name: "ar",
        required: false,
        type: "range",
        description: "Filter on beatmap approach rate",
        example: '3'
    },
    {
        name: "cs",
        required: false,
        type: "range",
        description: "Filter on beatmap circle size",
        example: '3'
    },
    {
        name: "od",
        required: false,
        type: "range",
        description: "Filter on beatmap overall difficulty",
        example: '3'
    },
    {
        name: "hp",
        required: false,
        type: "range",
        description: "Filter on beatmap health drain",
        example: '3'
    },
    {
        name: "maxcombo",
        required: false,
        type: "range",
        description: "Filter on beatmap max combo",
        example: '2000'
    },
]

const scoreParams = [
    {
        name: "enabled_mods",
        required: false,
        description: "Filter maps on mods used (use mod enum values, comma separated)",
        example: '8,16,24 (HD, HR, HDHR)'
    },
    {
        name: "played",
        min_attr: "start",
        max_attr: "end",
        required: false,
        type: "range",
        description: "Filter maps on date played",
        example: '2023-10-01'
    },
    {
        name: "pp",
        required: false,
        type: "range",
        description: "Filter maps on PP achieved",
        example: '727'
    },
    {
        name: "accuracy",
        required: false,
        type: "range",
        description: "Filter maps on accuracy",
        example: '96'
    },
    {
        name: "combo",
        required: false,
        type: "range",
        description: "Filter on score combo",
        example: '1100'
    },
]

beatmapParams.forEach(param => param.table = 'beatmap');
scoreParams.forEach(param => param.table = 'score');

const doc = {
    title: "osu!inspector API Documentation",
    description: "Documentation for the public api. Get an API key settings modal accessed by profile picture in the top right. Requires login.",
    base_url: `${GetAPI()}public`,
    paths: [
        {
            type: "GET",
            path: "/user/:id",
            description: "Get user statistics by user id",
            cacheTime: 5 * 60,
            params: [
                apiKeyParam,
                userIdParam,
                ...beatmapParams,
                ...scoreParams
            ],
        },
        {
            type: "GET",
            path: "/user/:id/scores",
            description: "Get user scores",
            cacheTime: 5 * 60,
            params: [
                apiKeyParam,
                userIdParam,
                ...beatmapParams,
                ...scoreParams
            ],
        }
    ]
};

export default doc;