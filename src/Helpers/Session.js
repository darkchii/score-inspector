const SESSION_ACTIVITY_THRESHOLD = 60 * 60 * 1.5; //this value dictates a new activity region
const SESSION_BREAK_THRESHOLD = 60 * 5; //this value dictates a break region
export function getSessions(scores) {
    scores.sort((a, b) => a.date_played_moment.valueOf() - b.date_played_moment.valueOf());

    let activities = [];
    let currentActivity = {
        scores: [],
        start: null,
        end: null,
        done: false,
        breaks: []
    }
    scores.forEach((score, index) => {
        const currentUnix = score.date_played_moment.valueOf() * 0.001;
        if (currentActivity.start === null) {
            currentActivity.start = currentUnix - score.beatmap.modded_length;
        }

        currentActivity.end = currentUnix;

        if (index < scores.length - 1) {
            const diff = Math.abs((currentUnix) - (scores[index + 1].date_played_moment.valueOf() * 0.001));

            if (diff >= SESSION_ACTIVITY_THRESHOLD) {
                currentActivity.end = currentUnix;
                currentActivity.done = true;
            }else if( diff >= SESSION_BREAK_THRESHOLD){
                currentActivity.breaks.push({
                    start: currentUnix,
                    end: scores[index + 1].date_played_moment.valueOf() * 0.001,
                    length: diff,
                });
            }
        } else if (index === scores.length - 1) {
            currentActivity.end = currentUnix;
            currentActivity.done = true;
        }

        if (currentActivity.done) {
            currentActivity.length = Math.ceil(Math.abs(currentActivity.end - currentActivity.start));
            activities.push(currentActivity);
            if (index < scores.length - 1) {
                currentActivity = {
                    scores: [],
                    start: scores[index + 1].date_played_moment.valueOf() * 0.001 - score.beatmap.modded_length,
                    end: null,
                    length: null,
                    done: false,
                    breaks: []
                }
            }
        }else{
            currentActivity.scores.push(score);
        }
    });

    return activities;
}