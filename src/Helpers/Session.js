import { getUnix } from "./Misc";

const ACTIVITY_THRESHOLD = 60 * 60 * 1.5; //this value dictates a new activity region
export function getSessions(scores) {
    scores.sort((a, b) => a.date_played_object - b.date_played_object);

    let activities = [];
    let currentActivity = {
        start: null,
        end: null,
        done: false
    }
    scores.forEach((score, index) => {
        if (currentActivity.start === null) {
            currentActivity.start = getUnix(score.date_played) - score.modded_length;
        }

        currentActivity.end = getUnix(score.date_played);

        if (index < scores.length - 1) {
            const diff = Math.abs(getUnix(score.date_played) - getUnix(scores[index + 1].date_played));

            if (diff >= ACTIVITY_THRESHOLD) {
                currentActivity.end = getUnix(score.date_played);
                currentActivity.done = true;
            }
        } else if (index === scores.length - 1) {
            currentActivity.end = getUnix(score.date_played);
            currentActivity.done = true;
        }

        if (currentActivity.done) {
            currentActivity.length = Math.ceil(Math.abs(currentActivity.end - currentActivity.start));
            activities.push(currentActivity);
            if (index < scores.length - 1) {
                currentActivity = {
                    start: getUnix(scores[index + 1].date_played) - score.modded_length,
                    end: null,
                    length: null,
                    done: false
                }
            }
        }
    });
    return activities;
}