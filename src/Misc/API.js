import config from "../Config";

function getAPI() {
    if (config.USE_DEV_API) {
        return config.API_DEV;
    } else {
        return config.API;
    }
}

//applies cors and stuff
async function call(url, method, body) {
    let response = await fetch(url, {
        method: method,
        body: body,
        headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*"
        }
    });
    const json = await response.json();
    return json;
}

async function getBeatmaps(filter) {
    let queryString = convertFilterObjectToQueryString(filter);
    let response = await call(getAPI() + "beatmaps" + queryString, "GET");
    return response;
}

function convertFilterObjectToQueryString(filter) {
    let queryString = "?";
    for (let key in filter) {
        queryString += key + "=" + filter[key] + "&";
    }
    return queryString;
}

export { getBeatmaps };