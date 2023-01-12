import { getUnix } from "./Misc";

const ACTIVITY_THRESHOLD = 60 * 60 * 1.5; //this value dictates a new activity region
export function getSessions(scores) {
    scores.sort((a, b) => a.date_played_moment.valueOf() - b.date_played_moment.valueOf());

    let activities = [];
    let currentActivity = {
        start: null,
        end: null,
        done: false
    }
    scores.forEach((score, index) => {
        if (currentActivity.start === null) {
            currentActivity.start = score.date_played_moment.valueOf() * 0.001 - score.modded_length;
        }

        currentActivity.end = score.date_played_moment.valueOf() * 0.001;

        if (index < scores.length - 1) {
            const diff = Math.abs(score.date_played_moment.valueOf() * 0.001 - scores[index + 1].date_played.valueOf() * 0.001);

            if (diff >= ACTIVITY_THRESHOLD) {
                currentActivity.end = score.date_played_moment.valueOf() * 0.001;
                currentActivity.done = true;
            }
        } else if (index === scores.length - 1) {
            currentActivity.end = score.date_played_moment.valueOf() * 0.001;
            currentActivity.done = true;
        }

        if (currentActivity.done) {
            currentActivity.length = Math.ceil(Math.abs(currentActivity.end - currentActivity.start));
            activities.push(currentActivity);
            if (index < scores.length - 1) {
                currentActivity = {
                    start: scores[index + 1].date_played_moment.valueOf() * 0.001 - score.modded_length,
                    end: null,
                    length: null,
                    done: false
                }
            }
        }
    });
    return activities;
}