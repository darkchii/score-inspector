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
        name: "approved_start",
        required: false,
        description: "Filter maps approved after this date",
        example: '2023-10-01'
    },
    {
        name: "approved_end",
        required: false,
        description: "Filter maps approved before this date",
        example: '2023-10-31'
    },
    {
        name: "length_min",
        required: false,
        description: "Maps with length greater than this value (in seconds)",
        example: '180'
    },
    {
        name: "length_max",
        required: false,
        description: "Maps with length less than this value (in seconds)",
        example: '600'
    },
    {
        name: "ar_min",
        required: false,
        description: "Maps with AR greater than this value",
        example: '3'
    },
    {
        name: "ar_max",
        required: false,
        description: "Maps with AR less than this value",
        example: '7'
    }
]

const scoreParams = [
    {
        name: "played_start",
        required: false,
        description: "Filter maps played after this date",
        example: '2023-10-01'
    },
    {
        name: "played_end",
        required: false,
        description: "Filter maps played before this date",
        example: '2023-10-31'
    }
]

const doc = {
    title: "osu!inspector API Documentation",
    base_url: `${GetAPI()}public`,
    paths: [
        {
            type: "GET",
            path: "/user/:id",
            description: "Get user statistics by user id",
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