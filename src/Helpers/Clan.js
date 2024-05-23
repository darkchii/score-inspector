import axios from "axios";
import { GetAPI, parseReadableStreamToJson } from "./Misc";

export async function CreateClan(data) {
    const response = await fetch(`${GetAPI()}clans/create`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });
    const body = await parseReadableStreamToJson(response.body);
    return body;
}

export async function UpdateClan(data) {
    const response = await fetch(`${GetAPI()}clans/update`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });
    const body = await parseReadableStreamToJson(response.body);
    return body;

}

export async function GetClan(id) {
    // const response = await fetch(`${GetAPI()}clans/get/${id}`);
    const response = await axios.get(`${GetAPI()}clans/get/${id}`);
    return response.data;
}

export async function DeleteClan(data) {
    const response = await fetch(`${GetAPI()}clans/delete`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });
    const body = await parseReadableStreamToJson(response.body);
    return body;
}